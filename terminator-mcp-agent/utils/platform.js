#!/usr/bin/env node

function getPlatformInfo() {
    const platform = process.platform;
    const arch = process.arch;

    // Windows
    if (platform === "win32" && arch === "x64") {
        return {
            platform,
            arch,
            target: "x86_64-pc-windows-msvc",
            bin: "terminator-mcp-agent.exe",
            npmDir: "win32-x64-msvc",
            pkg: "terminator-mcp-win32-x64-msvc",
        };
    }
    if (platform === "win32" && (arch === "arm64" || arch === "arm")) {
        return {
            platform,
            arch,
            target: "aarch64-pc-windows-msvc",
            bin: "terminator-mcp-agent.exe",
            npmDir: "win32-arm64-msvc",
            pkg: "terminator-mcp-win32-arm64-msvc",
        };
    }

    // Linux
    if (platform === "linux" && arch === "x64") {
        return {
            platform,
            arch,
            target: "x86_64-unknown-linux-gnu",
            bin: "terminator-mcp-agent",
            npmDir: "linux-x64-gnu",
            pkg: "terminator-mcp-linux-x64-gnu",
        };
    }

    // macOS
    if (platform === "darwin" && arch === "x64") {
        return {
            platform,
            arch,
            target: "x86_64-apple-darwin",
            bin: "terminator-mcp-agent",
            npmDir: "darwin-x64",
            pkg: "terminator-mcp-darwin-x64",
        };
    }
    if (platform === "darwin" && arch === "arm64") {
        return {
            platform,
            arch,
            target: "aarch64-apple-darwin",
            bin: "terminator-mcp-agent",
            npmDir: "darwin-arm64",
            pkg: "terminator-mcp-darwin-arm64",
        };
    }

    throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

module.exports = { getPlatformInfo };


