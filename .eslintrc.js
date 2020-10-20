module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: ['@typescript-eslint'],
  rules: {}
};
