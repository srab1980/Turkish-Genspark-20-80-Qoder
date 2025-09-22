#!/usr/bin/env python3
"""
Test script to verify MCP SQLite server connectivity
"""

import subprocess
import time
import sys

def test_mcp_server():
    print("Testing MCP SQLite Server...")
    
    # Start the MCP server in the background
    print("Starting MCP SQLite Server...")
    server_process = subprocess.Popen([
        "uvx", "mcp-server-sqlite", "--db-path", "./test.db"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Give the server a moment to start
    time.sleep(3)
    
    # Check if the server is running
    if server_process.poll() is None:
        print("✅ MCP SQLite Server is running")
        # Terminate the server
        server_process.terminate()
        try:
            server_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server_process.kill()
        return True
    else:
        stdout, stderr = server_process.communicate()
        print("❌ MCP SQLite Server failed to start")
        print("STDOUT:", stdout.decode())
        print("STDERR:", stderr.decode())
        return False

if __name__ == "__main__":
    success = test_mcp_server()
    sys.exit(0 if success else 1)