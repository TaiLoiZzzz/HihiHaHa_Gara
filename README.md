# HiHiHaHa Auto - He Thong Quan Ly Dich Vu Va Xuong Sua Chua O To 4S

Giai phap phan mem chuyen doi so toan dien cho chuoi trung tam dich vu, bao duong va cham soc o to cong nghe cao tieu chuan 4S.
He thong tich hop Cong khach hang truc tuyen, Ban lam viec Ky thuat vien tren thiet bi cam ung, Bang dieu phoi Kanban thoi gian thuc, Tro ly AI phan tich ky thuat va Cong thanh toan dien tu tu dong.

---

## 1. Gioi Thieu Tong Quan

HiHiHaHa Auto duoc nghien cuu va phat trien nham giai quyet cac nut that van hanh trong mo hinh garage o to truyen thong:
- Loai bo 100% quy trinh ghi chep giay to thu cong, giam thieu sai sot va that thoat du lieu vat tu.
- Minh bach hoa quy trinh sua chua: Chu xe theo doi tien do tung phut, xem hinh anh nghiem thu thuc te tai khoang nang va phe duyet bao gia truc tuyen.
- Toi uu nang suat xuong: Dieu phoi thoi gian thuc tren bang Kanban, phan bo khoang nang va kiem soat tai lam viec toi da cua moi ky thuat vien.
- Luu tru ho so ky thuat so tron doi: Moi phuong tien so huu so bao duong dien tu dong bo toan dien lich su thay the phu tung va hoa don thanh toan.

---

## 2. Kien Truc He Thong

He thong ap dung kien truc da tang hien dai (Multi-tier Architecture) ket hop mo hinh luu tru Polyglot Persistence:

```
[ Trinh Duyet Khach Hang / Mobile ]      [ Tablet Ky Thuat Vien / Ban Lam Viec ]
                     \                                /
                      \                              /
            [ Cloudflare Edge / Reverse Proxy: Cổng 8888 ]
                                    |
            [ Next.js 14 Frontend (App Router / Standalone) ]
                                    |
                    (Noi bo Rewrite Proxy: /api/v1)
                                    |
            [ Node.js / Express.js REST API & Socket Server: Cổng 5000 ]
                                    |
   +--------------------+-----------+-----------+--------------------+
   |                    |                       |                    |
[ MongoDB ]       [ PostgreSQL ]            [ Redis ]            [ Neo4j ]
Kho linh kien &   So cai giao dich &        Bo nho dem &         Do thi tri thuc
lenh sua chua     hoa don tai chinh         khoa phan tan        tuong thich xe
```

### Nguyen Ly Luu Tru Da He Quan Tri (Polyglot Persistence):
1. **MongoDB (Document Store):** Luu tru danh muc hon 300+ linh kien kho, thong tin phuong tien va chi tiet lenh sua chua voi cau truc linh hoat.
2. **PostgreSQL (Relational Store):** Dam bao tinh toan ven ACID cho toan bo giao dich thanh toan, hoa don, so cai doanh thu va doi soat cong no.
3. **Redis (In-Memory Key-Value):** Quan ly phien lam viec (Session), bo nho dem toc do cao va khoa phan tan (Distributed Lock) ngan chan tranh chap kho hang khi nhieu co van cung thao tac.
4. **Neo4j (Graph Database):** Luu tru mang luoi tri thuc quan he giua dong xe, ma dong co, trieu chung hu hong va linh kien tuong thich.

---

## 3. Danh Sach Cac Phan He Chuc Nang

### 3.1. Cong Khach Hang (Customer Portal)
- Dang nhap khong can mat khau phuc tap: Chu xe su dung Bien so xe va So dien thoai, he thong xac thuc qua ma OTP bao mat gui ve Gmail.
- Theo doi tien do truc tuyen: Xem trang thai thuc te cua phuong tien qua Socket.io realtime, hien thi ti le phan tram hoan thanh cong viec.
- Thu vien anh nghiem thu: Xem hinh anh chi tiet linh kien cu/moi duoc ky thuat vien chup tai khoang sua chua.
- Ky duyet bao gia dien tu: Xem chi tiet gia phu tung, tien cong, dieu khoan bao hanh va bam xac nhan phe duyet ngay tren dien thoai.
- Thanh toan VietQR Napas 24/7: He thong tu dong tao ma QR thanh toan ngan hang kem chinh xac so tien va noi dung giao dich de doi soat tu dong.
- So bao duong dien tu: Tra cuu toan bo lich su bao duong va cac lan vao xuong truoc do.

