export default class StatStory extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <span class="content">
        ${this.getAttribute('content')}
      </span>
      <div class="foot">
        <span class="by">${this.getAttribute('views')} views</span>
        <span class="sp">•</span>
        <time datetime="2021-08-12T12:00:00Z">${this.getAttribute('upvotes')} upvotes</time>
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')} " class="link">view</a>
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')}/manage" class="edit">manage</a>
      </div>
    `;
  }

  getStyles() {
    return /* css */`
    <style>
      *,
      *:after,
      *:before {
        box-sizing: border-box !important;
        font-family: inherit;
        -webkit-box-sizing: border-box !important;
      }

      *:focus {
        outline: inherit !important;
      }

      *::-webkit-scrollbar {
        -webkit-appearance: none;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        padding: 0;
        margin: 0;
        font-family: inherit;
      }

      p,
      ul,
      ol {
        padding: 0;
        margin: 0;
      }

      a {
        text-decoration: none;
      }

      :host {
        font-size: 16px;
        border-bottom: var(--story-border);
        display: flex;
        flex-flow: column;
        gap: 5px;
        padding: 15px 0;
        width: 100%;
      }

      .content {
        /* border: 1px solid #6b7280; */
        color: var(--text-color);
        font-family: var(--font-read), sans-serif;
        display: flex;
        flex-flow: column;
        font-size: 0.95rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .foot {
        /* border: 1px solid #6b7280; */
        color: var(--gray-color);
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .foot > .hash {
        color: var(--gray-color);
        font-size: 0.85rem;
        /* font-family: var(--font-main), sans-serif; */
      }

      .foot a {
        color: var(--gray-color);
        font-size: 0.9rem;
        /* font-family: var(--font-main), sans-serif; */
        font-family: var(--font-mono), sans-serif;
        text-decoration: none;
      }

      .foot a:hover {
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .foot .sp {
        color: var(--gray-color);
        font-size: 0.8rem;
        margin: 0;
      }

      .foot span.by,
      .foot time {
        font-size: 0.85rem;
        font-family: var(--font-mono), sans-serif;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }
      }
    </style>
    `;
  }
}