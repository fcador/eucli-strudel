const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const apxDsPath = path.resolve(__dirname, "../aPx_ds");

const config = getDefaultConfig(__dirname);

config.watchFolders = [apxDsPath];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
