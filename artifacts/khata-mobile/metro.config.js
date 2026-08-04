const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the workspace
config.watchFolders = [...config.watchFolders, workspaceRoot];

// Resolve node_modules from project and workspace
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
];

// IMPORTANT: Leave this as Expo expects
config.resolver.disableHierarchicalLookup = false;

module.exports = config;