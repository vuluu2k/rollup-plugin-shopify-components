# Test Project for rollup-plugin-shopify-components

This is a test project to demonstrate how to use the `rollup-plugin-shopify-components` plugin.

## Structure

```
test-project/
├── src/
│   ├── button/
│   │   ├── button.liquid          # Button component template
│   │   ├── button.global.scss     # Button styles
│   │   └── schema.js              # Button schema
│   ├── hero/
│   │   ├── hero.liquid
│   │   ├── hero.global.scss
│   │   └── schema.js
│   ├── blocks/
│   │   └── featured-product/
│   │       ├── featured-product.liquid
│   │       ├── featured-product.global.scss
│   │       └── schema.js
│   └── index.js                   # Entry point
├── rollup.config.js               # Rollup configuration
└── package.json
```

## Usage

1. Install dependencies:
```bash
npm install
```

2. Build components:
```bash
npm run build
```

3. Watch for changes:
```bash
npm run dev
```

## Expected Output

After building, you should see:

```
shopify_bundle/
├── button/
│   └── button.liquid              # Combined component
├── hero/
│   └── hero.liquid
├── blocks/
│   └── featured-product.liquid
└── assets/
    ├── button-button.css          # Generated CSS
    ├── hero-hero.css
    └── blocks-featured-product-featured-product.css
```

## Testing

1. Run the build to generate components
2. Check the generated files in `shopify_bundle/`
3. Modify any component file and watch it rebuild automatically
4. Verify that CSS files are generated in `shopify_bundle/assets/`

## Notes

- The plugin automatically detects component structure
- SCSS files are compiled to CSS
- Schema files are converted to Shopify format
- File watching works in development mode 