module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest"],
  rules: {
    "import/prefer-default-export": "off",
    "max-len": [
      "error",
      {
        code: 100,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "no-alert": "off",
    "no-console": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
  },
};
