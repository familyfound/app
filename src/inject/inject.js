// local helpers
import addExtraLinks from './add-extra-links'
import run from './run'
import incept from './incept'

// setting up for the assistant
let div = document.createElement('div')
div.id = 'ff-assistant'
document.body.appendChild(div)

incept() // we have to go deeper

let cleanExtra = null
  , cleanApp = null
  , timeout = null

function onLoad() {
  if (cleanExtra) cleanExtra()
  if (cleanApp) cleanApp()
  cleanExtra = null

  // TODO add back the note-taking stuff, but maybe through a `pageAction`
  cleanApp = null // run(div)

  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    cleanExtra = addExtraLinks(document.body)
    timeout = null
  }, 1000)
}

onLoad()
window.onhashchange = onLoad


