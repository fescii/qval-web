export default class StoryWrapper extends HTMLElement {
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

	formatDateWithRelativeTime = (isoDateStr) => {
		// 1. Convert ISO date string with timezone to local Date object
		const date = new Date(isoDateStr); // ISO strings with timezone are automatically handled

		// Ensure the created date object is interpreted in the provided timezone
		const offsetMinutes = date.getTimezoneOffset();

		// Adjust by adding offset to shift to local timezone before calculations
		date.setMinutes(date.getMinutes() + offsetMinutes);

		// 2. Calculate difference from current date in the local timezone
		const now = new Date();
		const diff = now - date; // Difference in milliseconds

		// 3. Determine the appropriate time unit and calculate relative value
		if (diff < 60000) { // Less than 1 minute
			const seconds = Math.round(diff / 1000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${seconds}s ago)`;
		}
		else if (diff < 3600000) { // Less than 1 hour
			const minutes = Math.round(diff / 60000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${minutes}m ago)`;
		}
		else if (diff < 86400000) { // Less than 1 day
			const hours = Math.round(diff / 3600000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${hours}h ago)`;
		}
		else if (diff < 604800000) { // Less than 1 week
			const days = Math.round(diff / 86400000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${days}d ago)`;
		}
		else if (diff < 31536000000) { // Less than 1 year
			const weeks = Math.round(diff / 604800000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${weeks}w ago)`;
		}
		else {  // 1 year or more
			const years = Math.round(diff / 31536000000);
			return `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (${years}y ago)`;
		}
	}

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getOpinionContent = () => {
    const contents = this.innerHTML.split('\n');

    let output = ``
    contents.forEach(content => {
      let trimContent = content.trim();
      if (trimContent !== '' && trimContent.length >= 1) {
        // console.log(trimContent);
        output += `<p>${trimContent}</p>`
      }
    })

    return `
      <div class="content">
        ${output}
      </div>
    `;
  }

  getHeader = (story) => {
    if (story === "opinion") {
      return `
        <div class="meta opinion">
          <a href="" class="opinion-link">${this.getAttribute('id')}</a>
          <span class="sp">•</span>
          <div class="author">
            <span class="sp">by</span>
            <div class="author-name">
              <a href="" class="link">${this.getAttribute('author-id')}</a>
              ${this.getAuthor()}
            </div>
          </div>
        </div>
      `
    }
    else {
      return `
        <span class="read-time">
          <span class="text">${this.getAttribute('read-time')} min read</span>
          <span class="sp">•</span>
          <span class="views">${this.getAttribute('views')} views</span>
        </span>
      `
    }
  }

  getAuthor = () => {
    return `
      <div class="profile">
        <span class="pointer"></span>
        <div class="head">
          <div class="image">
            <img src="${this.getAttribute('author-img')}" alt="User profile">
          </div>
          <div class="info">
            <p class="name">
              <span class="text">${this.getAttribute('author-id')}</span>
              ${this.checkVerified(this.getAttribute('author-verified'))}
            </p>
            <a href="" class="followers">
              <span class="no">${this.getAttribute('author-followers')}</span>
              <span class="text">followers</span>
            </a>
          </div>
        </div>
        <div class="data">
          <p class="name">${this.getAttribute('author-name')}</p>
          <span class="bio">${this.getAttribute('author-bio')}</span>
        </div>
        ${this.checkFollowing(this.getAttribute('following'))}
      </div>
    `
  }

	checkFollowing = (following) => {
		if (following === 'true') {
			return `
			  <span class="action following">Follow</span>
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

  getContent = (story) => {
	  if (story === "opinion") {
			return this.getOpinionContent();
	  }
		else {
			return `
			  <h3 class="title">
          <a href="" class="link">${this.getAttribute('title')}</a>
        </h3>
			`;
	  }
  }

  getFooter = (story) => {
    if (story === 'opinion') {
			return `
        <div class="stats">
          <span class="stat write">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.0001C4.617 22.0001 2 19.3831 2 12.0001C2 4.61712 4.617 2.00012 12 2.00012C12.414 2.00012 12.75 2.33612 12.75 2.75012C12.75 3.16412 12.414 3.50012 12 3.50012C5.486 3.50012 3.5 5.48612 3.5 12.0001C3.5 18.5141 5.486 20.5001 12 20.5001C18.514 20.5001 20.5 18.5141 20.5 12.0001C20.5 11.5861 20.836 11.2501 21.25 11.2501C21.664 11.2501 22 11.5861 22 12.0001C22 19.3831 19.383 22.0001 12 22.0001Z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2365 9.38606L20.2952 8.19072C21.4472 6.88972 21.3252 4.89472 20.0252 3.74172C19.3952 3.18372 18.5812 2.90372 17.7452 2.95572C16.9052 3.00672 16.1352 3.38272 15.5772 4.01272L9.6932 10.6607C7.8692 12.7187 9.1172 15.4397 9.1712 15.5547C9.2602 15.7437 9.4242 15.8877 9.6232 15.9497C9.6802 15.9687 10.3442 16.1717 11.2192 16.1717C12.2042 16.1717 13.4572 15.9127 14.4092 14.8367L19.0774 9.56571C19.1082 9.54045 19.1374 9.51238 19.1646 9.4815C19.1915 9.45118 19.2155 9.41925 19.2365 9.38606ZM10.4082 14.5957C11.0352 14.7097 12.4192 14.8217 13.2862 13.8427L17.5371 9.04299L15.0656 6.85411L10.8172 11.6557C9.9292 12.6567 10.2122 13.9917 10.4082 14.5957ZM16.0596 5.73076L18.5322 7.91938L19.1722 7.19672C19.7752 6.51472 19.7122 5.46872 19.0312 4.86572C18.7002 4.57372 18.2712 4.42472 17.8362 4.45272C17.3962 4.48072 16.9932 4.67672 16.7002 5.00672L16.0596 5.73076Z" fill="currentColor"></path>
            </svg>
            <span class="text">Reply</span>
            <span class="line"></span>
          </span>
          <span class="stat discuss">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-quote" viewBox="0 0 16 16">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"></path>
              <path d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"></path>
            </svg>
            <span class="no">98</span>
          </span>
        </div>
			`
    }
		else {
			return `
			  <div class="meta">
          <div class="author">
            <span class="sp">by</span>
            <div class="author-name">
              <a href="" class="link">${this.getAttribute('author-id')}</a>
              ${this.getAuthor()}
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
  }

  getBody() {
    return `
      ${this.getHeader(this.getAttribute('story'))}
      ${this.getContent(this.getAttribute('story'))}
      ${this.getFooter(this.getAttribute('story'))}
      <div class="form-container"></div>
    `;
  }

  getStyles() {
    return `
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
        background: #DDDDD7;
      }

      *::-webkit-scrollbar-thumb {
        width: 3px;
        background: linear-gradient(#53595f, #627ea0);
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
        border-top: thin solid #6b72801a;
        font-family: var(--font-main),sans-serif;
        padding: 15px 0;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
      }
      
      .read-time {
        color: #6b7280;
        font-size: 0.9rem;
        font-family: var(--font-mono),sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .read-time > span.sp {
        display: inline-block;
        margin: 0 0 -2px;
      }
      
      h3.title {
        color: #53595f;
        margin: 0;
        padding: 0;
        font-weight: 500;
        line-height: 1.5;
      }
      
      h3.title > a {
        text-decoration: none;
        color: inherit;
      }
      
      .meta {
        /* border: 1px solid #000000; */
        height: 25px;
        display: flex;
        position: relative;
        /* color: #f5f5f5; */
        color: #6b7280;
        align-items: center;
        font-family: var(--font-mono),monospace;
        gap: 5px;
        font-size: 0.9rem;
      }
      
      .meta > .author {
        /* border: 1px solid #000000; */
        height: 100%;
        display: flex;
        /* cursor: pointer; */
        align-items: center;
        gap: 5px;
      }
      
      .meta div.author-name {
        /* border: 1px solid #000000; */
        display: flex;
        align-items: center;
        /* cursor: pointer; */
      }
      
      .meta div.author-name > a {
        text-decoration: none;
        color: transparent;
        background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      .meta a.opinion-link {
        text-decoration: none;
        color: transparent;
        background-image: linear-gradient(78deg, rgb(31, 6, 71) -50%, rgb(48, 0, 130) 28.67%, rgb(143, 0, 153) 57.79%, rgba(238, 0, 176, 0.85) 76.05%, rgb(247, 95, 98) 88.54%, rgb(255, 190, 20));
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      .meta  .profile {
        border: 1px solid #83858442;
        box-shadow: 0 12px 48px #6d758d33;
        padding: 10px 10px;
        z-index: 2;
        position: absolute;
        top: 30px;
        left: 0;
        background-color: var(--background);
        display: none;
        flex-flow: column;
        gap: 0;
        width: 300px;
        border-radius: 12px;
        transition: all 100ms ease-out;
        -webkit-transition: all 100ms ease-out;
        -moz-transition: all 100ms ease-out;
        -ms-transition: all 100ms ease-out;
        -o-transition: all 100ms ease-out;
      }
      
      .meta > .author:hover .profile {
        display: flex;
      }
      
      .meta  .profile > span.pointer {
        border: 1px solid #83858442;
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
      
      .meta.opinion  .profile > span.pointer{
        left: unset;
        right: 50%;
      }
      
      .meta  .profile > .head {
        /* border: 1px solid #000000; */
        background-color: var(--background);
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        gap: 10px;
      }
      
      .meta  .profile > .head > .image {
        /* border: 1px solid #000000; */
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .meta  .profile > .head > .image img {
        /* border: 1px solid #000000; */
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .meta .info {
        /* border: 1px solid #000000; */
        display: flex;
        flex-flow: column;
        /* align-items: center; */
      }
      
      .meta .info p.name {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #53595f;
        font-weight: 500;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .meta .info p.name svg {
        /* border: 1px solid #000000; */
        margin: -2px 0 0;
        color: #08b86f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .meta .info a.followers {
        /* border: 1px solid #000000; */
        text-decoration: none;
        margin: 0;
        color: #6b7280;
        background: unset;
        font-family: var(--font-main),sans-serif;
        display: flex;
        align-items: center;
        /* justify-content: center; */
        gap: 5px;
      }
      
      .meta .info a.followers > span.no {
        font-family: var(--font-mono),sans-serif;
      }
      
      .meta .data {
        /* border: 1px solid #000000; */
        margin: 5px 0;
        display: flex;
        flex-flow: column;
        /* align-items: center; */
      }
      
      .meta .data > p.name {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #53595f;
        font-weight: 500;
        font-family: var(--font-main),sans-serif;
        font-size: 1.2rem;
        line-height: 1.5;
      }
      
      .meta .data > span.bio {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #6b7280;
        font-family: var(--font-main),sans-serif;
        font-size: 0.9rem;
      }
      
      .meta span.action {
        border: 1px solid #6b72808e;
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
        color: #ffffff;
        background-color: #1d2c38;
        /* background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%); */
      }
      .content {
        /*border: 1px solid #6b7280;*/
        display: flex;
        flex-flow: column;
        color: #53595f;
        line-height: 1.5;
        gap: 0;
        margin: 0;
        padding: 0;
      }
      
      .content p {
        /*border: 1px solid #0b49c7;*/
        margin: 0 0 5px 0;
        padding: 0;
        line-height: 1.5;
      }
      
      .content a {
        /* color: #1da1f2; */
        cursor: pointer;
        color: transparent;
        background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      .content a:hover {
        text-decoration-color: #21D029 !important;
        text-decoration: underline;
        -moz-text-decoration-color: #21D029 !important;
      }
      
      .content ul,
      .content ol {
        margin: 10px 0 0 20px;
        line-height: 1.4;
        color: #1f2937;
      }
      
      .content ul a,
      .content ol a {
        background: unset;
        color: #1f2937;
        font-weight: 500;
        text-decoration-color: #4b556321 !important;
        text-decoration: underline;
        -moz-text-decoration-color: #4b556321 !important;
      }
      
      .content ul a:hover,
      .content ol a:hover {
        text-decoration-color: #4b5563bd !important;
        -moz-text-decoration-color: #4b5563bd !important;
      }
      
      .stats {
        /* border: 1px solid #6b7280; */
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      
      .stats > .stat {
        /* border: 1px solid #6b7280; */
        padding: 3px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 1rem;
        font-weight: 400;
        color: #6b7280;
      }
      
      .stats * {
        font-family: var(--font-main),sans-serif;
      }
      
      .stats span.no {
        font-family: var(--font-mono),monospace;
        font-size: 1rem;
      }
      
      .stats > .stat.write {
        /* border: 1px solid #6b72803a; */
        /* background-color: #39383816; */
        position: relative;
      }
      
      .stats > .stat.write span.line {
        border-left: 2px solid #6b72803a;
        border-bottom: 2px solid #6b72803a;
        border-bottom-left-radius: 8px;
        position: absolute;
        top: 30px;
        left: 10px;
        display: none;
        width: 10px;
        height: 32px;
      }
      
      .stats.active > .stat.write span.line {
        border-left: 2px solid #18A5653a;
        border-bottom: 2px solid #18A5653a;
        display: inline-block;
      }
      
      .stats.active > .stat.write,
      .stats > .stat.write:hover {
        color: transparent;
        background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      > .stats > .stat.write svg {
        color: inherit;
        width: 22px;
        height: 22px;
      }
      
      .stats > .stat.discuss svg {
        color: inherit;
        width: 19px;
        height: 19px;
      }
      
      .stats > .stat.write svg {
        color: #6b7280;
      }
      .stats > .stat.write:hover svg {
        color: #18A565;
      }
      
      form.reply {
        /* border: 1px solid #6b7280; */
        padding: 0 0 0 25px;
        margin: 10px 0 0 0;
        display: none;
        gap: 10px;
        font-size: 1rem;
        font-weight: 400;
        color: #6b7280;
        position: relative;
      }
      
      form.reply .image {
        /* border: thin solid #4b5563bd; */
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        overflow: hidden;
        width: 35px;
        height: 35px;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      form.reply .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      form.reply > textarea {
        border: 1px solid #6b72805e;
        padding: 8px !important;
        margin: 0;
        width: calc(100% - 48px);
        resize: none;
        height: 38px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 1rem;
        font-weight: 400;
        color: #6b7280;
        border-radius: 10px;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      form.reply > textarea::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }
      
      form.reply > textarea:focus {
        border: 1px solid #18a5669a;
      }
      
      form.reply > button {
        border: none;
        cursor: pointer;
        color: #ffffff;
        background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
        position: absolute;
        right: 8px;
        top: calc(50% - 15px);
        height: 30px;
        width: 60px;
        padding: 0;
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
    </style>
    `;
  }
}