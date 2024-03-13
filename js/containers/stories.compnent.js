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

	getContent = () => {

	}

	getLoader = () => {
		return `
			<div class="stories-loader">
				<div class="loader-item">
					<span class="head"></span>	
					<div class="body"></div>
					<span class="foot">
						<span class="start">start</span>	
						<span class="dot">dot</span>	
						<span class="end">end</span>	
					</span>		
				</div>
			</div>
		`
	}

	getBody() {
		return `
      ${this.getLoader()}
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
        border-top: var(--story-border);
        font-family: var(--font-main),sans-serif;
        padding: 15px 0;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
      }
      
    </style>
    `;
	}
}