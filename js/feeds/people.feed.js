export default class PeopleFeeds extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.people-list');

    this.fetchPeople(contentContainer);
  }

  fetchPeople = (contentContainer) => {
    const peopleLoader = this.shadowObj.querySelector('people-loader');
    const content = this.getPeople();
    setTimeout(() => {
      peopleLoader.remove();
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
			<people-loader speed="300"></people-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="people-list">
				${this.getLoader()}
			</div>
    `;
  }

  getPeople = () => {
    return /*html*/`
			<user-wrapper username="U0BC98H63AB1" name="John Doe" picture="img/img.jpg"
        verified="true" user-follow="true" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0BC98H63BCA" name="Janet Doe" picture="https://100k-faces.glitch.me/random-image" 
        verified="false" user-follow="false" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0BC9BAC53H4" name="Yosemite Sam" picture="https://100k-faces.glitch.me/random-image"
        verified="true" user-follow="true" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0PHAB693NBA" name="Farghon Legon" picture="https://100k-faces.glitch.me/random-image" 
        verified="false" user-follow="true" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0DAB69B79NH" name="Porky Pig" picture="https://100k-faces.glitch.me/random-image"
        verified="false" user-follow="false" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0BCCA53HP1" name="Bugs Bunny" picture="https://100k-faces.glitch.me/random-image" 
        verified="true" user-follow="false" url="/u/U0BC98H63AB1" >
      </user-wrapper>
      <user-wrapper username="U0PC98H63AB8" name="Marvin Martian" picture="https://100k-faces.glitch.me/random-image"
        verified="false" user-follow="true" url="/u/U0BC98H63AB1" >
      </user-wrapper>
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
				  background-color: var(--background);
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 5px;
          width: 100%;
        }

				.people-list {
					background-color: var(--background);
					padding: 0;
					display: flex;
					flex-flow: column;
					gap: 0;
					width: 100%;
				}

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}