# 📈 Stock Analysis App — ລະບົບວິເຄາະຫຸ້ນ ແລະ ຕະຫຼາດການເງິນສາກົນ

ແພລດຟອມວິເຄາະຫຸ້ນແບບ Real-time ທີ່ຮອງຮັບທັງ **ຫຸ້ນລາວ LSX** (ຕະຫຼາດຫຼັກຊັບລາວ) ແລະ **ຫຸ້ນສາກົນ** (ໄທ, ຫວຽດນາມ, ຈີນ, ຍີ່ປຸ່ນ, ອາເມລິກາ, Crypto, ຄຳ ແລະ ນ້ຳມັນ) ພ້ອມເຄື່ອງມືວິເຄາະທາງເຕັກນິກ (Technical Indicators) ຄົບຊຸດ.

---

## ✨ ຈຸດເດັ່ນຂອງລະບົບ (Key Features)

- 🇱🇦 **ຕະຫຼາດຫຼັກຊັບລາວ (LSX):** ດຶງຂໍ້ມູນລາຄາຫຼ້າສຸດ ແລະ ປະຫວັດການຊື້ຂາຍຈາກ lsx.com.la
- 🇹🇭 **ຕະຫຼາດຫຼັກຊັບໄທ (SET):** ຫຸ້ນຍອດນິຍົມ SET50 ແລະ Bluechips
- 🇻🇳 **ຕະຫຼາດຫຼັກຊັບຫວຽດນາມ (VN / HOSE / HNX):** ຫຸ້ນຊັ້ນນຳ VN30
- 🇨🇳 **ຕະຫຼາດຫຼັກຊັບຈີນ (China A-Shares):** ຊຽງໄຮ້ (SSE), ເຊິນເຈີ້ນ (SZSE)
- 🇯🇵 **ຕະຫຼາດຫຼັກຊັບຍີ່ປຸ່ນ (TSE / Nikkei 225):** ຫຸ້ນເຕັກໂນໂລຢີ ແລະ ອຸດສາຫະກຳຊັ້ນນຳ
- 🇺🇸 **ຕະຫຼາດຫຸ້ນສະຫະລັດ (US Market):** NYSE, NASDAQ, S&P 500
- 🪙 **Crypto & ສິນຊັບສາກົນ:** Bitcoin, Ethereum, ຄຳ (Gold), ນ້ຳມັນ (Crude Oil)
- 📊 **ກຣາຟ TradingView:** Interactive Candlestick Charts ພ້ອມ Volume
- 📐 **Technical Indicators:** RSI, MACD, Bollinger Bands, SMA/EMA, Stochastic
- 🧠 **AI / Automated Analysis:** ປະເມີນສັນຍານ Buy/Sell, ແນວຮັບ-ແນວຕ້ານ (Support/Resistance)
- 🌐 **ຮອງຮັບ 4 ພາສາ:** ພາສາລາວ (🇱🇦), ພາສາໄທ (🇹🇭), ພາສາອັງກິດ (🇺🇸), ພາສາຈີນ (🇨🇳)
- 🌓 **ຮອງຮັບ 2 ໂໝດ:** Light Mode (ສີຟ້າອ່ອນມືອາຊີບ) & Dark Mode (Midnight Navy)

---

## 🚀 ວິທີເລີ່ມຕົ້ນໃຊ້ງານ (Quick Start)

### ສຳລັບ Windows:
ດັບເບິນຄລິກໄຟລ໌:
```bat
start.bat
```
ລະບົບຈະກວດສອບ Python, Node.js, ສ້າງ virtual environment, ຕິດຕັ້ງ dependencies ແລະ ເປີດທັງ Backend ແລະ Frontend ໃຫ້ອັດຕະໂນມັດ.

---

## 🛠️ ການຕິດຕັ້ງແບບ Manual (Manual Setup)

### 1. Backend (Python FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # ສຳລັບ Windows
# source .venv/bin/activate     # ສຳລັບ macOS/Linux

pip install -r requirements.txt
playwright install chromium
copy .env.example .env          # ສຳລັບ Windows (ຫຼື cp .env.example .env)
python main.py
```
> Backend ຈະເຮັດວຽກທີ່: `http://localhost:8000`  
> Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend (React + Vite + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
> Frontend ຈະເຮັດວຽກທີ່: `http://localhost:5173`

---

## 🐳 ການໃຊ້ງານດ້ວຍ Docker
```bash
docker-compose up -d --build
```
- **Frontend:** `http://localhost`
- **Backend API:** `http://localhost:8000`

---

## 📡 API Endpoints ຫຼັກ

### 1. ຫຸ້ນສາກົນ (Yahoo Finance)
- `GET /api/stocks/quote/{symbol}` → ລາຄາ ແລະ ສະຖິຕິ real-time
- `GET /api/stocks/history/{symbol}` → ຂໍ້ມູນແທ່ງທຽນ OHLCV
- `GET /api/stocks/search?q={query}` → ຄົ້ນຫາ symbol
- `GET /api/stocks/category/{category}` → ດຶງຕາມກຸ່ມ (lao, thai, vn, china, japan, us, crypto)
- `POST /api/stocks/quotes` → ດຶງຫຼາຍຕົວພ້ອມກັນ

### 2. ຫຸ້ນລາວ (LSX)
- `GET /api/lsx/market` → ດັດຊະນີ LSX Composite Index
- `GET /api/lsx/stocks` → ລາຍຊື່ຫຸ້ນ LSX ທັງໝົດ
- `GET /api/lsx/history/{symbol}` → ປະຫວັດລາຄາຫຸ້ນ LSX
- `POST /api/lsx/refresh` → ດຶງຂໍ້ມູນໃໝ່ຈາກເວັບໄຊທັນທີ

### 3. ບົດວິເຄາະ ແລະ ອິນດິເຄເຕີ (Technical Analysis)
- `GET /api/indicators/{symbol}` → ຄຳນວນຄ່າ RSI, MACD, Bollinger Bands, MA
- `GET /api/indicators/analysis/{symbol}` → ສະຫຼຸບສັນຍານເທຣດ (Strong Buy/Sell, TP/SL)

---

## 🏗️ Tech Stack

- **Backend:** Python 3.12, FastAPI, yfinance, Playwright, Pandas, Pandas-TA, SQLAlchemy, SQLite/PostgreSQL, APScheduler
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lightweight Charts (TradingView), Lucide Icons, Axios, React Query
- **Deployment:** Docker, Docker Compose, Nginx

---

## 🔒 ຂໍ້ຄວນລະວັງກ່ອນຂຶ້ນ Production / GitHub
1. ໄຟລ໌ `.env` ຖືກປ້ອງກັນໂດຍ `.gitignore` ບໍ່ໃຫ້ຫຼຸດຂຶ້ນ GitHub.
2. ຖ້າໃຊ້ງານຈິງໃນລະດັບ Production ແນະນຳໃຫ້ປ່ຽນ Database ຈາກ SQLite ເປັນ PostgreSQL + TimescaleDB.
3. ຂໍ້ມູນໃນເວັບໄຊແມ່ນເພື່ອການສຶກສາ ແລະ ວິເຄາະເທົ່ານັ້ນ, ບໍ່ຖືເປັນຄຳແນະນຳທາງດ້ານການລົງທຶນ.

---

## 📄 License
MIT License
