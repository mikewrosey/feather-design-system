module.exports = {
  testEnvironment: "jsdom",
  snapshotSerializers: ["./jest/serializer"],
  moduleFileExtensions: ["js", "jsx", "json", "vue", "ts", "tsx"],

  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },

  transformIgnorePatterns: ["/node_modules/"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },

  testPathIgnorePatterns: ["<rootDir>/(?:.+?)/e2e/"],

  testMatch: ["**/@featherds/*/src/**/*.spec.(js|jsx|ts|tsx)"],

  testURL: "http://localhost/",

  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
