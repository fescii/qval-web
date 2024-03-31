export default class UserWrapper extends HTMLElement {
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

    // this.openForm();
  }

  getLapseTime = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    // 2. Calculate difference from current date in the local timezone
    const now = new Date();
    const diff = now - date; // Difference in milliseconds

    // 3. Determine the appropriate time unit and calculate relative value
    if (diff < 60000) { // Less than 1 minute
      const seconds = Math.round(diff / 1000);
      return `${seconds}s`;
    }
    else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.round(diff / 60000);
      return `${minutes}m`;
    }
    else if (diff < 86400000) { // Less than 1 day
      const hours = Math.round(diff / 3600000);
      return `${hours}h`;
    }
    else if (diff < 604800000) { // Less than 1 week
      const days = Math.round(diff / 86400000);
      return `${days}d`;
    }
    else if (diff < 31536000000) { // Less than 1 year
      const weeks = Math.round(diff / 604800000);
      return `${weeks}w`;
    }
    else {  // 1 year or more
      const years = Math.round(diff / 31536000000);
      return `${years}y`;
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
    return `
      <div class="info">
        <div class="image">
          <img src="${this.getAttribute('img')}" alt="User profile picture">
        </div>
        <div class="data">
          <span class="user">
            <span class="code">${this.getAttribute('id')}</span>
            <span class="sp">•</span>
            <span class="joined">${this.getLapseTime(this.getAttribute('time'))}</span>
          </span>
          <p>Fredrick Ochieng</p>
        </div>
      </div>
      ${this.checkFollowing(this.getAttribute('following'))}
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
          border-bottom: var(--story-border);
          padding: 15px 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          width: 100%;
        }

        .info {
          /* border: 1px solid #53595f; */
          display: flex;
          flex-flow: row;
          align-items: start;
          justify-content: space-between;
          gap: 5px;
        }

        .info > .image {
          /* border: 1px solid #6b7280; */
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          overflow: hidden;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .info > .image > img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          object-fit: cover;
          overflow: hidden;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .info > .data {
          /* border: 1px solid #53595f; */
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
        }

        .info > .data > .user {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
        }

        .info > .data > p {
          /* border: 1px solid #6b7280; */
          margin: 0;
          padding: 0;
          color: var(--text-color);
          font-family: var(--font-text);
          font-weight: 500;
          line-height: 1.2;
          font-size: 1rem;
        }

        .action {
          border: var(--action-border);
          text-decoration: none;
          margin: 5px 0;
          padding: 4px 15px 5px;
          width: 100px;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        .action.follow {
          border: var(--input-border-focus);
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        @media screen and (max-width:660px) {
          :host {
            border-bottom: var(--story-border-mobile);
          }

          .action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}