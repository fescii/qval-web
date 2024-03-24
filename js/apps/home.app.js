export default class AppHome extends HTMLElement {
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
        <stories-container stories="popular" url="/stories/popular"></stories-container>
        <topics-container url="/topics/popular"></topics-container>
        <stories-container stories="recent" url="/stories/recent"></stories-container>
        <people-container url="/people/popular"></people-container>
        <stories-feed stories="all" url="/stories/feed"></stories-feed>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          <section class="opinion" id="sticky-position">
            <form action="" class="opinion">
              <div class="image">
                <img src="img/img.jpg" alt="Fredrick Ochieng" srcset="">
              </div>
              <textarea name="reply" placeholder="What's your opinion?" id="reply"></textarea>
              <button type="submit">Post</button>
            </form>
          </section>
          <stories-container stories="popular" url="/stories/popular"></stories-container>
          <stories-feed stories="all" url="/stories/feed"></stories-feed>
        </div>
        <div class="side">
          ${this.getDonateCard()}
          <topics-container url="/topics/popular"></topics-container>
          <people-container url="/people/popular"></people-container>
        </div>
      `;
    }
  }

  getDonateCard = () => {
    return /* html */`
			<div class="donate-card">
        <h2 class="title">Support us</h2>
        <p class="info">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
        <a href="" class="link">Learn more</a>
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

        section.opinion {
        /* border-top: var(--input-border); */
        background-color: var(--background);
        padding: 10px 0;
        display: flex;
        flex-flow: column;
        gap: 0;
        z-index: 2;
        position: sticky;
        top: 70px;
      }

      section.opinion.sticky {
        border-bottom: var(--input-border);
      }

      section.opinion > form.opinion {
        /* border-bottom: 1px solid #6b72805d; */
        /* border: 1px solid #000000; */
        padding: 10px 0 10px 0;
        margin: 0 0;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 1rem;
        font-weight: 400;
        color: var(--gray-color);
        position: relative;
      }

      section.opinion > form.opinion {
        padding: 0 0 5px 0;
      }


      section.opinion > form.opinion .image {
        /* border: thin solid #4b5563bd; */
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        /* align-self: center; */
        overflow: hidden;
        width: 35px;
        height: 35px;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      section.opinion > form.opinion .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
      }

      section.opinion > form.opinion > textarea {
        /* border: var(--input-border); */
        border: none;
        padding: 8px !important;
        margin: 0;
        width: calc(100% - 35px);
        resize: none;
        height: 40px;
        /* max-height: 100px !important; */
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

      section.opinion > form.opinion > textarea::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }

      section.opinion > form.opinion > textarea:focus {
        border: var(--input-border-focus);
      }

      section.opinion > form.opinion > button {
        border: none;
        cursor: pointer;
        color: var(--white-color);
        background: var(--accent-linear);
        position: absolute;
        right: 8px;
        top: calc(50% - 18px);
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
          /* border: 1px solid red; */
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .feeds {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        div.side {
          /* border: 1px solid #ff0000; */
          padding: 0;
          width: 35%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          /* height: max-content; */
        }

        div.side > .donate-card {
          /* border: 1px solid #ff0000; */
          padding: 10px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 5px;
        }

        div.side > .donate-card h2 {
          margin: 0;
          color: #1f2937;
          line-height: 1.4;
          font-weight: 600;
          font-family: var(--font-text), sans-serif;
        }

        div.side > .donate-card p {
          margin: 0;
          color: var(--text-color);
          line-height: 1.4;
        }

        div.side > .donate-card a {
          text-decoration: none;
          line-height: 1.4;
          width: max-content;
          color: var(--white-color);
          margin: 5px 0;
          padding: 4px 10px;
          font-weight: 400;
          background: var(--accent-linear);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

				@media screen and (max-width:660px) {
					:host {
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