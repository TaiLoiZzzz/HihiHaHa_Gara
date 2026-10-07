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

    console.log('🌐 [Neo4j Seed] Inserting nodes and relationships for Multi-Vehicle Shared Platforms...');

    const cypherSeedQuery = `
      // 1. TẠO CÁC KHUNG GẦM DÙNG CHUNG (SHARED PLATFORMS)
      CREATE (p1:Platform {code: "TNGA-K", manufacturer: "Toyota Group"})
      CREATE (p2:Platform {code: "GLOBAL-C", manufacturer: "Suzuki / Toyota"})
      CREATE (p3:Platform {code: "N3-PLATFORM", manufacturer: "Hyundai-Kia Group"})

      // 2. TẠO DÒNG ĐỘNG CƠ DÙNG CHUNG
      CREATE (e1:Engine {code: "2AR-FE", displacement: "2.5L", fuel: "Gasoline"})
      CREATE (e2:Engine {code: "K15B", displacement: "1.5L", fuel: "Gasoline"})
      CREATE (e3:Engine {code: "Smartstream-2.5", displacement: "2.5L", fuel: "Gasoline"})

      // 3. TẠO CÁC DÒNG XE THỰC TẾ
      CREATE (camry:VehicleModel {name: "Toyota Camry 2.5Q", year_from: 2018, year_to: 2024})
      CREATE (lexus:VehicleModel {name: "Lexus ES250", year_from: 2019, year_to: 2024})
      CREATE (rav4:VehicleModel {name: "Toyota RAV4 2.5", year_from: 2019, year_to: 2024})
      CREATE (xpander:VehicleModel {name: "Mitsubishi Xpander", year_from: 2020, year_to: 2024})
      CREATE (santafe:VehicleModel {name: "Hyundai SantaFe 2.5", year_from: 2021, year_to: 2024})
      CREATE (sorento:VehicleModel {name: "Kia Sorento 2.5", year_from: 2021, year_to: 2024})

      // LIÊN KẾT XE VỚI KHUNG GẦM VÀ ĐỘNG CƠ
      CREATE (camry)-[:USES_PLATFORM]->(p1)
      CREATE (lexus)-[:USES_PLATFORM]->(p1)
      CREATE (rav4)-[:USES_PLATFORM]->(p1)
      CREATE (xpander)-[:USES_PLATFORM]->(p2)
      CREATE (santafe)-[:USES_PLATFORM]->(p3)
      CREATE (sorento)-[:USES_PLATFORM]->(p3)

      CREATE (camry)-[:EQUIPPED_WITH]->(e1)
      CREATE (lexus)-[:EQUIPPED_WITH]->(e1)
      CREATE (santafe)-[:EQUIPPED_WITH]->(e3)
      CREATE (sorento)-[:EQUIPPED_WITH]->(e3)

      // 4. TẠO CỤM BỘ PHẬN CHI TIẾT (SUBSYSTEMS)
      CREATE (subBrake:Subsystem {name: "Front Caliper Assembly", category: "Brake"})
      CREATE (subFilter:Subsystem {name: "Air Filtration Subsystem", category: "Filtration"})
      CREATE (subIgnition:Subsystem {name: "Ignition System", category: "Engine"})

      CREATE (subBrake)-[:MOUNTED_ON_PLATFORM]->(p1)
      CREATE (subBrake)-[:MOUNTED_ON_PLATFORM]->(p3)
      CREATE (subFilter)-[:MOUNTED_ON_PLATFORM]->(p1)
      CREATE (subIgnition)-[:MOUNTED_ON_PLATFORM]->(p1)

      // 5. TẠO PHỤ TÙNG THAY THẾ CHUNG & TƯƠNG THÍCH
      CREATE (part1:Part {code: "04465-06100", name: "Bộ má phanh trước Toyota Camry", price: 1850000})
      CREATE (part2:Part {code: "04465-33480", name: "Bộ má phanh trước Lexus ES250", price: 2950000})
      CREATE (part3:Part {code: "04465-YZZD1", name: "Bộ má phanh trước Akebono OEM High-Perf", price: 1650000})
      CREATE (part4:Part {code: "17801-0H050", name: "Lọc gió động cơ Camry 2.5", price: 280000})
      CREATE (part5:Part {code: "BUGI-IRIDIUM", name: "Bugi Iridium Denso FK20HR11", price: 350000})

      // THIẾT LẬP QUAN HỆ LẮP RÁP & TƯƠNG THÍCH N-HOPS
      CREATE (part1)-[:FITS_SUB_ASSEMBLY]->(subBrake)
      CREATE (part2)-[:FITS_SUB_ASSEMBLY]->(subBrake)
      CREATE (part3)-[:FITS_SUB_ASSEMBLY]->(subBrake)
      CREATE (part4)-[:FITS_SUB_ASSEMBLY]->(subFilter)
      CREATE (part5)-[:FITS_SUB_ASSEMBLY]->(subIgnition)
    `;

    await runCypher(cypherSeedQuery);
    console.log('✅ [Neo4j Seed] Knowledge graph created successfully with 3 Shared Platforms & 5 Parts!');

    // Test Cypher N-hops query for compatible parts
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
