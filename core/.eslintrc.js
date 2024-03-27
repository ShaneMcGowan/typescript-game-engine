module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script',
      },
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prefer-const': 'off',
    semi: ['error', 'always'],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'never',
    }],
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-useless-computed-key': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: true,
      },
      multilineDetection: 'brackets',
    }],
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/comma-dangle': ['error', {
      arrays: 'never',
      objects: 'always',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    '@typescript-eslint/dot-notation': 'off',
  },
};
