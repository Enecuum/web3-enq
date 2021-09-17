module.exports = {
    extends: [
        'airbnb',
    ],

    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
    },

    rules: {
        semi: ['error', 'never'],
        indent: ['warn', 4],
        'object-shorthand': 0,
        'class-methods-use-this': 0,
        'no-console': 0,
        'max-classes-per-file': 0,
        'no-underscore-dangle': 0,
        'max-len': 0,
        'react/jsx-indent': 0,
        'no-plusplus': 0,
        'no-multiple-empty-lines': ['warn', {max: 2}],
    },
}
