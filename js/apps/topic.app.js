export default class AppTopic extends HTMLElement {
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

  getDate = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
        ${this.getHeader()}
        ${this.getFoot()}
        <div class="content-container">
          ${this.getStories()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getHeader()}
          ${this.getFoot()}
          <div class="content-container">
            ${this.getStories()}
          </div>
        </section>

        <section class="side">
          <topics-container url="/topics/popular"></topics-container>
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getStories = () => {
    return `
      <stories-feed stories="all" url="/U0A89BA6/stories"></stories-feed>
    `
  }

  getHeader = () => {
    let str = this.getAttribute('name');
    return `
      <div class="head">
        <div class="text-content">
          <h2 class="tag">
            ${str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase())}
          </h2>
          <div class="sub-text">
            Discover, read, and contribute to stories about ${str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase())}. Follow to interact
            with the contributing authors in the topic.
            You can also get the stories periodically via email by subscribing to this topic.
          </div>
          <div class="actions">
            ${this.checkSubscribed(this.getAttribute('subscribed'))}
            <span class="action start">
              <span class="text">Start writing</span>
            </span>
          </div>
        </div>
      </div>
    `
  }

  getInfo = () => {
    return `
      <div class="company">
        <ul class="footer-list">
          <li class="item">
            <a href="" class="item-link">Docs</a>
          </li>
          <li class="item">
            <a href="" class="item-link">What’s New</a>
            <span class="dot"></span>
          </li>
          <li class="item">
            <a href="" class="item-link">Give a feedback </a>
          </li>
          <li class="item">
            <a href="" class="item-link">Request a feature</a>
          </li>
          <li class="item">
            <a href="" class="item-link">Source code</a>
            <span class="dot"></span>
          </li>
          <li class="item">
            <a href="" class="item-link">Donate</a>
          </li>
          <li class="item">
            <a href="" class="item-link">Contact</a>
          </li>
          <li class="item">
            <a href="#" class="item-link">&copy 2024 aduki, Inc</a>
          </li>
        </ul>
      </div>
    `
  }

  getFoot = () => {
    return `
      <div class="foot">
        ${this.getAuthor()}
      </div>
    `
  }

  getAuthor = () => {
    return `
      <div class="author">
        <span class="code">${this.getAttribute('id')}</span>
        <span class="sp">•</span>
        <span class="stories">
          <span class="no">${this.getAttribute('stories')}</span>
          <span class="text">Stories</span>
        </span>
      </div>
    `
  }

  checkSubscribed = (subscribed) => {
    if (subscribed === 'true') {
      return `
			  <span class="action subscribed" id="subscribe-action">
          <span class="text">Subscribed</span>
        </span>
			`
    }
    else {
      return `
			  <span class="action subscribe" id="subscribe-action">
          <span class="text">Subscribe</span>
        </span>
			`
    }
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
          padding: 15px 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 0px;
          min-height: 60vh;
        }

        section.main {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0 0 15px 0;
        }

        .text-content {
          display: flex;
          flex-flow: column;
          gap: 0;
          color: var(--text-color);
        }

        .text-content > .tag {
          font-size: 1.5rem;
          font-weight: 500;
          font-family: var(--font-text);
          margin: 0;
          background: var(--accent-linear);
          background-clip: text;
          background-size: 250% 250%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 10s ease infinite;
          -webkit-animation: gradient 10s ease infinite;
          -moz-animation: gradient 10s ease infinite;
          -o-animation: gradient 10s ease infinite;
        }

        .text-content >.sub-text {
          font-size: 1rem;
          color: var(--text-color);
          line-height: 1.5;
          font-family: var(--font-main);
        }

        .text-content > .actions {
          /* border: 1px solid red; */
          display: flex;
          flex-flow: row;
          gap: 50px;
          margin: 20px 0 0 0;
        }

        .text-content > .actions > .action {
          text-decoration: none;
          border: var(--input-border-focus);
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          cursor: pointer;
          padding: 5px 20px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 15px;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
          -ms-border-radius: 15px;
          -o-border-radius: 15px;
        }

        .text-content > .actions > .action.subscribed {
          background: unset;
          border: var(--action-border);
          color: var(--gray-color);
        }

        .text-content > .actions > .action.start {
          padding: 6px 20px;
          border: none;
          color: var(--white-color);
          background: var(--accent-linear);
          font-weight: 500;
        }

        .text-content > .start-using > span.follow > span.plus > i.top {
          rotate: 90deg;
        }

        .text-content > .start-using > span.follow > span.plus > i.hor {
          position: absolute;
          left: 10%;
        }

        .foot {
          border-bottom: var(--border);
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          gap: 0;
          z-index: 3;
          width: 100%;
          position: sticky;
          top: 60px;
        }

        .foot > .author {
          border-top: var(--border);
          /* border-bottom: var(--border); */
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
        }

        div.content-container {
          /* border: 1px solid #6b7280; */
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 15px;
          width: 100%;
        }

        section.side {
          /* border: 1px solid #53595f; */
          padding: 0;
          width: 35%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 60px;
          height: max-content;
        }

        section.side > .donate-card {
          /* border: 1px solid #ff0000; */
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side > .donate-card h2 {
          margin: 0;
          color: #1f2937;
          line-height: 1.5;
          font-weight: 600;
          font-family: var(--font-text), sans-serif;
        }

        section.side > .donate-card p {
          margin: 0;
          color: var(--text-color);
          line-height: 1.4;
        }

        section.side > .donate-card a {
          text-decoration: none;
          line-height: 1.4;
          width: max-content;
          color: var(--white-color);
          margin: 5px 0;
          padding: 4px 10px;
          font-weight: 400;
          background: var(--accent-linear);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

                .company {
          display: flex;
          margin: 20px 0;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          max-width: 500px;
        }

        .company >.title {
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .company > ul.footer-list {
          margin: 0;
          list-style-type: none;
          padding: 0 0 0 1px;
          display: flex;
          flex-flow: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }

        .company > ul.footer-list > li.item {
          margin: 0 10px 0 0;
          padding: 0;
          width: max-content;
          position: relative;
        }

        .company > ul.footer-list > li.item > .dot {
          display: inline-block;
          background: var(--accent-linear);
          width: 5px;
          height: 5px;
          position: absolute;
          right: -9px;
          top: 3px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        .company > ul.footer-list > li.item > a.item-link {
          color: var(--gray-color);
          /* font-size: 0.98rem; */
          text-decoration: none;
          font-weight: 400;
          font-size: 0.9rem;
        }

        .company > ul.footer-list > li.item > a.item-link:hover {
          /* color: var(--accent-color); */
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          border-bottom: 1px solid var(--accent-color);
        }

				@media screen and (max-width:660px) {
					:host {
        font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

          .text-content > .actions {
            margin-top: 10px;
            padding: 0 0 15px 0;
          }

          .head {
            padding: 0;
          }

          .text-content > .actions > .action.subscribed {
            border-bottom: var(--border-mobile)
          }

          .foot > .author{
            border-bottom: var(--border-mobile);
          }

          .foot {
            border-top: var(--border-mobile);
          }

					.action,
					a {
						cursor: default !important;
          }

          .section.main {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          section.side {
            /* border: 1px solid #ff0000; */
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}