export default class EditTopic extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.setTitle(this.getAttribute('name'));

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  setTitle = name => {
    // update title of the document
    document.title = `Edit - ${name}`;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }


  connectedCallback() {
    this.enableScroll();

    // Check if the display is greater than 600px using mql
    const mql = window.matchMedia('(max-width: 660px)');
  }

  disconnectedCallback() {
    this.enableScroll();
  }

  replaceAndPushStates = (url, body, main) => {
    // get the first custom element in the body
    const firstElement = body.firstElementChild;

    // convert the custom element to a string
    const elementString = firstElement.outerHTML;
  
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: elementString },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: main},
      url, url
    );
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

  getLoader() {
    return /*html*/`
      <div id="loader-container">
				<div class="loader"></div>
			</div>
    `
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        
      `;
    }
    else {
      return /* html */`
        ${this.getTop()}
        <main class="main">
          <section class="sections">
            ${this.getSectionsHead()}
            <div class="container">
              ${this.getBaseSection()}
              ${this.getSections()}
              ${this.getSectionsActions()}
            </div>
          </section>
          <section class="content">
            <div class="content-container">
            </div>
          </section>
        </main>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <div class="header">
        <div class="title">
          <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
          </svg>
          </span>
          <div class="info">
            <h2>Health Care</h2>
            <span class="description">
              <span class="sections">3 Sections</span>
              <span class="sp">•</span>
              <span class="last-modified">
                <span>Oct 10, 2021</span>
              </span>
            </span>
          </div>
        </div>
        ${this.getAuthors()}
        ${this.getAction()}
      </div>
    `
  }

  getAuthors = () => {
    return /* html */ `
      <div class="authors">
        <div class="container">
          <div class="author one">
            <img src="/img/img2.png" alt="author" />
          </div>
          <div class="author two">
            <img src="/img/img3.png" alt="author" />
          </div>
          <div class="author three">
            <img src="/img/img5.png" alt="author" />
          </div>
        </div>
        <a class="more" href="#">+2</a>
      </div>
    `
  }

  getAction = () => {
    return /* html */ `
      <div class="action">
        <button class="publish">Publish</button>
      </div>
    `
  }

  getSectionsHead = () =>  {
    return /* html */`
      <div class="head">
        <h3>Sections</h3>
        <div class="actions">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
            </svg>
          </span>
        </div>
      </div>
    `;
  }

  getBaseSection = () => {
    return /* html */`
      <div class="base title">
        <h4>Edit title</h4>
      </div>
      <div class="base summary">
        <h4>Edit summary</h4>
      </div>
      <div class="base slug">
        <h4>Edit slug</h4>
      </div>
    `;
  }

  getSections = () => {
    return /* html */`
      <div class="sections">
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur bring me some tea</span>
          </div>
        </div>
        <div class="section active">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="section">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 21H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7H16C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Section 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
      </div>
    `;
  }

  getSectionsActions = () => {
    return /* html */`
      <div class="actions">
        <button class="add-section">Add Section</button>
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
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
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
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0px;
        }

        #loader-container {
          position: absolute;
          top: 0;
          left: 0;
          bottom: calc(40% - 35px);
          right: 0;
          z-index: 5;
          background-color: var(--loader-background);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          -webkit-border-radius: inherit;
          -moz-border-radius: inherit;
        }

        #loader-container > .loader {
          width: 35px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        div.header {
          width: 100%;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0 10px;
          height: 60px;
          background-color: var(--background);
          border-bottom: var(--border);
          position: sticky;
          top: 0;
        }

        div.header > div.title {
          display: flex;
          flex-flow: row;
          align-items: center;
          overflow: hidden;
          gap: 5px;
        }

        div.header > div.title > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-color);
          margin: 0 0 0 -5px;
        }

        div.header > div.title > span.icon:hover {
          color: var(--accent-color);
        }

        div.header > div.title > span.icon > svg {
          width: 28px;
          height: 28px;
        }

        div.header > div.title > div.info {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.header > div.title > div.info > h2 {
          font-size: 1rem;
          margin: 0;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          /* avoid text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div.header > div.title > div.info > span.description {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          font-family: var(--font-read), sans-serif;
          font-size: 0.85rem;
          color: var(--gray-color);
        }

        div.header > div.title > div.info > span.description span.sp {
          font-size: 1rem;
        }

        div.header > div.authors {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        div.header > div.authors > div.container {
          position: relative;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        div.header > div.authors > div.container > div.author {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          overflow: hidden;
        }

        div.header > div.authors > div.container > div.author > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        div.header > div.authors > a.more {
          font-size: 0.85rem;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          min-width: 50px;
          width: max-content;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: var(--border);
        }

        div.header > div.authors > a.more:hover {
          color: var(--anchor-color);
        }

        div.header > div.action {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
        }

        div.header > div.action > button.publish {
          font-size: 0.9rem;
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          background: var(--accent-linear);
          outline: none;
          width: max-content;
          padding: 3px 10px 4px 10px;
          height: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
        }

        main.main {
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          gap: 30px;
          min-height: 100vh;
        }

        section.content {
          width: 63%;
          display: flex;
          background-color: var(--background);
          flex-flow: column;
        }

        section.sections {
          padding: 0;
          width: 30%;
          height: max-content;
          display: flex;
          background-color: var(--background);
          flex-flow: column;
          height: max-content;
          max-height: 100vh;
        }

        section.sections > div.head {
          display: flex;
          flex-flow: row;
          background-color: var(--background);
          justify-content: space-between;
          align-items: center;
          padding: 18px 0 5px;
          border-bottom: var(--border);
        }

        section.sections > div.head > h3 {
          font-size: 1rem;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
        }

        section.sections > div.head > div.actions {
          display: flex;
          flex-flow: row;
          gap: 10px;
          padding: 0 5px;
        }

        section.sections > div.head > div.actions > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-color);
        }

        section.sections > div.head > div.actions > span.icon:hover {
          color: var(--accent-color);
        }

        section.sections > div.head > div.actions > span.icon > svg {
          width: 18px;
          height: 18px;
        }

        section.sections > div.container {
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 10px 5px 30px 0;
          overflow-y: auto;
          height: 100%;
          scrollbar-width: thin;
        }

        section.sections > div.container::-webkit-scrollbar {
          width: 3px;
          background-color: var(--scroll-bar-background);
        }

        section.sections > div.container::-webkit-scrollbar-thumb {
          width: 3px;
          background-color: var(--scroll-bar-linear);
          border-radius: 50px;
        }

        section.sections > div.container > div.base {
          display: flex;
          flex-flow: row;
          align-items: center;
          cursor: pointer;
          gap: 10px;
          padding: 5px 10px;
          border-radius: 10px;
          border: var(--border);
        }

        section.sections > div.container > div.base.active {
          border: var(--section-border);
        }

        section.sections > div.container > div.base:hover {
          background-color: var(--hover-background);
        }

        section.sections > div.container > div.base > h4 {
          font-size: 1rem;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 400;
        }

        section.sections > div.container > div.sections {
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        section.sections > div.container > div.sections > div.section {
          display: flex;
          flex-flow: row;
          align-items: center;
          cursor: pointer;
          gap: 10px;
          padding: 5px 10px;
          border-radius: 10px;
          border: var(--border);
        }

        section.sections > div.container > div.sections > div.section:hover {
          background-color: var(--hover-background);
        }

        section.sections > div.container > div.sections > div.section.active {
          border: var(--section-border);
        }

        section.sections > div.container > div.sections > div.section > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
        }

        section.sections > div.container > div.sections > div.section > span.icon > svg {
          width: 20px;
          height: 20px;
        }

        section.sections > div.container > div.sections > div.section > div.info {
          display: flex;
          flex-flow: column;
          gap: 0;
          overflow: hidden;
        }

        section.sections > div.container > div.sections > div.section > div.info > h4 {
          font-size: 1rem;
          margin: 0;
          overflow: hidden;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
        }

        section.sections > div.container > div.sections > div.section > div.info > span.description {
          font-size: 0.85rem;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
          /* don't allow text to overflow */
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block;
          overflow: hidden;
        }

        section.sections > div.container > div.actions {
          display: flex;
          flex-flow: row;
          justify-content: center;
          padding: 10px 0 30px;
        }

        section.sections > div.container > div.actions > button.add-section {
          font-size: 0.85rem;
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          background: var(--accent-linear);
          outline: none;
          width: max-content;
          padding: 3px 10px 4px 10px;
          height: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
        }

				@media screen and (max-width:900px) {
          section.sections {
            padding: 0;
            width: 33%;
          }
          section.content {
            width: 62%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
					}

          svg {
            cursor: default !important;
          }

          main.main {
            padding: 0;
            width: 100%;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: start;
            gap: 0;
            min-height: max-content;
            height: max-content;
            max-height: max-content;
          }

          section.sections {
            padding: 0;
            width: 100%;
            min-width: 100%;
            max-height: max-content;
            display: flex;
            flex-flow: column;
            gap: 0;
            height: max-content;
            position: unset;
          }
				}
	    </style>
    `;
  }
}