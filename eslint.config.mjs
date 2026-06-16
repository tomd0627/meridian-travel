import globals from 'globals';

export default [
  {
    files: ['js/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      eqeqeq: 'error',
      'no-console': 'error',
      'no-unused-vars': 'error',
    },
  },
  {
    files: ['tests/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: 'error',
      'no-console': 'error',
      'no-unused-vars': 'error',
    },
  },
];
