export default class AppProfile extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Check if you is true and convert to boolean
    this._you = this.getAttribute('you') === 'true';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

  
    this.activateTab()
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

  activateTab = () => {
    const outerThis = this;
    const tab = this.shadowObj.querySelector('ul#tab');
    const contentContainer = this.shadowObj.querySelector('.content-container');

    if (tab && contentContainer) {
      const line = tab.querySelector('span.line');
      const tabItems = tab.querySelectorAll('li.tab-item');
      let activeTab = tab.querySelector('li.tab-item.active');

      tabItems.forEach(tab => {
        tab.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()

          // Calculate half tab width - 10px
          const tabWidth = (tab.offsetWidth/2) - 20;

          line.style.left = `${tab.offsetLeft + tabWidth}px`;

          if (tab.dataset.element === activeTab.dataset.element) {
            return;
          }
          else {
            activeTab.classList.remove('active');
            tab.classList.add('active');
            activeTab = tab;
            switch (tab.dataset.element) {
              case "stories":
                contentContainer.innerHTML = outerThis.getStories();
                break;
              case "opinions":
                contentContainer.innerHTML = outerThis.getOpinions();
                break;
              case "people":
                contentContainer.innerHTML = outerThis.getPeople();
              default:
                break;
            }

          }
        })
      })
    }
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
        ${this.getTop()}
        ${this.getAuthor()}
        ${this.getTab()}
        <div class="content-container">
          ${this.getStories()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getTop()}
          <div class="body">
            ${this.getAuthor()}
            ${this.getTab()}
            <div class="content-container">
              ${this.getStories()}
            </div>
          </div>
        </section>

        <section class="side">
          <topics-container url="/topics/popular"></topics-container>
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Profile" type="profile"
        user-url="${this.getAttribute('url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getAuthor = () => {
    return /* html */`
      <profile-wrapper name="${this.getAttribute('name')}" username="${this.getAttribute('username')}" you="${this._you}"
        url="${this.getAttribute('url')}" picture="${this.getAttribute('picture')}" verified="${this.getAttribute('verified')}"
        followers="${this.getAttribute('followers')}" following="${this.getAttribute('following')}" user-follow="${this.getAttribute('user-follow')}"
        bio="${this.getAttribute('bio')}">
      </profile-wrapper>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
    `
  }

  getStories = () => {
    return `
      <stories-feed stories="all" url="/U0A89BA6/stories"></stories-feed>
    `
  }

  getOpinions = () => {
    return `
      <opinions-feed opinions="all" url="/U0A89BA6/opinions"></opinions-feed>
    `
  }

  getPeople = () => {
    return `
      <people-feed opinions="all" url="/U0A89BA6/followers"></people-feed>
    `
  }

  getTab = () => {
    return /* html */`
      <div class="tab-control">
        <ul id="tab" class="tab">
          <li data-element="stories" class="tab-item details active">
            <span class="text">Stories</span>
          </li>
          <li data-element="opinions" class="tab-item opinions">
            <span class="text">Opinions</span>
          </li>
          <li data-element="people" class="tab-item people">
            <span class="text">People</span>
          </li>
          <span class="line"></span>
        </ul>
      </div>
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
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 0px;
          min-height: 100vh;
        }

        section.main {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
        }

        .tab-control {
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

        .tab-control > .author {
          /* border-top: var(--border); */
          border-bottom: var(--border);
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
        }

        .tab-control > ul.tab {
          height: max-content;
          width: 100%;
          padding: 5px 0 0 0;
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

        .tab-control > ul.tab::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .tab-control > ul.tab > li.tab-item {
          /* border: var(--border); */
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

        .tab-control > ul.tab > li.tab-item > .text {
          font-weight: 500;
          font-size: 1rem;
        }

        .tab-control > ul.tab > li.tab-item:hover > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
        }

        .tab-control > ul.tab > li.active {
          font-size: 0.95rem;
          /*padding: 6px 10px 10px 10px;*/
        }

        .tab-control > ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
        }

        .tab-control > ul.tab span.line {
          position: absolute;
          z-index: 1;
          background: var(--accent-linear);
          display: inline-block;
          bottom: -3px;
          left: 12px;
          width: 20px;
          min-height: 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          transition: all 300ms ease-in-out;
        }

        div.content-container {
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
          padding: 25px 0 0 0;
          width: 35%;
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

          .top {
            display: flex;
            width: 100%;
            flex-flow: row;
            align-items: center;
            gap: 8px;
          }
          
          .tab-control {
            border-bottom: var(--border-mobile);
            margin: 5px 0 5px 0;
            position: sticky;
            top: 50px;
          }

          .actions > .action {
            cursor: default !important;
            display: flex;
            width: calc(50% - 15px);
            padding: 6px 25px;
          }

          .tab-control > ul.tab > li.tab-item,
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
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}