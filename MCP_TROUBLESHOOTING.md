# MCP Server SQLite Troubleshooting Guide

## Common Error
```
failed to initialize MCP client for sqlite: transport error: context deadline exceeded
```

## Root Causes and Solutions

### 1. Server Not Starting Correctly
**Symptoms**: The MCP client cannot connect to the server within the timeout period.

**Solution**: 
- Ensure the start-mcp.bat script is properly configured
- Verify that uv/uvx is installed and in PATH
- Check that the database file path is correct and accessible

### 2. Database Path Issues
**Symptoms**: The server fails to initialize due to database access problems.

**Solution**:
- Verify the database file exists at the specified path
- Ensure the database file has proper read/write permissions
- Use an absolute path instead of relative path if needed

### 3. Environment Configuration
**Symptoms**: Missing dependencies or incorrect PATH configuration.

**Solution**:
- Install uv if not already installed:
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```
- Ensure Python 3.13 is installed and accessible
- Verify that the PATH includes Python scripts directory

## Testing the Server

### Manual Test
1. Run the start-mcp.bat script
2. Check that the server starts without errors
3. Verify that the process remains running

### Automated Test
Run the test-mcp-server.py script to verify server functionality:
```bash
python test-mcp-server.py
```

## Qoder IDE Configuration

If the server is running correctly but you still get the error:

1. Open Qoder IDE Settings (Ctrl+Shift+, on Windows)
2. Navigate to MCP section
3. Check the server configuration parameters
4. Ensure the database path in the arguments is correct
5. Try reconnecting the server

## Additional Troubleshooting Steps

1. Restart Qoder IDE
2. Check firewall settings that might block local connections
3. Verify that no other process is using the same port
4. Check corporate security software that might block Node.js execution