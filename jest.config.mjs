export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testMatch: [
        "**/__tests__/**/*.test.mjs",
        "**/__tests__/**/*.test.js"
    ],
    moduleFileExtensions: ["js", "mjs"]
};