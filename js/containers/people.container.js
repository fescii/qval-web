export default class PeopleContainer extends HTMLElement {
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

		this.fetchStories(contentContainer);
	}

	fetchStories = (contentContainer) => {
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
			<div class="title">
				<h4 class="title">People</h4>
				<span class="desc">Discover authors on avalQ</span>
			</div>
			<div class="people-list">
				${this.getLoader()}
			</div>
			<div class="more">
				<p>Discover authors and follow authors. Interact, support and engage with authors.</p>
				<a href="" class="link">Discover</a>
			</div>
    `;
	}

	getPeople = () => {
		return `
			<person-wrapper id="U0A43PBA" img="img/img.jpg"
        verified="true" name="Fredrick Ochieng"
        bio="Student At The East African University"
        followers="23" following="true">
      </person-wrapper>
      <person-wrapper id="U0A43PBA" img="img/img.jpg"
        verified="true" name="Fredrick Ochieng"
        bio="Student At The East African University"
        followers="23" following="false">
      </person-wrapper>
      <person-wrapper id="U0A43PBA" img="img/img.jpg"
        verified="true" name="Fredrick Ochieng"
        bio="Student At The East African University"
        followers="23" following="false">
      </person-wrapper>
    <person-wrapper id="U0A43PBA" img="img/img.jpg"
      verified="true" name="Fredrick Ochieng"
      bio="Student At The East African University"
      followers="23" following="false">
    </person-wrapper>
    <person-wrapper id="U0A43PBA" img="img/img.jpg"
      verified="true" name="Fredrick Ochieng"
      bio="Student At The East African University"
      followers="23" following="false">
    </person-wrapper>
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
				  background-color: var(--background);
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 0;
					position: sticky;
  				top: 70px;
				}

				.people-list {
				  background-color: var(--background);
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 5px;
				}

				.title {
					/* border: 1px solid red; */
				  padding: 0 0 10px 0;
				  display: flex;
				  flex-flow: column;
				  gap: 0;
				}

				.title h4 {
				  color: #1f2937;
				  font-size: 1.3rem;
				  font-weight: 500;
					padding: 0;
					margin: 0;
				}

				.title > span {
				  color: var(--gray-color);
				  font-size: 0.85rem;
				}

				.more {
				  margin: 15px 0 0 0;
				  padding: 10px 0;
				  display: flex;
				  flex-flow: column;
				  align-items: center;
				  justify-content: center;
				  gap: 10px;
				}

				.more p {
				  margin: 0;
				  padding: 0;
				  text-align: center;
				  color: var(--text-color);
				}

				.more a {
				  text-decoration: none;
				  border: none;
				  background-color: var(--action-background);
				  padding: 5px 20px;
				  color: var(--white-color);
				  font-size: 0.9rem;
				  font-weight: 500;
				  border-radius: 10px;
				  -webkit-border-radius: 10px;
				  -moz-border-radius: 10px;
				}

				@media screen and (max-width:660px) {
					:host {
						padding: 15px 0;
						position: static;
					}

					a {
						cursor: default !important;
					}

					.people-list {
						background-color: var(--background);
						padding: 0;
						display: flex;
						flex-flow: row;
						gap: 20px;
						width: 100%;
						overflow-x: scroll;
					  -ms-overflow-style: none;
						scrollbar-width: none;
					}

					.people-list::-webkit-scrollbar {
						display: none !important;
						visibility: hidden;
						-webkit-appearance: none;
					}
				}
	    </style>
    `;
	}
}