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

    // select section > content
    const contentContainer = this.shadowObj.querySelector('section.content');
    if(contentContainer) {
      // fetch content
      this.fetchContent(contentContainer);
    }

    // activate tab
    this.activateTab();
  }

  fetchContent = contentContainer => {
    // insert loader
    contentContainer.innerHTML = this.getLoader();
    // select the loader
    setTimeout(() => {
      // set the content
      contentContainer.innerHTML = this.getEditor();
    }, 1500);
  }

  activateTab = () => {
    const outerThis = this;
    const tab = this.shadowObj.querySelector('ul#tab');
    const contentContainer = this.shadowObj.querySelector('section.sections > div.container');

    if (tab && contentContainer) {
      const line = tab.querySelector('span.line');
      const tabItems = tab.querySelectorAll('li.tab-item');
      let activeTab = tab.querySelector('li.tab-item.active');

      tabItems.forEach((tab, index) => {
        tab.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()

          // Calculate half tab width - 10px
          const tabWidth = (tab.offsetWidth / 2) - 20;

          line.style.left = `${tab.offsetLeft + tabWidth}px`;

          if (tab.dataset.element === activeTab.dataset.element) {
            return;
          }
          else {
            contentContainer.innerHTML = outerThis.getButtonLoader();
            activeTab.classList.remove('active');
            tab.classList.add('active');
            activeTab = tab;
            const tabElement = tab.dataset.element;
            setTimeout(() => {
              if (tabElement === 'info') {
                contentContainer.innerHTML = outerThis.getBaseSection();
              }
              else if (tabElement === 'sections') {
                contentContainer.innerHTML = outerThis.getSections();
              }
              else if (tabElement === 'drafts') {
                contentContainer.innerHTML = outerThis.getDrafts();
              }
            }, 1500);
          }
        })
      })
    }
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

  getButtonLoader() {
    return `
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
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
            </div>
          </section>
          <section class="content">
            ${this.getLoader()}
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
        ${this.getTab()}
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
      ${this.getSectionsActions()}
    `;
  }

  getDrafts = () => {
    return /* html */`
      <div class="drafts">
        <div class="draft">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 16C3 13.643 3 12.4645 3.73223 11.7322C4.46447 11 5.64298 11 8 11H16C18.357 11 19.5355 11 20.2678 11.7322C21 12.4645 21 13.643 21 16C21 18.357 21 19.5355 20.2678 20.2678C19.5355 21 18.357 21 16 21H8C5.64298 21 4.46447 21 3.73223 20.2678C3 19.5355 3 18.357 3 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Draft 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
          </div>
        </div>
        <div class="draft">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
              <path d="M3 3H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 16C3 13.643 3 12.4645 3.73223 11.7322C4.46447 11 5.64298 11 8 11H16C18.357 11 19.5355 11 20.2678 11.7322C21 12.4645 21 13.643 21 16C21 18.357 21 19.5355 20.2678 20.2678C19.5355 21 18.357 21 16 21H8C5.64298 21 4.46447 21 3.73223 20.2678C3 19.5355 3 18.357 3 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="info">
            <h4>Draft 1</h4>
            <span class="description">Lorem ipsum dolor sit amet, consectetur...</span>
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

  getTab = () => {
    return /* html */`
      <ul id="tab" class="tab">
        <li data-element="info" class="tab-item all active">
          <span class="text">Info</span>
        </li>
        <li data-element="sections" class="tab-item sections">
          <span class="text">Sections</span>
        </li>
        <li data-element="drafts" class="tab-item replies">
          <span class="text">Drafts</span>
        </li>
        <span class="line"></span>
      </ul>
    `;
  }

  getTitle = () => {
    return /* html */`
      <topic-title name="Health Care"></topic-title>
    `;
  }

  getSlug = () => {
    return /* html */`
      <topic-slug slug="health-care"></topic-slug>
    `;
  }

  getSummary = () => {
    return /* html */`
      <topic-summary summary="Lorem ipsum dolor sit amet, consectetur adipiscing elit."></topic-summary>
    `;
  }

  getEditor = () => {
    return /* html */`
      <text-editor></text-editor>
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

        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          min-height: 100px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader-alt {
          width: 25px;
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

        #btn-loader > .loader {
          width: 25px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
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
          z-index: 10;
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
          margin: 0 0 0 -3px;
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
          cursor: pointer;
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
          min-height: calc(100vh - 60px);
        }

        section.content {
          width: 65%;
          padding: 9px 0;
          position: relative;
          display: flex;
          background-color: var(--background);
          flex-flow: column;
        }

        section.sections {
          padding: 0;
          width: 30%;
          gap: 10px;
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
          position: sticky;
          top: 60px;
          width: 100%;
          margin: 0 0 0px;
          background: var(--background);
          justify-content: space-between;
          align-items: center;
          padding: 0;
          z-index: 3;
          border-bottom: var(--border);
        }

        section.sections > div.head > ul.tab {
          height: max-content;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          gap: 0;
          align-items: center;
          max-width: 100%;
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        section.sections > div.head > ul.tab::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        section.sections > div.head > ul.tab > li.tab-item {
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          padding: 6px 20px 8px 0;
          margin: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          overflow: visible;
          font-size: 0.95rem;
        }

        section.sections > div.head > ul.tab > li.tab-item > .text {
          font-weight: 500;
          font-size: 1rem;
        }

        section.sections > div.head > ul.tab > li.tab-item:hover > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        section.sections > div.head > ul.tab > li.active {
          font-size: 0.95rem;
        }

        section.sections > div.head > ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-read);
        }

        section.sections > div.head > ul.tab span.line {
          position: absolute;
          z-index: 1;
          background: var(--accent-linear);
          display: inline-block;
          bottom: -2.5px;
          left: 5px;
          width: 20px;
          min-height: 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          transition: all 300ms ease-in-out;
        }

        section.sections > div.container {
          display: flex;
          flex-flow: column;
          position: relative;
          gap: 10px;
          padding: 10px 5px 10px 0;
          overflow-y: auto;
          height: calc(100vh - 90px);
          min-height: 120px;
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

        section.sections > div.container > div.drafts,
        section.sections > div.container > div.sections {
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        section.sections > div.container > div.drafts > div.draft,
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

        section.sections > div.container > div.drafts > div.draft:hover,
        section.sections > div.container > div.sections > div.section:hover {
          background-color: var(--hover-background);
        }

        section.sections > div.container > div.drafts > div.draft.active,
        section.sections > div.container > div.sections > div.section.active {
          border: var(--section-border);
        }

        section.sections > div.container > div.drafts > div.draft > span.icon,
        section.sections > div.container > div.sections > div.section > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
        }

        section.sections > div.container > div.drafts > div.draft > span.icon > svg,
        section.sections > div.container > div.sections > div.section > span.icon > svg {
          width: 20px;
          height: 20px;
        }

        section.sections > div.container > div.drafts > div.draft > div.info,
        section.sections > div.container > div.sections > div.section > div.info {
          display: flex;
          flex-flow: column;
          gap: 0;
          overflow: hidden;
        }

        section.sections > div.container > div.drafts > div.draft > div.info > h4,
        section.sections > div.container > div.sections > div.section > div.info > h4 {
          font-size: 1rem;
          margin: 0;
          overflow: hidden;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 400;
        }

        section.sections > div.container > div.drafts > div.draft > div.info > span.description,
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
          cursor: pointer;
          width: max-content;
          padding: 4px 12px 5px 12px;
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