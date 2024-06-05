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
		const topicsLoader = this.shadowObj.querySelector('topics-loader');
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
			<topics-loader speed="300"></topics-loader>
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

	getTopics = () => {
		return /* html */`
			<div class="title">
				<h4 class="title">Topics</h4>
				<span class="text">Trending topics now</span>
			</div>
			<ul class="topics">
				<li class="topic">
					<a href="" class="link">
						<span class="no">63</span>
						<span class="text">Health Care</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">1.03k</span>
						<span class="text">Spotify</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">3</span>
						<span class="text">Good morning</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">117</span>
						<span class="text">Sora</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">71</span>
						<span class="text">Videotape</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">44</span>
						<span class="text">Kendrick Lamar</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">9</span>
						<span class="text">World War III</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">13</span>
						<span class="text">Christian</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">5</span>
						<span class="text">Nato</span>
					</a>
				</li>
				<li class="topic">
					<a href="" class="link">
						<span class="no">73</span>
						<span class="text">Programming</span>
					</a>
				</li>
			</ul>
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
				  gap: 10px;
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

				ul.topics {
				  margin: 0;
				  padding: 0;
				  list-style-type: none;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 10px;
				  width: 100%;
				}

				.title {
				  margin: 0 0 5px;
				  padding: 0;
				  width: 100%;
				  display: flex;
				  flex-flow: column;
				  gap: 0;
				}

				.title h4 {
				  color: var(--title-color);
				  font-size: 1.3rem;
				  font-weight: 600;
				  line-height: 1;
					display: none;
				}

				.title > span {
				  color: var(--text-color);
					font-family: var(--font-main), sans-serif;
				  font-size: 1rem;
					font-weight: 500;
				}

				ul.topics > li.topic {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: nowrap;
				  width: max-content;
				}

				ul.topics > li.topic a.link {
				  border: var(--topic-border);
				  margin: 0;
				  text-decoration: none;
					font-family: var(--font-read), sans-serif;
				  color: var(--gray-color);
				  padding: 4px 10px;
				  display: flex;
					align-items: center;
					justify-content: center;
				  gap: 5px;
				  flex-flow: row;
				  flex-wrap: nowrap;
				  width: max-content;
				  border-radius: 50px;
				  -webkit-border-radius: 50px;
				  -moz-border-radius: 50px;
				}

				ul.topics > li.topic a.link > span.no {
				  font-family: var(--font-mono), monospace;
				  font-size: 0.89rem;
				}

				ul.topics > li.topic a.link:hover {
				  color: transparent;
				  background: var(--accent-linear);
				  background-clip: text;
				  -webkit-background-clip: text;
					border: var(--topic-border-active);
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