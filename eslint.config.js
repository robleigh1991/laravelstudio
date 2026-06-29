import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
            },
        },
    },
    {
        // Formatting/layout rules are owned by Prettier — turn them off in ESLint
        // so the two tools don't conflict.
        rules: {
            'vue/max-attributes-per-line': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/html-self-closing': 'off',
            'vue/attributes-order': 'off',
            'vue/first-attribute-linebreak': 'off',
        },
    },
    {
        ignores: ['public/build/**', 'vendor/**', 'node_modules/**'],
    },
];
