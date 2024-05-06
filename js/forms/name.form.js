export default class StatStory extends HTMLElement {
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

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <div class="top">
        <h4 class="title">Your name</h4>
        <p class="desc">
          Your name is how people will find you on the platform. You can use your real name or a nickname.
          Both first and last name fields can't be empty.
        </p>
      </div>
      <form class="fields initial" id="name-form">
        <div class="field bio">
          <div class="input-group firstname">
            <label for="firstname" class="center">First name</label>
            <input data-name="firstname" type="text" name="firstname" id="firstname" placeholder="Enter your first name"
             value="${this.getAttribute('first-name')}" required>
            <span class="status">First name is required</span>
          </div>
          <div class="input-group lastname">
            <label for="lastname" class="center">Last name</label>
            <input data-name="lastname" type="text" name="lastname" id="lastname" value="${this.getAttribute('last-name')}" placeholder="Enter your last name" required>
            <span class="status">Last name is required</span>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="action next">
            <span class="text">Update name</span>
          </button>
        </div>
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
        -webkit-appearance: none;
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
        display: flex;
        flex-flow: column;
        gap: 5px;
        padding: 15px 0;
        width: 100%;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }
      }
    </style>
    `;
  }
}