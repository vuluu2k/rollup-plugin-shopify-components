/**
 * Hero Component Schema
 * Defines the structure and validation for hero component
 */

const heroSchema = {
  name: 'hero',
  description: 'A hero banner component with title and subtitle',
  
  // Component properties
  properties: {
    title: {
      type: 'string',
      required: true,
      description: 'Hero title text',
      default: 'Hero Title'
    },
    subtitle: {
      type: 'string',
      required: false,
      description: 'Hero subtitle text',
      default: 'Hero Subtitle'
    }
  },
  
  // Usage examples
  examples: [
    {
      description: 'Basic hero',
      code: `{% render 'hero', title: 'Welcome', subtitle: 'Learn more' %}`
    }
  ]
};

module.exports = heroSchema; 