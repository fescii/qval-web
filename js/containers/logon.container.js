export default class LogonContainer extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });

    this._step = 0;

    this._success = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path	d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
			</svg>
    `

    this._failed = `
		  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"	viewBox="0 0 16 16">
				<path	d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
			</svg>
    `

    this._data = {
      "register": {},
      "login": {},
      "recovery": {}
    };

    this.render();
  }


  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

    document.addEventListener("DOMContentLoaded", (_) => {
      Particles.init({
        selector: '.canvas',
        color: '#ffffff',
        connectParticles: true
      });
    })


    const contentContainer = this.shadowObj.querySelector('.logon-container');
    if (contentContainer) {
      const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action')
      const stagesContainer = contentContainer.querySelector('.stages');
      this.activateRegister(contentContainer, stagesContainer, contentTitle);
      this.activateLogin(contentContainer, stagesContainer, contentTitle);
    }

  }

  disconnectedCallback() {
    // console.log('We are inside disconnectedCallback');
  }

  activateRegister(contentContainer, stagesContainer, contentTitle) {
    const loader = this.getLoader();
    const form = this.getRegistrationForm();
    const outerThis = this;
    const registerButton = contentContainer.querySelector('.welcome > a.register');
    if (registerButton) {
      registerButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        contentContainer.insertAdjacentHTML('afterbegin', loader);

        const welcome = contentContainer.querySelector('.welcome');

        setTimeout(() => {
          welcome.remove();
          contentTitle.textContent = 'Register';
          outerThis.changeStages('register', stagesContainer);
          outerThis.nextStep('register', stagesContainer);
          stagesContainer.insertAdjacentHTML('afterend', form)

          contentContainer.querySelector('#loader-container').remove();

          outerThis.submitEvent('register', contentContainer.querySelector('form'));
          outerThis.prevStep('register', stagesContainer, contentContainer)
        }, 1000);

      })
    }
  }

  activateLogin(contentContainer, stagesContainer, contentTitle) {
    const loader = this.getLoader();
    const form = this.getLoginForm();
    const outerThis = this;
    const loginButton = contentContainer.querySelector('a.login');
    if (loginButton) {
      loginButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        contentContainer.insertAdjacentHTML('afterbegin', loader);

        const welcome = contentContainer.querySelector('.welcome');
        const finish = contentContainer.querySelector('.finish');

        setTimeout(() => {
          if (welcome) {
            welcome.remove();
          }
          if (finish) {
            finish.remove();
          }
          contentTitle.textContent = 'Login';
          outerThis.changeStages('login', stagesContainer);
          outerThis.nextStep('login', stagesContainer);
          stagesContainer.insertAdjacentHTML('afterend', form)

          contentContainer.querySelector('#loader-container').remove();

          outerThis.submitEvent('login', contentContainer.querySelector('form'));
          outerThis.prevStep('login', stagesContainer, contentContainer)
        }, 1000);

      })
    }
  }

  changeStages(stageType, stagesContainer) {
    const stages = stagesContainer.querySelectorAll('.no');

    switch (stageType) {
      case 'register':
        stagesContainer.classList.remove('login', 'welcome-stages');
        stagesContainer.classList.add('register');

        stages.forEach(stage => {
          stage.style.display = 'inline-block';
        });

        break;

      case 'login':
        stagesContainer.classList.remove('register', 'welcome-stages');
        stagesContainer.classList.add('login');

        stages.forEach((stage, index) => {
          if(index === 2 || index === 3) {
            stage.style.display = 'none';
          }
        });

        break;

      case 'welcome':
        stagesContainer.classList.remove('register', 'login');
        stagesContainer.classList.add('welcome-stages');

        stages.forEach((stage, index) => {
          if (index === 2 || index === 3) {
            stage.style.display = 'none';
          }
        });

        break;
      default:
        break;
    }
  }

  nextStep(stageType, stagesContainer) {
    const stages = stagesContainer.querySelectorAll('span.stage');

    switch (stageType) {
      case "register":
        stages[this._step + 1].classList.add('active');
        this._step += 1;
        break;
      case "login":
        if(this._step >= 4) {
          stages[4].classList.remove('active');
          stages[1].classList.add('active');
          this._step = 1;
        }
        else if((this._step + 1) === 2) {
          stages[stages.length - 1].classList.add('active');
          this._step = (stages.length - 1);
        }
        else {
          stages[this._step + 1].classList.add('active');
          this._step += 1;
        }
        break;
      default:
        break;
    }
  }

  prevStep(stageType, stagesContainer, contentContainer) {
    const outerThis = this;
    const welcome = this.getWelcome();
    const form = contentContainer.querySelector('form.fields');
    const stages = stagesContainer.querySelectorAll('span.stage');
    const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');

    const prevButton = form.querySelector('.actions > .action.prev ');

    prevButton.addEventListener('click', e => {
      e.preventDefault()

      prevButton.innerHTML = outerThis.getBtnAltLoader();
      prevButton.style.setProperty("pointer-events", 'none');

      switch (stageType) {
        case "register":
          if (outerThis._step <= 1) {
            setTimeout(() => {
              stages[1].classList.remove('active');
              form.remove();
              stagesContainer.insertAdjacentHTML('afterend', welcome)
              outerThis._step = 0;

              outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
              outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
            }, 1500);
          }
          else if(outerThis._step === 2) {
            setTimeout(() => {
              stages[outerThis._step].classList.remove('active');
              outerThis._step -= 1;
              const currentFields = form.querySelector('.field.bio');
              if (currentFields) {
                currentFields.remove();
              }

              form.insertAdjacentHTML('afterbegin', outerThis.getUsernameFields())
            }, 1500);
          }
          else if(outerThis._step === 3) {
            setTimeout(() => {
              stages[outerThis._step].classList.remove('active');
              outerThis._step -= 1;
              const currentFields = form.querySelector('.field.password');
              if (currentFields) {
                currentFields.remove();
              }

              form.insertAdjacentHTML('afterbegin', outerThis.getBioFields())
            }, 1500);
          }
          break;
        case "login":
          if (this._step <= 1) {
            setTimeout(() => {
              stages[1].classList.remove('active');
              form.remove();
              stagesContainer.insertAdjacentHTML('afterend', welcome)
              outerThis._step = 0;

              outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
              outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
            }, 1500);
          }
          break;
        default:
          break;
      }

      setTimeout(() => {
        prevButton.innerHTML = `<span class="text">Back</span>`
        prevButton.style.setProperty("pointer-events", 'auto');
      }, 1500);
    })
  }

  submitEvent(stageType, form) {
    const outerThis = this;
    form.addEventListener('submit', e => {
      e.preventDefault();

      switch (stageType) {
        case 'register':
          if (outerThis._step === 1) {
            outerThis.validateUsername(form);
          }
          else if (outerThis._step === 2) {
            outerThis.validateBio(form);
          }
          else if (outerThis._step === 3) {
            outerThis.validatePassword(form);
          }
          break;
        case 'login':
          outerThis.validateLogin(form);
        default:
          break;
      }
    })
  }

  validateLogin(form) {
    const outerThis = this;
    const data = {};
    const submitButton = form.querySelector('.actions > .action.next ');
    const inputField = form.querySelector('.field.login');
    const userKeyGroup = inputField.querySelector('.input-group.user-key');
    const passwordGroup = inputField.querySelector('.input-group.password');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');

    userKeyGroup.classList.remove('success', 'failed');
    passwordGroup.classList.remove('success', 'failed');

    let svg = userKeyGroup.querySelector('svg');
    let passwordSvg = passwordGroup.querySelector('svg');
    if (svg && passwordSvg) {
      svg.remove();
      passwordSvg.remove();
    }

    const userKeyValue = userKeyGroup.querySelector('input').value.trim();
    const passwordValue = passwordGroup.querySelector('input').value.trim();

    const userKeyStatus = userKeyGroup.querySelector('span.status');
    const passwordStatus = passwordGroup.querySelector('span.status');


    if (userKeyValue === '') {
      userKeyStatus.textContent = 'Username or email is required!';
      userKeyGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      userKeyGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Login</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      userKeyGroup.insertAdjacentHTML('beforeend', this._success);
      setTimeout(() => {
        userKeyGroup.classList.add('success');
      }, 2000);
      data['user-key'] = userKeyValue;
    }

    if (passwordValue === '') {
      passwordStatus.textContent = 'Password is required!';
      passwordGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      passwordGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Login</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      passwordGroup.insertAdjacentHTML('beforeend', this._success);
      setTimeout(() => {
        passwordGroup.classList.add('success');
      }, 2000);
      data['password'] = passwordValue;
    }

    if (data['user-key'] && data['password']) {
      //API CALL
      outerThis.performLogin(form, data)
    }
  }

  performLogin(form, data) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next ');

    // After API call
    let _msg = 'Username is available' // From API

    setTimeout(() => {
      submitButton.innerHTML = `<span class="text">Continue</span>`
      submitButton.style.setProperty("pointer-events", 'auto');

      outerThis.activateLoginFinish(form.parentElement, 'Fredrick');
    }, 3000);
  }

  validateUsername(form) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next ');
    const inputField = form.querySelector('.field.username');
    const inputGroup = inputField.querySelector('.input-group');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');
    inputGroup.classList.remove('success', 'failed');
    let svg = inputGroup.querySelector('svg');
    if (svg) {
      svg.remove();
    }

    const inputValue = inputGroup.querySelector('input').value.trim();
    // console.log(inputValue);
    const status = inputGroup.querySelector('span.status');

    let msg = 'Username is required!'

    if (inputValue === '') {
      status.textContent = msg;
      inputGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      inputGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else if (inputValue.length < 5) {
      msg = 'Username must be 5 characters or more!'
      status.textContent = msg;
      inputGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      inputGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }

    else {
      // Call API
      outerThis.checkUsername(form, inputValue, inputGroup, status);
    }
  }

  checkUsername(form, inputValue, inputGroup, status) {
    const submitButton = form.querySelector('.actions > .action.next ');

    // After API call
    let msg = 'Username is available' // From API

    //Add user to the data object
    this._data.register['username'] = inputValue;


    status.textContent = msg;
    inputGroup.insertAdjacentHTML('beforeend', this._success);

    setTimeout(() => {
      inputGroup.classList.add('success');
    }, 2000);

    setTimeout(() => {
      submitButton.innerHTML = `<span class="text">Continue</span>`
      submitButton.style.setProperty("pointer-events", 'auto');
      this.activateBio(form)
    }, 3000);
  }

  activateBio(form) {
    const stagesContainer = form.parentElement.querySelector('.stages');
    form.firstElementChild.remove()
    this.nextStep('register', stagesContainer);

    form.insertAdjacentHTML('afterbegin', this.getBioFields())
  }

  validateBio(form) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next ');
    const inputField = form.querySelector('.field.bio');

    // const inputGroups = inputField.querySelectorAll('.input-group');
    const firstName = inputField.querySelector('.input-group.firstname');
    const lastname = inputField.querySelector('.input-group.lastname');
    const email = inputField.querySelector('.input-group.email');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');


    // Validate names
    if (this.validateName(firstName, submitButton) && this.validateName(lastname, submitButton)) {
      const input = email.querySelector('input').value.trim();

      email.classList.remove('success', 'failed');
      let svg = email.querySelector('svg');
      if (svg) {
        svg.remove();
      }
      const emailStatus = email.querySelector('span.status');

      if (input === '') {
        emailStatus.textContent = 'Enter a valid email!';
        email.insertAdjacentHTML('beforeend', outerThis._failed);
        email.classList.add('failed');

        setTimeout(() => {
          submitButton.innerHTML = `<span class="text">Continue</span>`
          submitButton.style.setProperty("pointer-events", 'auto');
        }, 1000);
      }
      else {
        // no Inspection
        let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (input.match(validRegex)) {

          // Call the API
          outerThis.checkEmail(form, input, email, emailStatus);
        }
        else {
          emailStatus.textContent = 'Enter a valid email!';
          email.insertAdjacentHTML('beforeend', outerThis._failed);
          email.classList.add('failed');

          setTimeout(() => {
            submitButton.innerHTML = `<span class="text">Continue</span>`
            submitButton.style.setProperty("pointer-events", 'auto');
          }, 1000);
        }
      }
    }
  }

  validateName(nameElement, submitButton) {
    const outerThis = this;
    const inputElement = nameElement.querySelector('input')
    const input = nameElement.querySelector('input').value.trim();

    nameElement.classList.remove('success', 'failed');
    let svg = nameElement.querySelector('svg');
    if (svg) {
      svg.remove();
    }
    const nameStatus = nameElement.querySelector('span.status');

    if (input === '') {
      nameStatus.textContent = 'This field is required!';
      nameElement.insertAdjacentHTML('beforeend', outerThis._failed);
      nameElement.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);

      return false;
    }
    else {
      nameStatus.textContent = '';
      nameElement.insertAdjacentHTML('beforeend', this._success);

      if (inputElement.dataset.name === "firstname") {
        this._data.register['firstname'] = input;
      }
      else {
        this._data.register['lastname'] = input;
      }

      nameElement.classList.add('success');

      return true;
    }
  }

  checkEmail(form, input, email, emailStatus) {
    const submitButton = form.querySelector('.actions > .action.next');

    // After API call
    let msg = 'Username is available' // From API

    //Add user to the data object
    this._data.register['username'] = input;

    emailStatus.textContent = msg;
    email.insertAdjacentHTML('beforeend', this._success);

    this._data.register['email'] = input;

    setTimeout(() => {
      email.classList.add('success');
    }, 1000);


    setTimeout(() => {
      submitButton.innerHTML = `<span class="text">Register</span>`
      submitButton.style.setProperty("pointer-events", 'auto');
      this.activatePassword(form)
    }, 2000);
  }

  activatePassword(form) {
    const stagesContainer = form.parentElement.querySelector('.stages');
    form.firstElementChild.remove()
    this.nextStep('register', stagesContainer);

    // console.log(this.getPasswordFields());

    form.insertAdjacentHTML('afterbegin', this.getPasswordFields())
  }

  validatePassword(form) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next');
    const inputField = form.querySelector('.field.password');

    // const inputGroups = inputField.querySelectorAll('.input-group');
    const password = inputField.querySelector('.input-group.password');
    const repeatPassword = inputField.querySelector('.input-group.repeat-password');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');

    const input = password.querySelector('input').value.trim();
    const inputRepeat = repeatPassword.querySelector('input').value.trim();

    password.classList.remove('success', 'failed');
    repeatPassword.classList.remove('success', 'failed');
    let svg = password.querySelector('svg');
    let svgRepeat = repeatPassword.querySelector('svg');
    if (svg && svgRepeat) {
      svg.remove();
      svgRepeat.remove();
    }


    const passwordStatus = password.querySelector('span.status');
    const repeatStatus = repeatPassword.querySelector('span.status');

    if (input === '') {
      passwordStatus.textContent = 'Password is required!';
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      if(this.isPassword(input, password, passwordStatus)){
        if (input === inputRepeat) {
          repeatStatus.textContent = '';
          repeatPassword.insertAdjacentHTML('beforeend', this._success);

          this._data.register['password'] = input;

          // console.log(this._data);

          repeatPassword.classList.add('success');

          // API Call
          this.activateFinish(form.parentElement);
        }
        else {
          repeatStatus.textContent = 'Passwords must match be equal!';
          repeatPassword.insertAdjacentHTML('beforeend', outerThis._failed);
          repeatPassword.classList.add('failed');

          setTimeout(() => {
            submitButton.innerHTML = `<span class="text">Continue</span>`
            submitButton.style.setProperty("pointer-events", 'auto');
          }, 1000);
        }
      }
      else {
        setTimeout(() => {
          submitButton.innerHTML = `<span class="text">Continue</span>`
          submitButton.style.setProperty("pointer-events", 'auto');
        }, 1000);
      }
    }
  }

  isPassword(input, password, passwordStatus) {
    const outerThis = this;
    // Regular expressions for each criterion
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialSymbolRegex = /[^A-Za-z0-9]/;

    // Check each criterion
    if (input.length < 6) {
      passwordStatus.textContent = "Password must be at least 6 characters long.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!uppercaseRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one uppercase letter.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!lowercaseRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one lowercase letter.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!digitRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one digit.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!specialSymbolRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one special symbol.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else {
      passwordStatus.textContent = '';
      password.insertAdjacentHTML('beforeend', this._success);

      password.classList.add('success');

      return true;
    }
  }

  activateFinish(contentContainer) {
    const outerThis = this;
    const stagesContainer = contentContainer.querySelector('.stages');
    const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');
    const finish = this.getRegSuccess();
    const form = contentContainer.querySelector('form');

    setTimeout(() => {
      form.remove();
      outerThis.nextStep('register', stagesContainer);
      stagesContainer.insertAdjacentHTML('afterend', finish)

      outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
    }, 1000);
  }

  activateLoginFinish(contentContainer, name) {
    const outerThis = this;
    const stagesContainer = contentContainer.querySelector('.stages');
    // const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');
    const finish = this.getLoginSuccess(name);
    const form = contentContainer.querySelector('form');

    setTimeout(() => {
      form.remove();
      outerThis.nextStep('login', stagesContainer);
      stagesContainer.insertAdjacentHTML('afterend', finish)
    }, 1000);
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
    return `
      ${this.getAnimation()}
      <div class="logon-container">
        ${this.getHeader()}
        ${this.getStages()}
        ${this.getWelcome()}
        ${this.getFooter()}
      </div>

      ${this.getStyles()}
    `
  }

  getAnimation() {
    return `
      <div class="area">
        <ul class="circles">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-git" viewBox="0 0 16 16">
              <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.457" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-word" viewBox="0 0 16 16">
              <path d="M5.485 6.879a.5.5 0 1 0-.97.242l1.5 6a.5.5 0 0 0 .967.01L8 9.402l1.018 3.73a.5.5 0 0 0 .967-.01l1.5-6a.5.5 0 0 0-.97-.242l-1.036 4.144-.997-3.655a.5.5 0 0 0-.964 0l-.997 3.655L5.485 6.88z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
              <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-braces" viewBox="0 0 16 16">
              <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-quote" viewBox="0 0 16 16">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              <path d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2" />
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
          </li>
        </ul>
      </div>
    `
  }

  getLoader() {
    return `
      <div id="loader-container">
				<div class="loader"></div>
			</div>
    `
  }

  getButtonLoader() {
    return `
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
    `
  }

  getBtnAltLoader() {
    return `
      <span id="btn-loader">
				<span class="loader-alt"></span>
			</span>
    `
  }

  getHeader() {
    return `
      <div class="head">
				<div class="logo">
					<h2 class="main">
						<span class="action">Join</span> - Colink</h2>
					<span class="slogan">Create and contribute to ideas that can change the world.</span>
				</div>
			</div>
    `
  }

  getStages() {
    return `
      <div class="stages welcome-stages">
				<span class="no stage first active">1</span>
				<span class="no stage second">2</span>
				<span class="no stage third">3</span>
				<span class="no stage fourth">4</span>
				<span class="stage done">
					<span class="left"></span>
					<span class="right"></span>
				</span>
			</div>
    `
  }

  getWelcome() {
    return `
      <div class="welcome">
				<p>
					Connect with your audience, amplify collaborations, and share your knowledge without limits.
					Build a vibrant project hub where ideas ignite and progress shines.
				</p>
				<a href="/login/" class="login">Login</a>
				<a href="/register/" class="register">Register</a>
				<div class="info">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill"
						viewBox="0 0 16 16">
						<path
							d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					By continuing you indicate that you agree to <a href="" class="aduki">aduki's</a> <a href="">Terms of Service</a> and <a href="">Privacy
						Policy</a>.
				</div>
			</div>
    `
  }

  getRegSuccess() {
    return `
      <div class="finish">
        <h2 class="title">Welcome!</h2>
				<p>
					Your account has been created successfully. Please log in into your account to start sharing great ideas.
				</p>
				<a href="/login/" class="login">Login</a>
			</div>
    `
  }

  getLoginSuccess(name) {
    return `
      <div class="finish login-success">
        <span>Welcome</span>
        <h2 class="title">${name}</h2>
				<p>
					You've successfully login into your account, click continue to proceed.
				</p>
				<a href="/login/" class="continue">Continue</a>
			</div>
    `
  }

  getRegistrationForm() {
    return `
      <form class="fields initial">
				<div class="field username">
					<div class="input-group">
						<label for="username" class="center">Choose your username</label>
						<input data-name="username" type="text" name="username" id="username" placeholder="Enter your desired username" required>
						<span class="status">Username is taken!</span>
					</div>
				</div>
				<div class="actions">
					<button type="button" class="action prev">
						<span class="text">Back</span>
					</button>
					<button type="submit" class="action next">
						<span class="text">Continue</span>
					</button>
				</div>
			</form>
    `
  }

  getUsernameFields() {
    return `
      <div class="field username">
				<div class="input-group">
				  <label for="username" class="center">Choose your username</label>
					<input data-name="username" type="text" name="username" id="username" placeholder="Enter your desired username" required>
					<span class="status">Username is taken!</span>
				</div>
			</div>
    `
  }

  getBioFields() {
    return `
      <div class="field bio">
				<div class="input-group firstname">
					<label for="firstname" class="center">First name</label>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					<input data-name="firstname" type="text" name="firstname" id="firstname" placeholder="Enter your first name" required>
					<span class="status">First name is required</span>
				</div>
				<div class="input-group lastname">
					<label for="lastname" class="center">Last name</label>
					<input data-name="lastname" type="text" name="lastname" id="lastname" placeholder="Enter your last name" required>
					<span class="status">Last name is required</span>
				</div>
				<div class="input-group email">
					<label for="email" class="center">Email</label>
					<input data-name="Email" type="email" name="email" id="email" placeholder="Enter your email" required>
					<span class="status">Email is required</span>
				</div>
			</div>
    `
  }

  getPasswordFields() {
    return `
      <div class="field password bio">
				<div class="input-group password">
					<label for="password" class="center">Password</label>
					<input data-name="password" type="password" name="password" id="password" placeholder="Enter your password" required>
					<span class="status">Password is required</span>
				</div>
				<div class="input-group repeat-password">
					<label for="password2" class="center">Repeat password</label>
					<input data-name="password2" type="password" name="password2" id="password2" placeholder="Repeat your password" required>
					<span class="status">Password is required</span>
				</div>
			</div>
    `
  }

  getLoginForm() {
    return `
      <form class="fields initial bio">
				<div class="field login bio">
					<div class="input-group user-key">
						<label for="user-key" class="center">Username or email</label>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
						</svg>
						<input data-name="user-key" type="text" name="user-key" id="user-key" placeholder="Enter username or email"
							required>
						<span class="status">Username or email is required</span>
					</div>
					<div class="input-group password">
						<label for="password" class="center">Password</label>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
						</svg>
						<input data-name="password" type="password" name="password" id="password" placeholder="Enter password"
							required>
						<span class="status">Password is required</span>
					</div>
				</div>
				<div class="actions">
					<button type="button" class="action prev">
						<span class="text">Back</span>
					</button>
					<button type="submit" class="action next">
						<span class="text">Login</span>
					</button>
				</div>
			</form>
    `
  }

  getFooter() {
    const newDate = new Date(Date.now());
    return `
      <ul class="footer">
				<li>
					<span class="dot"></span>
					<a href="" class="copyright">
						<span class="copy">&copy;</span>
						<span class="year">${newDate.getFullYear()}</span>
						aduki Inc.
					</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">About</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Community</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Privacy</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Terms</a>
				</li>
			</ul>
    `
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }
        *,
        *:after,
        *:before {
          box-sizing: border-box;
          font-family: var(--font-main), sans-serif;
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

        :host{
          /* border: 2px solid blue;*/
          background: rgb(15, 28, 112);
          width: 100%;
          min-height: 100vh;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #loader-container {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          background-color: #ffffff38;
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          -webkit-border-radius: inherit;
          -moz-border-radius: inherit;
        }

        #loader-container > .loader {
          width: 35px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader-alt {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        .area {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: 100vh;
        }

        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .circles li {
          position: absolute;
          z-index: 2;
          list-style: none;
          width: 45px;
          height: 45px;
          /* background: rgba(255, 255, 255, 0.2); */
          animation: animate 25s linear infinite;
          bottom: -150px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #21d02a60;

        }

        .circles li:nth-child(odd) {
          color: rgba(240, 156, 78, 0.678);
        }

        .circles li svg {
          width: 90%;
          height: 90%;
        }

        .circles li:nth-child(1) {
          left: 25%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }


        .circles li:nth-child(2) {
          left: 10%;
          width: 40px;
          height: 40px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        .circles li:nth-child(3) {
          left: 70%;
          width: 40px;
          height: 40px;
          animation-delay: 4s;
        }

        .circles li:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        .circles li:nth-child(5) {
          left: 65%;
          width: 45px;
          height: 45px;
          border-radius: 50px;
          animation-delay: 0s;
        }

        .circles li:nth-child(6) {
          left: 75%;
          width: 110px;
          height: 110px;
          animation-delay: 3s;
        }

        .circles li:nth-child(7) {
          left: 35%;
          width: 150px;
          height: 150px;
          animation-delay: 7s;
        }

        .circles li:nth-child(8) {
          left: 50%;
          width: 55px;
          height: 55px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        .circles li:nth-child(9) {
          left: 20%;
          width: 35px;
          height: 35px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        .circles li:nth-child(10) {
          left: 85%;
          width: 100px;
          height: 100px;
          animation-delay: 1s;
          animation-duration: 11s;
        }



        @keyframes animate {

          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }

          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }

        }

        .logon-container {
          /* border: 1px solid black; */
          background: #ffffffec;
          z-index: 3;
          padding: 20px;
          width: 700px;
          height: max-content;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 1px 1px 30px 0 rgba(0, 0, 0, 0.062);
          /* backdrop-filter: blur(10px); */
          /* -webkit-backdrop-filter: blur(10px); */
          border-radius: 10px;
          position: relative;
        }

        .logon-container >.head {
          /* border: 1px solid #404040; */
          background-color: transparent;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .logon-container >.head>.logo {
          /* border: 2px solid rgb(175, 84, 84); */
          max-height: max-content;
          position: relative;
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .logon-container >.head>.logo h2 {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 600;
          font-size: 1.8rem;
          color: transparent;
          background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-mono);
        }

        .logon-container >.head>.logo span.slogan {
          margin: 0;
          width: 100%;
          color: #808080;
          line-height: 1.4;
          font-family: var(--font-mono);
          font-size: 1rem;
          font-style: italic;
          text-align: center;
        }

        .logon-container > .stages {
          /*border: 1px solid #404040;*/
          background-color: transparent;
          height: max-content;
          width: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 10px 0 10px 0;
        }

        .logon-container>.stages span.done {
          background: linear-gradient(0deg, rgba(57, 56, 56, 0.1) 0%, rgba(57, 56, 56, 0.3) 100%);
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container>.stages span.done > span {
          display: inline-block;
          height: 3px;
          width: 8px;
          position: absolute;
          background-color: #ffffff;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        .logon-container>.stages span.done>span.left {
          top: 15px;
          left: 7px;
          rotate: 45deg;
        }

        .logon-container>.stages span.done>span.right {
          rotate: -45deg;
          left: 11px;
          width: 14px;
        }

        .logon-container>.stages span.done.active {
          background: rgb(223, 121, 26);
          background: linear-gradient(0deg, rgb(223, 121, 26) 0%, rgb(240, 156, 78) 100%);
          background-color: rgb(247, 145, 162);
        }

        .logon-container > .stages span.no {
          /* border: 1px solid red; */
          text-align: center;
          font-weight: 600;
          font-size: 1.2rem;
          padding: 2px;
          background: linear-gradient(0deg, rgba(57, 56, 56, 0.1) 0%, rgba(57, 56, 56, 0.3) 100%);
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container > .stages.login span.no.fourth,
        .logon-container > .stages.login span.no.third {
          display: none;
        }

        .logon-container > .stages.welcome-stages span.no.fourth,
        .logon-container > .stages.welcome-stages span.no.third {
          display: none;
        }

        .logon-container > .stages.register span.no.fourth,
        .logon-container > .stages.register span.no.third {
          display: none;
        }

        .logon-container > .stages span.no.active {
          background: linear-gradient(0deg, #18A565 0%, #21D029 100%);
        }

        .logon-container > .welcome {
          width: 90%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          row-gap: 10px;
          justify-content: center;
        }

        .logon-container > .finish {
          width: 90%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .logon-container > .finish > h2 {
          margin: 10px 0;
          text-align: center;
          color: #404040;
          line-height: 1.4;
          font-size: 1.5rem;
        }

        .logon-container > .finish > p,
        .logon-container>.welcome > p {
          grid-column: 1/3;
          margin: 0;
          text-align: center;
          color: #404040;
          line-height: 1.4;
          font-size: 1.1rem;
        }

        .logon-container > .finish > a,
        .logon-container >.welcome > a {
          background: linear-gradient(0deg,      #18A565 0%,      #21D029 100%);
          text-decoration: none;
          padding: 10px 20px;
          cursor: pointer;
          margin: 20px 0;
          width: 150px;
          justify-self: center;
          text-align: center;
          color: #ffffff;
          border: none;
          font-size: 1.15rem;
          font-weight: 500;
          border-radius: 15px;
        }

        .logon-container > .welcome > a:last-of-type {
          background:  rgb(223, 121, 26);
          background: linear-gradient(0deg, rgb(223, 121, 26) 0%, rgb(240, 156, 78) 100%);
          background-color: rgb(247, 145, 162);
        }

        .logon-container >.welcome > .info {
          /* border: 1px solid #606060; */
          grid-column: 1/3;
          /* margin: 0 0 0 20px; */
          text-align: center;
          color: #404040;
          line-height: 1.4;
        }


        .logon-container > .welcome > .info svg {
          margin: 0 0 -3px 0;
          color: #18A565;
          width: 18px;
          height: 18px;
        }

        .logon-container > .welcome > .info .aduki {
          color: transparent;
          background: linear-gradient(103.53deg, #18A565 -6.72%, #21D029 109.77%);
          background-clip: text;
          -webkit-background-clip: text;
          font-weight: 400;
        }

        .logon-container>.welcome>.info a {
          color: #808080;
          font-style: italic;
          font-size: 0.9em;
        }

        .logon-container>.welcome>.info a:hover {
          color: transparent;
          text-decoration: underline;
          background:  rgb(223, 121, 26);
          background: linear-gradient(0deg, rgb(223, 121, 26) 0%, rgb(240, 156, 78) 100%);
          background-color: rgb(247, 145, 162);
          background-clip: text;
          -webkit-background-clip: text;

        }

        .logon-container >.fields {
          margin: 0 0 20px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .logon-container >.fields .field.bio{
          /* border: 1px solid black; */
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: center;
          column-gap: 20px;
          row-gap: 20px;
        }

        .logon-container >.fields>.field {
          /* border: 1px solid black; */
          width: 90%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 2px;
        }

        .logon-container >.fields.center>.field {
          align-items: center;
        }


        .logon-container >.fields .field .input-group {
          /* border: 1px solid black; */
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: #404040;
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        .logon-container >.fields .field.bio .input-group {
          width: 100%;
        }

        .logon-container >.fields .field.bio .input-group.email {
          grid-column: 1/3;
          width: 100%;
        }

        .logon-container>.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        .logon-container>.fields .field .input-group > svg {
          display: none;
        }

        .logon-container>.fields .field .input-group.success > svg {
          display: inline-block;
        }
        .logon-container >.fields .field  .input-group.failed > svg {
          display: inline-block;
        }

        .logon-container>.fields .field .input-group.success > svg {
          color: #18A565;
        }

        .logon-container >.fields .field  .input-group.failed > svg {
          color: #ec4b19;
        }

        /* .logon-container >.fields.center .field .input-group {
          align-items: center;
        } */

        .logon-container >.fields label {
          /* border: 1px solid black; */
          padding: 0 0 5px 0;
          color: #404040;
        }

        .logon-container >.fields .field.bio label{
          padding: 0 0 0 5px;
        }

        .logon-container >.fields label {
          color: #666666;
          font-size: 1.1rem;
          font-family: var(--font-main),sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        .logon-container >.fields .field input {
          border: 1px solid #80808037;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: #404040;
        }

        /* .logon-container >.fields.center .field input {
          width: 400px;
        } */

        .logon-container >.fields .field input:focus {
          border: 1px solid #08b86f60;
        }

        .logon-container >.fields .field  .input-group.success input,
        .logon-container >.fields .field  .input-group.success input:focus {
          border: 1px solid #08b86f60;
        }

        .logon-container >.fields .field  .input-group.failed input,
        .logon-container >.fields .field  .input-group.failed input:focus {
          border: 1px solid  #ec4a1965;
        }

        .logon-container >.fields .field  .input-group.success input {
          color: #18A565;
        }

        .logon-container>.fields .field .input-group.failed input {
          color: #ec4b19;
        }

        .logon-container >.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          /* background-color: #ffffff; */
          background-color: #eaf3ff;
          padding: 0 5px;
        }

        .logon-container >.fields .field span.status {
          color: #ec4b19;
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        .logon-container>.fields .field .input-group.failed span.status {
          color: #ec4b19;
          font-size: 0.8rem;
          display: inline-block;
        }

        .logon-container >.fields .field  .input-group.success span.status {
          color: #18A565;
          font-size: 0.8rem;
          display: inline-block;
        }

        .logon-container >.fields .field  .input-group.success span.status {
          display: none;
        }

        .logon-container>.fields .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          margin: 20px 0 0 0;
        }

        .logon-container > .fields .actions > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border: none;
          border-radius: 15px;
          font-family: var(--font-main),sans-serif;
          line-height: 1.2;
          font-size: 1.2rem;
          font-weight: 500;
          color: #404040;
          width: 120px;
          padding: 8px 10px;
          height: 40px;
          cursor: pointer;
          position: relative;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        .logon-container > .fields .actions > .action.prev {
          background: linear-gradient(0deg, rgba(57, 56, 56, 0.087) 0%, rgba(57, 56, 56, 0.187) 100%);
        }

        .logon-container > .fields .actions > .action.prev svg path {
          fill: #404040;
        }

        .logon-container > .fields .actions > .action.next {
          color: #ffffff;
          background: #ad5389;
          background: linear-gradient(0deg, rgba(20, 167, 62, 1) 0%, rgba(102, 247, 113, 1) 100%);
          background-color: rgb(247, 145, 162);
        }

        .logon-container >.fields .actions > .action.next svg path {
          fill: #ffffff;
        }

        .logon-container>.fields .actions>.action.disabled {
          /*background: #80808023;*/
          pointer-events: none;
          /*opacity: .9;*/
        }


        /* Logon Footer */
        .logon-container >.footer {
          border-top: 1px solid #80808027;
          margin: 10px 0 0 0;
          width: 100%;
          padding: 10px 0 10px 0;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        .logon-container > .footer > li {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          color: #808080;
          cursor: pointer;
        }

        .logon-container > .footer > li span.dot {
          display: inline-block;
          margin: 2px 0 0 0;
          width: 5px;
          height: 5px;
          background-color: #808080;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container > .footer > li a {
          color: inherit;
          /* font-family: var(--font-mono); */
          line-height: 1.4;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 400;
        }

        .logon-container > .footer > li:hover {
          color: #21D029;
          text-decoration: underline;
        }

        .logon-container > .footer > li:hover span.dot {
          background-color: #21D029;
        }

        .logon-container > .footer > li a.copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-family: var(--font-mono),monospace;
        }

        .logon-container > .footer > li a.copyright .year {
          font-family: var(--font-main),sans-serif;
          font-size: 0.9em;
          padding: 0 5px 0 2px;
          font-weight: 500;
        }

      </style>
    `;
  }
}