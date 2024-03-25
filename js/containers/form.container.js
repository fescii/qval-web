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
        <textarea name="reply" placeholder="What's your opinion?" id="reply"></textarea>
        <div class="footer">
          <div class="actions">
            <span class="action at" title="Mention">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208c13.3 0 24 10.7 24 24s-10.7 24-24 24C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v28c0 50.8-41.2 92-92 92c-31.1 0-58.7-15.5-75.3-39.2C322.7 360.9 291.1 376 256 376c-66.3 0-120-53.7-120-120s53.7-120 120-120c28.8 0 55.2 10.1 75.8 27c4.3-6.6 11.7-11 20.2-11c13.3 0 24 10.7 24 24v80 28c0 24.3 19.7 44 44 44s44-19.7 44-44V256c0-114.9-93.1-208-208-208zm72 208a72 72 0 1 0 -144 0 72 72 0 1 0 144 0z"/>
              </svg>
            </span>
            <span class="action hashtag" title="Hashtag">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 448 512">
                <path d="M188.7 32.5c13 2.6 21.4 15.2 18.8 28.2L192.5 136h111l16.9-84.7c2.6-13 15.2-21.4 28.2-18.8s21.4 15.2 18.8 28.2L352.5 136H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H342.9L314.1 328H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H304.5l-16.9 84.7c-2.6 13-15.2 21.4-28.2 18.8s-21.4-15.2-18.8-28.2L255.5 376h-111l-16.9 84.7c-2.6 13-15.2 21.4-28.2 18.8s-21.4-15.2-18.8-28.2L95.5 376H24c-13.3 0-24-10.7-24-24s10.7-24 24-24h81.1l28.8-144H56c-13.3 0-24-10.7-24-24s10.7-24 24-24h87.5l16.9-84.7c2.6-13 15.2-21.4 28.2-18.8zM182.9 184L154.1 328h111l28.8-144h-111z"/>
              </svg>
            </span>
            <span class="action link" title="Link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 640 512">
                <path d="M580.3 267.2c56.2-56.2 56.2-147.3 0-203.5C526.8 10.2 440.9 7.3 383.9 57.2l-6.1 5.4c-10 8.7-11 23.9-2.3 33.9s23.9 11 33.9 2.3l6.1-5.4c38-33.2 95.2-31.3 130.9 4.4c37.4 37.4 37.4 98.1 0 135.6L433.1 346.6c-37.4 37.4-98.2 37.4-135.6 0c-35.7-35.7-37.6-92.9-4.4-130.9l4.7-5.4c8.7-10 7.7-25.1-2.3-33.9s-25.1-7.7-33.9 2.3l-4.7 5.4c-49.8 57-46.9 142.9 6.6 196.4c56.2 56.2 147.3 56.2 203.5 0L580.3 267.2zM59.7 244.8C3.5 301 3.5 392.1 59.7 448.2c53.6 53.6 139.5 56.4 196.5 6.5l6.1-5.4c10-8.7 11-23.9 2.3-33.9s-23.9-11-33.9-2.3l-6.1 5.4c-38 33.2-95.2 31.3-130.9-4.4c-37.4-37.4-37.4-98.1 0-135.6L207 165.4c37.4-37.4 98.1-37.4 135.6 0c35.7 35.7 37.6 92.9 4.4 130.9l-5.4 6.1c-8.7 10-7.7 25.1 2.3 33.9s25.1 7.7 33.9-2.3l5.4-6.1c49.9-57 47-142.9-6.5-196.5c-56.2-56.2-147.3-56.2-203.5 0L59.7 244.8z"/>
              </svg>
            </span>
            <span class="action emoji" title="Emoji">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 512 512">
                <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
              </svg>
            </span>
          </div>
          <button type="submit">Reply</button>
        </div>
      </form>
    `;
	}

  checkType = () => {
    if (this.getAttribute('type') === 'opinion') {
      return 'border-bottom: none;';
    }
    else {
      return 'border-bottom: var(--story-border);';
    }
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
          ${this.checkType()}
          background-color: var(--background);
          padding: 0 0 10px 2px;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        form.opinion {
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          position: relative;
        }

        form.opinion > textarea {
          border: none;
          /* border: var(--input-border); */
          padding: 4px 0;
          margin: 0;
          width: calc(100% - 35px);
          resize: none;
          height: 35px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-color);
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        form.opinion > textarea::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        form.opinion .footer {
          /* border: var(--input-border); */
          padding: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        form.opinion .footer > .actions {
          /* border: var(--input-border); */
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        form.opinion .footer * {
          transition: all 300ms ease-in-out;
          -webkit-transition: all 300ms ease-in-out;
          -moz-transition: all 300ms ease-in-out;
          -ms-transition: all 300ms ease-in-out;
          -o-transition: all 300ms ease-in-out;
        }

        form.opinion .footer > .actions > .action {
          /* border: var(--input-border); */
          cursor: pointer;
          padding: 0;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        form.opinion .footer > .actions > .action > svg {
          /* border: var(--input-border); */
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          width: 20px;
          height: 20px;
        }

        form.opinion .footer > .actions > .action:hover {
          /* border: var(--input-border); */
          color: var(--accent-color);
        }

        form.opinion .footer > button {
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
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