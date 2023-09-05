import { createRoot } from 'react-dom/client'
import './styles/styles.scss'
import { App } from './App'
import Cursor from './components/Cursor'

import TwitterIcon from './public/twitter-icon.svg'
import HuggingFaceIcon from './public/hugging-face-icon.svg'
import GithubIcon from './public/github-icon.svg'

createRoot(document.getElementById('root')).render(<App />)

const menu = document.createElement('div')
let innerHTML = `
<div class="menu">
<a class="menu__link" data-cursor-stick target="_blank" href="https://twitter.com/obv_research">
  <img src="${TwitterIcon}" />
</a>
<a class="menu__link" data-cursor-stick target="_blank" href="https://github.com/obvious-research">
<img src="${GithubIcon}" />
</a>
<a class="menu__link" data-cursor-stick target="_blank" href="https://huggingface.co/obvious-research">
<img src="${HuggingFaceIcon}" />
</a>
</div>
`.trim()

menu.innerHTML = innerHTML

document.body.appendChild(menu)

// menu.insertAdjacentHTML('beforeend', innerHTML)
