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