export default class TrendingContainer extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.stories');

    this.fetchStories(contentContainer);
  }

  fetchStories = (contentContainer) => {
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getStories();
    setTimeout(() => {
      storyLoader.remove();
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
			<story-loader speed="300"></story-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="stories new">
        <div class="title">
          <h2>${this.getAttribute('topic')}</h2>
          <span class="info">
            60 new stories
          </span>
        </div>
				${this.getLoader()}
      </div>
    `;
  }

  getStories = () => {
    return /* html */`
			<story-wrapper story="story" id="P0A43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="The US Senate called on the law markers"
        read-time="6" author-id="U0A43PBA" author-img="img/img.jpg"
        author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University"
        author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="opinion" upvotes="9" id="P0A43PBA" upvoted="true"
	      views="609" time="2022-01-03T13:00:00+03:00"
	      story-title="The US Senate called on the law markers"
	      read-time="6" author-id="U0A43PBA" author-img="img/img.jpg"
	      author-verified="true" author-name="Fredrick Ochieng"
	      author-bio="Student At The East African University"
	      author-followers="23" following="true">
	    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptas ratione! Corporis, enim accusantium possimus minima eum illo atque dolorum provident nisi.
	    Facilis nulla optio quas quod veniam nam voluptas!
	    </story-wrapper>
	    <story-wrapper story="story" id="P0A43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="Lorem ipsum dolor sit amet consectetur adipisicing elit"
        read-time="6" author-id="U0A43PBA" author-img="img/img.jpg"
        author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University"
        author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="story" id="P0A43PBA"
        views="609" time="2022-01-03T13:00:00+03:00" story-title="The US Senate called on the law markers"
        read-time="6" author-id="U0A43PBA" author-img="img/img.jpg" author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University" author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="opinion" id="P0A43PBA" upvotes="3" upvoted="false"
        views="609" time="2022-01-03T13:00:00+03:00" story-title="The US Senate called on the law markers"
        read-time="6" author-id="U0A43PBA" author-img="img/img.jpg" author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University" author-followers="23" following="true">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptas ratione! Corporis, enim accusantium possimus minima eum illo atque dolorum provident nisi.
      Facilis nulla optio quas quod veniam nam voluptas!
      </story-wrapper>
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
				width: 100%;
      }

			div.stories {
			  /* border: 1px solid #000000; */
			  padding: 0;
			  width: 100%;
			  display: flex;
			  flex-flow: column;
			  gap: 0;
			}

      div.stories > .title {
			  /* border: 1px solid #000000; */
			  padding: 0;
			  width: 100%;
			  display: flex;
			  flex-flow: row;
        color: var(--text-color);
			  gap: 2px;
			}

      div.stories > .title > .icon {
			  /* border: 1px solid #000000; */
			  padding: 0;
			  display: flex;
        color: var(--gray-color);
			  gap: 0;
			}

      div.stories > .title > .icon > svg {
			  /* border: 1px solid #000000; */
			  padding: 0;
        margin: 0 0 -2px -3px;
			  display: flex;
        color: var(--gray-color);
			  gap: 0;
			}

      div.stories > .title > h2 {
			  /* border: 1px solid #000000; */
        text-transform: capitalize;
			  padding: 0;
        margin: 0;
        font-weight: 500;
        font-size: 1.5rem;
        font-family: var(--font-main), sans-serif;
        color: var(--text-color);
			  gap: 0;
			}

    </style>
    `;
  }
}