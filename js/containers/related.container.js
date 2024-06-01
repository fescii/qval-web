export default class RelatedContainer extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('div.content');

    this.fetchTopics(contentContainer);
  }

  fetchTopics = (contentContainer) => {
    const topicsLoader = this.shadowObj.querySelector('post-loader');
    const content = this.getRelatedStories();
    setTimeout(() => {
      topicsLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
    }, 2000)
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader = () => {
    return `
			<post-loader speed="300"></post-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return /* html */`
			<div class="content">
				${this.getLoader()}
			</div>
    `;
  }

  getRelatedStories = () => {
    return /* html */`
			<div class="related">
        <p class="title">Related stories.</p>
        <ul class="stories">
          <li class="story">
            <a href="" class="link">
              <span class="title">Ubuntu vs Debian: Which one is better</span>
              <span class="date">June 23, 2021</span>
            </a>
          </li>
          <li class="story">
            <a href="" class="link">
              <span class="title">Ubuntu Makes Proprietary Software Easier to Get</span>
              <span class="date">June 23, 2021</span>
            </a>
          </li>
          <li class="story">
            <a href="" class="link">
              <span class="title">Behind the scenes of Vercel's infrastructure: Achieving optimal scalability and performance</span>
              <span class="date">June 23, 2021</span>
            </a></li>
        </ul>
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
          margin: 15px 0;
				  display: flex;
				  flex-flow: column;
				}

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 10px;
				  width: 100%;
				}

				.related {
          /* border: thin solid #4b5563bd; */
          background-color: var(--background);
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .related > p.title {
          color: var(--title-color);
          padding: 0;
          font-size: 1.2rem;
          margin: 0;
          font-weight: 500;
        }

        .related > ul.stories {
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .related > ul.stories li.story {
          text-decoration: none;
          padding: 10px 0 0 0;
          display: flex;
        }

        .related > ul.stories li.story a {
          text-decoration: none;
          display: flex;
          flex-flow: column;
          color: var(--gray-color);
        }

        .related > ul.stories li.story a span.title {
          color: var(--read-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
        }

        .related > ul.stories li.story a:hover > span.title {
          color: var(--title-color);
        }

        .related > ul.stories li.story a span.date {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
          font-size: 0.8rem;
        }

				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 15px 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}