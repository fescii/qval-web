export default class StatContainer extends HTMLElement {
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
    this.activateTab();
  }

  activateTab = () => {
    const outerThis = this;
    const tab = this.shadowObj.querySelector('ul#tab');
    const contentContainer = this.shadowObj.querySelector('.content');

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

          if (index === 0) {
            line.style.left = '0';
          }
          else {
            line.style.left = `${tab.offsetLeft + tabWidth}px`;
          }

          if (tab.dataset.element === activeTab.dataset.element) {
            return;
          }
          else {
            activeTab.classList.remove('active');
            tab.classList.add('active');
            activeTab = tab;
            switch (tab.dataset.element) {
              case "all":
                contentContainer.innerHTML = `
                  ${outerThis.getAll()}
                  ${outerThis.getStories()}
                  ${outerThis.getOpinions()}
                  ${outerThis.getAccount()}
                `;
                break;
              case "stories":
                contentContainer.innerHTML = outerThis.getStatFeedStories();
                break;
              case "opinions":
                contentContainer.innerHTML = outerThis.getStatFeedOpinions();
                break;
              default:
                contentContainer.innerHTML = `
                  ${outerThis.getAll()}
                  ${outerThis.getStories()}
                  ${outerThis.getOpinions()}
                  ${outerThis.getAccount()}
                `;
                break;
            }

          }
        })
      })
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
    // language=HTML
    return `
      ${this.getHeader()}
      ${this.getTab()}
			<div class="content">
				${this.getAll()}
        ${this.getStories()}
        ${this.getOpinions()}
        ${this.getAccount()}
      </div>
    `;
  }

  getAll = () => {
    return /* html */`
			<all-stat date="2021-09-01" date-last="2021-08-01" all="1654757" all-last="1554751" stories="965457" stories-last="995458"
        opinions="84754" opinions-last="73859">
      </all-stat>
		`;
  }

  getStories = () => {
    return /* html */`
			<stories-stat date="2021-09-01" date-last="2021-08-01" views="96458" views-last="99457"
        opinions="84555" opinions-last="73512" upvotes="4557" upvotes-last="3573">
      </stories-stat>
		`
  }

  getOpinions = () => {
    return /* html */`
			<opinions-stat date="2021-09-01" date-last="2021-08-01" views="6543" views-last="9145" opinions="8754"
        opinions-last="7559" upvotes="456" upvotes-last="593">
      </opinions-stat>
		`;
  }

  getAccount = () => {
    return /* html */`
			<users-stat date="2021-09-01" date-last="2021-08-01" followers="6545" followers-last="9145" subscribers="8755"
        subscribers-last="7555" donations="9453" donations-last="7587" currency="Ksh">
      </users-stat>
		`;
  }

  getStatFeedStories = () => {
    return /* html */`
      <stat-feed current="stories" api-stories="/api/v1/u/stats/stories"
        api-opinions="/api/v1/u/stats/opinions">
      </stat-feed>
    `;
  }

  getStatFeedOpinions = () => {
    return /* html */`
      <stat-feed current="opinions" api-stories="/api/v1/u/stats/stories"
        api-opinions="/api/v1/u/stats/opinions">
      </stat-feed>
    `;
  }

  getHeader = () => {
    // mql
    const mql = window.matchMedia('(max-width: 660px)');

    // check if the media query is true
    if (!mql.matches) {
      return /* html */`
        <div class="top">
          <h4 class="title">Your stats</h4>
          <p class="desc">
            Your stats are a summary of your interactions on the platform. You can view your stories, opinions and likes/upvotes.
          </p>
        </div>
      `;
    }

    return '';
  }

  getTab = () => {
    return /* html */`
      <div class="actions">
        <ul id="tab" class="tab">
          <li data-element="all" class="tab-item all active">
            <span class="text">All</span>
          </li>
          <li data-element="stories" class="tab-item stories">
            <span class="text">Stories</span>
          </li>
          <li data-element="opinions" class="tab-item opinions">
            <span class="text">Opinions</span>
          </li>
          <span class="line"></span>
        </ul>
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
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .top {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > h4.title {
          border-bottom: var(--story-border-mobile);
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0;
          color: var(--gray-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .actions {
          border-bottom: var(--story-border);
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          gap: 0;
          z-index: 3;
          width: 100%;
          position: sticky;
          top: 60px;
        }

        .actions > ul.tab {
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

        .actions > ul.tab::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .actions > ul.tab > li.tab-item {
          /* border: var(--story-border); */
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

        .actions > ul.tab > li.tab-item > .text {
          font-weight: 500;
          font-size: 1rem;
        }

        .actions > ul.tab > li.tab-item:hover > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
        }

        .actions > ul.tab > li.active {
          font-size: 0.95rem;
          /*padding: 6px 10px 10px 10px;*/
        }

        .actions > ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
        }

        .actions > ul.tab span.line {
          position: absolute;
          z-index: 1;
          background: var(--accent-linear);
          display: inline-block;
          bottom: -2.5px;
          left: 0px;
          width: 20px;
          min-height: 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          transition: all 300ms ease-in-out;
        }

        .content {
          /* border: var(--story-border); */
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .top > .desc {
            margin: 0;
            padding: 6px 0 10px;
            color: var(--gray-color);
            font-size: 1rem;
            line-height: 1.5;
            font-family: var(--font-main), sans-serif;
          }

          .actions {
            position: sticky;
            top: 50px;
          }
        }

      </style>
    `;
  }
}