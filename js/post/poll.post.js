export default class QuickPost extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Get array of objects for poll options and parse to Array
    this._options = Array.from(JSON.parse(this.getAttribute('options')));

    // Get the end time for the poll
    this._endTime = new Date(this.getAttribute('end-time'));

    // Check if user has voted and convert to boolean
    this._voted = true ? this.getAttribute('voted') === 'true' : false;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

    this.openForm();

    // scroll the likes
    this.scrollLikes();

    // activate the like button
    this.likePost();

    // Open share overlay
    this.openShare();

    // Update poll expiry time per second
    this.updatePollTime();

    // Check if user has voted
    if (this._voted) {
      // disable all inputs
      this.disableInputs();
    }
    else {
      // Listen for checked radio button
      this.listenForChecked();
    }
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

  // Disable all inputs
  disableInputs = () => {
    // Select radio inputs
    const inputs = this.shadowObj.querySelectorAll('input[type="radio"]');

    // Loop through the inputs and disable them
    if (inputs) {
      inputs.forEach(input => {
        input.disabled = true;
      });
    }
  }

  // Listen for checked radio button
  listenForChecked = () => {
    const outerThis = this;
    // Get the poll options container
    const pollOptions = this.shadowObj.querySelector('.poll-options');

    // Check if the poll options container exists
    if (pollOptions) {
      // Get all the poll inputs
      const inputs = pollOptions.querySelectorAll('input[type="radio"]');

      // Add event listener to the poll options container
      inputs.forEach(input => {
        // add event listener to the input
        input.addEventListener('change', e => {
          // prevent the default action
          e.preventDefault();

          // prevent the propagation of the event
          e.stopPropagation();

          // Get the selected option
          const selectedOption = e.target.parentElement;

          // Get the selected option name
          const selectedOptionName = selectedOption.dataset.name;

          // Get the new options
          const newOptions = outerThis._options.map(option => {
            // Check if the option is the selected option
            if (option.name === selectedOptionName) {
              return { ...option, votes: option.votes + 1 };
            }
            else {
              return option;
            }
          });

          // Update the options
          outerThis._options = newOptions;

          // Calculate the total percentage for each option based on the total votes
          const totalVotes = newOptions.reduce((acc, option) => acc + option.votes, 0);

          // Calculate the percentage for each option
          newOptions.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

          // update votes attribute in the selected option
          let votes = outerThis.parseToNumber(selectedOption.getAttribute('votes'));
          console.log(votes);
          selectedOption.setAttribute('votes', votes + 1);
          console.log(selectedOption.getAttribute('votes'));

          // Update the selected attribute
          outerThis.setAttribute('selected', selectedOptionName);

          // Update the voted attribute
          outerThis.setAttribute('voted', 'true');

          // Update the options attribute
          outerThis.setAttribute('options', JSON.stringify(newOptions));

          // update the fill width for each option fill element
          outerThis.updateFillWidth();

          // update the total votes element
          outerThis.updateTotalVotes();

          // disable all inputs after voting
          outerThis.disableInputs();
        });
      });

    }
  }

  // Update width of the fill element for each option
  updateFillWidth = () => {
    // Get the poll options container
    const pollOptions = this.shadowObj.querySelector('.poll-options');

    // Check if the poll options container exists
    if (pollOptions) {
      // Get all the poll options
      const options = pollOptions.querySelectorAll('.poll-option');

      // Loop through the options and update the fill width
      options.forEach(option => {
        // Get the fill element
        const fill = option.querySelector('.fill');

        // Get the votes for the option
        const votes = this.parseToNumber(option.getAttribute('votes'));

        // Get the total votes
        const totalVotes = this._options.reduce((acc, option) => acc + option.votes, 0);

        // Check if the current option has the highest number of votes
        const isHighest = votes === Math.max(...this._options.map(option => option.votes));

        // add the high class if the option has the highest number of votes
        if (isHighest) {
          option.classList.add('high');
        }

        // Calculate the percentage for the option
        const percentage = (votes / totalVotes) * 100;

        // Update the fill width
        fill.style.width = `${percentage}%`;

        // Update the percentage text
        let html = `
          <span class="percentage">${percentage.toFixed(1)}%</span>
        `

        // Insert the html beforeend of the label
        option.querySelector('label').insertAdjacentHTML('beforeend', html);
      });
    }
  }

  // Update total votes element
  updateTotalVotes = () => {
    // Select the total votes element
    const totalVotes = this.shadowObj.querySelector('.poll .info > .total > span.total');

    if (totalVotes) {
      // Get the total votes
      const votes = this._options.reduce((acc, option) => acc + option.votes, 0);

      // Convert the total votes to a string with commas
      const votesStr = this.numberWithCommas(votes);

      // Update the total votes
      totalVotes.textContent = votesStr;
    }
  }

  // Update poll expiry time per second
  updatePollTime = () => {
    // select the poll time element
    const pollTime = this.shadowObj.querySelector('.poll span.count');

    const endTime = this._endTime;

    // Convert the end time to local time
    const localEndTime = new Date(endTime.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

    // Get the current time
    const currentTime = new Date(Date.now());

    // Get the difference between the current time and the end time
    let timeDiff = localEndTime - currentTime;

    // Check if the poll time element exists
    if (pollTime) {
      // Check if the time difference is less than 0
      if (timeDiff <= 0) {
        pollTime.textContent = "Poll ended";
      }
      else {
        // Update the poll time every second
        setInterval(() => {
          pollTime.textContent = this.getRemainingTime(timeDiff);

          // update the time difference
          timeDiff = localEndTime - new Date(Date.now());
        }, 1000);
      }
    }
  }

  // Get remaining time for the poll
  getRemainingTime = (timeDiff) => {
    // get the number of hours if any in the time difference
    let hours = Math.floor(timeDiff / (1000 * 60 * 60));

    // Get the number of minutes if any in the time difference excluding days and hours
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Get the number of seconds if any in the time difference excluding days, hours and minutes
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);


    // Check if total hours is less than 10, add a leading zero
    hours = hours < 10 ? `0${hours}` : hours;

    // Check if minutes is less than 10, add a leading zero
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    // Check if seconds is less than 10, add a leading zero
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }

  // fn to like a post
  likePost = () => {
    // Select like button
    const likeButton = this.shadowObj.querySelector('.action.like');

    // If like button, add event listener
    if (likeButton) {
      // Get the svg node
      const svg = likeButton.querySelector('svg');


      likeButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Toggle the active class
        likeButton.classList.toggle('true');

        // Get the current like status
        const liked = this.getAttribute('liked') || 'false';

        // Get the total likes
        const likes = this.getAttribute('likes') || 0;

        // Parse the likes to an integer
        const totalLikes = this.parseToNumber(likes);

        // add scaling to the svg: reduce the size of the svg
        svg.style.transform = 'scale(0.8)';

        // Add a transition to the svg
        svg.style.transition = 'transform 0.2s ease-in-out';

        // Check if the user has liked the post
        if (liked === 'true') {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes - 1);

          // Set the new value of liked
          this.setAttribute('liked', 'false');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
            `;
            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);
        }
        else {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes + 1);

          // Set the new value of liked
          this.setAttribute('liked', 'true');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
            `;

            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);
        }

        // Re-render the component
        // this.render();

        // Scroll the likes
        this.scrollLikes();
      });
    }
  }

  // fn to scroll likes numbers: bring the appropriate number into view
  scrollLikes = () => {
    // Check if user has liked the post
    const liked = this.getAttribute('liked') || 'false';

    // Get the numbers container
    const numbers = this.shadowObj.querySelector('.numbers.likes');

    // Get the previous and next elements
    if (numbers) {
      const prevElement = numbers.querySelector('#prev');
      const nextElement = numbers.querySelector('#next');

      // Check if the elements exist
      if (prevElement && nextElement) {
        // Get the height of the container
        const containerHeight = numbers.clientHeight;

        // Get the height of the previous and next elements
        // const prevHeight = prevElement.clientHeight;
        const nextHeight = nextElement.clientHeight;

        // If the user has liked the post, scroll to the next element
        if (liked === 'true') {
          // Scroll to the next element
          // numbers.scrollTo({ top: nextElement.offsetTop - containerHeight + nextHeight, behavior: 'smooth' });
          // numbers.scrollTo({ top: nextElement.offsetTop - containerHeight + nextHeight, behavior: 'smooth' });

          // Scroll to the next element using custom scrollTo
          this.scrollTo(numbers, nextElement.offsetTop - containerHeight + nextHeight, 200);
        }
        else {
          // Scroll to the top of the container
          // numbers.scrollTo({ top: 0, behavior: 'smooth' });

          // Scroll to the top of the container using custom scrollTo
          this.scrollTo(numbers, 0, 200);
        }
      }
    }
  }

  // Define the easeInOutQuad function for smoother scrolling
  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  // Create a custom smooth scrollTo to accommodate chrome and other browsers
  scrollTo = (element, to, duration) => {
    const outThis = this;

    // Get the current scroll position
    let start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    // Create the animation
    const animateScroll = function () {
      currentTime += increment;
      let val = outThis.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  // fn to open the share overlay
  openShare = () => {
    // Get share button
    const shareButton = this.shadowObj.querySelector('.action.share');

    // Check if the overlay exists
    if (shareButton) {
      // Get overlay
      const overlay = shareButton.querySelector('.overlay');

      // Select close button
      const closeButton = shareButton.querySelector('.close');

      // Add event listener to the close button
      closeButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Remove the active class
        overlay.classList.remove('active');
      });

      // Add event listener to the share button
      shareButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Toggle the overlay
        overlay.classList.add('active');

        // add event to run once when the overlay is active: when user click outside the overlay
        document.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          // Check if the target is not the overlay
          if (!overlay.contains(e.target)) {

            // Remove the active class
            overlay.classList.remove('active');
          }
        }, { once: true });
      });
    }
  }

  formatNumber = n => {
    if (n >= 0 && n <= 999) {
      return n.toString();
    } else if (n >= 1000 && n <= 9999) {
      const value = (n / 1000).toFixed(2);
      return `${value}k`;
    } else if (n >= 10000 && n <= 99999) {
      const value = (n / 1000).toFixed(1);
      return `${value}k`;
    } else if (n >= 100000 && n <= 999999) {
      const value = (n / 1000).toFixed(0);
      return `${value}k`;
    } else if (n >= 1000000 && n <= 9999999) {
      const value = (n / 1000000).toFixed(2);
      return `${value}M`;
    } else if (n >= 10000000 && n <= 99999999) {
      const value = (n / 1000000).toFixed(1);
      return `${value}M`;
    } else if (n >= 100000000 && n <= 999999999) {
      const value = (n / 1000000).toFixed(0);
      return `${value}M`;
    } else {
      return "1B+";
    }
  }

  parseToNumber = num_str => {
    // Try parsing the string to an integer
    const num = parseInt(num_str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  // fn to open the share overlay
  openShare = () => {
    // Get share button
    const shareButton = this.shadowObj.querySelector('.action.share');

    // Check if the overlay exists
    if (shareButton) {
      // Get overlay
      const overlay = shareButton.querySelector('.overlay');

      // Select close button
      const closeButton = shareButton.querySelector('.close');

      // Add event listener to the close button
      closeButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Remove the active class
        overlay.classList.remove('active');
      });

      // Add event listener to the share button
      shareButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Toggle the overlay
        overlay.classList.add('active');

        // add event to run once when the overlay is active: when user click outside the overlay
        document.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          // Check if the target is not the overlay
          if (!overlay.contains(e.target)) {

            // Remove the active class
            overlay.classList.remove('active');
          }
        }, { once: true });
      });
    }
  }

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatDateWithRelativeTime = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
  }

  openForm = () => {
    const writeBtn = this.shadowObj.querySelector('span.action.write');
    const formContainer = this.shadowObj.querySelector('div.form-container');
    if (writeBtn && formContainer) {
      const formElement = this.getForm();

      writeBtn.addEventListener('click', event => {
        event.preventDefault();

        // console.log(writeContainer);
        // console.log(formElement);

        // writeContainer.classList.toggle('active');
        if (writeBtn.classList.contains('open')) {
          writeBtn.classList.remove('open');

          // adjust the margin top of the form container
          formContainer.style.setProperty('margin-top', '0');
          formContainer.innerHTML = '';
        }
        else {
          writeBtn.classList.add('open');
          // adjust the margin top of the form container
          formContainer.style.setProperty('margin-top', '15px');

          // Add the form to the form container
          formContainer.insertAdjacentHTML('beforeend', formElement);
        }
      })
    }
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
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getPoll()}
      ${this.getFooter()}
      <div class="form-container"></div>
    `;
  }

  getHeader = () => {
    return /*html*/`
      <div class="meta opinion">
        <span class="time">
          <time class="published" datetime="${this.getAttribute('time')}">
            ${this.formatDateWithRelativeTime(this.getAttribute('time'))}
          </time>
          <span class="sp">•</span>
        </span>
        <div class="author">
          <span class="sp">by</span>
          <div class="author-name">
            <a href="" class="link action-link">${this.getAttribute('author-id')}</a>
          </div>
        </div>
      </div>
    `
  }

  getPoll = () =>  {
    // Calculate the total percentage for each option based on the total votes
    const totalVotes = this._options.reduce((acc, option) => acc + option.votes, 0);

    // convert the total votes to a string with commas
    const totalVotesStr = this.numberWithCommas(totalVotes);

    return /*html*/`
      <div class="poll">
        <div class="poll-options">
          ${this.getPollOptions()}
        </div>

        <span class="info">
          <span class="total">
            <span class="total">${totalVotesStr}</span>
            <span class="text">votes</span>
          </span>
          <span class="sp">•</span>
          <span class="count">00:00:00</span>
        </span>
      </div>
    `
  }

  // Get the options for the poll
  getPollOptions = () => {
    // Check if poll has ended
    const pollEnded = new Date(Date.now()) > this._endTime;

    // Check if poll has ended
    if (pollEnded) {
      return this.getEndedOptions();
    }
    // Check if user has voted
    else if (this._voted) {
      return this.getVotedOptions();
    }
    else {
      return this.getOptions();
    }
  }

  getEndedOptions = () => {
    // Get the options
    const options = this._options;

    // get selected option
    const selected = this.getAttribute('selected');

    // Calculate the total percentage for each option based on the total votes
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

    // Calculate the percentage for each option
    options.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

    // get the option highest number of votes
    const highestVotes = Math.max(...options.map(option => option.votes));

    // loop through the options and return the html
    return options.map((option, index) => {
      // Check which option is selected
      const isSelected = selected === option.name;

      // Check if the option has the highest number of votes
      const isHighest = option.votes === highestVotes;

      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option ${isSelected ? 'selected' : ''} ${isHighest ? 'high' : ''}">
          <input type="radio" name="poll" id="poll-${index + 1}" ${isSelected ? 'checked' : ''} disabled>
          <label for="poll-${index + 1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="${option.percentage.toFixed(2)}%" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
            <span class="percentage">${option.percentage.toFixed(1)}%</span>
          </label>
        </div>
      `;
    }).join('');
  }

  getOptions = () => {
    // get the options
    const options = this._options;

    // Map through the options and return the html
    return options.map((option, index) => {
      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option">
          <input type="radio" name="poll" id="poll-${index + 1}">
          <label for="poll-${index + 1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="0" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
          </label>
        </div>
      `;
    }).join('');
  }

  getVotedOptions = () => {
    // Get the options
    const options = this._options;

    // get selected option
    const selected = this.getAttribute('selected');

    // Calculate the total percentage for each option based on the total votes
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

    // Calculate the percentage for each option
    options.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

    // get the option highest number of votes
    const highestVotes = Math.max(...options.map(option => option.votes));

    // loop through the options and return the html
    return options.map((option, index) => {
      // Check which option is selected
      const isSelected = selected === option.name;

      // Check if the option has the highest number of votes
      const isHighest = option.votes === highestVotes;

      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option ${isSelected ? 'selected' : ''} ${isHighest ? 'high' : ''}">
          <input type="radio" name="poll" id="poll-${index+1}" ${isSelected ? 'checked' : ''}>
          <label for="poll-${index+1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="${option.percentage.toFixed(2)}%" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
            <span class="percentage">${option.percentage.toFixed(1)}%</span>
          </label>
        </div>
      `;
    }).join('');
  }

  getContent = () => {
    return `
      <div class="content">
        ${this.innerHTML}
      </div>
    `
  }

  getFooter = () => {
    return /* html */`
      <div class="actions stats">
        <span class="action write">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00016 1.83337C3.3755 1.83337 1.8335 3.37537 1.8335 8.00004C1.8335 12.6247 3.3755 14.1667 8.00016 14.1667C12.6248 14.1667 14.1668 12.6247 14.1668 8.00004" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0189 2.86915V2.86915C12.3569 2.28315 11.3456 2.34449 10.7596 3.00649C10.7596 3.00649 7.84694 6.29649 6.83694 7.43849C5.8256 8.57982 6.56694 10.1565 6.56694 10.1565C6.56694 10.1565 8.23627 10.6852 9.23227 9.55982C10.2289 8.43449 13.1563 5.12849 13.1563 5.12849C13.7423 4.46649 13.6803 3.45515 13.0189 2.86915Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0061 3.86719L12.4028 5.98919" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.getOpinions()}
          <span class="line"></span>
        </span>
        ${this.getLike(this.getAttribute('liked'))}
        ${this.getViews()}
        <span class="action share">
          <span class="icon">
            <span class="sp">•</span>
            <span class="sp">•</span>
          </span>
          ${this.getShare()}
        </span>
      </div>
		`
  }

  getOpinions = () => {
    // Get total opinions and parse to integer
    const opinions = this.getAttribute('opinions') || 0;

    // Convert the opinions to a number
    const totalOpinions = this.parseToNumber(opinions);

    //  format the number
    const opinionsFormatted = this.formatNumber(totalOpinions);

    return /*html*/`
      <span class="numbers">
        <span id="prev">${opinionsFormatted}</span>
      </span>
    `
  }

  getViews = () => {
    // Get total views and parse to integer
    const views = this.getAttribute('views') || 0;

    // Convert the views to a number
    const totalViews = this.parseToNumber(views);

    // Format the number
    const viewsFormatted = this.formatNumber(totalViews);

    return /*html*/`
      <span class="stat views">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
          <path d="M8.75 1.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Zm-3.5 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z"></path>
        </svg>
        <span class="numbers">
          <span id="prev">${viewsFormatted}</span>
        </span>
      </span>
    `
  }

  getLike = (liked) => {
    if (liked === 'true') {
      return /*html*/`
        <span class="action like true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
          </svg>
          <span class="numbers likes">
            ${this.getLikeNumbers()}
          </span>
        </span>
			`
    }
    else {
      return /*html*/`
        <span class="action like">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
          </svg>
          <span class="numbers likes">
            ${this.getLikeNumbers()}
          </span>
        </span>
			`
    }
  }

  getLikeNumbers = () => {
    // Get total likes and parse to integer
    const likes = this.getAttribute('likes') || 0;
    const totalLikes = this.parseToNumber(likes);

    // Format the number
    const likesFormatted = this.formatNumber(totalLikes);

    // Check if user has liked the post
    const liked = this.getAttribute('liked') || 'false';

    // Check if the user has liked the post
    if (liked === 'true') {
      // next value is the current value
      const nextValue = likesFormatted;

      // Get the previous value by subtracting 1, if the value is less than 0, return 0: wrap in formatNumber
      const prevValue = this.formatNumber(totalLikes - 1 >= 0 ? totalLikes - 1 : 0);


      // Return the HTML for prev and next values
      return /*html*/`
        <span id="prev">${prevValue}</span>
        <span id="next">${nextValue}</span>
      `
    }
    else {
      // next value is the current value + 1
      const nextValue = this.formatNumber(totalLikes + 1);

      // the previous value is the current value
      const prevValue = likesFormatted;

      // Return the HTML for prev and next values
      return /*html*/`
        <span id="prev">${prevValue}</span>
        <span id="next">${nextValue}</span>
      `
    }
  }

  getShare = () => {
    return /* html */`
      <div class="overlay">
        <span class="close"></span>
        <span class="options">
          <span class="option link">
            <span class="text">Copy link</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 640 512">
              <path d="M580.3 267.2c56.2-56.2 56.2-147.3 0-203.5C526.8 10.2 440.9 7.3 383.9 57.2l-6.1 5.4c-10 8.7-11 23.9-2.3 33.9s23.9 11 33.9 2.3l6.1-5.4c38-33.2 95.2-31.3 130.9 4.4c37.4 37.4 37.4 98.1 0 135.6L433.1 346.6c-37.4 37.4-98.2 37.4-135.6 0c-35.7-35.7-37.6-92.9-4.4-130.9l4.7-5.4c8.7-10 7.7-25.1-2.3-33.9s-25.1-7.7-33.9 2.3l-4.7 5.4c-49.8 57-46.9 142.9 6.6 196.4c56.2 56.2 147.3 56.2 203.5 0L580.3 267.2zM59.7 244.8C3.5 301 3.5 392.1 59.7 448.2c53.6 53.6 139.5 56.4 196.5 6.5l6.1-5.4c10-8.7 11-23.9 2.3-33.9s-23.9-11-33.9-2.3l-6.1 5.4c-38 33.2-95.2 31.3-130.9-4.4c-37.4-37.4-37.4-98.1 0-135.6L207 165.4c37.4-37.4 98.1-37.4 135.6 0c35.7 35.7 37.6 92.9 4.4 130.9l-5.4 6.1c-8.7 10-7.7 25.1 2.3 33.9s25.1 7.7 33.9-2.3l5.4-6.1c49.9-57 47-142.9-6.5-196.5c-56.2-56.2-147.3-56.2-203.5 0L59.7 244.8z" />
            </svg>
          </span>
          <span class="option more">
            <span class="text">Share options</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"  fill="currentColor">
            <path d="M15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a2.994 2.994 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 13.5 13Zm-9-5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 4.5 8Zm9-5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 13.5 3Z"></path>
            </svg>
          </span>
          <span class="option code">
            <span class="text">Embed code</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
          </span>
        </span>
      </div>
    `
  }

  getForm = () => {
    return `
      <form-container type="opinion"></form-container>
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
        font-size: 16px;
        border-bottom: var(--story-border);
        font-family: var(--font-main), sans-serif;
        padding: 15px 0 10px;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 0;
      }

      .meta {
        height: 25px;
        display: flex;
        position: relative;
        color: var(--gray-color);
        align-items: center;
        font-family: var(--font-mono),monospace;
        gap: 5px;
        font-size: 0.9rem;
      }

      .meta > span.time {
        font-family: var(--font-main), sans-serif;
        font-size: 0.85rem;
      }

      .meta > .author {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .meta div.author-name {
        display: flex;
        align-items: center;
      }

      .meta div.author-name > a {
        text-decoration: none;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .meta a.opinion-link {
        text-decoration: none;
        color: transparent;
        background-image: var(--alt-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .content {
        display: flex;
        flex-flow: column;
        color: var(--text-color);
        line-height: 1.4;
        gap: 0;
        margin: 0;
        padding: 0;
      }

      .content p {
        margin: 0 0 10px 0;
        padding: 0;
        line-height: 1.4;
        font-family: var(--font-text), sans-serif;
      }

      .content p:last-of-type {
        margin: 0;
      }

      .content a {
        cursor: pointer;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .content a:hover {
        text-decoration-color: var(--anchor-active) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor-active) !important;
      }

      .content ul,
      .content ol {
        margin: 10px 0 0 20px;
        line-height: 1.4;
        color: var(--font-text);
        font-family: var(--font-text), sans-serif;
      }

      .content ul a,
      .content ol a {
        background: unset;
        color:var(--font-text);
        font-weight: 500;
        text-decoration-color: var(--anchor) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor) !important;
      }

      .content ul a:hover,
      .content ol a:hover {
        text-decoration-color: #4b5563bd !important;
        -moz-text-decoration-color: #4b5563bd !important;
      }

      .poll {
        padding: 10px 0 5px 0;
        display: flex;
        flex-flow: column;
        gap: 15px;
      }

      .poll > .poll-options {
        padding: 0;
        display: flex;
        flex-flow: column;
        gap: 8px;
      }

      .poll > .poll-options > .poll-option {
        padding: 0;
        display: flex;
        flex-flow: row;
        gap: 0;
      }

      .poll > .poll-options > .poll-option label {
        display: inline-block;
        position: relative;
        height: 30px;
        width: 100%;
        cursor: pointer;
        line-height: 1.5;
        border: var(--story-border);
        padding: 0;
        font-family: var(--font-text), sans-serif;
        color: var(--gray-color);
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -ms-border-radius: 10px;
        -o-border-radius: 10px;
      }

      .poll > .poll-options > .poll-option label span.text {
        /* border: var(--story-border-mobile); */
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: inline-block;
        z-index: 1;
        width: 100%;
        height: max-content;
        padding: 2px 8px;
      }

      .poll > .poll-options > .poll-option label svg {
        position: absolute;
        display: none;
        right: 50px;
        top: 50%;
        z-index: 3;
        transform: translateY(-50%);
        color: var(--gray-color);
      }

      .poll > .poll-options > .poll-option label span.percentage {
        position: absolute;
        right: 5px;
        top: 50%;
        z-index: 2;
        transform: translateY(-50%);
        font-family: var(--font-main), sans-serif;
        color: var(--gray-color);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .poll > .poll-options > .poll-option.high label span.percentage {
        font-weight: 600;
        color: transparent;
        background: var(--second-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .poll > .poll-options > .poll-option label span.fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        display: inline-block;
        z-index: 0;
        height: 100%;
        background: var(--poll-background);
        border-top-left-radius: 9px;
        border-bottom-left-radius: 9px;
        transition: width 0.3s ease-in-out;
        -webkit-transition: width 0.3s ease-in-out;
        -moz-transition: width 0.3s ease-in-out;
        -ms-transition: width 0.3s ease-in-out;
        -o-transition: width 0.3s ease-in-out;
      }

      .poll > .poll-options > .poll-option input[type="radio"] {
        display: none;
      }

      .poll > .poll-options > .poll-option.high label span.fill {
        background: var(--poll-linear);
      }

      .poll > .poll-options > .poll-option.high label span.text {
        font-weight: 500;
        color: var(--title-color);
      }

      .poll > .poll-options > .poll-option input[type="radio"]:checked + label svg {
        display: inline-block;
      }

      .poll > .poll-options > .poll-option.high input[type="radio"]:checked + label svg {
        display: inline-block;
        color: var(--alt-color);
      }

      .poll > .info {
        padding: 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: start;
        color: var(--gray-color);
        gap: 5px;
        font-size: 0.95rem;
      }

      .poll > .info .sp {
        font-size: 0.83rem;
        margin: 2px 0 0 0;
      }

      .poll > .info > .total .total,
      .poll > .info .count {
        font-family: var(--font-main), sans-serif;
        font-weight: 500;
        font-size: 0.75rem;
        display: inline-block;
        margin: 3px 0 0 0;
      }

      .stats.actions {
        /* border: var(--input-border); */
        padding: 5px 0 0 0;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0;
      }

      .stats.actions > span.write.action {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        font-family: var(--font-text) sans-serif;
        font-size: 0.95rem;
        justify-content: start;
        gap: 5px;
        padding: 5px 5px;
        height: 30px;
        border-radius: 50px;
        font-weight: 500;
        font-size: 1rem;
        color: var(--gray-color);
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        -ms-border-radius: 50px;
        -o-border-radius: 50px;
      }

      .stats.actions > span.write.action > svg {
        width: 19px;
        height: 19px;
        margin: -2px 0 0 0;
      }

      .stats.actions > span.write.action span.line {
        background: var(--accent-linear);
        position: absolute;
        top: 30px;
        left: 13px;
        display: none;
        width: 3px;
        height: 20px;
        border-radius: 5px;
      }

      .stats.actions > span.write.action.open span.line {
        display: inline-block;
      }

      .stats.actions > span.write.action.open {
        color: var(--accent-color);
      }

      .stats.actions > span.write.action.open > span.numbers {
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats.actions > span.stat,
      .stats.actions > span.action {
        /* border: var(--input-border); */
        min-height: 35px;
        height: 30px;
        width: max-content;
        position: relative;
        padding: 5px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 1rem;
        font-weight: 400;
        /* color: var(--action-color); */
        color: var(--gray-color);
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        -ms-border-radius: 50px;
        -o-border-radius: 50px;
      }

      .stats.actions > span.stat.views {
        gap: 2px;
      }

      .stats.actions > span.stat.views {
        padding: 5px 5px;
      }

      .stats.actions > span:first-of-type {
        margin: 0 0 0 -7px;
      }

      .stats.actions > span.action.share {
        /* border: var(--input-border); */
        min-height: 35px;
        height: 35px;
        width: 35px;
        max-width: 35px;
        padding: 0;
      }

      .stats.actions > span.play:hover,
      .stats.actions > span.stat:hover,
      .stats.actions > span.action:hover {
        background: var(--hover-background);
      }

      .stats.actions > span.stat.views:hover {
        background: inherit;
      }

      .stats.actions span.numbers {
        /* border: var(--input-border); */
        font-family: var(--font-main), sans-serif;
        font-size: 1rem;
        font-weight: 500;
      }

      .stats.actions > span {
        /* border: var(--input-border); */
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 1rem;
        font-weight: 400;
        /* color: var(--gray-color); */
      }

      .stats.actions > .stat > .numbers,
      .stats.actions > .action > .numbers {
        height: 21px;
        min-height: 21px;
        padding: 0;
        margin: 0;
        display: flex;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
        scrollbar-width: none;
        gap: 0;
        align-items: start;
        justify-content: start;
        flex-flow: column;
        transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
        -ms-overflow-style: none;
        scrollbar-width: none;
        will-change: transform;
      }

      .stats.actions > span > .numbers::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }

      .stats.actions > span > .numbers > span {
        /* border: 1px solid red; */
        scroll-snap-align: start;
         transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 21px;
        min-height: 21px;
        padding: 3px 0;
        margin: 0;
        font-family: var(--font-main), sans-serif;
        font-size: 0.95rem;
      }

      .stats.actions > span.true > .numbers > span,
      .stats.actions > span.active > .numbers > span {
        color: transparent;
        background: var(--second-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats.actions > span.up > .numbers > span {
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats.actions > span.down > .numbers > span {
        color: transparent;
        background: var(--error-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .stats.actions > span.action.share {
        min-width: 45px;
      }

      .stats.actions > span.action.share > .icon {
        display: flex;
        gap: 0;
      }
      .stats.actions > span.action.share > .icon > span.sp {
        display: inline-block;
        font-size: 1.2rem;
        margin: 0 0 2px 0;
        /* color: var(--gray-color); */
      }

      .stats.actions > span svg {
        color: inherit;
        width: 16px;
        height: 16px;
      }

      .stats.actions > span.action.like svg {
        margin: -1px 0 0 0;
        width: 16px;
        height: 16px;
        transition: transform 0.5s ease;
      }

      .stats.actions > span.stat.views svg {
        color: inherit;
        width: 16px;
        height: 16px;
      }

      .stats.actions > span.stat.up svg {
        color: var(--accent-color);
      }

      .stats.actions > span.stat.down svg {
        color: var(--error-color);
      }

      .stats.actions > span.true svg,
      .stats.actions > span.active svg {
        color: var(--alt-color);
      }

      .stats.actions > span.action.share > .overlay {
        display: none;
        flex-flow: column;
        z-index: 4;
      }

      .stats.actions > span.action.share > .overlay span.close {
        display: none;
      }

      .stats.actions>span.action.share > .overlay.active {
        display: flex;
      }

      .stats.actions > span.action.share .options {
        display: flex;
        flex-flow: column;
        gap: 0;
        box-shadow: var(--card-box-shadow);
        width: 240px;
        padding: 8px 8px;
        position: absolute;
        bottom: calc(100% - 35px);
        right: calc(50% - 100px);
        background: var(--background);
        border: var(--story-border-mobile);
        border-radius: 20px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        -ms-border-radius: 20px;
        -o-border-radius: 20px;
      }

      .stats.actions > span.action.share .options > .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        padding: 8px 10px;
        color: var(--text-color);
        border-radius: 8px;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        -ms-border-radius: 8px;
        -o-border-radius: 8px;
      }

      .stats.actions > span.action.share .options > .option:hover {
        background: var(--hover-background);
      }

      .stats.actions > span.action.share .options > .option > span.text {
        font-family: var(--font-text), sans-serif;
        font-weight: 500;
        font-size: 1.05rem;
      }

      .stats.actions > span.action.share .options > .option > svg {
        width: 18px;
        height: 18px;
      }

      .stats.actions > span.action.share .options > .option.code > svg,
      .stats.actions > span.action.share .options > .option.more > svg {
        width: 17px;
        height: 17px;
      }

      @media screen and (max-width: 660px) {
        :host {
          font-size: 16px;
          border-bottom: var(--story-border-mobile);
        }

        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .meta a.opinion-link,
        .meta div.author-name > a,
        a,
        .stats > .stat {
          cursor: default !important;
        }

        .poll > .poll-options > .poll-option > label {
          border: var(--story-border-mobile) !important;;
        }

        a,
        span.stat,
        span.action {
          cursor: default !important;
        }

        .stats.actions > span.play:hover,
        .stats.actions > span.stat:hover,
        .stats.actions > span.action:hover {
          background: none;
        }

        .stats.actions > span.action.share > .overlay {
          position: fixed;
          background-color: var(--modal-overlay);
          z-index: 100;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: none;
        }

        .stats.actions > span.action.share > .overlay span.close {
          display: flex;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .stats.actions > span.action.share .options {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-around;
          z-index: 1;
          gap: 0;
          box-shadow: var(--card-box-shadow);
          width: 100%;
          padding: 15px 8px;
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          background: var(--background);
          border: var(--story-border-mobile);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        .stats.actions > span.action.share .options > .option {
          display: flex;
          flex-flow: column-reverse;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
          padding: 10px;
        }

        .stats.actions > span.action.share .options > .option > svg {
          width: 30px;
          height: 30px;
        }

        .stats.actions > span.action.share .options > .option.code > svg {
          width: 29px;
          height: 29px;
        }

        .stats.actions > span.action.share .options > .option.more > svg {
          width: 27px;
          height: 27px;
        }

        .stats.actions > span.action.share .options > .option > span.text {
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
          font-size: 0.8rem;
        }
      }
    </style>
    `;
  }
}