class NewsletterContent extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    // override the background color of the editor
    shadow.innerHTML = `<style>
    .mceWrapperOuter {
      background-color: #fdfdfd !important;
    }
    * {
      background-color: #fdfdfd !important;
    }
  </style> ${this.getAttribute('content')}`;
  }
}

customElements.define('newsletter-content', NewsletterContent);
