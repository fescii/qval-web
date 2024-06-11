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
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // onpopstate event
    this.onpopEvent();

    // Watch for media query changes
    const mql = window.matchMedia('(max-width: 660px)');
    this.watchMediaQuery(mql);
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();

      // call onpopstate event
      this.onpopEvent();
    });
  }

  onpopEvent = () => {
    const outerThis = this;
    // Update state on window.onpopstate
    window.onpopstate = event => {
      // This event will be triggered when the browser's back button is clicked

      // console.log(event.state);
      if (event.state) {
        if (event.state.page) {
          outerThis.updatePage(event.state.content)
        }
      }
    }
  }

  updatePage = content => {
    // select body
    const body = document.querySelector('body');

    // populate content
    body.innerHTML = content;
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

  formatNumber = n => {
    if (n >= 0 && n <= 999) {
      return n.toString();
    } else if (n >= 1000 && n <= 9999) {
      const value = (n / 1000).toFixed(2);
      return `${value}k`;
    } else if (n >= 10000 && n <= 99999) {
      const value = (n / 1000).toFixed(1);
      return `${value}k`;
    } else if (n >= 100000 && n <= 999999) {
      const value = (n / 1000).toFixed(0);
      return `${value}k`;
    } else if (n >= 1000000 && n <= 9999999) {
      const value = (n / 1000000).toFixed(2);
      return `${value}M`;
    } else if (n >= 10000000 && n <= 99999999) {
      const value = (n / 1000000).toFixed(1);
      return `${value}M`;
    } else if (n >= 100000000 && n <= 999999999) {
      const value = (n / 1000000).toFixed(0);
      return `${value}M`;
    } else {
      return "1B+";
    }
  }

  parseToNumber = num_str => {
    // Try parsing the string to an integer
    const num = parseInt(num_str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
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
        ${this.getTop()}
        ${this.getHeader()}
        ${this.getAuthor()}
        <div class="content-container">
          ${this.getStories()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getTop()}
          ${this.getHeader()}
          <div class="content-container">
            ${this.getStories()}
          </div>
        </section>

        <section class="side">
          ${this.getAuthor()}
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
    // Replace all - with space 
    str = str.replace(/-/g, ' ');

    // capitalize the first letter of the string
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return /*html*/`
      <div class="head">
        <div class="text-content">
          <div class="topic-head">
            <div class="topic">
            <h2> ${str} </h2>
            <p class="info">Discover, read, and contribute to stories about ${str}.</p>
            </div>
            ${this.getStats()}
          </div>
          <div class="sub-text">
            <p>${this.getAttribute('description')}</p>
          </div>
          ${this.getActions()}
        </div>
      </div>
    `
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Topic" type="topic"
        user-url="${this.getAttribute('user-url')}">
      </header-wrapper>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
    `
  }

  getStats = () => {

    // Get followers
    let followers = this.parseToNumber(this.getAttribute('followers'));

    // Get stories
    let stories = this.parseToNumber(this.getAttribute('stories'));

    // Format the number
    let formattedStories = this.formatNumber(stories);
    let formattedFollowers = this.formatNumber(followers);

    return /*html*/`
      <div class="stats">
        <span class="followers">
          <span class="no">${formattedFollowers}</span>
          <span class="text">followers</span>
        </span>
        <span class="sp">•</span>
        <span class="stories">
          <span class="no">${formattedStories}</span>
          <span class="text">stories</span>
        </span>
      </div>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper username="${this.getAttribute('author-username')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="/u/${this.getAttribute('author-username').toLowerCase()}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getActions = () => {
    return /* html */`
      <div class="actions">
        ${this.checkSubscribed(this.getAttribute('subscribed'))}
        ${this.checkFollow(this.getAttribute('user-follow'))}
        <span class="action edit" id="edit-action">
          <span class="text">Edit</span>
        </span>
      </div>
    `
  }

  checkFollow = subscribed => {
    if (subscribed === 'true') {
      return /*html*/`
			  <span class="action following" id="follow-action">
          <span class="text">Following</span>
        </span>
			`
    }
    else {
      return /*html*/`
			  <span class="action follow" id="follow-action">
          <span class="text">Follow</span>
        </span>
			`
    }
  }

  checkSubscribed = subscribed => {
    if (subscribed === 'true') {
      return /*html*/`
			  <span class="action subscribed" id="subscribe-action">
          <span class="text">Subscribed</span>
        </span>
			`
    }
    else {
      return /*html*/`
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
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        section.main {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
          min-height: 100vh
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
        }

        .text-content {
          display: flex;
          flex-flow: column;
          gap: 10px;
          color: var(--text-color);
        }

        .text-content > .topic-head {
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        .text-content > .topic-head .topic {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .text-content > .topic-head .topic > h2 {
          font-size: 1.5rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          margin: 0;
          color: var(--text-color);
        }

        .text-content > .topic-head .topic > p.info {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 400;
          font-family: var(--font-main), sans-serif;
          margin: 0;
          color: var(--text-color);
        }

        .stats {
          padding: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-mono), monospace;
          font-size: 1rem;
        }

        .stats .sp {
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          margin: -2px 0 0 0;
        }

        .stats > span {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .stats > span > .text {
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
        }

        .stats > span >  .no {
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
        }

        .text-content > .sub-text {
          font-size: 1rem;
          color: var(--text-color);
          line-height: 1.5;
          font-family: var(--font-main);
        }

        .text-content > .actions {
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
          margin: 0;
        }

        .text-content > .actions > .action {
          text-decoration: none;
          padding: 3px 15px;
          font-weight: 500;
          background: var(--accent-linear);
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          cursor: pointer;
          width: max-content;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 10px;
        }

        .text-content > .actions > .action.edit,
        .text-content > .actions > .action.following,
        .text-content > .actions > .action.subscribed {
          padding: 2.5px 10px;
          background: unset;
          border: var(--action-border);
          color: var(--gray-color);
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
          top: 58px;
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
          padding: 25px 0;
          width: 33%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
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

          .foot > .author {
            border: none;
            border-top: var(--border-mobile);
          }

          .foot {
            border: none;
            border-bottom: none;
            position: sticky;
            top: 49px;
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