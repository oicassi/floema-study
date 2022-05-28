module.exports = {
  root: true,
  extends: ['standard'],
  globals: {
    IS_DEVELOPMENT: 'readonly',
  },
  parserOptions: {
    ecmasVersion: 2020,
  },
  rules: {
    'max-len': ['warn', { code: 120 }],
    'no-unused-vars': ['warn'],
    'comma-dangle': ['off'],
  },
}
