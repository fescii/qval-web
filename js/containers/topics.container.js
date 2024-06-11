export default class TopicsContainer extends HTMLElement {
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
		const topicsLoader = this.shadowObj.querySelector('topic-loader');
		const content = this.getTopics();
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
			<topic-loader speed="300"></topic-loader>
		`
	}

	getBody = () => {
		// language=HTML
		return /* html */`
			<div class="title">
				<h2>Most read topics</h2>
				<p class="info">Many people read stories about these topics.</p>
			</div>
			<div class="content">
				${this.getLoader()}
			</div>
    `;
	}

  getTopics = () => {
    return /*html*/`
      <topic-wrapper hash="T0BC98H63AB1" name="health-care" description="Health care is the maintenance or improvement of health via the prevention, diagnosis, treatment, recovery, or cure of disease, illness, injury, and other physical and mental impairments in people."
        user-follow="true" url="/t/T0BC98H63AB1"
        subscribers="236" followers="9734">
      </topic-wrapper>

      <topic-wrapper hash="T0YZ92G78LM1" name="technology-is-the-key-to-many-solutions-but-not-definate" description="Technology is the application of scientific knowledge for practical purposes, especially in industry."
        user-follow="false" url="/t/T0BC98H63AB1"
        subscribers="987" followers="15632">
      </topic-wrapper>

      <topic-wrapper hash="T0JQ75H45FD2" name="sports" description="Sports involve physical exertion and skill in which an individual or team competes against another or others for entertainment."
        user-follow="true" url="/t/T0BC98H63AB1"
        subscribers="512" followers="8341">
      </topic-wrapper>

      <topic-wrapper hash="T0PL84D56GH3" name="education" description="Education is the process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits."
        user-follow="false" url="/t/T0BC98H63AB1"
        subscribers="674" followers="12098">
      </topic-wrapper>

      <topic-wrapper hash="T0RK39J23NM4" name="science" description="Science is the pursuit and application of knowledge and understanding of the natural and social world following a systematic methodology based on evidence."
        user-follow="true" url="/t/T0BC98H63AB1"
        subscribers="856" followers="21045">
      </topic-wrapper>

      <topic-wrapper hash="T0XC49K76PO5" name="travel" description="Travel is the movement of people between distant geographical locations, either for leisure or business purposes."
        user-follow="true" url="/t/T0BC98H63AB1"
        subscribers="239" followers="4789">
      </topic-wrapper>

      <topic-wrapper hash="T0ML28P57QW6" name="music" description="Music is the art of arranging sounds in time to produce a composition through the elements of melody, harmony, rhythm, and timbre."
        user-follow="false" url="/t/T0BC98H63AB1"
        subscribers="319" followers="9453">
      </topic-wrapper>

      <topic-wrapper hash="T0HZ11L63VK7" name="art" description="Art is a diverse range of human activities involving the creation of visual, auditory, or performed artifacts, expressing the creator's imaginative or technical skill."
        user-follow="true" url="/t/T0BC98H63AB1"
        subscribers="728" followers="16349">
      </topic-wrapper>
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
					margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 0px;
				}

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 0;
				  width: 100%;
				}

				.title {
          display: flex;
					width: 100%;
          flex-flow: column;
					padding: 5px 5px 8px;
          gap: 0;
					background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%);
					border-radius: 10px;
        }

        .title > h2 {
          font-size: 1.5rem;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
        }

        .title > p.info {
          margin: 0;
          font-size: 0.9rem;
          font-style: italic;
          font-weight: 400;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
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