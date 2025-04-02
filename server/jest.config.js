const jestConfig = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{}],
  },
  testMatch: ["**/test/**/*.ts"] ,
};

module.exports = jestConfig;