### 3.2. Ban Lam Viec Ky Thuat Vien (Technician Tablet Workspace)
- Giao dien toi uu cho thiet bi cam ung: Cac nut bam kich thuoc lon, tuong phan cao, de thao tac truc tiep tai cau nang.
- Bao mat ca may theo ma PIN: Moi tho may co ma PIN rieng de dang nhap va chiu trach nhiem tren tung hang muc cong viec.
- Quan ly checklist va thanh truot tien do: Cap nhat trang thai cong doan (Thao do, Ve sinh, Thay the, Can chinh, Nghiem thu KCS).
- Kiem soat tai an toan: Gioi han toi da 3 xe dang lam dong thoi tren moi tho de dam bao chat luong ky thuat va an toan lao dong.
- Upload anh truc tiep: Tich hop camera thiet bi de chup anh linh kien hong hoc va linh kien moi sau khi lap dat.

### 3.3. Ban Lam Viec Co Van Dich Vu (Service Advisor)
- Tiep nhan xe va lap lenh: Nhap thong tin bien so, so dien thoai, ghi nhan trieu chung hu hong va yeu cau cua chu xe.
- Tro ly AI phan tich phu tung: Tu dong phan tich mo ta hu hong va doi soat danh muc kho de de xuat linh kien phu hop trong 1 thao tac.
- Tra cuu nhanh va tu dong dien (Autocomplete): Tim kiem theo ten hoac ma phu tung OEM, tu dong dien don gia va so luong ton kho kha dung.

### 3.4. Bang Dieu Phoi Xuong Kanban (Workshop Dispatcher)
- Quy trinh chuan hoa 7 buoc: Tiep nhan xe -> Cho duyet gia -> Cho phu tung -> Dang thi cong -> Nghiem thu KCS -> Cho thanh toan -> Da ban giao.
- Phan bo khoang nang truc quan: Keo tha xe vao cac khoang chuyen dung (Cau nang 2 tru, Cau 4 tru, Khoang dien - dien lanh, Khoang can chinh thuoc lai 3D).
- Dong bo da thiet bi: Trang thai xe thay doi tren Kanban lap tuc cap nhat den man hinh cua Co van, Tho may va Chu xe.

### 3.5. Quan Ly Kho Phu Tung (Inventory Management)
- Quan ly 300+ ma linh kien: Phan chia chi tiet theo he thong phanh, dong co, khung gam, he thong loc, danh lua va dien.
- Quan ly vi tri luu kho: Dinh vi chinh xac vi tri khay ke trong kho (vi du: KHO-A1-K2).
- Canh bao muc ton kho toi thieu: Tu dong danh dau do cac mat hang duoi nguong an toan de bo phan mua hang chu dong nhap them.

### 3.6. Ban Giam Doc & Bao Cao Doanh Thu (Owner Dashboard)
- Chi so van hanh cot loi (KPI): Thong ke doanh thu theo ngay, tuan, thang; ty le hoan thanh dung han; ty le lap day khoang nang.
- Phan tich co cau doanh thu: Phan tach doanh thu tu phu tung vat tu va doanh thu tu tien cong dich vu.

---

## 4. Cong Nghe Su Dung

