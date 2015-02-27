
export default function incept() {
  // inject a file that has access to the client's runtime variables, etc.
  if (window.chrome && window.chrome.runtime) {
    var script = document.createElement('script')
    script.src = chrome.runtime.getURL('build/inception.js')
    script.setAttribute('data-ext-id', chrome.runtime.id)
    script.id = 'ff-inception'
    document.body.appendChild(script)
  }
}

