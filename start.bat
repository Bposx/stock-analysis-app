@echo off
chcp 65001 >nul
echo ============================================
echo   Stock Analysis App - Launcher
echo   ລະບົບວິເຄາະຫຸ້ນ LSX + ຫຸ້ນສາກົນ
echo ============================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python ຍັງບໍ່ໄດ້ຕິດຕັ້ງ - ກະລຸນາດາວໂຫຼດຈາກ python.org
    pause & exit /b 1
)

:: Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js ຍັງບໍ່ໄດ້ຕິດຕັ້ງ - ກະລຸນາດາວໂຫຼດຈາກ nodejs.org
    pause & exit /b 1
)

:: Setup Backend
echo [1/4] ກຳລັງກວດສອບ ແລະ setup Backend...
cd backend
if not exist ".venv" (
    echo     Creating Python virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate
pip install -r requirements.txt -q
python -m playwright install chromium

:: Create .env if missing
if not exist ".env" (
    copy ..\.env.example .env >nul 2>&1
    echo     Created .env from example
)

:: Start Backend in new window
echo [2/4] ເປີດໃຊ້ງານ Backend (http://localhost:8000)...
start "Stock Backend" cmd /k "call .venv\Scripts\activate && python main.py"

cd ..

:: Setup Frontend
echo [3/4] ກຳລັງກວດສອບ ແລະ setup Frontend...
cd frontend
if not exist "node_modules" (
    echo     Installing npm packages...
    npm install
)

:: Start Frontend in new window
echo [4/4] ເປີດໃຊ້ງານ Frontend (http://localhost:5173)...
start "Stock Frontend" cmd /k "npm run dev"

cd ..

echo.
echo ============================================
echo  ✓ App ເລີ່ມເຮັດວຽກແລ້ວ...
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:5173
echo  API Docs: http://localhost:8000/docs
echo ============================================
echo.
timeout /t 5
start http://localhost:5173
