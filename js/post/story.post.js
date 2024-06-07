export default class StoryPost extends HTMLElement {
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

  formatDateWithRelativeTime = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getHeader = () => {
    return /*html*/`
      <span class="read-time">
        <span class="text">${this.getReadTime()} min read</span>
        <span class="sp">•</span>
        <span class="views">${this.getViews()} views</span>
      </span>
    `
  }

  getReadTime = () => {
    return /*html*/ `
      <span class="time">${this.getAttribute('read-time')}</span>
    `
  }


  getViews = () => {
    // Get the number of views
    const views = this.getAttribute('views');

    // Parse the views to a number
    const viewsNum = this.parseToNumber(views);

    // Format the number of views
    const formattedViews = this.formatNumber(viewsNum);

    return /*html*/ `
      <span class="views-no">${formattedViews}</span>
    `
  }

  checkFollowing = (following) => {
    if (following === 'true') {
      return `
			  <span class="action following">Following</span>
			`
    }
    else {
      return `
			  <span class="action follow">Follow</span>
			`
    }
  }

  checkVerified = (value) => {
    if (value === 'true') {
      return `
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0" />
          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
        </svg>
			`
    }
    else {
      return ''
    }
  }

  getContent = () => {
    return `
			<h3 class="title">
        <a href="" class="link">${this.getAttribute('story-title')}</a>
      </h3>
		`;
  }

  getFooter = () => {
    return `
			<div class="meta">
        <div class="author">
          <span class="sp">by</span>
          <div class="author-name">
            <a href="" class="link action-link">${this.getAttribute('author-id')}</a>
          </div>
        </div>
        <span class="time">
          <span class="sp">•</span>
          <time class="published" datetime="${this.getAttribute('time')}">
            ${this.formatDateWithRelativeTime(this.getAttribute('time'))}
          </time>
        </span>
      </div>
		`
  }

  getBody() {
    return `
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getFooter()}
      <div class="form-container"></div>
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
        border-bottom: var(--border);
        font-family: var(--font-main), sans-serif;
        padding: 15px 0 10px;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
      }

      .read-time {
        color: var(--gray-color);
        font-size: 0.9rem;
        font-family: var(--font-main),sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .read-time .text .time {
        font-family: var(--font-mono), monospace;
      }

      .read-time .views .views-no {
        font-family: var(--font-main), monospace;
        font-size: 0.8rem;
      }

      .read-time > span.sp {
        display: inline-block;
        margin: 0 0 -2px;
      }

      h3.title {
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        margin: 0;
        padding: 0;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 1.4;
      }

      h3.title > a {
        text-decoration: none;
        color: inherit;
      }

      .meta {
        height: 25px;
        display: flex;
        position: relative;
        color: var(--gray-color);
        align-items: center;
        font-family: var(--font-mono),monospace;
        gap: 5px;
        font-size: 0.9rem;
      }

      .meta > span.time {
        font-family: var(--font-text), sans-serif;
        font-size: 0.85rem;
      }

      .meta > .author {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .meta div.author-name {
        display: flex;
        align-items: center;
      }

      .meta div.author-name > a {
        text-decoration: none;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .meta a.reply-link {
        text-decoration: none;
        color: transparent;
        background-image: var(--alt-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .meta  .profile {
        border: var(--modal-border);
        box-shadow: var(--modal-shadow);
        background-color: var(--background);
        padding: 0;
        z-index: 2;
        position: absolute;
        top: 30px;
        left: 0;
        display: none;
        flex-flow: column;
        gap: 0;
        width: 300px;
        height: max-content;
        border-radius: 12px;
      }

      .meta  .profile > .cover {
        padding: 10px 10px;
        display: flex;
        flex-flow: column;
        gap: 0;
        width: 100%;
        border-radius: 12px;
        transition: all 100ms ease-out;
        -webkit-transition: all 100ms ease-out;
        -moz-transition: all 100ms ease-out;
        -ms-transition: all 100ms ease-out;
        -o-transition: all 100ms ease-out;
      }

      .meta  .profile > .cover p.about-info {
        display: none;
        font-family: var(--font-main), san-serif;
      }

      .meta > .author:hover .profile {
        display: flex;
      }

      .meta .profile > span.pointer {
        border: var(--modal-border);
        border-bottom: none;
        border-right: none;
        position: absolute;
        top: -5px;
        left: 50px;
        background-color: var(--background);
        display: inline-block;
        width: 10px;
        height: 10px;
        rotate: 45deg;
        border-radius: 1px;
        -webkit-border-radius: 1px;
        -moz-border-radius: 1px;
      }

      .meta.reply .profile > span.pointer{
        left: unset;
        right: 45%;
      }

      .meta .profile > .cover > .head {
        background-color: var(--background);
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        gap: 10px;
      }

      .meta .profile > .cover > .head > .image {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      .meta .profile > .cover > .head > .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      .meta .info {
        display: flex;
        flex-flow: column;
      }

      .meta .info p.name {
        margin: 0;
        color: var(--text-color);
        font-weight: 500;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .meta .info p.name svg {
        margin: -2px 0 0;
        color: var(--accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .meta .info a.followers {
        text-decoration: none;
        margin: 0;
        color: var(--gray-color);
        background: unset;
        font-family: var(--font-main),sans-serif;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .meta .info a.followers > span.no {
        font-family: var(--font-mono),sans-serif;
      }

      .meta .data {
        margin: 5px 0;
        display: flex;
        flex-flow: column;
      }

      .meta .data > p.name {
        margin: 0;
        color: var(--text-color);
        font-weight: 500;
        font-family: var(--font-main),sans-serif;
        font-size: 1.2rem;
        line-height: 1.5;
      }

      .meta .data > span.bio {
        margin: 0;
        color: var(--gray-color);
        font-family: var(--font-main),sans-serif;
        font-size: 0.9rem;
      }

      .meta span.action {
        border: var(--action-border);
        margin: 10px 0 5px;
        padding: 6px 15px;
        font-weight: 500;
        font-family: var(--font-main),sans-serif;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 8px;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
      }

      .meta span.action.follow {
        border: none;
        text-decoration: none;
        color: var(--white-color);
        background-color: var(--action-color);
      }

      @media screen and (max-width:660px) {
        :host {
        font-size: 16px;
          border-bottom: var(--border-mobile);
        }

        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .meta a.reply-link,
        .meta div.author-name > a,
        a,
        .stats > .stat {
          cursor: default !important;
        }

        h3.title {
          color: var(--text-color);
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
        }

        h3.title > a {
          text-decoration: none;
          color: inherit;
        }

        .stats > .stat.upvote > .numb_list {
        /*border: var(--action-border);*/
          margin-bottom: -1.8px;
        }

        .stats > .stat.upvote > .numb_list > span {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1;
          padding: 0;
        }

        .stats > .stat.upvote.true > .numb_list > span {
          padding: 0;
        }

        .stats > .stat.upvote.active > .numb_list > span {
          padding: 0;
        }

        .stats > .stat.upvote svg {
          margin: 0 0 0 0;
          width: 14.5px;
          height: 14.5px;
        }

        .meta .profile {
          border: unset;
          box-shadow: unset;
          padding: 0;
          z-index: 10;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: transparent;
          display: none;
          flex-flow: column;
          justify-content: end;
          gap: 0;
          width: 100%;
          height: 100%;
          border-radius: unset;
        }

        .meta.opened .profile {
          display: flex;
        }

        .meta  .profile > .cover {
          border-top: var(--modal-border);
          box-shadow: unset;
          padding: 20px 10px;
          z-index: 3;
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: 100%;
          border-radius: unset;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }

        .meta  .profile > .cover p.about-info {
          display: block;
          line-height: 1.4;
          padding: 0;
          font-size: 1rem;
          color: var(--text-color);
          margin: 10px 0 0 0;
        }

        .meta > .author:hover .profile {
          display: none;
        }

        .meta.reply .profile > span.pointer,
        .meta  .profile > span.pointer {
          border: var(--modal-border);
          border-bottom: none;
          border-right: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--modal-overlay);
          display: inline-block;
          min-width: 100%;
          height: 100%;
          rotate: unset;
          border-radius: 0;
        }

        .meta  .profile > .cover > .head {
          display: flex;
          flex-wrap: nowrap;
          width: 100%;
          gap: 10px;
          z-index: 2;
        }

        .meta .data {
          margin: 5px 0;
          display: flex;
          flex-flow: column;
        }

        .meta .data > p.name {
          margin: 0;
          color: var(--text-color);
          font-weight: 500;
          font-family: var(--font-main),sans-serif;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        .meta .data > span.bio {
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-main),sans-serif;
          font-size: 0.9rem;
        }

        .meta span.action {
          border: var(--action-border);
          margin: 10px 0 5px;
          padding: 10px 15px;
          font-weight: 500;
          font-family: var(--font-main),sans-serif;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 8px;
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
        }
        .meta span.action.follow {
          border: none;
          text-decoration: none;
          color: var(--white-color);
          background-color: var(--action-color);
        }
      }
    </style>
    `;
  }
}