export default class AppSearch extends HTMLElement {
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

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getTopics = () => {
    const topics = this.getAttribute('topics');

    const arrayOfObjects = JSON.parse(topics);

    let html = '';

    arrayOfObjects.forEach(topic => {
      html += /* html */`
        <trending-container topic-id="${topic.id}"
          topic-name="${topic.url}" topic="${topic.name}"
          stories="${topic.stories}" url="/trending/${topic.id}" >
        </trending-container>
      `
    });

    return html;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getForm()}
        <div class="content-container">
          ${this.getTopics()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getForm()}
          <div class="content-container">
            ${this.getTopics()}
          </div>
        </section>

        <section class="side">
          ${this.getDonateCard()}
          <topics-container url="/topics/popular"></topics-container>
        </section>
      `;
    }
  }

  getForm = () => {
    return `
      <form action="" method="get" class="search">
        <div class="contents">
          <input type="text" name="query" id="query" placeholder="What's your query?">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
        ${this.getTab()}
      </form>
    `
  }

  getDonateCard = () => {
    return /* html */`
			<div class="donate-card">
        <h2 class="title">Support us</h2>
        <p class="info">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
        <a href="" class="link">Learn more</a>
      </div>
		`
  }

  getTab = () => {
    return /* html */`
      <ul id="tab" class="tab">
        <li data-element="Discover" class="tab-item reviews  active">
          <span class="text">Discover</span>
          <span class="line"></span>
        </li>
        <li data-element="stories" class="tab-item details">
          <span class="text">Stories</span>
          <span class="line"></span>
        </li>
        <li data-element="people" class="tab-item related">
          <span class="text">People</span>
          <span class="line"></span>
        </li>
      </ul>
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
          padding: 0 0 30px 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;

          min-height: 60vh;
        }

        section.main {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        form.search {
          border-bottom: var(--story-border);
          background: var(--background);
          padding: 10px 0 0 0;
          margin: 0 0 15px 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 15px;
          z-index: 3;
          width: 100%;
          position: sticky;
          top: 70px;
        }

        form.search > .contents {
          /* border: 1px solid #6b7280; */
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          width: 100%;
          position: relative;
        }

        form.search > .contents > input {
          border: var(--input-border);
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text);
          color: var(--text-color);
          font-size: 1rem;
          padding: 10px 10px 10px 35px;
          gap: 0;
          width: 100%;
          border-radius: 18px;
          -webkit-border-radius: 18px;
          -moz-border-radius: 18px;
          -ms-border-radius: 18px;
          -o-border-radius: 18px;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 20px;
          width: 20px;
          left: 10px;
          top: calc(50% - 12px);
          color: var(--gray-color);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 14px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
          height: 28px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        ul.tab {
          height: max-content;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          gap: 5px;
          align-items: center;
          max-width: 100%;
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        ul.tab::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        ul.tab > li.tab-item {
          position: relative;
          color: var(--gray-color);
          font-weight: 500;
          padding: 6px 10px 8px 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 1.05rem;
        }

        ul.tab > li.tab-item:hover > .text {
          color: var(--accent-color);
        }

        ul.tab > li.active {
          font-size: 0.95rem;
          padding: 6px 10px 10px 10px;
        }

        ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
        }

        ul.tab > li.active > span.line {
          position: absolute;
          background: var(--accent-linear);
          display: inline-block;
          bottom: 0;
          right: 0;
          left: 0;
          min-height: 4px;
          border-top-left-radius: 50px;
          border-top-right-radius: 50px;
        }


        div.content-container {
          /* border: 1px solid #6b7280; */
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
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
          top: 70px;
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

				@media screen and (max-width:660px) {
					:host {
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}
					a {
						cursor: default !important;
          }

          form.search {
            border-bottom: var(--story-border-mobile);
          }

          form.search > .contents > input {
            padding: 10px 10px 10px 35px;
            width: 100%;
            border-radius: 18px;
            -webkit-border-radius: 18px;
            -moz-border-radius: 18px;
            -ms-border-radius: 18px;
            -o-border-radius: 18px;
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
            width: 100%;
          }
				}
	    </style>
    `;
  }
}