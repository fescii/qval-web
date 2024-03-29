export default class PeopleLoader extends HTMLElement {
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

	getTemplate() {
		// Show HTML Here
		return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
	}

	getBody() {
		return `
      <div class="loader">
        <div class="head">
          <span class="profile skeleton"></span>
          <span class="info">
            <span class="name skeleton"></span>
            <span class="followers skeleton"></span>
          </span>
        </div>
        <div class="action skeleton"></div>
      </div>
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

	      :host {
					display: flex;
					flex-flow: column;
					gap: 15px;
					width: 100%;
				}

				.loader {
					padding: 0 10px 0 0;
					display: flex;
					width: 100%;
					flex-flow: row !important;
					flex-wrap: nowrap;
					gap: 20px;
					align-items: center;
					justify-content: space-between;
				}

				.loader .skeleton {
					background: var(--loader-gradient);
					background-size: 500% 500%;
					-webkit-animation: Gradient 2.25s ease infinite;
					-moz-animation: Gradient 2.25s ease infinite;
					animation: Gradient 2.25s ease infinite;
				}

				.loader > .head {
					padding: 0;
					margin: 0;
					width: 60%;
					display: flex;
					flex-flow: row;
					align-items: center;
					flex-wrap: nowrap;
					gap: 10px;
				}

				.loader > .head > span.profile {
					display: inline-block;
					height: 32px;
					width: 32px;
					border-radius: 50px;
					-webkit-border-radius: 50px;
					-moz-border-radius: 50px;
				}

				.loader > .head > span.info {
					display: flex;
					flex-flow: column;
					gap: 8px;
					min-width: calc(100% - 45px);
				}

				.loader > .head > .info .name {
					display: inline-block;
					margin: 0;
					padding: 0;
					width: 100%;
					height: 8px;
					border-radius: 3px;
					-webkit-border-radius: 3px;
					-moz-border-radius: 3px;
				}

				.loader > .head > .info .followers {
					display: inline-block;
					margin: 0;
					padding: 0;
					width: 50%;
					height: 8px;
					border-radius: 3px;
					-webkit-border-radius: 3px;
					-moz-border-radius: 3px;
				}

				.loader > .action {
					display: inline-block;
					margin: 0;
					padding: 0;
					width: 20%;
					height: 15px;
					border-radius: 4px;
					-webkit-border-radius: 4px;
					-moz-border-radius: 4px;
				}

				@keyframes Gradient {
				  0% {
				    background-position: 0 25%;
				    /*opacity: 0.5;*/
				  }
				  50% {
				    background-position: 25% 50%;
				    /*opacity: 0.75;*/
				  }
				  75% {
				    background-position: 50% 75%;
				    /*opacity: 0.75;*/
				  }
				  100% {
				    background-position: 75% 100%;
				    /*opacity: 1;*/
				  }
				}
	    </style>
    `;
	}
}