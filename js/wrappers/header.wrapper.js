export default class HeaderWrapper extends HTMLElement {
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

    const contentContainer = this.shadowObj.querySelector('nav.nav');

    this.fetchContent(contentContainer);
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

  fetchContent = contentContainer => {
    const title = this.getAttribute('section');
    const storyLoader = this.shadowObj.querySelector('post-loader');
    const content = this.getContent(title);
    setTimeout(() => {
      storyLoader.remove();
      contentContainer.classList.remove('short');
      contentContainer.insertAdjacentHTML('beforeend', content);
    }, 2000)
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
      <nav data-expanded="false" class="nav short">
      </nav>
      ${this.getLoader()}
    `
  }

  getContent  = title => {
    return /* html */ `
      <div class="left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
        </svg>
        <h3 class="name">${title}</h3>
      </div>
      ${this.getTopIcons(true)}
    `
  }

  getTopIcons = authenticated => {
    if (authenticated) {
      return /* html */ `
        <div class="links">
          <a href="${this.getAttribute('user-url').toLowerCase()}" class="link profile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
            </svg>
          </a>
          <a href="${this.getAttribute('search-url')}" class="link search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      `
    }
    else {
      return /* html */ `
        <div class="links">
          <a href="${this.getAttribute('auth-url').toLowerCase()}?next=${this.getAttribute('url').toLowerCase()}" class="link signin">
            <span class="text">Sign in</span>
          </a>
          <a href="" class="link search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      `
    }
  }

  getLoader = () => {
    return `
			<post-loader speed="300"></post-loader>
		`
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
          width: 100%;
          height: max-content;
          background-color: var(--background);
          gap: 0;
          display: block;
          position: sticky;
          top: 0;
          z-index: 10;
          margin: 0 0 10px;
        }

        nav.nav {
          border-bottom: var(--border);
          color: var(--title-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 10px;
          height: 60px;
          max-height: 60px;
          padding: 22px 0 10px;
        }

        nav.nav.short {
          border-bottom: none;
          max-height: 10px;
          padding: 0;
          margin: 0 0 10px;
        }

        nav.nav > .left {
          color: var(--title-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        nav.nav > .left h3 {
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
        }

        nav.nav > .left svg {
          cursor: pointer;
          width: 24px;
          height: 24px;
          margin: 0;
        }

        nav.nav > .links {
          padding: 0 10px 0 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: max-content;
          gap: 15px;
        }

        nav.nav > .links > a.link {
          text-decoration: none;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        nav.nav > .links > a.link.profile:hover,
        nav.nav > .links > a.link.search:hover {
          transition: color 0.3s ease-in-out;
          -webkit-transition: color 0.3s ease-in-out;
          -moz-transition: color 0.3s ease-in-out;
          -ms-transition: color 0.3s ease-in-out;
          -o-transition: color 0.3s ease-in-out;
          color: var(--accent-color);
        }

        nav.nav > .links a.link.search a svg {
          margin: 0;
          width: 22px;
          height: 22px;
        }

        nav.nav > .links > a.link.profile > svg {
          width: 23px;
          height: 23px;
          margin: 1px 0 0 0;
        }

        nav.nav > .links > a.link.signin {
          border: var(--border-mobile);
          font-weight: 500;
          padding: 3px 15px;
          font-family: var(--font-read);
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        nav.nav > .links > a.link.signin:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        @media screen and (max-width: 660px) {
          nav.nav {
            border-bottom: var(--border-mobile);
            height: 50px;
            max-height: 50px;
            padding: 10px 0;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}