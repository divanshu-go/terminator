#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { getPlatformInfo } = require("./platform");

const args = process.argv.slice(2);
const isRelease = args.includes("--release");
const isDebug = args.includes("--debug");

if (!isRelease && !isDebug) {
  console.error("Specify --release or --debug");
  process.exit(1);
}

const { platform, target, bin: binName, npmDir } = getPlatformInfo();

// Kill any existing terminator-mcp-agent process before building
try {
  // windows is annoying w filesystem
  if (platform === "win32") {
    execSync("taskkill /f /im terminator-mcp-agent.exe 2>nul || exit 0", { stdio: "ignore" });
  }
} catch (error) {
  // Ignore errors if process doesn't exist
}

const buildType = isRelease ? "--release" : "";
console.log(`Building for target ${target} (${buildType || "debug"})`);
// Build without explicit target to use default host target
// Enable sentry feature for release builds
const features = isRelease ? "--features sentry" : "";
execSync(
  `cargo build -p terminator-mcp-agent ${buildType} ${features}`,
  { stdio: "inherit" },
);

const buildDir = isRelease ? "release" : "debug";
// Binary is in target/release or target/debug when no --target is specified
const binaryPath = path.join(
  __dirname,
  "../../target",
  buildDir,
  binName,
);
const destDir = path.join(__dirname, "../npm", npmDir);
const destPath = path.join(destDir, binName);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(binaryPath, destPath);
console.log(`Copied ${binaryPath} to ${destPath}`);

// Copy to LocalAppData for cross-repo sharing
const os = require("os");
let sharedBinDir;
let sharedBinPath;

if (platform === "win32") {
  // Windows: %LOCALAPPDATA%\mediar\bin\
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  sharedBinDir = path.join(localAppData, "mediar", "bin");
  sharedBinPath = path.join(sharedBinDir, binName);
} else if (platform === "darwin") {
  // macOS: ~/Library/Application Support/mediar/bin/
  sharedBinDir = path.join(os.homedir(), "Library", "Application Support", "mediar", "bin");
  sharedBinPath = path.join(sharedBinDir, binName);
} else {
  // Linux: ~/.local/share/mediar/bin/
  sharedBinDir = path.join(os.homedir(), ".local", "share", "mediar", "bin");
  sharedBinPath = path.join(sharedBinDir, binName);
}

// Create shared directory if it doesn't exist
if (!fs.existsSync(sharedBinDir)) {
  fs.mkdirSync(sharedBinDir, { recursive: true });
  console.log(`Created shared directory: ${sharedBinDir}`);
}

// Copy to shared location
fs.copyFileSync(binaryPath, sharedBinPath);
console.log(`Copied to shared location: ${sharedBinPath}`);

if (platform === "darwin") {
  console.log(`Signing ${destPath}...`);
  try {
    execSync(`codesign --force --deep --sign - ${destPath}`);
    console.log("Signing successful.");
  } catch (error) {
    console.error("Signing failed. Please ensure you have Xcode Command Line Tools installed.");
    console.error(error);
    process.exit(1);
  }
}
