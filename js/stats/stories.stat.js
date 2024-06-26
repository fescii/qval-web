export default class StoriesStat extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._up  = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path>
      </svg>
    `;

    this._down = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M4.22 4.179a.75.75 0 0 1 1.06 0l5.26 5.26v-4.2a.75.75 0 0 1 1.5 0v6.01a.75.75 0 0 1-.75.75H5.28a.75.75 0 0 1 0-1.5h4.2L4.22 5.24a.75.75 0 0 1 0-1.06Z"></path>
      </svg>
    `;

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

  calculateDifference = (last, current) => {
    // Calculate the difference between the new and old values
    const difference = current - last;

    return difference;
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      <div class="cards">
        ${this.getViews()}
        ${this.getUpvotes()}
        ${this.getReplies()}
      </div>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="title">
        <h4 class="text">Stories</h4>
        <span class="desc">Your stories summery</span>
      </div>
    `
  }

  getViews = () => {
    let icon = ''
    const lastViews = this.parseToNumber(this.getAttribute('views-last'));
    const currentViews = this.parseToNumber(this.getAttribute('views'));


    const change = this.calculateDifference(lastViews, currentViews);

    // if change is negative, we need to make it positive
    const difference = Math.abs(change);

    // console.log(`All Percentage Change: ${change}`);
    if (change > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;
    }

    return /* html */`
      <div class="card">
        <h4 class="title">Views</h4>
        <div class="stat">
          <h2 class="no">
            ${this.formatNumber(currentViews)}
          </h2>
          ${icon}
        </div>
      </div>
    `
  }

  getUpvotes = () => {
    let icon = ''
    const lastUpvotes = this.parseToNumber(this.getAttribute('upvotes-last'));
    const currentUpvotes = this.parseToNumber(this.getAttribute('upvotes'));

    const change = this.calculateDifference(lastUpvotes, currentUpvotes);

    // if change is negative, we need to make it positive
    const difference = Math.abs(change);

    // console.log(`All Percentage Change: ${change}`);
    if (change > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;
    }

    return /* html */`
      <div class="card">
        <h4 class="title">Upvotes</h4>
        <div class="stat">
          <h2 class="no">
            ${this.formatNumber(currentUpvotes)}
          </h2>
          ${icon}
        </div>
      </div>
    `
  }

  getReplies = () => {
    let icon = ''
    const lastReplies = this.parseToNumber(this.getAttribute('replies-last'));
    const currentReplies = this.parseToNumber(this.getAttribute('replies'));

    const change = this.calculateDifference(lastReplies, currentReplies);

    // if change is negative, we need to make it positive
    const difference = Math.abs(change);

    // console.log(`All Percentage Change: ${change}`);
    if (change > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage up">${this.formatNumber(difference)}</span>
        </span>
      `;
    }

    return /* html */`
      <div class="card">
        <h4 class="title">Replies</h4>
        <div class="stat">
          <h2 class="no">
            ${this.formatNumber(currentReplies)}
          </h2>
          ${icon}
        </div>
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
          border-bottom: var(--border-mobile);
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 10px;
          justify-content: center;
          padding: 0 0 10px;
        }

        .title {
          display: flex;
          position: relative;
          flex-flow: column;
          padding: 6px 0;
          gap: 0;
          justify-content: center;
          color: var(--text-color);
        }

        .title time {
          position: absolute;
          right: 10px;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          border: var(--input-border);
          padding: 2px 10px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          -o-border-radius: 5px;
        }

        .title > h4 {
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .title > span.desc {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
        }

        .cards {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          gap: 20px;
          padding: 6px 0;
          width: 100%;
        }

        .cards > .card {
          /* border: thin solid #4b5563bd; */
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 10px 25px 10px 15px;
          background-color: var(--stat-background);
          justify-content: center;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        .cards > .card > .title {
          color: var(--gray-color);
          font-size: 1rem;
          font-weight: 400;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .cards > .card > .stat {
          /* border: thin solid #4b5563bd; */
          color: var(--text-color);
          display: flex;
          flex-flow: row;
          gap: 15px;
          /* height: 50px; */
          align-items: end;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .cards > .card > .stat > h2.no {
          color: var(--text-color);
          font-size: 1.25rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .cards > .card > .stat > .change {
          /* border: thin solid #4b5563bd; */
          display: flex;
          flex-flow: row;
          gap: 2px;
          padding: 0 0 2px 0;
        }

        .cards > .card > .stat > .change.up {
          color: var(--accent-alt);
        }

        .cards > .card > .stat > .change.down {
          color: var(--error-color);
        }

        .cards > .card > .stat > .change.up .percentage {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .cards > .card > .stat > .change .percentage {
          /* color: var(--text-color); */
          font-size: 1rem;
          font-weight: 400;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .cards > .card > .stat > .change svg {
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          :host {
            padding-bottom: 25px;
          }

          .cards {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 6px 0;
            width: 100%;
          }

          .cards > .card {
            display: flex;
            flex-flow: column;
            width: 100%;
            gap: 10px;
            padding: 10px 25px 10px 15px;
          }
        }
      </style>
    `;
  }
}