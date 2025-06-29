import fs from 'fs';
import path from 'path';
import sass from 'sass';

/**
 * Component Builder Class
 */
class ComponentBuilder {
  constructor(options = {}) {
    this.srcDir = options.srcDir || path.resolve('src');
    this.outputDir = options.outputDir || path.resolve('shopify_bundle');
    this.assetsDir = options.assetsDir || path.resolve('shopify_bundle/assets');
    this.watchMode = options.watchMode || false;
    this.debounceDelay = options.debounceDelay || 100;
  }

  async buildAllComponents() {
    console.log('🔧 Building Shopify components...');
    
    // Tự động phát hiện tất cả folder trong src
    const srcItems = fs.readdirSync(this.srcDir, { withFileTypes: true });
    const srcFolders = srcItems.filter(item => item.isDirectory());
    
    for (const folder of srcFolders) {
      const folderName = folder.name;
      const srcFolderPath = path.join(this.srcDir, folderName);
      const outputFolderPath = path.join(this.outputDir, folderName);
      
      // Tạo thư mục output tương ứng
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
      }
      
      console.log(`📦 Building ${folderName}...`);
      await this.buildComponentsFlat(srcFolderPath, outputFolderPath);
    }
  }

  async buildComponentsFlat(srcPath, snippetsDir) {
    if (!fs.existsSync(srcPath)) return;
    const items = fs.readdirSync(srcPath, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(srcPath, item.name);
      if (item.isDirectory()) {
        // Nếu trong folder có file trùng tên với folder (.liquid), bundle ra snippets
        const componentLiquid = path.join(itemPath, `${item.name}.liquid`);
        if (fs.existsSync(componentLiquid)) {
          await this.buildComponent(item.name, itemPath, snippetsDir);
        }
        // Đệ quy tiếp cho các thư mục con
        await this.buildComponentsFlat(itemPath, snippetsDir);
      }
      // Nếu là file .liquid ở root src, cũng bundle ra snippets
      else if (item.isFile() && item.name.endsWith('.liquid')) {
        const base = path.basename(item.name, '.liquid');
        await this.buildComponent(base, srcPath, snippetsDir);
      }
    }
  }

  async buildComponent(componentName, componentDir, outputDir) {
    const liquidFile = path.join(componentDir, `${componentName}.liquid`);
    const scssFile = path.join(componentDir, `${componentName}.global.scss`);
    const schemaFile = path.join(componentDir, 'schema.js');
    
    console.log(`📦 Building component: ${componentName} (from ${path.relative(this.srcDir, componentDir)})`);
    
    let liquidContent = '';
    
    // Add component documentation
    liquidContent += `{% comment %}\n`;
    liquidContent += `  ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component\n`;
    
    // Process schema for documentation
    if (fs.existsSync(schemaFile)) {
      try {
        const schemaContent = fs.readFileSync(schemaFile, 'utf8');
        
        // Extract description for comment
        const descriptionMatch = schemaContent.match(/description:\s*['"]([^'"]+)['"]/);
        if (descriptionMatch) {
          liquidContent += `  ${descriptionMatch[1]}\n`;
        }
        
        console.log(`  📋 Schema processed for ${componentName}`);
        
      } catch (e) {
        console.warn(`⚠️  Could not process schema for ${componentName}:`, e.message);
      }
    }
    
    liquidContent += `{% endcomment %}\n\n`;
    
    // Add stylesheet if SCSS exists
    if (fs.existsSync(scssFile)) {
      try {
        const scssContent = fs.readFileSync(scssFile, 'utf8');
        const cssContent = this.processSCSS(scssContent, componentName);
        
        liquidContent += `{% stylesheet %}\n`;
        liquidContent += cssContent;
        liquidContent += `{% endstylesheet %}\n\n`;
        
        // Also generate separate CSS file with component path
        const relativePath = path.relative(this.srcDir, componentDir);
        const cssFileName = relativePath ? `${relativePath.replace(/[\/\\]/g, '-')}-${componentName}.css` : `${componentName}.css`;
        const cssFile = path.join(this.assetsDir, cssFileName);
        // Ensure the assets directory exists
        const cssDir = path.dirname(cssFile);
        if (!fs.existsSync(cssDir)) {
          fs.mkdirSync(cssDir, { recursive: true });
        }
        fs.writeFileSync(cssFile, cssContent);
        console.log(`  ✅ Generated CSS: ${cssFileName}`);
        
      } catch (error) {
        console.error(`  ❌ Failed to process SCSS for ${componentName}:`, error.message);
      }
    }
    
    // Add liquid template
    if (fs.existsSync(liquidFile)) {
      const templateContent = fs.readFileSync(liquidFile, 'utf8');
      liquidContent += templateContent;
    }
    
    // Add schema block at the end if schema file exists
    if (fs.existsSync(schemaFile)) {
      try {
        const schemaContent = fs.readFileSync(schemaFile, 'utf8');
        const shopifySchema = this.convertToShopifySchema(schemaContent, componentName);
        
        liquidContent += `\n\n{% schema %}\n`;
        liquidContent += `${JSON.stringify(shopifySchema, null, 2)}\n`;
        liquidContent += `{% endschema %}\n`;
        
        console.log(`  📋 Schema block added for ${componentName}`);
      } catch (e) {
        console.warn(`⚠️  Could not add schema block for ${componentName}:`, e.message);
      }
    }
    
    // Write combined liquid file
    const outputFile = path.join(outputDir, `${componentName}.liquid`);
    fs.writeFileSync(outputFile, liquidContent);
    console.log(`  ✅ Generated: ${componentName}.liquid`);
  }

  processSCSS(scssContent, componentName) {
    // Use sass compiler to properly convert SCSS to CSS
    try {
      const result = sass.compileString(scssContent, {
        style: 'expanded',
        loadPaths: [path.dirname(scssContent)]
      });
      
      return result.css;
    } catch (error) {
      console.warn(`⚠️  Could not compile SCSS for ${componentName}, using fallback:`, error.message);
      
      // Fallback: manual SCSS to CSS conversion
      let css = scssContent;
      
      // Replace SCSS nesting with flat CSS
      const baseClass = `.${componentName}`;
      
      // Handle pseudo-selectors
      css = css.replace(/&:hover\s*\{/g, `}\n\n${baseClass}:hover {`);
      css = css.replace(/&:active\s*\{/g, `}\n\n${baseClass}:active {`);
      css = css.replace(/&:focus\s*\{/g, `}\n\n${baseClass}:focus {`);
      css = css.replace(/&:disabled\s*\{/g, `}\n\n${baseClass}:disabled {`);
      
      // Replace remaining & with base class
      css = css.replace(/&/g, baseClass);
      
      // Remove SCSS comments and clean up
      css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
      css = css.replace(/^\s*\/\/.*$/gm, ''); // Remove line comments
      
      return css;
    }
  }

  convertToShopifySchema(schemaContent, componentName) {
    try {
      // Extract schema object using regex
      const schemaMatch = schemaContent.match(/const\s+\w+Schema\s*=\s*(\{[\s\S]*?\});/);
      if (!schemaMatch) {
        throw new Error('Could not extract schema object');
      }
      
      // Parse the JavaScript object (simple approach)
      const schemaStr = schemaMatch[1];
      
      // Convert to Shopify schema format
      const shopifySchema = {
        name: componentName.charAt(0).toUpperCase() + componentName.slice(1),
        tag: 'div',
        class: componentName,
        settings: []
      };
      
      // Extract properties and convert to Shopify settings
      const propertiesMatch = schemaStr.match(/properties:\s*\{([\s\S]*?)\n\s*\},/);
      if (propertiesMatch) {
        const propertiesText = propertiesMatch[1];
        const propertyRegex = /(\w+):\s*\{([\s\S]*?)\}/g;
        let propertyMatch;
        
        while ((propertyMatch = propertyRegex.exec(propertiesText)) !== null) {
          const propertyName = propertyMatch[1];
          const propertyContent = propertyMatch[2];
          
          const descMatch = propertyContent.match(/description:\s*['"]([^'"]+)['"]/);
          const typeMatch = propertyContent.match(/type:\s*['"]([^'"]+)['"]/);
          const defaultMatch = propertyContent.match(/default:\s*([^,\n]+)/);
          const enumMatch = propertyContent.match(/enum:\s*\[([^\]]+)\]/);
          
          if (descMatch) {
            const setting = {
              type: this.mapTypeToShopify(typeMatch ? typeMatch[1] : 'string'),
              id: propertyName,
              label: descMatch[1],
              default: defaultMatch ? this.parseDefaultValue(defaultMatch[1]) : undefined
            };
            
            // Add options for enum types
            if (enumMatch) {
              const options = enumMatch[1].split(',').map(opt => {
                const cleanOpt = opt.trim().replace(/['"]/g, '');
                return {
                  value: cleanOpt,
                  label: cleanOpt.charAt(0).toUpperCase() + cleanOpt.slice(1)
                };
              });
              setting.options = options;
            }
            
            shopifySchema.settings.push(setting);
          }
        }
      }
      
      return shopifySchema;
      
    } catch (error) {
      console.warn(`⚠️  Could not convert schema for ${componentName}:`, error.message);
      
      // Return a basic schema as fallback
      return {
        name: componentName.charAt(0).toUpperCase() + componentName.slice(1),
        tag: 'div',
        class: componentName,
        settings: []
      };
    }
  }
  
  mapTypeToShopify(jsType) {
    const typeMap = {
      'string': 'text',
      'number': 'number',
      'boolean': 'checkbox',
      'array': 'select'
    };
    return typeMap[jsType] || 'text';
  }
  
  parseDefaultValue(value) {
    const cleanValue = value.trim().replace(/['"]/g, '');
    if (cleanValue === 'true') return true;
    if (cleanValue === 'false') return false;
    if (!isNaN(cleanValue)) return Number(cleanValue);
    return cleanValue;
  }

  // Rebuild specific component
  async rebuildComponent(changedFile) {
    const relativePath = path.relative(this.srcDir, changedFile);
    const pathParts = relativePath.split(path.sep);
    
    if (pathParts.length === 0) return;
    
    // Tìm component name và output directory dựa trên logic giống buildAllComponents
    let componentName, componentDir, outputDir;
    
    if (pathParts.length === 1) {
      // File ở root src (ví dụ: src/component.liquid)
      componentName = path.basename(changedFile, path.extname(changedFile));
      componentDir = this.srcDir;
      outputDir = this.outputDir; // Output vào snippets root
    } else {
      // File trong thư mục con (ví dụ: src/button/button.liquid)
      const fileName = path.basename(changedFile, path.extname(changedFile));
      const parentDir = pathParts[pathParts.length - 2]; // Thư mục cha
      
      // Nếu tên file trùng với tên thư mục cha, đó là component
      if (fileName === parentDir) {
        componentName = parentDir;
        componentDir = path.dirname(changedFile);
        // Tìm output directory tương ứng với thư mục gốc chứa component
        const rootComponentDir = pathParts[0]; // Thư mục gốc đầu tiên
        outputDir = path.join(this.outputDir, rootComponentDir);
      } else {
        // Nếu không trùng, lấy tên file làm component
        componentName = fileName;
        componentDir = path.dirname(changedFile);
        // Tìm output directory tương ứng với thư mục gốc chứa component
        const rootComponentDir = pathParts[0]; // Thư mục gốc đầu tiên
        outputDir = path.join(this.outputDir, rootComponentDir);
      }
    }
    
    console.log(`🔄 Rebuilding component: ${componentName} (file changed: ${relativePath})`);
    console.log(`   Output directory: ${path.relative(this.outputDir, outputDir)}`);
    
    // Tạo output directory nếu chưa tồn tại
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    await this.buildComponent(componentName, componentDir, outputDir);
  }
}

/**
 * Rollup plugin for Shopify components
 */
export default function shopifyComponentsPlugin(options = {}) {
  const builder = new ComponentBuilder(options);
  let isInitialBuild = true;
  let isWatching = false;
  let rebuildTimeouts = new Map(); // Track rebuild timeouts for debouncing
  let watchers = []; // Track all watchers for cleanup
  
  return {
    name: 'shopify-components',
    
    async buildStart() {
      if (isInitialBuild) {
        await builder.buildAllComponents();
        isInitialBuild = false;
      }
    },

    // Setup watching after bundle is written
    async writeBundle() {
      if (!isWatching && builder.watchMode) {
        isWatching = true;
        console.log('👀 Watching for component file changes...');
        
        // Watch the entire src directory for changes
        const srcDir = path.resolve(builder.srcDir); // Ensure absolute path
        
        // Try recursive watching first
        try {
          const watcher = fs.watch(srcDir, { 
            recursive: true, 
            persistent: true 
          }, async (eventType, filename) => {
            if (!filename) return;
            
            const filePath = path.resolve(path.join(srcDir, filename));
            
            // Only process files that are actually inside src directory
            if (!filePath.startsWith(srcDir)) {
              console.log(`⚠️  Ignoring file outside src: ${filePath}`);
              return;
            }
            
            // Only process component files
            if (filename.endsWith('.liquid') || 
                filename.endsWith('.scss') || 
                filename.endsWith('.js')) {
              
              // Debounce rebuilds to prevent multiple rapid rebuilds
              const componentKey = filename;
              
              if (rebuildTimeouts.has(componentKey)) {
                clearTimeout(rebuildTimeouts.get(componentKey));
              }
              
              rebuildTimeouts.set(componentKey, setTimeout(async () => {
                console.log(`📝 Component file changed: ${filename}`);
                await builder.rebuildComponent(filePath);
                rebuildTimeouts.delete(componentKey);
              }, builder.debounceDelay)); // Use configurable debounce delay
            }
          });
          
          // Store watcher reference for cleanup
          this.watcher = watcher;
          
        } catch (error) {
          console.log('⚠️  Recursive watching not supported, using manual directory scanning...');
          
          // Fallback: manually watch all subdirectories
          this.watchDirectoryRecursively(srcDir);
        }
      }
    },
    
    // Manual recursive directory watching
    watchDirectoryRecursively(dir) {
      if (!fs.existsSync(dir)) return;
      
      const srcDir = path.resolve(builder.srcDir);
      const currentDir = path.resolve(dir);
      
      // Only watch directories within src
      if (!currentDir.startsWith(srcDir)) {
        console.log(`⚠️  Skipping directory outside src: ${currentDir}`);
        return;
      }
      
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          // Watch subdirectory
          const watcher = fs.watch(itemPath, { persistent: true }, async (eventType, filename) => {
            if (!filename) return;
            
            const filePath = path.resolve(path.join(itemPath, filename));
            
            // Only process files that are actually inside src directory
            if (!filePath.startsWith(srcDir)) {
              console.log(`⚠️  Ignoring file outside src: ${filePath}`);
              return;
            }
            
            // Only process component files
            if (filename.endsWith('.liquid') || 
                filename.endsWith('.scss') || 
                filename.endsWith('.js')) {
              
              // Debounce rebuilds
              const componentKey = path.relative(builder.srcDir, filePath);
              
              if (rebuildTimeouts.has(componentKey)) {
                clearTimeout(rebuildTimeouts.get(componentKey));
              }
              
              rebuildTimeouts.set(componentKey, setTimeout(async () => {
                console.log(`📝 Component file changed: ${componentKey}`);
                await builder.rebuildComponent(filePath);
                rebuildTimeouts.delete(componentKey);
              }, builder.debounceDelay));
            }
          });
          
          watchers.push(watcher);
          
          // Recursively watch subdirectories
          this.watchDirectoryRecursively(itemPath);
        }
      }
    },
    
    // Clean up watcher when plugin is closed
    closeBundle() {
      if (this.watcher) {
        console.log('🧹 Cleaning up component watcher...');
        this.watcher.close();
        this.watcher = null;
      }
      
      // Clean up manual watchers
      if (watchers.length > 0) {
        console.log('🧹 Cleaning up manual watchers...');
        watchers.forEach(watcher => {
          try {
            watcher.close();
          } catch (e) {
            // Ignore errors if watcher is already closed
          }
        });
        watchers = [];
      }
      
      isWatching = false;
      
      // Clear any pending timeouts
      rebuildTimeouts.forEach(timeout => clearTimeout(timeout));
      rebuildTimeouts.clear();
    }
  };
} 