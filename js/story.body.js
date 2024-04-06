export default class StoryBody extends HTMLElement {
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

  getContent = () => {
    return this.innerHTML;
  }

  getFonts = () => {
    return `
      <div class="fonts" id="sticky-position">
        <span class="options">
          <span class="font san-serif active">Sans serif</span>
          <span class="font mono">Mono</span>
          <span class="font serif">Serif</span>
        </span>
      </div>
    `
  }


  getBody() {
    return `
      ${this.getFonts()}
      ${this.getContent()}
    `;
  }


  getStyles() {
    return /* css */`
    <style>
      *,
      *:after,
      *:before {
        box-sizing: border-box !important;
        font-family: var(--font-read), sans-serif;
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
        /* border: 1px solid #000000; */
        margin: 5px 0 0 0;
        display: flex;
        flex-flow: column;
        color: var(--read-color);
        font-family: var(--font-read), sans-serif;
        gap: 0;
        font-size: 1rem;
        font-weight: 400;
      }

      .fonts {
        border-bottom: var(--story-border);
        padding: 10px 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--gray-color);
        gap: 20px;
        z-index: 2;
        position: sticky;
        top: 60px;
        background-color: var(--background);
      }

      .fonts > .options {
        display: flex;
        align-items: center;
        justify-content: start;
        color: var(--gray-color);
        gap: 20px;
      }

      .fonts .options * {
        transition: all 300ms ease-in-out;
        -webkit-transition: all 300ms ease-in-out;
        -moz-transition: all 300ms ease-in-out;
        -ms-transition: all 300ms ease-in-out;
        -o-transition: all 300ms ease-in-out;
      }

      .fonts .options > span.font {
        display: inline-block;
        padding: 3px 15px;
        cursor: pointer;
        font-size: 1rem;
        color: var(--gray-color);
        border: var(--story-border-mobile);
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      .fonts .options > span.font.san-serif {
        font-family: var(--font-read);
      }

      .fonts .options > span.font.mono {
        font-family: var(--font-mono);
        font-size: 0.85rem;
      }

      .fonts .options > span.font.serif {
        font-family: 'Times New Roman', Times, serif;
        font-size: 0.95rem;
      }

      .fonts .options > span.font.active {
        border: var(--input-border-focus);
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .fonts .options > span.font:hover {
        color: var(--accent-color);
        border: var(--input-border-focus);
      }

      * {
        font-family: var(--font-read), sans-serif;
        color: inherit;
        font-family: inherit;
        transition: all 300ms ease-in-out;
        -webkit-transition: all 300ms ease-in-out;
        -moz-transition: all 300ms ease-in-out;
        -ms-transition: all 300ms ease-in-out;
        -o-transition: all 300ms ease-in-out;
      }

      .intro {
        /* border: 1px solid #000000; */
        margin: 15px 0 0 0;
      }

      .paragraph {
        /* border: 1px solid #000000; */
        margin: 20px 0 0 0;
      }

      h2.title {
        /* border: var(--input-border-focus); */
        padding: 0 !important;
        font-family: var(--font-read), sans-serif;
        font-size: 1.3rem !important;
        font-weight: 500;
        line-height: 1.5;
        margin: 5px 0;
      }

      h6,
      h5,
      h4,
      h3,
      h1 {
        /* border: var(--input-border-focus); */
        padding: 0 !important;
        font-family: var(--font-read), sans-serif;
        font-size: 1.25rem !important;
        font-weight: 500;
        line-height: 1.5;
        margin: 5px 0;
      }

      p {
        margin: 0 0 10px 0;
        font-family: var(--font-read), sans-serif;
        line-height: 1.5;
      }

      a {
        /* color: #1da1f2; */
        cursor: pointer;
        font-family: var(--font-read), sans-serif;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      a:hover {
        text-decoration-color: var(--anchor-active) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor-active) !important;
      }

      ul,
      ol {
        margin: 10px 0 0 20px;
        font-family: var(--font-read), sans-serif;
        line-height: 1.4;
        color: inherit;
      }

      @media screen and (max-width:660px) {
        .fonts {
          border-bottom: var(--story-border-mobile);
        }

        a {
          cursor: default !important;
        }

      }
    </style>
    `;
  }
}