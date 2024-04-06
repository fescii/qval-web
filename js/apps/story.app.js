export default class AppStory extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.topics = this.getAttribute('topics').split(',');

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

  getDate = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
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
        <article class="content">
          ${this.getHeader()}
          ${this.getStoryBody()}
          ${this.getNextArticle()}
          ${this.getForm()}
          ${this.getOpinions()}
        </article>
      `;
    }
    else {
      return /* html */`
        <article class="content">
          ${this.getHeader()}
          ${this.getStoryBody()}
          ${this.getNextArticle()}
          ${this.getForm()}
          ${this.getOpinions()}
        </article>

        <section class="side">
          ${this.getAuthor()}
          ${this.getRelatedStories()}
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getHeader = () => {
    let str = this.topics[0];
    return `
      <div class="head">
        <span class="topic">${str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase())}</span>
        <h1 class="title">${this.getAttribute('title')}</h1>
        <span class="stats">
          <span class="date">${this.getDate(this.getAttribute('date'))}</span>
          <span class="dot"></span>
          <span class="views">${this.getAttribute('views')} views</span>
        </span>

        <div class="by">
          <span class="by">by</span>
          <a href="" class="name">${this.getAttribute('author-name')}</a>
        </div>
      </div>
    `
  }

  getStoryBody = () => {
    return `
      <story-body>
        <div class="intro">
          <p>If you’re looking for a Linux distribution, you’ve likely seen recommendations for both&nbsp;<a
              href="https://www.blogger.com/#">Debian</a> or <a href="https://www.blogger.com/#">Ubuntu</a>.
            Their similarities, and the fact that Ubuntu is technically based on
            Debian, blur the lines between them. Let’s explore the important
            differences.
          </p>
          <p>Following our <a href="">Series B last December</a>, I'm happy to announce we've raised a <a href=""><strong>$102M
                Series C</strong></a> from existing and new investors.</p>
          <p>Our vision of the Web is a global realtime medium for both creators
            and consumers,
            where all friction and latency are eliminated.</p>
          <p>We'll use this investment to:</p>
          <ol>
            <li>
              <a href="">Build the SDK for Web</a>
            </li>
            <li>
              <a href="">Lower the barrier of entry</a>
            </li>
            <li><a href="">Focus on the end-user</a></li>
          </ol>
        </div>
        <div class="paragraph" id="section1">
          <h2 class="title">Debian Has Lower System Requirements</h2>
          <p>If the device you want to <a href="https://www.blogger.com/#">install Linux</a> on is light on resources, you’ll
            want
            to note Debian and Ubuntu’s differing minimum requirements. <a href="https://www.blogger.com/#">A Debian 11 desktop
              install requires</a>
            at least a 1GHz processor, 1GB RAM, and
            10GB storage. <a href="https://www.blogger.com/#">Ubuntu Desktop more than doubles those requirements</a> with a
            2GHz dual-core
            processor, 4GB of RAM, and 25GB of disk space.
          </p>
          <p>That said, when we tested standard installations of both Debian 11
            and Ubuntu Desktop 20.04, the pull on resources didn’t differ
            significantly, using about 1GB of RAM at idle. For older devices, this
            can be asking a lot, so you may want a more minimal desktop. That’s
            relatively easy to get with Debian, but for Ubuntu, you’re better off
            going with another “<a href="https://www.blogger.com/#">Ubuntu flavor</a>” like <a
              href="https://www.blogger.com/#">Lubuntu</a> or <a href="https://www.blogger.com/#">Xubuntu</a>.
          </p>
          <p>Why? Much of the resource consumption comes from the GNOME desktop environment (DE), not the <a
              href="https://www.blogger.com/#">operating system</a>
            itself. You can reduce&nbsp;Debian’s weight significantly if, at install,
            you simply choose a lightweight DE like Xfce or LXQt instead of GNOME
            (optionally, deselect “standard system utilities” as well to forgo most
            of the preinstalled apps). On Ubuntu, you could <a href="https://www.blogger.com/#">get one of those DEs after
              installation</a>, but that process is a bit more
            complicated and leaves you with an additional DE you might not use.
          </p>
        </div>
        <div class="paragraph" id="section2">
          <h2 class="title">Ubuntu Makes Proprietary Software Easier to Get</h2>
          <p>Ubuntu and Debian take different approaches to the debate on free and <a href="https://www.blogger.com/#">open
              source</a>
            (FOSS) versus closed source or “proprietary” software. When you first
            run Debian, you don’t have immediate access to proprietary software,
            which includes popular apps like Spotify, Steam, and Microsoft Teams.
            This also includes drivers necessary to make some critical hardware
            work, including NVIDIA GPUs. You can only get that proprietary software
            by&nbsp;<a href="https://www.blogger.com/#">adding specific repositories</a> to your software sources, downloading
            <a href="https://www.blogger.com/#">DEB files</a> from official websites, or installing them through services like
            <a href="https://www.blogger.com/#">Snap</a> or <a href="https://www.blogger.com/#">Flathub</a>.
          </p>
          <p>In stark contrast, Ubuntu Desktop doesn’t hold any proprietary
            software back. Generally, if there’s a popular app available for Linux,
            you can get it with ease the moment you first boot up Ubuntu (an
            exception might be <a href="https://www.blogger.com/#">Google Chrome</a>). Ubuntu will also make sure you get all
            necessary hardware
            drivers at installation, proprietary and otherwise.</p>
          <p>Why the dramatic difference? Debian tries to serve a wider community
            by making it easy for people who are dedicated to the FOSS way of life
            to use Debian in good conscience. Ubuntu, however, prioritizes
            convenience for the everyday user who doesn’t care about code
            philosophies. If that’s you, you’ll likely find Ubuntu more appealing.</p>
        </div>
        <div class="paragraph" id="section3">
          <h2 class="title">Debian Supports Older Hardware</h2>
          <p>If you’re thinking of <a href="https://www.blogger.com/#">reviving an aging device</a>
            with Linux, you’re more likely to have success with Debian. That’s
            partly because Debian still maintains support for 32-bit architectures
            (also known as&nbsp;i386). Most consumer PCs released in or after the year
            2009 use 64-bit architectures. But if your computer is from before that
            year, you may need a distribution (distro) that still supports 32-bit,
            such as Debian.
          </p>
          <p>Ubuntu, in contrast, dropped full 32-bit support with version 18.04.
            Earlier versions with 32-bit support are still available for download,
            but standard updates have already ended. Extended security updates&nbsp;for
            version 14.04 will continue only until April 2024 and April 2026 for
            16.04.
          </p>
          <p>The decision to drop 32-bit allowed the Ubuntu development team to
            focus on serving modern users with modern devices. The Debian team, in
            contrast, carries on the 32-bit legacy so that outmoded but otherwise
            functioning devices can stay out of the trash bin. These are two
            different but honorable objectives, and which serves you better depends
            on your device.</p>
        </div>
        <div class="paragraph" id="section4">
          <h2 class="title">Ubuntu Is Corporate-Backed</h2>
          <p>Ubuntu is maintained by an organization called <a href="https://www.blogger.com/#">Canonical</a>.
            Debian, in contrast, is developed completely by a community of volunteers. Both offer their distros free of charge,
            but Canonical also
            offers paid support if you’re using Ubuntu professionally.</p>
        </div>
      </story-body>
    `
  }

  getNextArticle = () => {
    return `
      <div class="next-article">
        <a href="/story/${this.getAttribute('next-id')}" class="article">
          <span class="title">Next article</span>
          <span class="text">${this.getAttribute('next-title')}</span>
          <span class="date">${this.getDate(this.getAttribute('next-date'))}</span>
        </a>
      </div>
    `
  }

  getForm = () => {
    return `
      <form-container type="story"></form-container>
    `
  }

  getOpinions = () => {
    return `
      <section class="responses">
        <opinions-feed opinions="all" url="/story/${this.getAttribute('id')}/opinions"></opinions-feed>
      </section>
    `
  }

  getAuthor = () => {
    return `
      <div class="posted-by">
        <p class="text">Posted by</p>
        <div class="author">
          <div class="image">
            <img src="${this.getAttribute('author-image')}" alt="${this.getAttribute('author-name')}">
          </div>
          <div class="name">
            <a href="" class="name">${this.getAttribute('author-name')}</a>
            <span class="occupation">${this.getAttribute('author-bio')}</span>
          </div>
        </div>
      </div>
    `
  }

  getRelatedStories = () => {
    return /* html */`
			<div class="related">
        <p class="title">Related stories</p>
        <ul class="stories">
          <li class="story">
            <a href="" class="link">
              <span class="title">Ubuntu vs Debian: Which one is better</span>
              <span class="date">June 23, 2021</span>
            </a>
          </li>
          <li class="story">
            <a href="" class="link">
              <span class="title">Ubuntu Makes Proprietary Software Easier to Get</span>
              <span class="date">June 23, 2021</span>
            </a>
          </li>
          <li class="story">
            <a href="" class="link">
              <span class="title">Behind the scenes of Vercel's infrastructure: Achieving optimal scalability and performance</span>
              <span class="date">June 23, 2021</span>
            </a></li>
        </ul>
      </div>
		`
  }

  getInfo = () => {
    return `
      <div class="company">
        <ul class="footer-list">
          <li class="item">
            <a href="" class="item-link">Docs</a>
          </li>
          <li class="item">
            <a href="" class="item-link">What’s New</a>
            <span class="dot"></span>
          </li>
          <li class="item">
            <a href="" class="item-link">Give a feedback </a>
          </li>
          <li class="item">
            <a href="" class="item-link">Request a feature</a>
          </li>
          <li class="item">
            <a href="" class="item-link">Source code</a>
            <span class="dot"></span>
          </li>
          <li class="item">
            <a href="" class="item-link">Donate</a>
          </li>
          <li class="item">
            <a href="" class="item-link">Contact</a>
          </li>
          <li class="item">
            <a href="#" class="item-link">&copy 2024 aduki, Inc</a>
          </li>
        </ul>
      </div>
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
          display: flex;
          gap: 0;
          min-height: 90vh;
          justify-content: space-between;
        }

        article.content {
          /* border: 1px solid #000000; */
          padding: 30px 20px 30px 0;
          width: 65%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        article.content .head {
          /* border: 1px solid #000000; */
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        article.content .head > .topic {
          width: max-content;
          color: var(--white-color);
          margin: 0 0 5px;
          padding: 3px 10px 4px 10px;
          box-shadow: 0 0 0 1px #ffffff25, 0 2px 2px #0000000a, 0 8px 16px -4px #0000000a;
          background: var(--accent-linear);
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        article.content .head > h1.title {
          margin: 5px 0;
          font-weight: 700;
          font-size: 1.7rem;
          line-height: 1.5;
          color: var(--title-color);
        }

        article.content .head > span.stats {
          display: flex;
          align-items: center;
          justify-content: start;
          color: var(--gray-color);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          gap: 20px;
        }

        article.content .head > span.stats span.dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background-color: var(--dot-background);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        article.content .head > .by {
          border-top: var(--story-border);
          border-bottom: var(--story-border);
          background-color: var(--background);
          margin: 15px 0 0 0;
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          /* font-family: var(--font-read), sans-serif; */
          font-size: 1rem;
        }

        article.content .head > .by a {
          text-decoration: none;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
        }

        article.content .next-article {
          /* border-top: var(--story-border); */
          padding: 20px 0;
          margin: 0;
        }

        article.content .next-article > a {
          border: var(--story-border-mobile);
          padding: 15px 20px;
          display: flex;
          flex-flow: column;
          align-items: flex-end;
          text-align: end;
          font-size: 0.9rem;
          gap: 10px;
          color: var(--gray-color);
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        article.content .next-article > a:hover {
          background-color: var(--hover-background);
        }

        article.content .next-article > a > span.text {
          color: var(--read-color);
          font-weight: 500;
        }

        article.content .next-article > a > span.date {
          font-weight: 500;
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }

        article.content .next-article > a > span.title {
          font-weight: 400;
          font-size: 0.8rem;
        }

        /* Responses */
        article.content section.responses {
          /* border: 1px solid #000000; */
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side {
          /* border: thin solid #4b5563bd; */
          padding: 20px 0 30px 0;
          margin: 0;
          background-color: transparent;
          width: 33%;
          height: max-content;
          display: flex;
          flex-flow: column;
          gap: 0;
          position: sticky;
          top: 60px;
        }

        .posted-by {
          /* border: thin solid #4b5563bd; */
          background-color: var(--background);
          padding: 10px 15px 0 0;
          display: flex;
          flex-flow: column;
          gap: 15px;
        }

        .posted-by > p.text {
          color: var(--gray-color);
          padding: 0;
          margin: 0;
          font-weight: 500;
        }

        .posted-by > .author {
          /* border: thin solid #4b5563bd; */
          padding: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .posted-by > .author .image {
          /* border: thin solid #4b5563bd; */
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 45px;
          height: 45px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .posted-by > .author .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .posted-by > .author > .name {
          /* border: thin solid #4b5563bd; */
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .posted-by > .author > .name a {
          font-weight: 500;
          color: var(--text-color);
        }

        .posted-by > .author > .name .occupation {
          /* font-weight: 500; */
          color: var(--gray-color);
          font-size: 0.95rem;
        }

        section.side .related {
          /* border: thin solid #4b5563bd; */
          background-color: var(--background);
          padding: 10px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side .related > p.title {
          color: var(--gray-color);
          padding: 0;
          margin: 0;
          font-weight: 500;
        }

        section.side .related > ul.stories {
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side .related > ul.stories li.story {
          text-decoration: none;
          padding: 10px 0 0 0;
          display: flex;
        }

        section.side .related > ul.stories li.story a {
          text-decoration: none;
          display: flex;
          flex-flow: column;
          color: var(--gray-color);
        }

        section.side .related > ul.stories li.story a span.title {
          color: var(--read-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
        }

        section.side .related > ul.stories li.story a:hover > span.title {
          color: var(--read-color);
          /* font-weight: 500; */
        }


        section.side .related > ul.stories li.story a span.date {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
        }

        section.side > .company {
          display: flex;
          margin: 20px 0;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          max-width: 500px;
        }

        section.side > .company >.title {
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
        }

        section.side > .company > ul.footer-list {
          margin: 0;
          list-style-type: none;
          padding: 0 0 0 1px;
          display: flex;
          flex-flow: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }

        section.side > .company > ul.footer-list > li.item {
          margin: 0 10px 0 0;
          padding: 0;
          width: max-content;
          position: relative;
        }

        section.side > .company > ul.footer-list > li.item > .dot {
          display: inline-block;
          background: var(--accent-linear);
          width: 5px;
          height: 5px;
          position: absolute;
          right: -9px;
          top: 3px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        section.side > .company > ul.footer-list > li.item > a.item-link {
          color: var(--gray-color);
          /* font-size: 0.98rem; */
          text-decoration: none;
          font-weight: 400;
          font-size: 0.9rem;
        }

        section.side > .company > ul.footer-list > li.item > a.item-link:hover {
          /* color: var(--accent-color); */
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          border-bottom: 1px solid var(--accent-color);
        }

				@media screen and (max-width:660px) {
					:host {
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            gap: 0;
					}

          article.content {
            /* border: 1px solid #000000; */
            padding: 30px 20px 30px 0;
            width: 100%;
            display: flex;
            flex-flow: column;
            gap: 0;
          }

          article.content .head > .by {
            border-top: var(--story-border-mobile);
            border-bottom: var(--story-border-mobile);
          }

					.action,
					a {
						cursor: default !important;
          }

          section.side {
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}