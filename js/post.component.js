export default class OpinionWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

    this.openForm();
  }

  openForm = () => {
    const writeContainer = this.shadowObj.querySelector('div.stats');
    const formContainer = this.shadowObj.querySelector('div.form-container');
    if (writeContainer && formContainer) {
      const writeBtn = writeContainer.querySelector('span.stat.write');
      const formElement = this.getForm();

      writeBtn.addEventListener('click', event => {
        event.preventDefault();

        // console.log(writeContainer);
        // console.log(formElement);

        // writeContainer.classList.toggle('active');
        if (writeContainer.classList.contains('active')) {
          writeContainer.classList.remove('active');
          formContainer.innerHTML = '';
        }
        else {
          writeContainer.classList.add('active');
          formContainer.insertAdjacentHTML('beforeend', formElement);
        }
      })
    }
  }

  formatDateToLocale(isoDate) {
    // Create a Date object from the ISO date string
    const date = new Date(isoDate);

    // Options for formatting to the desired output
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };

    // Use toLocaleDateString to format according to browser settings
    return date.toLocaleDateString('en-US', options);
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    const contents = this.innerHTML.split('\n');

    let output = ``
    contents.forEach(content => {
      let trimContent = content.trim();
      if (trimContent.length !== '' && trimContent.length >= 1) {
        // console.log(trimContent);
        output += `<p>${trimContent}</p>`
      }
    })

    return `
      <div class="content" id="content">
        ${output}
      </div>
    `;
  }

  getHeader = () => {
    const date = this.formatDateToLocale(this.getAttribute('date'));
    const discussId = this.getAttribute('id').trim();
    let classicId = `${discussId.substring(0, 1)}<span class="sub">${discussId.charAt(1)}</span>${discussId.substring(2)} `

    return `
      <div class="head">
        <span class="info">
          <a href="${this.getAttribute('url')}" class="code">#${classicId}</a>
          <span class="dot"></span>
          <span class="date">${date}</span>
        </span>
      </div>
    `
  }

  getStats = () => {
    return `
      <div class="stats">
        <span class="stat write">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22.0001C4.617 22.0001 2 19.3831 2 12.0001C2 4.61712 4.617 2.00012 12 2.00012C12.414 2.00012 12.75 2.33612 12.75 2.75012C12.75 3.16412 12.414 3.50012 12 3.50012C5.486 3.50012 3.5 5.48612 3.5 12.0001C3.5 18.5141 5.486 20.5001 12 20.5001C18.514 20.5001 20.5 18.5141 20.5 12.0001C20.5 11.5861 20.836 11.2501 21.25 11.2501C21.664 11.2501 22 11.5861 22 12.0001C22 19.3831 19.383 22.0001 12 22.0001Z"
              fill="currentColor" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M19.2365 9.38606L20.2952 8.19072C21.4472 6.88972 21.3252 4.89472 20.0252 3.74172C19.3952 3.18372 18.5812 2.90372 17.7452 2.95572C16.9052 3.00672 16.1352 3.38272 15.5772 4.01272L9.6932 10.6607C7.8692 12.7187 9.1172 15.4397 9.1712 15.5547C9.2602 15.7437 9.4242 15.8877 9.6232 15.9497C9.6802 15.9687 10.3442 16.1717 11.2192 16.1717C12.2042 16.1717 13.4572 15.9127 14.4092 14.8367L19.0774 9.56571C19.1082 9.54045 19.1374 9.51238 19.1646 9.4815C19.1915 9.45118 19.2155 9.41925 19.2365 9.38606ZM10.4082 14.5957C11.0352 14.7097 12.4192 14.8217 13.2862 13.8427L17.5371 9.04299L15.0656 6.85411L10.8172 11.6557C9.9292 12.6567 10.2122 13.9917 10.4082 14.5957ZM16.0596 5.73076L18.5322 7.91938L19.1722 7.19672C19.7752 6.51472 19.7122 5.46872 19.0312 4.86572C18.7002 4.57372 18.2712 4.42472 17.8362 4.45272C17.3962 4.48072 16.9932 4.67672 16.7002 5.00672L16.0596 5.73076Z"
              fill="currentColor" />
          </svg>
          <span class="text">Reply</span>
          <span class="line"></span>
        </span>
        <span class="stat discuss">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-quote"
            viewBox="0 0 16 16">
            <path
              d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
            <path
              d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
          </svg>
          <span class="no">${this.getAttribute('opinions')}</span>
        </span>
      </div>
    `
  }

  getForm = () => {
    return `
      <form action="" class="reply">
        <div class="image">
          <img src="${this.getAttribute('profile')}" alt="Profile picture">
        </div>
        <textarea name="reply" placeholder="Discuss opinion #${this.getAttribute('id')}"  id="reply"></textarea>
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
          </svg>
        </button>
      </form>
    `
  }

  getBody() {
    return `
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getStats()}
      <div class="form-container"></div>
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
        background: #DDDDD7;
      }

      *::-webkit-scrollbar-thumb {
        width: 3px;
        background: linear-gradient(#53595f, #627ea0);
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
        border-top: 1px solid #6b728038;
        padding: 15px 0;
        display: flex;
        flex-flow: column;
        gap: 0;
        font-family: var(--font-main);
      }

      
    </style>
    `;
  }
}