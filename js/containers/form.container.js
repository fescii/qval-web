export default class FormContainer extends HTMLElement {
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

	getTemplate = () => {
		// Show HTML Here
		return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
	}

	getBody = () => {
		return /* html */`
      <form action="" class="opinion">
        <div class="image">
          <img src="img/img.jpg" alt="Fredrick Ochieng" srcset="">
        </div>
        <textarea name="reply" placeholder="What's your opinion?" id="reply"></textarea>
        <button type="submit">Post</button>
      </form>
    `;
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
          border-bottom: var(--story-border);
          background-color: var(--background);
          padding: 10px 0;
          display: flex;
          flex-flow: column;
          gap: 5px;
        }

        form.opinion {
          padding: 0;
          margin: 0;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          position: relative;
        }

        form.opinion .image {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 35px;
          height: 35px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        form.opinion .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        form.opinion > textarea {
          border: none;
          /* border: var(--input-border); */
          padding: 8px !important;
          margin: 0;
          width: calc(100% - 35px);
          resize: none;
          height: 40px;
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

        form.opinion > textarea::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        form.opinion > button {
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

				@media screen and (max-width:660px) {
					:host {
						padding: 10px 0;
            border-bottom: var(--story-border-mobile);
					}

          div.options > span {
            border: var(--story-border-mobile);
          }
				}
	    </style>
    `;
	}
}