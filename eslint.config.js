const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        ignores: ['node_modules/**', 'coverage/**'],
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
        },
    },
];
