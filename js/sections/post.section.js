export default class PostSection extends HTMLElement {
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

    const contentContainer = this.shadowObj.querySelector('div.content-container');

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
    const outerThis = this;
    const storyLoader = this.shadowObj.querySelector('post-loader');
    const content = this.getContent();
    setTimeout(() => {
      storyLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
      outerThis.updateActiveTab(outerThis.getAttribute('active'));
      outerThis.activateTab(contentContainer);
    }, 2000)
  }

  updateActiveTab = active => {
    // Select tab with active class
    const tab = this.shadowObj.querySelector(`ul#tab > li.${active}`);

    if (tab) {
      tab.classList.add('active');
    }
    else {
      // select replies tab
      const replies = this.shadowObj.querySelector(`ul#tab > li.replies`);
      replies.classList.add('active');
    }
  }

  activateTab = contentContainer => {
    const outerThis = this;
    const tab = this.shadowObj.querySelector('ul#tab');

    if (tab && contentContainer) {
      const line = tab.querySelector('span.line');
      const tabItems = tab.querySelectorAll('li.tab-item');
      let activeTab = tab.querySelector('li.tab-item.active');

      // Get feeds container
      const feeds = contentContainer.querySelector('.feeds');

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
              case "replies":
                feeds.innerHTML = outerThis.getReplies();
                break;
              case "likes":
                feeds.innerHTML = outerThis.getLikes();
              default:
                break;
            }

          }
        })
      })
    }
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
      <div class="content-container">
        ${this.getLoader()}
      </div>
    `
  }

  getContent = () => {
    return /* html */`
      ${this.getTab()}
      <div class="feeds">
        ${this.getContainer(this.getAttribute('active'))}
      </div>

		`
  }

  getTab = () => {
    return /* html */`
      <div class="tab-control">
        <ul id="tab" class="tab">
          <li data-element="replies" class="tab-item replies">
            <span class="text">Replies</span>
          </li>
          <li data-element="likes" class="tab-item likes">
            <span class="text">Likes</span>
          </li>
          <span class="line"></span>
        </ul>
      </div>
    `
  }

  getContainer = active => {
    // Switch between replies and likes
    switch (active) {
      case "replies":
        return this.getReplies();
      case "likes":
        return this.getLikes();
      default:
        return this.getReplies();
    }
  }

  getReplies = () => {
    return `
      <replies-feed replies="all" url="/U0A89BA6/replies"></replies-feed>
    `
  }

  getLikes = () => {
    return `
      <people-feed replies="all" url="/U0A89BA6/followers"></people-feed>
    `
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
          padding: 15px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0px;
        }

        div.content-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.content-container > .feeds {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
        }

        .tab-control {
          border-bottom: var(--border);
          border-top: var(--border);
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

        @media screen and (max-width: 660px) {
          :host {
            padding: 0;
          }

          .tab-control {
            border-bottom: var(--border-mobile);
            border-top: none;
            margin: 0 5px 0;
            position: sticky;
            top: 50px;
          }

          .tab-control > ul.tab > li.tab-item,
					.action,
					a {
						cursor: default !important;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}