| Phan Vung | Cong Nghe | Muc Dich Su Dung |
| :--- | :--- | :--- |
| Frontend Framework | Next.js 14 (App Router) | Xay dung giao dien Single Page Application, ho tro SSR va Standalone Build |
| Ngon Ngu | TypeScript / JavaScript | Dam bao tinh an toan kieu du lieu tren toan bo ma nguon |
| CSS & UI Components | Tailwind CSS, Lucide React, Sonner | Giao dien hien dai, responsive, toi uu tren desktop, tablet va mobile |
| Backend Server | Node.js, Express.js | Xay dung RESTful API Engine, xu ly logic nghiep vu |
| Realtime Engine | Socket.io | Dong bo trang thai Kanban, tien do sua chua va thong bao thoi gian thuc |
| Co So Du Lieu Tai Lieu | MongoDB 7.0 | Quan ly ho so lenh sua chua, danh muc ton kho va thong tin khach hang |
| Co So Du Lieu Quan He | PostgreSQL 16 | Quan ly hoa don tai chinh, ghi so thanh toan va giao dich ACID |
| Co So Du Lieu Bo Nho | Redis 7.2 | Quan ly phien dang nhap, bo nho dem va Distributed Lock |
| Co So Du Lieu Do Thi | Neo4j 5.x Community | Quan ly so do tuong thich dong xe va phu tung OEM |
| Tri Tue Nhan Tao | Google Gemini AI | Ho tro co van dich vu chan doan hu hong va de xuat phu tung |
| Gui Email Tu Dong | Nodemailer (Gmail SMTP) | Gui ma xac thuc OTP, thong bao tiep nhan, bao gia va hoa don dien tu |
| Dong Goi Container | Docker, Docker Compose | Dong goi moi truong phat trien va moi truong van hanh production |

---

## 5. Kien Truc Dong Goi Docker & An Toan Mang

### 5.1. Next.js Multi-stage Standalone Build
Frontend Next.js duoc dong goi theo mo hinh Dockerfile 3 giai doan (Multi-stage):
1. **Giai doan 1 (deps):** Su dung `node:20-alpine`, chay `npm ci` de cai dat dependencies tu lockfile.
2. **Giai doan 2 (builder):** Bien dich ma nguon voi cau hinh `output: 'standalone'` trong `next.config.mjs`. Trinh bien dich tu dong phan tich Dependency Tracing de chi gom nhung module thuc su can thiet.
3. **Giai doan 3 (runner):** Su dung image Alpine toi gian, tao user phi dac quyen `nextjs:nodejs`, chi sao chep thu muc `.next/standalone`, `.next/static` va `public`.
- **Ket qua:** Dung luong image giam tu muc tieu chuan 1.2GB xuong con xap xi 120MB, tang toc do build va tiet kiem tai nguyen may chu.

### 5.2. Zero Public Database Exposure
File cau hinh `docker-compose.yml` ap dung nguyen tac bao mat toi da:
- Loai bo toan bo directive `ports:` tren ca 4 he quan tri co so du lieu (MongoDB, PostgreSQL, Neo4j, Redis).
- Thay the bang directive `expose:` chi mo cong trong pham vi mang noi bo Docker Bridge (`hihihaha_internal_net`).
- May chu Backend va Frontend giao tiep voi database thong qua ten service DNS noi bo (`mongodb:27017`, `postgres:5432`, `neo4j:7687`, `redis:6379`).
- **Loi ich bao mat:** Cat dut 100% be mat tan cong tu mang Internet hoac mang cuc bo LAN, ngan chan hoan toan cac cong cu quet cong tu dong vao co so du lieu.

---

## 6. Huong Dan Cai Dat Va Chay He Thong

### 6.1. Yeu Cau He Thong
- Node.js phien ban tu 18.x tro len (khuyen nghi 20.x LTS).
- Trinh quan ly goi npm hoac yarn.
- Docker Engine va Docker Compose (neu su dung phuong phap chay container).
- Git.

### 6.2. Phuong Phap 1: Chay Toan Bo He Thong Bang Docker Compose (Khuyen Nghi)

Day la phuong phap nhanh nhat, tu dong khoi dong toan bo co so du lieu, Backend va Frontend trong mang cach ly.

```bash
# 1. Clone ma nguon tu GitHub
git clone https://github.com/TaiLoiZzzz/HihiHaHa_Gara.git
cd HihiHaHa_Gara

# 2. Khoi chay toan bo cum he thong bang Docker Compose
docker compose up -d --build

# 3. Kiem tra trang thai hoat dong cua cac container
docker compose ps
```

Sau khi khoi dong, he thong se san sang tai:
- Giao dien Web: `http://localhost:8888`
- Backend API noi bo: `http://localhost:5000`

