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

    const contentContainer = this.shadowObj.querySelector('.content-container');

    this.fetchStoryContent(contentContainer);
  }


  fetchStoryContent = (contentContainer) => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    const storyLoaders = this.shadowObj.querySelectorAll('story-loader');
    const content = this.getContent();
    setTimeout(() => {
      storyLoaders.forEach(loader  => {
        loader.remove()
      })
      contentContainer.insertAdjacentHTML('beforeend', content);
    }, 2000);
  }

  getDate = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
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
    return `
      ${this.getHeader()}
      <div class="body">
        ${this.innerHTML}
      </div>
      ${this.getNextArticle()}
    `;
  }

  getHeader = () => {
    return `
      <div class="head">
        <span class="topic">${this.getAttribute('topic')}</span>
        <h1 class="story-title">${this.getAttribute('story-title')}</h1>
      </div>
    `
  }

  getNextArticle = () => {
    return /* html */`
      <div class="next-article">
        <a href="/s/${this.getAttribute('next-hash').toLowerCase()}" class="article">
          <span class="title">Next article</span>
          <span class="text">${this.getAttribute('next-title')}</span>
          <span class="date">${this.getDate(this.getAttribute('next-date'))}</span>
        </a>
      </div>
    `
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
    return /*html*/`
      <div class="content-container">
        ${this.getLoader()}
      </div>
    `;
  }

  getLoader = () => {
    return `
			<story-loader speed="300"></story-loader>
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
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: column;
          font-family: var(--font-read), sans-serif;
          gap: 0;
        }

        .content-container {
          margin: 0;
          display: flex;
          flex-flow: column;
        }

        .content-container > div.head {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0;
        }

        .content-container > div.head > .topic {
          width: max-content;
          color: var(--white-color);
          margin: 0;
          padding: 3px 10px 4px 10px;
          box-shadow: 0 0 0 1px #ffffff25, 0 2px 2px #0000000a, 0 8px 16px -4px #0000000a;
          background: var(--accent-linear);
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .content-container > div.head > h1.story-title {
          margin: 0;
          padding: 5px 0;
          font-weight: 700;
          font-size: 1.7rem;
          line-height: 1.5;
          color: var(--title-color);
        }

        .content-container > .next-article {
          /* border-top: var(--story-border); */
          padding: 20px 0;
          margin: 0;
        }

        .content-container .next-article > a {
          border: var(--story-border-mobile);
          padding: 15px 20px;
          display: flex;
          flex-flow: column;
          align-items: flex-end;
          text-align: end;
          font-size: 0.9rem;
          gap: 10px;
          color: var(--gray-color);
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        .content-container .next-article > a:hover {
          background-color: var(--hover-background);
        }

        .content-container .next-article > a > span.text {
          color: var(--read-color);
          font-weight: 500;
        }

        .content-container .next-article > a > span.date {
          font-weight: 500;
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }

        .content-container .next-article > a > span.title {
          font-weight: 400;
          font-size: 0.8rem;
        }

        div.body {
          /* border: 1px solid #000000; */
          margin: 0;
          display: flex;
          flex-flow: column;
          color: var(--read-color);
          font-family: var(--font-read), sans-serif;
          gap: 0;
          font-size: 1.125rem;
          font-weight: 400;
        }

        div.body * {
          font-size: 1.05rem;
          line-height: 1.5;
          color: inherit;
          font-family: inherit;
          transition: all 300ms ease-in-out;
          -webkit-transition: all 300ms ease-in-out;
          -moz-transition: all 300ms ease-in-out;
          -ms-transition: all 300ms ease-in-out;
          -o-transition: all 300ms ease-in-out;
        }

        div.body .section {
          /* border: 1px solid #000000; */
          margin: 10px 0 0 0;
        }

        div.body h2.title {
          /* border: var(--input-border-focus); */
          padding: 0 !important;
          font-size: 1.3rem !important;
          font-weight: 500;
          line-height: 1.5;
          margin: 5px 0;
        }

        div.body h6,
        div.body h5,
        div.body h4,
        div.body h3,
        div.body h1 {
          /* border: var(--input-border-focus); */
          padding: 0 !important;
          font-size: 1.25rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 15px 0 5px 0;
        }

        div.body p {
          margin: 15px 0;
          line-height: 1.5;
        }

        div.body p:first-of-type {
          margin: 0 0 15px 0;
        }

        div.body a {
          text-decoration: none;
          cursor: pointer;
          color: var(--anchor-color) !important;
        }

        div.body a:hover {
          /* text-decoration-color: var(--anchor-active) !important; */
          text-decoration: underline;
        }

        div.body blockquote {
          margin: 10px 0;
          padding: 5px 15px;
          font-style: italic;
          border-left: 2px solid var(--gray-color);
          background: var(--background);
          color: var(--text-color);
          font-weight: 400;
        }

        div.body blockquote:before {
          content: open-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        div.body blockquote:after {
          content: close-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        div.body hr {
          border: none;
          background-color: var(--gray-color);
          height: 1px;
          margin: 10px 0;
        }

        div.body b,
        div.body strong {
          font-weight: 500;

        }

        div.body ul,
        div.body ol {
          margin: 5px 0 15px 20px;
          padding: 0 0 0 15px;
          color: inherit;
        }

        @media screen and (max-width:660px) {
          .fonts {
            border-bottom: var(--story-border-mobile);
          }

          .content-container * {
            font-size: 1rem;
            line-height: 1.4;
            color: inherit;
            font-family: inherit;
          }

          a {
            cursor: default !important;
          }

        }
      </style>
    `;
  }
}