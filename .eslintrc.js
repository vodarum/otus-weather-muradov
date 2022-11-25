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
    "class-methods-use-this": [
      "error",
      {
        exceptMethods: [
          "createMarkupElement",
          "isDefined",
          "removeMarkup",
          "saveWeatherInfo",
          "validateCoord",
        ],
      },
    ],
    "import/prefer-default-export": "off",
    "max-len": [
      "error",
      {
        code: 100,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      },
    ],
    "no-alert": "off",
    "no-console": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": 0,
    "prefer-destructuring": ["error", { object: true, array: false }],
  },
};
