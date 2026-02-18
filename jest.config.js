module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?(-.*)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|native-base|react-native-svg|nativewind|apx-ds)/)",
  ],
  modulePaths: ["<rootDir>/node_modules"],
};
