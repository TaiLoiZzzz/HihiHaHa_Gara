const { runCypher, driver, checkNeo4jConnection } = require('../neo4j');

const seedNeo4jData = async () => {
  try {
    const isConnected = await checkNeo4jConnection();
    if (!isConnected) {
      process.exit(1);
    }

    console.log('🧹 [Neo4j Seed] Cleaning old graph data...');
    await runCypher('MATCH (n) DETACH DELETE n');

    console.log('🔒 [Neo4j Seed] Creating constraints...');
    await runCypher('CREATE CONSTRAINT part_code_unique IF NOT EXISTS FOR (p:Part) REQUIRE p.code IS UNIQUE');
    await runCypher('CREATE CONSTRAINT vehicle_name_unique IF NOT EXISTS FOR (v:VehicleModel) REQUIRE v.name IS UNIQUE');

    console.log('🌐 [Neo4j Seed] Inserting nodes and relationships...');

    const cypherSeedQuery = `
      // 1. tao khung gam dung chung tnga-k
      CREATE (p:Platform {code: "TNGA-K", manufacturer: "Toyota Group"})

      // 2. tao dong co 2ar-fe
      CREATE (e:Engine {code: "2AR-FE", displacement: "2.5L", fuel: "Gasoline"})

      // 3. tao dong xe camry va lexus
      CREATE (camry:VehicleModel {name: "Toyota Camry 2.5Q", year_from: 2018, year_to: 2024})
      CREATE (lexus:VehicleModel {name: "Lexus ES250", year_from: 2019, year_to: 2024})

      // lien ket xe voi khung gam va dong co
      CREATE (camry)-[:USES_PLATFORM]->(p)
      CREATE (lexus)-[:USES_PLATFORM]->(p)
      CREATE (camry)-[:EQUIPPED_WITH]->(e)
      CREATE (lexus)-[:EQUIPPED_WITH]->(e)

      // 4. tao cum chi tiet cum phanh truoc
      CREATE (sub:Subsystem {name: "Front Caliper Assembly", category: "Brake"})

      // 5. tao phu tung ma phanh camry va lexus
      CREATE (partCamry:Part {code: "04465-06100", name: "Bộ má phanh trước Camry", price: 1850000})
      CREATE (partLexus:Part {code: "04465-33480", name: "Bộ má phanh trước Lexus", price: 2950000})

      // thiet lap quan he lap rap da tang n-hops
      CREATE (partCamry)-[:FITS_SUB_ASSEMBLY]->(sub)
      CREATE (partLexus)-[:FITS_SUB_ASSEMBLY]->(sub)
      CREATE (sub)-[:MOUNTED_ON_PLATFORM]->(p)
    `;

    await runCypher(cypherSeedQuery);
    console.log('✅ [Neo4j Seed] Knowledge graph created successfully!');

    // 6. chay va in thu nghiem cau truy van cypher n-hops tra cuu phu tung tuong thich choe
    console.log('\n🔍 [Neo4j Test] Querying N-hops cross-compatible parts for Lexus ES250...');
    const nHopsQuery = `
      MATCH (targetCar:VehicleModel {name: "Lexus ES250"})-[:USES_PLATFORM]->(platform:Platform)
            <-[:MOUNTED_ON_PLATFORM]-(sub:Subsystem {name: "Front Caliper Assembly"})
            <-[:FITS_SUB_ASSEMBLY]-(alternativePart:Part)
      RETURN alternativePart.code AS CompatiblePartCode, 
             alternativePart.name AS PartName, 
             alternativePart.price AS Price,
             platform.code AS SharedPlatform
    `;

    const res = await runCypher(nHopsQuery);
    console.log('📊 [Neo4j Test Results]:');
    res.records.forEach((record, idx) => {
      console.log(`  ${idx + 1}. Mã phụ tùng: ${record.get('CompatiblePartCode')} | Tên: ${record.get('PartName')} | Giá: ${record.get('Price').toLocaleString()} VNĐ | Khung gầm chung: ${record.get('SharedPlatform')}`);
    });

    console.log('\n✨ [Neo4j Seed] Seeding and N-hops verification completed successfully!');
    await driver.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ [Neo4j Seed] Error:', err.message);
    await driver.close();
    process.exit(1);
  }
};

seedNeo4jData();
