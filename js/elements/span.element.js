// Extending the functionality of the span element
// Dependencies: js/elements/element.js

export default class CustomSpan extends HTMLSpanElement {
  constructor() {
    super('span');

    // render the element
    this.render();

    // set styles
    this.setStyles();
  }

  // render the element
  render() {
    this.innerHTML = this.getTemplate();
  }

  // connected callback
  connectedCallback() {
    console.log('Connected');
  }

  // disconnected callback
  disconnectedCallback() {
    console.log('Disconnected');
  }

  // get the template
  getTemplate() {
    return `
      ${this.innerHTML}
    `;
  }

  // Set styles
  setStyles() {
    // set display property to inline-block
    this.style.display = 'inline-block';

    // set width based on the attribute
    this.style.width = this.getAttribute('width') || 'auto';
  }
}