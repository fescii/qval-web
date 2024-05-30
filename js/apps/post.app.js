export default class AppPost extends HTMLElement {
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

    // mql query at: 660px
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql);
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {

      this.render();
    });
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

  getTemplate = () => {
    // Show HTML Here
    return `
      <div class="container">
        ${this.getBody()}
      </div>
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getHeader()}
        ${this.getPost()}
        ${this.getAuthor()}
        <opinions-feed opinions="all" url="/opinions"></opinions-feed>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          ${this.getHeader()}
          ${this.getPost()}
          <opinions-feed opinions="all" url="/opinions"></opinions-feed>
        </div>
        <div class="side">
          <section class="author">
            ${this.getAuthor()}
          </section>
          <topics-container url="/topics/popular"></topics-container>
        </div>
      `;
    }
  }

  getPost = () => {
    // return /* html */`
    //   <post-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
    //     opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
    //     views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
    //     author-id="${this.getAttribute('author-id')}">
    //         <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
    //         <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
    //         'Content here, content here', making it look like readable English.</p>
    //         <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
    //         <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
    //   </post-wrapper>
    // `

    return /*html */`
      <poll-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
        opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
        views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
        author-id="${this.getAttribute('author-id')}"
        options='${this.getAttribute('options')}' voted="${this.getAttribute('voted')}" selected="${this.getAttribute('selected')}"
        end-time="${this.getAttribute('end-time')}">
        <p>Which is the best programming language?</p>
      </poll-wrapper>
    `
  }

  getHeader = () => {
    return /* html */ `
      <div class="top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
        </svg>
        <h3 class="name">Post</h3>
      </div>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper username="${this.getAttribute('author-username')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="/u/${this.getAttribute('author-username').toLowerCase()}"
      >
       ${this.getAttribute('author-bio')}
      </author-wrapper>
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
          padding: 0 0 30px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .container {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          min-height: 60vh;
        }

        .top {
          border-bottom: var(--story-border);
          color: var(--text-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          background-color: var(--background);
          padding: 22px 0 10px 0;
          margin: 0 0 5px;
          gap: 10px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top h3 {
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .top svg {
          cursor: pointer;
          width: 23px;
          height: 23px;
        }

        .feeds {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        div.side {
          padding: 0;
          width: 35%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 60px;
          height: max-content;
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
					}

          .container {
            padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            gap: 0;
          }

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}
					a {
						cursor: default !important;
          }

          .feeds {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          div.side {
            /* border: 1px solid #ff0000; */
            padding: 0;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}