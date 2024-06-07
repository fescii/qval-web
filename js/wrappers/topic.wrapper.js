export default class TopicWrapper extends HTMLElement {
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
      ${this.getUser()}
      ${this.getStyles()}
    `;
  }


  getUser = () => {
    // Get name and check if it's greater than 20 characters
    let name = this.getAttribute('name');

    // Replace - with space and capitalize first letter of the first word using regex: heath-care becomes Heath care
    name = name.toLowerCase().replace(/-/g, ' ');
    
    // Capitalize the first letter of the first word
    const formattedName = name.replace(/^\w/, c => c.toUpperCase());


    // GET url
    const url = this.getAttribute('url');

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 20 ? `${name.substring(0, 20)}..` : name;

    return /* html */ `
      <div class="topic">
        <div class="info">
          <h4 class="name">
            <span class="name">${formattedName}</span>
          </h4>
          <div class="hori">
            <a href="${url.toLowerCase()}" class="hash">
              <span class="text">${this.getAttribute('hash')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </a>
            ${this.checkFollowing(this.getAttribute('user-follow'))}
          </div>
        </div>
      </div>
      ${this.getDescription()}
      ${this.getStats()}
    `
  }

  getDescription = () => {
    // Get description and check if it's greater than 100 characters
    let description = this.getAttribute('description');

    // Check if the description is greater than 100 characters: replace the rest with ...
    let displayDescription = description.length > 112 ? `${description.substring(0, 112)}...` : description;

    return /* html */ `
      <p class="description">${displayDescription}</p>
    `
  }

  checkFollowing = following => {
    if (following === 'true') {
      return /*html*/`
        <button class="action following">following</button>
			`
    }
    else {
      return /*html*/`
        <button class="action follow">follow</button>
			`
    }
  }

  getStats = () => {
    // Get total followers & following and parse to integer
    const followers = this.getAttribute('followers') || 0;
    const subscribers = this.getAttribute('subscribers') || 0;

    // Convert the followers & following to a number
    const totalFollowers = this.parseToNumber(followers);
    const totalSubscribers = this.parseToNumber(subscribers);

    //  format the number
    const followersFormatted = this.formatNumber(totalFollowers);
    const subscribersFormatted = this.formatNumber(totalSubscribers);


    return /* html */`
      <div class="stats">
        <span class="stat">
          <span class="number">${followersFormatted}</span>
          <span class="label">followers</span>
        </span>
        <span class="sp">•</span>
        <span class="stat">
          <span class="number">${subscribersFormatted}</span>
          <span class="label">subscribers</span>
        </span>
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
          border-bottom: var(--border);
          padding: 10px 0;
          width: 100%;
          display: flex;
          align-items: center;
          flex-flow: column;
          gap: 8px;
        }

        .topic {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          background-color: var(--que-background);
          padding: 10px 8px;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }
        
        .info {
          display: flex;
          width: 100%;
          flex-flow: column;
          gap: 0;
        }

        .info > .hori {
          display: flex;
          align-items: start;
          justify-content: space-between;
          flex-flow: row;
          gap: 0;
        }
        
        .info > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          line-height: 1.3;
          font-weight: 500;
          break-word: break-all;
          word-wrap: break-word;
        }
        
        .info > .hori > a.hash {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          padding: 3px 0;
          align-items: center;
        }
        
        .info > .hori > a.hash svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 2px 0 0 0;
        }
        
        .info > .hori > a.hash:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        .info > .hori > a.hash:hover svg {
          color: var(--accent-color);
        }

        p.description {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          line-height: 1.3;
          padding: 0 3px;
        }
        
        button.action {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px 5px;
          height: max-content;
          width: 100px;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          background: var(--accent-linear);
          color: var(--white-color);
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.3;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          cursor: pointer;
          outline: none;
          border: none;
          text-transform: capitalize;
        }
        
        button.action.following {
          background: none;
          border: var(--border-mobile);
          color: var(--text-color);
          font-weight: 400;
          font-size: 0.9rem;
        }

        .stats {
          color: var(--gray-color);
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 10px;
          padding: 0 3px;
        }

        .stats > span.sp {
          margin: 0 0 2px 0;
        }

        .stats > .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .stats > .stat > .label {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-transform: lowercase;
          font-size: 0.95rem;
          font-weight: 400;
        }

        .stats > .stat > .number {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
        }     

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            border-bottom: var(--border-mobile);
          }

          button.action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}