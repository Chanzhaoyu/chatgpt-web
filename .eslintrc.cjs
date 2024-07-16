module.exports = {
  root: true,
  extends: ['@antfu'],
  rules: {
    'vue/component-name-in-template-casing': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'vue/html-self-closing': 'off',
		'vue/no-unused-vars': "off"
  },
}
