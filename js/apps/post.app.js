export default class AppPost extends HTMLElement {
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

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        <que-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
          opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
          song="${this.getAttribute('song')}" artist="${this.getAttribute('artist')}" album="${this.getAttribute('album')}" released="${this.getAttribute('released')}"
          views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
          author-id="${this.getAttribute('author-id')}">
          <div>
            <span class="label"># Intro</span>
              <p>Oh-ooh-whoa-oh-oh-oh-oh</p>
              <p>Oh-ooh-whoa-oh-oh-oh-oh</p>
              <p>Oh-ooh-whoa-oh, oh-oh-oh-oh</p>
          </div>

          <div>
            <span class="label"># Verse</span>
              <p>You know you love me (yo), I know you care (uh-huh)</p>
              <p>Just shout whenever (yo), and I'll be there (uh-huh)</p>
              <p>You are my love (yo), you are my heart (uh-huh)</p>
              <p>And we will never, ever, ever be apart (yo, uh-huh)</p>
          </div>

          <div>
            <span class="label"># Verse</span>
              <p>Are we an item? (Yo) girl, quit playin' (uh-huh)</p>
              <p>We're just friends" (yo), what are you sayin'? (Uh-huh)</p>
              <p>Said, "There's another" (yo), and looked right in my eyes (uh-huh)</p>
              <p>My first love broke my heart for the first time, and I was like (yo, uh-huh)</p>
          </div>

          <div>
              <span class="label"># Chorus</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine</p>
          </div>

          <div>
             <span class="label"># Chorus</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine</p>
          </div>

          <div>
              <span class="label"># Verse</span>
              <p>Oh, for you, I would've done whatever (uh-huh)</p>
              <p>And I just can't believe we ain't together (yo, uh-huh)</p>
              <p>And I wanna play it cool (yo), but I'm losin' you (uh-huh)</p>
              <p>I'll buy you anything (yo), I'll buy you any ring (uh-huh)</p>
          </div>

          <div>
              <span class="label"># Verse</span>
              <p>And I'm in pieces (yo), baby, fix me (uh-huh)</p>
              <p>And just shake me 'til you wake me from this bad dream (yo, uh-huh)</p>
              <p>I'm goin' down (oh), down, down, down (uh-huh)</p>
              <p>And I just can't believe, my first love won't be around, and I'm like</p>
          </div>

          <div>
              <span class="label"># Chorus</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine</p>
          </div>

          <div>
             <span class="label"># Chorus</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine (Luda!)</p>
          </div>

          <div>
              <span class="label"># Bridge</span>
              <p>When I was 13, I had my first love</p>
              <p>There was nobody that compared to my baby</p>
              <p>And nobody came between us, nor could ever come above</p>
              <p>She had me goin' crazy</p>
              <p>Oh, I was starstruck</p>
              <p>She woke me up daily</p>
          </div>

          <div>
              <span class="label"># Bridge</span>
              <p>Don't need no Starbucks (woo)</p>
              <p>She made my heart pound</p>
              <p>And skip a beat when I see her in the street and</p>
              <p>At school on the playground</p>
              <p>But I really wanna see her on the weekend</p>
              <p>She knows she got me dazin'</p>
              <p>'Cause she was so amazin'</p>
              <p>And now, my heart is breakin'</p>
              <p>But I just keep on sayin'</p>
          </div>

          <div>
              <span class="label"># Chorus</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine</p>
          </div>

          <div>
              <span class="label"># Chorus / Outro</span>
              <p>Baby, baby, baby, oh</p>
              <p>Like, "Baby, baby, baby, no</p>
              <p>Like, "Baby, baby, baby, oh</p>
              <p>I thought you'd always be mine, mine</p>
              <p>I'm gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
              <p>Now, I'm all gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
              <p>Now, I'm all gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
              <p>Now, I'm all gone (gone, gone, gone)</p>
              <p>I'm gone</p>
          </div>

        </que-wrapper>
        <opinions-feed opinions="all" url="/opinions"></opinions-feed>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          <que-wrapper upvotes="${this.getAttribute('upvotes')}" id="${this.getAttribute('id')}"
            opinions="${this.getAttribute('opinions')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
            song="${this.getAttribute('song')}" artist="${this.getAttribute('artist')}" album="${this.getAttribute('album')}" released="${this.getAttribute('released')}"
            views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
            author-id="${this.getAttribute('author-id')}">
            <div>
              <span class="label"># Intro</span>
                <p>Oh-ooh-whoa-oh-oh-oh-oh</p>
                <p>Oh-ooh-whoa-oh-oh-oh-oh</p>
                <p>Oh-ooh-whoa-oh, oh-oh-oh-oh</p>
            </div>

            <div>
              <span class="label"># Verse</span>
                <p>You know you love me (yo), I know you care (uh-huh)</p>
                <p>Just shout whenever (yo), and I'll be there (uh-huh)</p>
                <p>You are my love (yo), you are my heart (uh-huh)</p>
                <p>And we will never, ever, ever be apart (yo, uh-huh)</p>
            </div>

            <div>
              <span class="label"># Verse</span>
                <p>Are we an item? (Yo) girl, quit playin' (uh-huh)</p>
                <p>We're just friends" (yo), what are you sayin'? (Uh-huh)</p>
                <p>Said, "There's another" (yo), and looked right in my eyes (uh-huh)</p>
                <p>My first love broke my heart for the first time, and I was like (yo, uh-huh)</p>
            </div>

            <div>
                <span class="label"># Chorus</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine</p>
            </div>

            <div>
              <span class="label"># Chorus</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine</p>
            </div>

            <div>
                <span class="label"># Verse</span>
                <p>Oh, for you, I would've done whatever (uh-huh)</p>
                <p>And I just can't believe we ain't together (yo, uh-huh)</p>
                <p>And I wanna play it cool (yo), but I'm losin' you (uh-huh)</p>
                <p>I'll buy you anything (yo), I'll buy you any ring (uh-huh)</p>
            </div>

            <div>
                <span class="label"># Verse</span>
                <p>And I'm in pieces (yo), baby, fix me (uh-huh)</p>
                <p>And just shake me 'til you wake me from this bad dream (yo, uh-huh)</p>
                <p>I'm goin' down (oh), down, down, down (uh-huh)</p>
                <p>And I just can't believe, my first love won't be around, and I'm like</p>
            </div>

            <div>
                <span class="label"># Chorus</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine</p>
            </div>

            <div>
              <span class="label"># Chorus</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine (Luda!)</p>
            </div>

            <div>
                <span class="label"># Bridge</span>
                <p>When I was 13, I had my first love</p>
                <p>There was nobody that compared to my baby</p>
                <p>And nobody came between us, nor could ever come above</p>
                <p>She had me goin' crazy</p>
                <p>Oh, I was starstruck</p>
                <p>She woke me up daily</p>
            </div>

            <div>
                <span class="label"># Bridge</span>
                <p>Don't need no Starbucks (woo)</p>
                <p>She made my heart pound</p>
                <p>And skip a beat when I see her in the street and</p>
                <p>At school on the playground</p>
                <p>But I really wanna see her on the weekend</p>
                <p>She knows she got me dazin'</p>
                <p>'Cause she was so amazin'</p>
                <p>And now, my heart is breakin'</p>
                <p>But I just keep on sayin'</p>
            </div>

            <div>
                <span class="label"># Chorus</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine</p>
            </div>

            <div>
                <span class="label"># Chorus / Outro</span>
                <p>Baby, baby, baby, oh</p>
                <p>Like, "Baby, baby, baby, no</p>
                <p>Like, "Baby, baby, baby, oh</p>
                <p>I thought you'd always be mine, mine</p>
                <p>I'm gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
                <p>Now, I'm all gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
                <p>Now, I'm all gone (yeah, yeah, yeah, yeah, yeah, yeah)</p>
                <p>Now, I'm all gone (gone, gone, gone)</p>
                <p>I'm gone</p>
            </div>
          </que-wrapper>
          <opinions-feed opinions="all" url="/opinions"></opinions-feed>
        </div>
        <div class="side">
          <section class="author">
            ${this.getAuthor()}
          </section>
          <topics-container url="/topics/popular"></topics-container>
        </div>
      `;
    }
  }

  checkVerified = (value) => {
		if (value === 'true') {
			return `
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0" />
          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
        </svg>
			`
		}
		else {
			return ''
		}
	}

  getAuthor = () => {
    return /* html */`
			<div class="head">
        <div class="image">
          <img src="img/img.jpg" alt="User profile">
        </div>
        <div class="info">
          <p class="name">
            <span class="text">U0A43PBA</span>
            ${this.checkVerified(this.getAttribute('author-verified'))}
          </p>
          <a href="" class="followers">
            <span class="no">${this.getAttribute('author-followers')}</span>
            <span class="text">followers</span>
          </a>
        </div>
      </div>
      <div class="data">
        <p class="name">${this.getAttribute('author-name')}</p>
        <span class="bio">${this.getAttribute('author-bio')}</span>
        <p class="about-info">
          ${this.getAttribute('author-about')}
        </p>
      </div>
      ${this.checkFollowing(this.getAttribute('following'))}
		`
  }

  checkFollowing = (following) => {
    if (following === 'true') {
      return `
			  <span class="action following">Following</span>
			`
    }
    else {
      return `
			  <span class="action follow">Follow</span>
			`
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
          font-size: 16px;
          /* border: 1px solid red; */
          padding: 0 0 30px 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
          min-height: 60vh;
        }

        .feeds {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }


        div.side {
          /* border: 1px solid #53595f; */
          padding: 0;
          width: 35%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 60px;
          height: max-content;
        }

        div.side section.author {
          /* border: 1px solid #53595f; */
          display: flex;
          flex-flow: column;
          gap: 5px;
          transition: all 100ms ease-out;
          -webkit-transition: all 100ms ease-out;
          -moz-transition: all 100ms ease-out;
          -ms-transition: all 100ms ease-out;
          -o-transition: all 100ms ease-out;
        }

        div.side section.author p.about-info {
          display: flex;
          font-family: var(--font-main), san-serif;
          color: var(--text-color);
          line-height: 1.4;
          margin: 8px 0 5px 0;
        }

        div.side section.author > .head {
          /* border: 1px solid gray; */
          display: flex;
          padding: 0;
          align-items: center;
          flex-wrap: nowrap;
          width: 100%;
          gap: 10px;
        }

        div.side section.author > .head > .image {
          width: 45px;
          height: 45px;
          overflow: hidden;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        div.side section.author > .head > .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          overflow: hidden;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        div.side section.author > .head .info {
          /* border: 1px solid gray; */
          height: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.side section.author > .head .info p.name {
          margin: 0;
          color: var(--text-color);
          font-weight: 500;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        div.side section.author > .head .info p.name svg {
          margin: -1px 0 0;
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        div.side section.author > .head .info a.followers {
          text-decoration: none;
          margin: 0;
          color: var(--gray-color);
          background: unset;
          font-family: var(--font-main), sans-serif;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        div.side section.author > .head .info a.followers > span.no {
          font-family: var(--font-mono), sans-serif;
        }

        div.side section.author >.data {
          /* border: var(--input-border); */
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.side section.author > .data > p.name {
          margin: 0;
          color: var(--text-color);
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        div.side section.author > .data > span.bio {
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
        }

        div.side section.author span.action {
          border: var(--action-border);
          margin: 0;
          padding: 6px 25px;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          width: max-content;
          font-size: 1.05rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        div.side section.author span.action.follow {
          border: none;
          text-decoration: none;
          color: var(--white-color);
          background-color: var(--action-color);
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}
					a {
						cursor: default !important;
          }

          .feeds {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          div.side {
            /* border: 1px solid #ff0000; */
            padding: 0;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}