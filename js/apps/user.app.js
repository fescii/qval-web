export default class AppUser extends HTMLElement {
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

    this.activateTab()
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
        ${this.getHeader()}
        ${this.getBio()}
        ${this.checkFollowing(this.getAttribute('u-follow'))}
        ${this.getActions()}
        <div class="content-container">
          ${this.getStories()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getHeader()}
          ${this.getBio()}
          ${this.checkFollowing(this.getAttribute('u-follow'))}
          ${this.getActions()}
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

  getHeader = () => {
    return `
      <div class="head">
        <div class="data">
          <div class="name">
            <span class="user">
              <span class="code">${this.getAttribute('id')}</span>
              <span class="joined">${this.getDate(this.getAttribute('join-date'))}</span>
            </span>
            <p>Fredrick Ochieng</p>
          </div>
          <div class="users">
            <a href="" class="stat followers">
              <span class="no">${this.getAttribute('followers')}</span>
              <span class="text">followers</span>
            </a>
            <span class="sp">•</span>
            <a href="" class="stat followers">
              <span class="no">${this.getAttribute('following')}</span>
              <span class="text">stories</span>
            </a>
          </div>
        </div>
        <div class="image">
          <img src=${this.getAttribute('img')} alt="Profile photo">
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
    `
  }

  getActions = () => {
    return `
      <div class="actions">
        ${this.getAuthor()}
        ${this.getTab()}
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

  getBio = () => {
    return `
      <p class="about">
        ${this.getAttribute('bio')}
      </p>
    `
  }

  checkFollowing = (following) => {
    if (following === 'true') {
      return `
			  <div class="action following">Following</div>
			`
    }
    else {
      return `
			  <div class="action follow">Follow</div>
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


				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
					}
				}
	    </style>
    `;
  }
}