De dung toan bo he thong:
```bash
docker compose down
```

---

### 6.3. Phuong Phap 2: Chay Thu Cong Tren Moi Truong Local Development

Neu muon phat trien ma nguon truc tiep tren may tinh, thuc hien theo cac buoc sau:

#### Buoc 1: Khoi dong cac Co so du lieu
Chay cac container database bang Docker (hoac su dung cac ban cai dat database cuc bo tren may):
```bash
docker compose up -d mongodb postgres neo4j redis
```

#### Buoc 2: Cai dat va khoi chay Backend
Mo cua so terminal dau tien:
```bash
# Di chuyen vao thu muc backend
cd backend

# Cai dat dependencies
npm install

# Khoi chay Backend API tren cong 5000
node src/server.js
```
Kiem tra Backend hoat dong: Truy cap `http://localhost:5000/health` tren trinh duyet.

#### Buoc 3: Cai dat va khoi chay Frontend
Mo cua so terminal thu hai:
```bash
# Di chuyen vao thu muc client
cd client

# Cai dat dependencies
npm install

# Chay che do phat trien (Development):
npm run dev

# Hoac build va chay ban production (Standalone) tren cong 8888:
npm run build
npx next start -p 8888
```
Truy cap ung dung tai: `http://localhost:8888` (hoac `http://localhost:3000` neu chay `npm run dev`).

---

## 7. Cau Hinh Bien Moi Truong

### 7.1. Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=production

# Ket noi MongoDB
MONGO_URI=mongodb://localhost:27017/hihihaha_db

# Ket noi PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=hihihaha_db

# Ket noi Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j123456

# Ket noi Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Bao mat JWT Token
JWT_SECRET=hihihaha_super_secret_jwt_key_2026_secured
JWT_EXPIRES_IN=2h

