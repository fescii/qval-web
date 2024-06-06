export default class RepliesFeed extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.opinions');

    this.fetchOpinions(contentContainer);
  }

  fetchOpinions = (contentContainer) => {
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getReplies();
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
			<div class="opinions">
				${this.getLoader()}
      </div>
    `;
  }

  getReplies = () => {
    return /* html */`
      <quick-post story="reply" likes="120" opinions="450" id="P1B52QCA" liked="false"
        views="512" time="2019-08-17T14:30:00+03:00"
        read-time="5" author-id="U1B52QCA">
        <p>The new legislation aims to address ongoing issues in healthcare reform.</p>
        <p>It includes provisions for better access to medical services for underprivileged communities.</p>
      </quick-post>

      <quick-post story="reply" likes="75" opinions="210" id="P2C63RDB" liked="true"
        views="380" time="2019-08-18T10:15:00+03:00"
        read-time="4" author-id="U2C63RDB">
        <p>Climate change continues to have a significant impact on agricultural productivity.</p>
        <p>Farmers are adapting by implementing new techniques and technologies.</p>
      </quick-post>

      <quick-post story="reply" likes="89" opinions="340" id="P3D74SEC" liked="false"
        views="420" time="2019-08-19T09:45:00+03:00"
        read-time="7" author-id="U3D74SEC">
        <p>Artificial Intelligence is rapidly advancing, bringing new possibilities to various industries.</p>
        <p>From healthcare to finance, AI is revolutionizing the way we work and live.</p>
      </quick-post>

      <quick-post story="reply" likes="102" opinions="390" id="P4E85TDF" liked="true"
        views="485" time="2019-08-20T11:20:00+03:00"
        read-time="6" author-id="U4E85TDF">
        <p>Renewable energy sources are becoming more viable and widespread.</p>
        <p>Investment in solar and wind energy is crucial for a sustainable future.</p>
      </quick-post>
  
      <quick-post story="reply" likes="140" opinions="520" id="P5F96UGE" liked="false"
        views="600" time="2019-08-21T12:30:00+03:00"
        read-time="8" author-id="U5F96UGE">
        <p>Researchers have made significant progress in the fight against cancer.</p>
        <p>New treatments are showing promising results in clinical trials.</p>
      </quick-post>

      <quick-post story="reply" likes="64" opinions="310" id="P6G07VHF" liked="true"
        views="405" time="2019-08-22T14:00:00+03:00"
        read-time="5" author-id="U6G07VHF">
        <p>From tropical beaches to historical cities, 2020 has many travel destinations to offer.</p>
        <p>Plan your next vacation with these top travel spots.</p>
      </quick-post>

      <quick-post story="reply" likes="110" opinions="470" id="P7H18WIG" liked="false"
        views="520" time="2019-08-23T15:45:00+03:00"
        read-time="6" author-id="U7H18WIG">
        <p>Scientists have discovered new species in the deepest parts of the ocean.</p>
        <p>These findings could provide insights into the origins of life on Earth.</p>
      </quick-post>

      <quick-post story="reply" likes="95" opinions="360" id="P8I29XJH" liked="true"
        views="450" time="2019-08-24T16:10:00+03:00"
        read-time="7" author-id="U8I29XJH">
        <p>Education plays a critical role in shaping the future of society.</p>
        <p>Investing in education is investing in the future.</p>
      </quick-post>
  
      <quick-post story="reply" likes="80" opinions="400" id="P9J30YKI" liked="false"
        views="490" time="2019-08-25T10:50:00+03:00"
        read-time="5" author-id="U9J30YKI">
        <p>The stock market is experiencing significant changes in 2020.</p>
        <p>Investors should keep an eye on these key trends.</p>
      </quick-post>

      <quick-post story="reply" likes="87" opinions="280" id="P10K41ZLJ" liked="true"
        views="430" time="2019-08-26T11:35:00+03:00"
        read-time="6" author-id="U10K41ZLJ">
        <p>Modern art has evolved significantly over the past century.</p>
        <p>Artists continue to push the boundaries of creativity and expression.</p>
      </quick-post>

      <quick-post story="reply" likes="77" opinions="320" id="P11L52AMK" liked="false"
        views="370" time="2019-08-27T13:20:00+03:00"
        read-time="4" author-id="U11L52AMK">
        <p>Mental health awareness is crucial for overall well-being.</p>
        <p>Support and understanding can make a significant difference.</p>
      </quick-post>
      <quick-post story="reply" likes="92" opinions="350" id="P12M63BNL" liked="true"
        views="480" time="2019-08-28T14:40:00+03:00"
        read-time="5" author-id="U12M63BNL">
        <p>The 2020 Olympics showcased incredible athletic talent and sportsmanship.</p>
        <p>Here are some of the most memorable moments from the games.</p>
      </quick-post>
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
				width: 100%;
        padding: 0 0 30px;
      }

			div.stories {
			  /* border: 1px solid #000000; */
			  padding: 0;
			  width: 100%;
			  display: flex;
			  flex-flow: column;
			  gap: 0;
			}
    </style>
    `;
  }
}