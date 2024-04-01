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

    this.upVote();
    this.openForm();
    this.openProfile();
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

  openProfile = () => {
    const outerThis = this;
    const mql = window.matchMedia('(max-width: 660px)');
    const metaElement = this.shadowObj.querySelector(".meta");

    // console.log(metaElement);

    if (mql.matches) {
      if (metaElement) {
        const link = metaElement.querySelector("a.action-link");
        const content = metaElement.querySelector("div.user-container");
        const pointer = metaElement.querySelector('.pointer');

        // console.log(content);

        if (link && content && pointer) {
          link.addEventListener("click", ev => {
            ev.preventDefault();
            ev.stopPropagation();

            content.style.setProperty("display", "flex");
            outerThis.disableScroll()
          })

          pointer.addEventListener("click", e => {
            e.preventDefault();

            content.style.setProperty("display", "none");
            outerThis.enableScroll()
          })
        }
      }
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

  openForm = () => {
    const writeContainer = this.shadowObj.querySelector('.stats');
    const formContainer = this.shadowObj.querySelector('div.form-container');
    if (writeContainer && formContainer) {
      const writeBtn = writeContainer.querySelector('span.stat.write');
      const formElement = this.getForm();

      writeBtn.addEventListener('click', event => {
        event.preventDefault();

        // console.log(writeContainer);
        // console.log(formElement);

        // writeContainer.classList.toggle('active');
        if (writeContainer.classList.contains('active')) {
          writeContainer.classList.remove('active');
          formContainer.innerHTML = '';
        }
        else {
          writeContainer.classList.add('active');
          formContainer.insertAdjacentHTML('beforeend', formElement);
        }
      })
    }
  }

  upVote() {
    const outerThis = this;
    let container = this.shadowObj.querySelector(".stats>.stat.upvote");
    if (container) {
      let outerNum = container.querySelector(".numb_list");
      outerNum.scrollBy({
        top: outerNum.scrollHeight + 10,
        behavior: "smooth"
      })

      container.addEventListener('click', (event) => {
        event.preventDefault();

        const upvoted = outerThis.getAttribute("upvoted") || "false";
        // console.log(upvoted);

        let numb = container.querySelector(".numb_list");
        let num = numb.querySelector(`#u-${outerThis.getAttribute('upvotes')}`);
        // console.log(num);
        let numHolder = num.textContent;

        if (upvoted === "false") {
          container.classList.add("active");
          try {
            numHolder = parseInt(numHolder) + 1;
          }
          catch (error) {
            console.error(error);
          }

          let newNum = document.createElement("span");
          newNum.setAttribute("id", `u-${numHolder}`)
          newNum.innerText = numHolder;

          outerThis.setAttribute("upvotes", numHolder);
          outerThis.setAttribute("upvoted", 'true');

          numb.appendChild(newNum);
          numb.scrollBy({
            top: num.scrollHeight + 100,
            behavior: "smooth"
          })
        }
        else {
          container.classList.remove("active");
          container.classList.remove("true");

          try {
            numHolder = parseInt(numHolder) - 1;

            if (typeof numHolder === "number") {
              if (numHolder < 1) {
                numHolder = 0
              }
            }
          }
          catch (error) {
            console.error(error);
          }

          let allNum = numb.querySelectorAll('span');
          let removeNum = numb.querySelector(`#u-${outerThis.getAttribute('upvotes')}`);

          if (allNum.length > 1) {
            removeNum.remove()
          }
          else {
            removeNum.textContent = numHolder;
            removeNum.setAttribute("id", `u-${numHolder}`)
          }
          outerThis.setAttribute("upvotes", numHolder);
          outerThis.setAttribute("upvoted", 'false');

          numb.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
      })
    }
  }

  expandTextArea = () => {
    const replyTextarea = this.shadowObj.querySelector('textarea');
    if (replyTextarea) {
      replyTextarea.addEventListener('input', () => {
        replyTextarea.style.height = 'auto';
        const height = replyTextarea.scrollHeight;
        if (height <= 60) {
          replyTextarea.style.height = `38px`;
        }
        else if (height <= 100) {
          replyTextarea.style.height = `${height + 10}px`;
        }
        else {
          replyTextarea.style.height = `100px`;
        }
      });
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
              <a href="" class="link action-link">${this.getAttribute('author-id')}</a>
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
      <div class="profile user-container">
        <span class="pointer"></span>
        <div class="cover">
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
            <p class="about-info">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptas ratione! Corporis, enim accusantium possimus minima eum illo atque dolorum provident nisi.
            Facilis nulla optio quas quod veniam nam voluptas!</p>
          </div>
          ${this.checkFollowing(this.getAttribute('following'))}
        </div>
      </div>
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

  getContent = (story) => {
	  if (story === "opinion") {
			return this.getOpinionContent();
	  }
		else {
			return `
			  <h3 class="title">
          <a href="" class="link">${this.getAttribute('story-title')}</a>
        </h3>
			`;
	  }
  }

  getFooter = (story) => {
    if (story === 'opinion') {
			return /* html */`
        <div class="stats">
          <span class="stat write">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.0001C4.617 22.0001 2 19.3831 2 12.0001C2 4.61712 4.617 2.00012 12 2.00012C12.414 2.00012 12.75 2.33612 12.75 2.75012C12.75 3.16412 12.414 3.50012 12 3.50012C5.486 3.50012 3.5 5.48612 3.5 12.0001C3.5 18.5141 5.486 20.5001 12 20.5001C18.514 20.5001 20.5 18.5141 20.5 12.0001C20.5 11.5861 20.836 11.2501 21.25 11.2501C21.664 11.2501 22 11.5861 22 12.0001C22 19.3831 19.383 22.0001 12 22.0001Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2365 9.38606L20.2952 8.19072C21.4472 6.88972 21.3252 4.89472 20.0252 3.74172C19.3952 3.18372 18.5812 2.90372 17.7452 2.95572C16.9052 3.00672 16.1352 3.38272 15.5772 4.01272L9.6932 10.6607C7.8692 12.7187 9.1172 15.4397 9.1712 15.5547C9.2602 15.7437 9.4242 15.8877 9.6232 15.9497C9.6802 15.9687 10.3442 16.1717 11.2192 16.1717C12.2042 16.1717 13.4572 15.9127 14.4092 14.8367L19.0774 9.56571C19.1082 9.54045 19.1374 9.51238 19.1646 9.4815C19.1915 9.45118 19.2155 9.41925 19.2365 9.38606ZM10.4082 14.5957C11.0352 14.7097 12.4192 14.8217 13.2862 13.8427L17.5371 9.04299L15.0656 6.85411L10.8172 11.6557C9.9292 12.6567 10.2122 13.9917 10.4082 14.5957ZM16.0596 5.73076L18.5322 7.91938L19.1722 7.19672C19.7752 6.51472 19.7122 5.46872 19.0312 4.86572C18.7002 4.57372 18.2712 4.42472 17.8362 4.45272C17.3962 4.48072 16.9932 4.67672 16.7002 5.00672L16.0596 5.73076Z" fill="currentColor"/>
            </svg>
            <span class="line"></span>
          </span>
          <span class="stat discuss">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
            </svg>
            <span class="no">98</span>
          </span>
          <span class="stat upvote ${this.getAttribute('upvoted')}">
            <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" viewBox="0 0 384 512">
              <path d="M209.4 39.4C204.8 34.7 198.6 32 192 32s-12.8 2.7-17.4 7.4l-168 176c-9.2 9.6-8.8 24.8 .8 33.9s24.8 8.8 33.9-.8L168 115.9V456c0 13.3 10.7 24 24 24s24-10.7 24-24V115.9L342.6 248.6c9.2 9.6 24.3 9.9 33.9 .8s9.9-24.3 .8-33.9l-168-176z"/>
            </svg>
            <span class="numb_list no">
              <span id="u-${this.getAttribute('upvotes')}">${this.getAttribute('upvotes')}</span>
            </span>
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
              <a href="" class="link action-link">${this.getAttribute('author-id')}</a>
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

  getForm = () => {
    return `
      <form-container type="opinion"></form-container>
    `
  }

  getBody() {
    return `
      ${this.getHeader(this.getAttribute('story'))}
      ${this.getContent(this.getAttribute('story'))}
      ${this.getFooter(this.getAttribute('story'))}
      <div class="form-container"></div>
    `;
  }

  checkType = () => {
    if (this.getAttribute('story') === 'opinion') {
      return 'padding: 15px 0 0 0;';
    }
    else {
      return 'padding: 15px 0;';
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
        border-bottom: var(--story-border);
        font-family: var(--font-main), sans-serif;
        ${this.checkType()}
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
      }

      .read-time {
        color: var(--gray-color);
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
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        margin: 0;
        padding: 0;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.5;
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

      .meta a.opinion-link {
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

      .meta  .profile > span.pointer {
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

      .meta.opinion  .profile > span.pointer{
        left: unset;
        right: 50%;
      }

      .meta  .profile > .cover>  .head {
        background-color: var(--background);
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        gap: 10px;
      }

      .meta  .profile > .cover>  .head > .image {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      .meta  .profile > .cover>  .head > .image img {
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
      .content {
        display: flex;
        flex-flow: column;
        color: var(--text-color);
        line-height: 1.5;
        gap: 0;
        margin: 0;
        padding: 0;
      }

      .content p {
        margin: 0 0 5px 0;
        padding: 0;
        line-height: 1.5;
        font-family: var(--font-text), sans-serif;
      }

      .content a {
        cursor: pointer;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .content a:hover {
        text-decoration-color: var(--anchor-active) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor-active) !important;
      }

      .content ul,
      .content ol {
        margin: 10px 0 0 20px;
        line-height: 1.4;
        color: var(--font-text);
        font-family: var(--font-text), sans-serif;
      }

      .content ul a,
      .content ol a {
        background: unset;
        color:var(--font-text);
        font-weight: 500;
        text-decoration-color: var(--anchor) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor) !important;
      }

      .content ul a:hover,
      .content ol a:hover {
        text-decoration-color: #4b5563bd !important;
        -moz-text-decoration-color: #4b5563bd !important;
      }

      .stats {
        /* border: var(--input-border); */
        padding: 0;
        margin: 0 0 12px 0;
        display: flex;
        align-items: center;
        gap: 23px;
      }

      .stats > .stat {
        padding: 3px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 1rem;
        font-weight: 400;
        color: var(--gray-color);
      }

      .stats span.no {
        font-family: var(--font-main),sans-serif;
        font-size: 1rem;
      }

      .stats * {
        font-family: var(--font-main),sans-serif;
      }

      .stats > .stat.upvote {
        /*border: var(--input-border);*/
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 1rem;
        font-weight: 400;
        color: var(--gray-color);
      }

      .stats > .stat.upvote > .numb_list {
        /*border: var(--action-border);*/
        height: 21px;
        min-height: 21px;
        padding: 0;
        margin: 0;
        margin-bottom: calc(16px / -3);
        display: flex;
        overflow-y: scroll;
        display: flex;
        gap: 5px;
        align-items: start;
        justify-content: start;
        flex-flow: column;
        transform: translateY(calc(-100% + 21px));
        transition: transform 0.5s linear;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .stats > .stat.upvote > .numb_list > .numb_list::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }

      .stats > .stat.upvote > .numb_list{
        transition: all 500ms ease-in-out;
        -webkit-transition: all 500ms ease-in-out;
        -moz-transition: all 500ms ease-in-out;
        -ms-transition: all 500ms ease-in-out;
        -o-transition: all 500ms ease-in-out;
      }

      .stats > .stat.upvote > .numb_list > span {
        /*border: 1px solid red;*/
        line-height: 1;
        display: inline-block;
        text-align: start;
        height: 21px;
        min-height: 21px;
        padding: 0;
        margin: 0;
        font-family: var(--font-main), san-serif;
        font-size: 1rem;
      }

      .stats > .stat.upvote.true > .numb_list > span,
      .stats > .stat.upvote.active > .numb_list > span {
        color: transparent;
        background: var(--second-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats > .stat.upvote.true > .numb_list > span {
        padding: 0;
      }

      .stats > .stat.upvote.active > .numb_list > span {
        padding: 0;
        margin: 0;
      }

      .stats > .stat.write {
        position: relative;
      }

      .stats > .stat.write span.line {
        border-left: var(--close-line);
        border-bottom: var(--close-line);
        border-bottom-left-radius: 8px;
        position: absolute;
        top: 30px;
        left: 10px;
        display: none;
        width: 10px;
        height: 32px;
      }

      .stats.active > .stat.write span.line {
        border-left: var(--open-line);
        border-bottom: var(--open-line);
        display: inline-block;
      }

      .stats.active > .stat.write {
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats > .stat.write svg {
        color: inherit;
        width: 22px;
        height: 22px;
      }

      .stats > .stat.discuss svg {
        margin: -1px 0 0 0;
        color: inherit;
        width: 18px;
        height: 18px;
      }

      .stats > .stat.upvote svg {
        margin: 0;
        width: 15px;
        height: 15px;
      }

      .stats > .stat.upvote.true svg,
      .stats > .stat.upvote.active svg {
        color: var(--color-alt);
      }

      .stats > .stat.write svg {
        color: var(--gray-color);
      }

      .stats.active > .stat.write svg {
        color: var(--accent-color);
      }

      form.reply {
        padding: 0 0 0 25px;
        margin: 10px 0 0 0;
        display: flex;
        gap: 10px;
        font-size: 1rem;
        font-weight: 400;
        color: var(--gray-color);
        position: relative;
      }

      form.reply > .image {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: start;
        overflow: hidden;
        width: 35px;
        height: 35px;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      form.reply > .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      form.reply > textarea {
        border: var(--input-border);
        font-family: var(--font-text), sans-serif;
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
        color: var(--gray-color);
        border-radius: 10px;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      form.reply > textarea::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }

      form.reply > textarea:focus {
        border: var(--input-border-focus);
      }

      form.reply > button {
        border: none;
        cursor: pointer;
        color: var(--white-color);
        background: var(--accent-linear);
        position: absolute;
        right: 8px;
        bottom: 5px;
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
      @media screen and (max-width:660px) {
        :host {
          border-bottom: var(--story-border-mobile);
        }

        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .meta a.opinion-link,
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

        .meta.opinion .profile > span.pointer,
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