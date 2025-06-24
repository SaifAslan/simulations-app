module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babelrc.js" },
    ],
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/babel-jest.config.js", // Explicitly ignore the Babel config
    "/.babelrc.js",
  ],
};
