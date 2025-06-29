/**
 * card Component Schema
 * Defines the structure and validation for card component
 */

const cardSchema = {
  name: 'card',
  description: 'A reusable card component',
  
  // Component properties
  properties: {
    param1: {
      type: 'string',
      required: false,
      description: 'Example parameter',
      default: 'default_value'
    }
  },
  
  // CSS classes mapping
  cssClasses: {
    base: 'card',
    variants: {
      default: 'card--default',
      primary: 'card--primary'
    },
    elements: {
      text: 'card__text'
    }
  },
  
  // Validation rules
  validation: {
    param1: {
      minLength: 1,
      maxLength: 100
    }
  },
  
  // Usage examples
  examples: [
    {
      description: 'Basic card',
      code: `{% render 'card' %}`
    },
    {
      description: 'card with parameter',
      code: `{% render 'card', param1: 'custom_value' %}`
    }
  ]
};

module.exports = cardSchema;
