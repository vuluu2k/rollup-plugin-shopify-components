# Rollup Plugin Shopify Components

A Rollup plugin for building Shopify theme components with automatic SCSS compilation, schema generation, and file watching.

## Features

- 🔧 **Automatic Component Building**: Scans your `src/` directory and builds Shopify components
- 🎨 **SCSS Compilation**: Automatically compiles `.global.scss` files to CSS
- 📋 **Schema Generation**: Converts JavaScript schema files to Shopify schema format
- 👀 **File Watching**: Watches for changes and rebuilds components automatically
- 🚀 **Debounced Rebuilds**: Prevents multiple rapid rebuilds when saving files
- 📁 **Flexible Structure**: Supports nested component directories

## Installation

```bash
npm install rollup-plugin-shopify-components
```

## Usage

### Basic Configuration

```javascript
// rollup.config.js
import shopifyComponents from 'rollup-plugin-shopify-components';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponents({
      srcDir: 'src',
      outputDir: 'shopify_bundle',
      assetsDir: 'shopify_bundle/assets',
      watchMode: true,
      debounceDelay: 100
    })
  ]
};
```

### Advanced Configuration

```javascript
// rollup.config.js
import shopifyComponents from 'rollup-plugin-shopify-components';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    shopifyComponents({
      // Source directory containing your components
      srcDir: 'src',
      
      // Output directory for generated Shopify components
      outputDir: 'shopify_bundle',
      
      // Assets directory for CSS files
      assetsDir: 'shopify_bundle/assets',
      
      // Enable file watching (default: false)
      watchMode: true,
      
      // Debounce delay for rebuilds in milliseconds (default: 100)
      debounceDelay: 150
    })
  ],
  watch: {
    include: 'src/**/*.js'
  }
};
```

## Component Structure

The plugin expects your components to follow this structure:

```
src/
├── button/
│   ├── button.liquid          # Main component template
│   ├── button.global.scss     # Component styles
│   └── schema.js              # Component schema
├── hero/
│   ├── hero.liquid
│   ├── hero.global.scss
│   └── schema.js
└── blocks/
    └── featured-product/
        ├── featured-product.liquid
        ├── featured-product.global.scss
        └── schema.js
```

### Generated Output

```
shopify_bundle/
├── button/
│   └── button.liquid          # Combined component with styles and schema
├── hero/
│   └── hero.liquid
├── blocks/
│   └── featured-product.liquid
└── assets/
    ├── button-button.css      # Generated CSS files
    ├── hero-hero.css
    └── blocks-featured-product-featured-product.css
```

## Schema Format

Your `schema.js` files should follow this format:

```javascript
const buttonSchema = {
  description: "A customizable button component",
  properties: {
    text: {
      description: "Button text",
      type: "string",
      default: "Click me"
    },
    style: {
      description: "Button style",
      type: "string",
      enum: ["primary", "secondary", "outline"],
      default: "primary"
    },
    size: {
      description: "Button size",
      type: "string",
      enum: ["small", "medium", "large"],
      default: "medium"
    },
    disabled: {
      description: "Disable button",
      type: "boolean",
      default: false
    }
  }
};
```

This will be converted to Shopify schema format:

```json
{
  "name": "Button",
  "tag": "div",
  "class": "button",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "Button text",
      "default": "Click me"
    },
    {
      "type": "select",
      "id": "style",
      "label": "Button style",
      "options": [
        { "value": "primary", "label": "Primary" },
        { "value": "secondary", "label": "Secondary" },
        { "value": "outline", "label": "Outline" }
      ],
      "default": "primary"
    }
  ]
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDir` | string | `'src'` | Source directory containing components |
| `outputDir` | string | `'shopify_bundle'` | Output directory for generated components |
| `assetsDir` | string | `'shopify_bundle/assets'` | Directory for generated CSS files |
| `watchMode` | boolean | `false` | Enable file watching for development |
| `debounceDelay` | number | `100` | Debounce delay for rebuilds (ms) |

## Development

### Building Components

```bash
# Build once
rollup -c

# Build and watch for changes
rollup -c --watch
```

### File Watching

When `watchMode` is enabled, the plugin will:

1. Watch all `.liquid`, `.scss`, and `.js` files in your `src/` directory
2. Automatically rebuild components when files change
3. Debounce rebuilds to prevent excessive processing
4. Clean up watchers when the build process ends

## Examples

### Simple Button Component

```liquid
<!-- src/button/button.liquid -->
<button class="button button--{{ style }} button--{{ size }}" {% if disabled %}disabled{% endif %}>
  {{ text }}
</button>
```

```scss
/* src/button/button.global.scss */
.button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &--primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &--secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  }
  
  &--outline {
    background: transparent;
    border: 2px solid #007bff;
    color: #007bff;
    
    &:hover {
      background: #007bff;
      color: white;
    }
  }
  
  &--small {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 16px 32px;
    font-size: 18px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
}
```

```javascript
// src/button/schema.js
const buttonSchema = {
  description: "A customizable button component with multiple styles and sizes",
  properties: {
    text: {
      description: "Button text",
      type: "string",
      default: "Click me"
    },
    style: {
      description: "Button style",
      type: "string",
      enum: ["primary", "secondary", "outline"],
      default: "primary"
    },
    size: {
      description: "Button size",
      type: "string",
      enum: ["small", "medium", "large"],
      default: "medium"
    },
    disabled: {
      description: "Disable button",
      type: "boolean",
      default: false
    }
  }
};
```

## License

MIT 