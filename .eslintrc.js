module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/strongly-recommended',
  ],
  rules: {
    "import/no-unresolved": "off",
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}