module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        }
      }
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@controllers': './src/controllers',
        '@helpers': './src/helpers',
        '@models': './src/models',
        '@routers': './src/routers'
      }
    }]
  ],
  ignore: [
    'node_modules'
  ]
}