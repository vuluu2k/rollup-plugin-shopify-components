/**
 * Button Component Schema
 * Defines the structure and validation for button component
 */

const buttonSchema = {
  name: 'button',
  description: 'A reusable button component with various styles and states',
  properties: {
    text: {
      type: 'string',
      required: true,
      description: 'Button text content',
      default: 'Button'
    },
    url: {
      type: 'string',
      required: false,
      description: 'Button link URL',
      default: '#'
    },
    style: {
      type: 'string',
      required: false,
      description: 'Button style variant',
      enum: ['primary', 'secondary', 'outline', 'ghost'],
      default: 'primary'
    },
    size: {
      type: 'string',
      required: false,
      description: 'Button size variant',
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    full_width: {
      type: 'boolean',
      required: false,
      description: 'Whether button should take full width',
      default: false
    },
    disabled: {
      type: 'boolean',
      required: false,
      description: 'Whether button is disabled',
      default: false
    },
    icon: {
      type: 'string',
      required: false,
      description: 'Icon name to display',
      default: ''
    },
    icon_position: {
      type: 'string',
      required: false,
      description: 'Icon position relative to text',
      enum: ['left', 'right'],
      default: 'left'
    }
  },
  
  // CSS classes mapping
  cssClasses: {
    base: 'button',
    styles: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      outline: 'button--outline',
      ghost: 'button--ghost'
    },
    sizes: {
      small: 'button--small',
      medium: 'button--medium',
      large: 'button--large'
    },
    states: {
      fullWidth: 'button--full-width',
      disabled: 'button--disabled'
    },
    elements: {
      icon: 'button__icon',
      iconLeft: 'button__icon--left',
      iconRight: 'button__icon--right',
      text: 'button__text'
    }
  },
  validation: {
    text: {
      minLength: 1,
      maxLength: 100
    },
    url: {
      pattern: /^[#\/]|https?:\/\//,
      message: 'URL must be a valid link or start with # or /'
    }
  },
  examples: [
    {
      description: 'Basic primary button',
      code: `{% render 'button', text: 'Click me', url: '/products' %}`
    },
    {
      description: 'Secondary button with icon',
      code: `{% render 'button', text: 'Add to cart', style: 'secondary', icon: 'cart' %}`
    },
    {
      description: 'Large outline button',
      code: `{% render 'button', text: 'Learn more', style: 'outline', size: 'large' %}`
    },
    {
      description: 'Full width disabled button',
      code: `{% render 'button', text: 'Out of stock', disabled: true, full_width: true %}`
    }
  ]
};

module.exports = buttonSchema;