# Cau hinh Email Nodemailer (Gmail App Password)
GMAIL_USER=hihihaha.auto.service@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# Ten mien cong khai
APP_PUBLIC_URL=https://hihihahagara.quachtailoi.id.vn
```

### 7.2. Frontend (`client/.env.production`)
```ini
NEXT_PUBLIC_API_URL=/api/v1
INTERNAL_BACKEND_URL=http://localhost:5000
```

---

## 8. Danh Sach Tai Khoan Kiem Thu He Thong

### 8.1. Cổng Khach Hang (`/login`)
- **Bien so xe kiem thu:** `51K-888.88`
- **So dien thoai:** `0797526990` (hoac `0912345678`)
- **Ma xac thuc OTP:** `123456` (hoac lay ma thuc te tu Gmail / Console Log backend)
- **Mo ta:** Sau khi dang nhap, he thong chuyen den giao dien theo doi truc tuyen lenh sua chua cua xe Porsche / Camry.

### 8.2. Cong Can Bo Nhan Vien & Quan Ly (`/staff/login`)
Mat khau mac dinh cho toan bo tai khoan noi bo: `123456`

| Vai Tro | So Dien Thoai | Chuc Danh / Nhiem Vu | Duong Dan Lam Viec |
| :--- | :--- | :--- | :--- |
| Co Van Dich Vu | `0988888801` | Tiep nhan xe, chan doan AI, lap bao gia | `/advisor/work-orders` |
| Quan Doc Xuong | `0988888802` | Dieu phoi khoang nang tren bang Kanban | `/manager/kanban` |
| Ky Thuat Vien 01 | `0988888803` | Thợ may & gam (Ma PIN: `1357`) | `/technician` |
| Ky Thuat Vien 02 | `0988888804` | Tho dien & dien lanh (Ma PIN: `1234`) | `/technician` |
| Ky Thuat Vien 03 | `0988888805` | Tho dong son (Ma PIN: `2468`) | `/technician` |
| Thu Kho Vat Tu | `0988888807` | Quan ly kho, kiem ke linh kien | `/manager/inventory` |
| Tong Giam Doc | `0988888800` | Theo doi dashboard chi so kinh doanh | `/owner/dashboard` |

---

## 9. Kich Ban Kiem Thu Nghiep Vu Chuan (End-to-End Workflow)

Nguoi dung co the kiem thu toan bo luong cong viec theo quy trinh 6 buoc:

1. **Buoc 1 (Tiep nhan xe):**
   - Dang nhap tai khoan Co Van Dich Vu (`0988888801`).
   - Vao trang `/advisor/create-order`, nhap bien so xe moi, so dien thoai khach va ghi nhan trieu chung.
   - Su dung tinh nang AI de du doan va chon phu tung de xuat tu kho. Bam tao lenh.
2. **Buoc 2 (Dieu phoi khoang nang):**
   - Dang nhap tai khoan Quan Doc Xuong (`0988888802`) tai `/manager/kanban`.
   - Keo tha lenh sua chua vao khoang nang tuong ung va phan cong Ky thuat vien dam nhiem.
3. **Buoc 3 (Chu xe duyet gia):**
   - Dang nhap Cong Khach Hang (`/login`) bang bien so va so dien thoai.
   - Xem chi tiet bao gia va bam chap thuan ky duyet dien tu.
4. **Buoc 4 (Tho may thi cong):**
   - Dang nhap Ban Lam Viec Tho (`/technician`) bang so dien thoai `0988888803` va ma PIN `1357`.
   - Xem xe duoc phan cong, bam bat dau thuc hien, danh dau checklist va cap nhat thanh truot tien do %.
5. **Buoc 5 (Nghiem thu KCS & Ban giao):**
   - Quan doc xac nhan nghiem thu KCS dat yeu cau tren bang Kanban, chuyen trang thai sang cho thanh toan.
6. **Buoc 6 (Thanh toan & Xuat xuong):**
   - Chu xe vao trang thanh toan `/customer/payment/[order_code]`, quet ma VietQR de hoan tat.
   - He thong ghi so cai giao dich vao PostgreSQL, tru kho tu dong tren MongoDB va cap nhat trang thai da ban giao xe.

---

## 10. Cau Truc Thu Muc Du An

```
CNPM_GaraSuaXe/
├── backend/                       # Nguon may chu API Node.js / Express
│   ├── src/
│   │   ├── config/                # Cau hinh ket noi 4 he CSDL (Mongo, PG, Neo4j, Redis)
│   │   ├── middlewares/           # Xac thuc JWT, phan quyen RBAC, xu ly loi
│   │   ├── modules/               # Cac module nghiep vu: auth, work-order, inventory, payment, ai
│   │   │   └── auth/templates/    # Mau Email HTML tiep nhan, bao gia, OTP, hoa don
│   │   ├── sockets/               # Realtime WebSocket engine
│   │   ├── utils/                 # Logger, helper xu ly ket qua
│   │   ├── app.js                 # Khoi tao Express, CORS, Helmet
│   │   └── server.js              # Diem khoi dong HTTP Server
│   ├── Dockerfile                 # Dockerfile dong goi backend
│   └── package.json
│
├── client/                        # Ung dung Next.js 14 Frontend
│   ├── public/                    # Tai nguyen tinh: logo, favicon, hinh anh
│   ├── src/
│   │   ├── app/                   # App Router: route khach hang, co van, tho, quan doc, chu xe
│   │   ├── components/            # Cac component giao dien dung chung
│   │   ├── lib/                   # Ham goi API (fetchApi), ho tro Next.js Proxy Rewrite
│   │   └── types/                 # Dinh nghia TypeScript kieu du lieu
│   ├── next.config.mjs            # Cau hinh Standalone Output va API Rewrites
│   ├── Dockerfile                 # Multi-stage Standalone Dockerfile (~120MB)
│   └── package.json
│
├── docker-compose.yml             # Cau hinh cum dich vu tong the (Zero Public DB Exposure)
└── README.md                      # Tai lieu huong dan he thong
```

---

## 11. Ban Quyen Va Giay Phep

He thong phan mem quan ly dich vu garage o to HiHiHaHa Auto duoc phat trien voi muc tieu ung dung thuc te va tieu chuan hoa quy trinh chuyen doi so nganh cong nghiep oto 4S.

Ban quyen thuoc ve Nhom Phat Trien Du An HiHiHaHa Auto. Tat ca cac quyen duoc bao luu.
