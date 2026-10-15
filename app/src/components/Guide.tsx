import { usePageMeta } from '../pageMeta'
import { loadOptions } from '../savedOptions'
import Logo from './Logo'
import StarLink from './StarLink'

type ScreenshotProps = {
  src: string
  alt: string
  width: number
  height: number
}

// GitHub's text is small once the screenshot fits the panel, so it opens full size
function Screenshot({ src, alt, width, height }: ScreenshotProps) {
  return (
    <a className="guide-shot" href={src} target="_blank" rel="noreferrer">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" />
    </a>
  )
}

function Guide() {
  usePageMeta({
    path: '/guide',
    title: 'Add a card to your GitHub profile README · Code Trainer Card',
    description: 'Five steps to put a Code Trainer Card on your GitHub profile: create your profile repository, build the card and paste it into your README.'
  })

  const username = loadOptions().username.trim()
  const profileUrl = `https://github.com/${username ? encodeURIComponent(username) : ''}`

  return (
    <div className="page">
      <div className="page-bar">
        <StarLink />
      </div>
      <header className="title">
        <Logo />
        <div>
          <h1>Code Trainer Card</h1>
          <p>Put your card on your GitHub profile in 5 steps</p>
        </div>
      </header>
      <main className="panel guide">
        <ol className="guide-steps">
          <li>
            <h2>Create a GitHub account</h2>
            <p>
              Sign up at <a href="https://github.com/signup" target="_blank" rel="noreferrer">github.com/signup</a>.
              Your username is what the card uses to find your profile.
            </p>
          </li>
          <li>
            <h2>Create your profile repository</h2>
            <p>
              Create a <a href="https://github.com/new" target="_blank" rel="noreferrer">new repository</a> named
              exactly {username ? <code>{username}</code> : 'your username'}. GitHub shows a message saying it's a
              special repository: its README appears on your profile. Make it <b>Public</b>, turn on <b>Add
              README</b> and press <b>Create repository</b>.
            </p>
            <Screenshot
              src="/guide/new-repository.webp"
              alt="GitHub's new repository form, with the repository named after the username and marked as special"
              width={1209}
              height={1301}
            />
          </li>
          <li>
            <h2>Build your card</h2>
            <p>
              In the <a href="/builder">card builder</a>, type your username, pick a color, role and skills, then
              press <b>Copy Markdown</b>.
            </p>
          </li>
          <li>
            <h2>Paste it in the README</h2>
            <p>
              Open <code>README.md</code> in your new repository, click the pencil icon to edit it, paste the
              Markdown and press the green <b>Commit changes</b> button at the top right.
            </p>
            <Screenshot
              src="/guide/edit-readme.png"
              alt="Editing README.md on GitHub with the card's Markdown pasted at the end"
              width={900}
              height={595}
            />
          </li>
          <li>
            <h2>Check your profile</h2>
            <p>
              Open <a href={profileUrl} target="_blank" rel="noreferrer">{username ? `github.com/${username}` : 'your GitHub profile'}</a>:
              the card is at the top.
            </p>
          </li>
        </ol>
        <h2>Good to know</h2>
        <ul className="guide-tips">
          <li>Your followers, commits and badges update on their own. GitHub can take a few hours to show new numbers.</li>
          <li>
            Most of your work is private? Turn on <b>Include private contributions on my profile</b> in GitHub's
            Settings, under Public profile, then turn on <b>Private commits</b> in the builder.
          </li>
          <li>Changed your card? Copy the Markdown again and replace the old one in your README.</li>
        </ul>
        <a className="start" href="/builder">Build your card</a>
      </main>
    </div>
  )
}

export default Guide
