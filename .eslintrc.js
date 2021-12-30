module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    "airbnb-base",
    // 'plugin:vue/essential',
    // '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
    parser: 'babel-eslint',
    sourceType: "module"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
