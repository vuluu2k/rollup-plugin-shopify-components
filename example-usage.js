// Example usage of rollup-plugin-shopify-components

import { defineConfig } from 'rollup';
import shopifyComponentsPlugin from './rollup-plugin-shopify-components.js';

// Basic usage
export const basicConfig = defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponentsPlugin()
  ]
});

// Advanced usage with custom options
export const advancedConfig = defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponentsPlugin({
      srcDir: 'components',           // Custom source directory
      outputDir: 'shopify_theme',     // Custom output directory
      assetsDir: 'shopify_theme/css', // Custom assets directory
      watchMode: true,                // Enable file watching
      debounceDelay: 200              // Custom debounce delay
    })
  ],
  watch: {
    include: 'src/**/*.js'
  }
});

// Production build (no watching)
export const productionConfig = defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponentsPlugin({
      watchMode: false  // Disable watching for production
    })
  ]
});

// Multiple output formats
export const multiFormatConfig = defineConfig([
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife'
    },
    plugins: [
      shopifyComponentsPlugin({
        watchMode: true
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'es'
    },
    plugins: [
      shopifyComponentsPlugin({
        watchMode: false
      })
    ]
  }
]);

// Development with hot reload
export const developmentConfig = defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponentsPlugin({
      watchMode: true,
      debounceDelay: 50  // Faster rebuilds for development
    })
  ],
  watch: {
    include: 'src/**/*.js',
    clearScreen: false
  }
}); 