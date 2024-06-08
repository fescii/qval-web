export default class HoverAuthor extends HTMLElement {
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <div class="author">
        ${this.getLink()}
        <div data-expanded="false" class="content-container">
          <span class="pointer"></span>
          ${this.getContent()}
        </div>
      </div>
    `
  }

  getContent = () => {
    return /* html */`
		  ${this.getHeader()}
      ${this.getStats()}
      ${this.getBio()}
      ${this.getActions()}
		`
  }

  getLink = () => {
    // Get username
    let username = this.getAttribute('username');

    // GET url
    let url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    // trim white spaces to username and convert to uppercase
    username = username.trim().toUpperCase();

    return /* html */`
        <a href="${url}" class="meta link">${username}</a>
      `
  }

  getHeader = () => {
    // Get username
    let username = this.getAttribute('username');

    // trim username and convert to uppercase
    username = username.trim().toUpperCase();

    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('name');

    // GET url
    let url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 20 ? `${name.substring(0, 20)}..` : name;

    return /* html */ `
      <div class="top">
        <div class="avatar">
          <img src="${this.getAttribute('picture')}" alt="author name">
          ${this.checkVerified(this.getAttribute('verified'))}
        </div>
        <div class="name">
          <h4 class="name">
            <span class="name">${displayName}</span>
          </h4>
          <a href="${url}" class="username">
            <span class="text">${username}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z" />
            </svg>
          </a>
        </div>
      </div>
    `
  }

  checkVerified = verified => {
    if (verified === 'true') {
      return /*html*/`
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
            <path  d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
          </svg>
        </div>
			`
    }
    else {
      return ''
    }
  }

  getStats = () => {
    // Get total followers & following and parse to integer
    const followers = this.getAttribute('followers') || 0;
    const following = this.getAttribute('following') || 0;

    // Convert the followers & following to a number
    const totalFollowers = this.parseToNumber(followers);
    const totalFollowing = this.parseToNumber(following);

    //  format the number
    const followersFormatted = this.formatNumber(totalFollowers);
    const followingFormatted = this.formatNumber(totalFollowing);


    return /* html */`
      <div class="stats">
        <span class="stat">
          <span class="number">${followersFormatted}</span>
          <span class="label">Followers</span>
        </span>
        <span class="sp">•</span>
        <span class="stat">
          <span class="number">${followingFormatted}</span>
          <span class="label">Following</span>
        </span>
      </div>
		`
  }

  getBio = () => {
    // Get bio content
    let bio = this.getAttribute('bio') || 'The user has not added their bio yet.';

    // trim white spaces
    bio = bio.trim();

    // Check if bio is greater than 100 characters: replace the rest with ...
    let bioLines = bio.length > 94 ? `${bio.substring(0, 94)}...` : bio;

    return /*html*/`
      <div class="bio">
        <p>${bioLines}</p>
      </div>
    `
  }

  getActions = () => {
    // GET url
    let url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    return /*html*/`
      <div class="actions">
        <a href="${url}" class="action view">View</a>
        ${this.checkFollowing(this.getAttribute('user-follow'))}
        <span class="action support">Support</span>
      </div>
    `;
  }

  checkFollowing = following => {
    if (following === 'true') {
      return /*html*/`
        <span class="action following">Following</span>
			`
    }
    else {
      return /*html*/`
        <span class="action follow">Follow</span>
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
          /*border: var(--border);*/
          font-size: 16px;
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0 0 -1px 0;
        }

        .author {
          position: relative;
          padding: 0;
          height: 30px;
          width: max-content;
          display: flex;
          flex-flow: column;
          justify-content: center;
          gap: 0px;
        }
        
        a.meta.link {
          height: max-content;
          display: flex;
          align-items: center;
          font-family: var(--font-mono),monospace;
          gap: 5px;
          font-size: 0.9rem;
          line-height: 1.5;
          text-decoration: none;
          text-decoration: none;
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        .content-container {
          border: var(--border);
          position: absolute;
          z-index: 4;
          background-color: var(--background);
          top: 0;
          left: -30px;
          top: calc(100% - 1px);
          box-shadow: var(--card-box-shadow-alt);
          padding: 10px;
          width: 380px;
          display: none;
          flex-flow: column;
          align-items: start;
          gap: 8px;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .author:hover .content-container {
          display: flex;
          animation: fadeIn 500ms ease-in-out;
        }
        
        .content-container > span.pointer {
          position: absolute;
          top: -5px;
          left: 70px;
          rotate: 45deg;
          width: 10px;
          height: 10px;
          background: var(--background);
          /* clip-path: polygon(50% 0%, 0% 100%, 100% 100%); */
          border-left: var(--border);
          border-top: var(--border);
        }
        
        .top {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 8px;
        }
        
        .top > .avatar {
          position: relative;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }
        
        .top > .avatar > img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          object-fit: cover;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }
        
        .top > .avatar > .icon {
          background: var(--background);
          position: absolute;
          bottom: -1px;
          right: -2px;
          width: 20px;
          height: 20px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .top > .avatar > .icon svg {
          width: 15px;
          height: 15px;
          color: var(--accent-color);
        }
        
        .top > .name {
          display: flex;
          justify-content: center;
          flex-flow: column;
          gap: 0;
        }
        
        .top > .name > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          line-height: 1.2;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .top > .name > h4.name svg {
          color: var(--alt-color);
          margin: 5px 0 0 0;
        }
        
        .top > .name > a.username {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .top > .name > a.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 3px 0 0 0;
        }

        .top > .name > a.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .top > .name > a.username:hover svg {
          color: var(--accent-color);
        }
        
        .stats {
          color: var(--gray-color);
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        .stats > span.sp {
          margin: 0 0 -3px 0;
        }
        
        .stats > .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
        }
        
        .stats > .stat > .label {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-transform: lowercase;
          font-size: 1rem;
          font-weight: 400;
        }
        
        .stats > .stat > .number {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          margin: 0 0 -2px 0;
        }
        
        .bio {
          display: flex;
          flex-flow: column;
          gap: 5px;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
        }
        
        .bio > p {
          margin: 0;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.4;
        }
        
        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 20px;
          margin: 5px 0 3px;
        }
        
        .actions > .action {
          border: var(--action-border);
          text-decoration: none;
          color: var(--text-color);
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          justify-content: center;
          padding: 1px 15px;
          border-radius: 20px;
          -webkit-border-radius: 20px;
          -moz-border-radius: 20px;
        }
        
        .actions > .action.follow {
          border: none;
          padding: 2px 15px;
          font-weight: 500;
          background: var(--accent-linear);
          color: var(--white-color);
        }
        
        .actions > .action.view {
          border: none;
          padding: 2px 15px;
          background: var(--action-linear);
          color: var(--white-color);
        }

        @media screen and (max-width: 660px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }
          a,
          span.stat,
          .actions > .action,
          span.action {
            cursor: default !important;
          }

          .content-container > svg {
            display: inline-block;
            position: absolute;
            top: 18px;
            right: 5px;
            color: var(--gray-color);
            cursor: default !important;
            width: 22px;
            height: 22px;
            transition: all 0.5s ease;
          }

          .top > .avatar {
            width: 40px;
            height: 40px;
          }

          .top > .name > h4.name {
            color: var(--text-color);
            font-family: var(--font-read), sans-serif;
            font-size: 1rem;
            font-weight: 500;
          }

          .top > .name > h4.name svg {
            color: var(--alt-color);
            margin: 4px 0 0 0;
            width: 15px;
            height: 15px;
          }

          .top > .name > a.username {
            color: var(--gray-color);
            font-family: var(--font-mono), monospace;
            font-size: 0.83rem;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            gap: 2px;
            align-items: center;
          }
        }
      </style>
    `;
  }
}