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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return `
      <div class="head">
        <div class="image">
          <img src="${this.getAttribute('img')}" alt="User profile">
        </div>
        <div class="name">
          <h4 class="uid">
            <a href="" class="link">${this.getAttribute('id')}</a>
            ${this.getAuthor()} 
          </h4>
          <span class="followers">
            <span class="no">${this.getAttribute('followers')}</span>
            <span class="text">followers</span>
          </span>
        </div>
      </div>
      ${this.checkFollow(this.getAttribute('following'))}
    `
  }

  getAuthor = () => {
    return `
      <div class="profile">
        <span class="pointer"></span>
        <div class="head">
          <div class="image">
            <img src="${this.getAttribute('img')}" alt="User profile">
          </div>
          <div class="info">
            <p class="name">
              <span class="text">${this.getAttribute('id')}</span>
              ${this.checkVerified(this.getAttribute('verified'))}
            </p>
            <a href="" class="followers">
              <span class="no">${this.getAttribute('followers')}</span>
              <span class="text">followers</span>
            </a>
          </div>
        </div>
        <div class="data">
          <p class="name">${this.getAttribute('name')}</p>
          <span class="bio">${this.getAttribute('bio')}</span>
        </div>
        ${this.checkFollowing(this.getAttribute('following'))}
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

  checkFollow = (following) => {
    if (following === 'true') {
      return `
			   <span class="action following">
           <span class="text">Following</span>
         </span>
			`
    }
    else {
      return `
			   <span class="action follow">
           <span class="text">Follow</span>
         </span>
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
        font-family: var(--font-main),sans-serif;
        border-right: 1px solid #6b728034;
        background-color: #e6e6e616;
        padding: 8px 10px 8px 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        gap: 10px
      }
      
      .head {
        /* border: 1px solid #6b7280; */
        padding: 0;
        margin: 0;
        display: flex;
        flex-flow: row;
        flex-wrap: nowrap;
        gap: 10px;
      }
      
      .head > .image {
        /* border: 1px solid #6b7280; */
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .head > .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .head > .name {
        /* border: 1px solid #6b7280; */
        padding: 0;
        display: flex;
        flex-flow: column;
        flex-wrap: nowrap;
        gap:  0;
        position: relative;
      }
      
      .head > .name h4.uid  .profile {
        border: 1px solid #83858442;
        box-shadow: 0 12px 48px #6d758d33;
        padding: 0 10px 10px;
        z-index: 2;
        position: absolute;
        top: 25px;
        left: -55px;
        background-color: var(--background);
        display: none;
        flex-flow: column;
        font-weight: 400;
        gap: 0;
        width: 300px;
        border-radius: 12px;
        transition: all 100ms ease-out;
        -webkit-transition: all 100ms ease-out;
        -moz-transition: all 100ms ease-out;
        -ms-transition: all 100ms ease-out;
        -o-transition: all 100ms ease-out;
      }
      
      .head > .name h4.uid:hover .profile {
        display: flex;
      }
      
      .head > .name h4.uid .profile > span.pointer {
        border: 1px solid #83858442;
        border-bottom: none;
        border-right: none;
        position: absolute;
        top: -5px;
        left: 100px;
        background-color: var(--background);
        display: inline-block;
        width: 10px;
        height: 10px;
        rotate: 45deg;
        border-radius: 1px;
        -webkit-border-radius: 1px;
        -moz-border-radius: 1px;
      }
      
      .head > .name h4.uid .profile > .head {
        /* border: 1px solid #000000; */
        background-color: var(--background);
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        gap: 10px;
      }
      
      .head > .name h4.uid .profile > .head > .image {
        /* border: 1px solid #000000; */
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .head > .name h4.uid .profile > .head > .image img {
        /* border: 1px solid #000000; */
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }
      
      .head > .name h4.uid > .profile .info {
        /* border: 1px solid #000000; */
        display: flex;
        flex-flow: column;
        /* align-items: center; */
      }
      
      .head > .name h4.uid > .profile .info p.name {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #53595f;
        font-weight: 500;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .head > .name h4.uid > .profile .info p.name svg {
        /* border: 1px solid #000000; */
        margin: -2px 0 0;
        color: #08b86f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .head > .name h4.uid > .profile .info a.followers {
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
      
      .head > .name h4.uid > .profile .info a.followers > span.no {
        font-family: var(--font-mono),monospace;
      }
      
      .head > .name h4.uid > .profile .data {
        /* border: 1px solid #000000; */
        margin: 5px 0;
        display: flex;
        flex-flow: column;
        /* align-items: center; */
      }
      
      .head > .name h4.uid > .profile .data > p.name {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #53595f;
        font-weight: 500;
        font-family: var(--font-main),sans-serif;
        font-size: 1.2rem;
        line-height: 1.5;
      }
      
      .head > .name h4.uid > .profile .data > span.bio {
        /* border: 1px solid #000000; */
        margin: 0;
        color: #6b7280;
        font-family: var(--font-main),sans-serif;
        font-size: 0.9rem;
      }
      
      .head > .name h4.uid > .profile span.action {
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
      
      .head > .name h4.uid > .profile span.action.follow {
        border: none;
        text-decoration: none;
        color: #ffffff;
        background-color: #1d2c38;
      }
      
      .head > .name h4.uid {
        color: #53595f;
        font-family: var(--font-mono),monospace;
        font-weight: 500;
        font-size: 0.9rem;
      }
      
      .head > .name h4.uid:hover > a {
        color: transparent;
        background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      .head > .name h4.uid a {
        color: inherit;
        text-decoration: none;
      }
      
      .head > .name span.followers {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #6b7280;
        font-size: 0.9rem;
      }
      
      .head > .name span.followers > span.no {
        font-family: var(--font-mono),monospace;
      }
      
      .action {
        border: 1px solid #6b72803f;
        color: #6b7280;
        padding: 5px 25px;
        width: max-content;
        display: flex;
        flex-flow: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
      }

      .action.follow {
        border: none;
        background-color: #1d2c38;
        color: #ffffff;
        font-size: 0.9rem;
        font-weight: 500;
      }
    </style>
    `;
  }
}