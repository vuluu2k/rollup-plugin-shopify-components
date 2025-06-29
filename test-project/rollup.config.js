import { defineConfig } from 'rollup';
import shopifyComponentsPlugin from '../rollup-plugin-shopify-components.js';

export default defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'TestBundle'
  },
  plugins: [
    shopifyComponentsPlugin({
      srcDir: 'src',
      outputDir: 'shopify_bundle',
      assetsDir: 'shopify_bundle/assets',
      watchMode: true,
      debounceDelay: 100
    })
  ],
  watch: {
    include: 'src/**/*.js',
    exclude: 'node_modules/**',
    buildDelay: 100,
    clearScreen: false
  }
}); 