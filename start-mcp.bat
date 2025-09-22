@echo off
set PATH=%PATH%;C:\Users\srab1.SAMEH-NVME\AppData\Local\Programs\Python\Python313\Scripts

echo Checking if uv is installed...
where uv >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: uv is not installed or not in PATH
    echo Please install uv by running:
    echo powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    exit /b 1
)

echo Checking if mcp-server-sqlite is available...
uvx mcp-server-sqlite --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing mcp-server-sqlite...
    uvx mcp-server-sqlite --help
)

echo Starting MCP SQLite Server with existing database...
uvx mcp-server-sqlite --db-path ./Turkish-Genspark-20-80/data/turkish_learning.db