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
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        <post-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
          opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
          views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
          author-id="${this.getAttribute('author-id')}">
            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
              'Content here, content here', making it look like readable English.</p>
            <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
            <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
        </post-wrapper>
        <opinions-feed opinions="all" url="/opinions"></opinions-feed>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          <post-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
            opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
             views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
            author-id="${this.getAttribute('author-id')}">
            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
            'Content here, content here', making it look like readable English.</p>
            <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
            <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
          </post-wrapper>
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


  getAuthor = () => {
    return /* html */`
			<author-wrapper username="${this.getAttribute('author-username')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
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
          /* border: 1px solid red; */
          padding: 0 0 30px 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
          min-height: 60vh;
        }

        .feeds {
          /* border: 1px solid #6b7280; */
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
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
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