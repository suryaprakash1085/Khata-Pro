// const { getDefaultConfig } = require("expo/metro-config");
// const path = require("path");

// const projectRoot = __dirname;
// const workspaceRoot = path.resolve(projectRoot, "../..");

// const config = getDefaultConfig(projectRoot);

// // Watch the workspace
// config.watchFolders = [...config.watchFolders, workspaceRoot];

// // Resolve node_modules from project and workspace
// config.resolver.nodeModulesPaths = [
//   path.join(projectRoot, "node_modules"),
//   path.join(workspaceRoot, "node_modules"),
// ];

// // IMPORTANT: Leave this as Expo expects
// config.resolver.disableHierarchicalLookup = false;

// module.exports = config;



const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch workspace packages
config.watchFolders = [
  workspaceRoot,
];

// pnpm symlink support
config.resolver.unstable_enableSymlinks = true;

// Resolve node_modules
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
];

// Let Metro search parent folders
config.resolver.disableHierarchicalLookup = false;

// Important for pnpm
config.resolver.unstable_enablePackageExports = true;

module.exports = config;