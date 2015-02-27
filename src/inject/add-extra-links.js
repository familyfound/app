
let IFRAME_CLS = 'ff-source-iframe'

export default function addExtraLinks(body) {
  let nodes = []
  for (let name in extras) {
    inject(body, extras[name], nodes)
  }
  injectSourceIframeButtons()
  return remove.bind(null, nodes)
}

function remove(nodes) {
  nodes.forEach(node => node.parentNode && node.parentNode.removeChild(node))
  nodes.cleaned = true
}

/** the actual extras **/

var extras = {
  ancestrySearcher: {
    after: '.tools.researchSection .search-records',
    requiredNodes: [
      '.conclusion[conclusion="NAME"][subtype="BIRTH"] .dataCell .nameForm',
      '.conclusion[conclusion="BIRTH"][viewtype="EVENT"] .dataCell'
    ],
    el(node, body) {
      let info = getAncestryInfo(body)
      return link('Ancestry Search', ancestryUrl(info), 'fs-icon-search')
    },
  },
}

function link(text, href, className) {
  let a = document.createElement('a')
  a.href = href
  a.target = '_blank'
  a.innerHTML = text
  a.className = className
  return a
}

function injectSourceIframeButtons() {
  document.body.addEventListener('mousedown', evt => {
    if (!evt.target.classList.contains('sourceTitle') ||
        evt.target.parentElement.parentElement.parentElement.parentElement.id !== 'Sources') {
      return
    }
    let node = evt.target
    if (node.parentNode.querySelector('.' + IFRAME_CLS)) return
    if (node.parentNode.querySelector('.ff-source-iframe-button')) return
    let link = node.parentNode.querySelector('.urlSectionText')
    let button = document.createElement('button')
    button.className = 'ff-source-iframe-button'
    button.innerHTML = 'View inline'
    button.onclick = () => {
      let iframe = document.createElement('iframe')
      iframe.src = link.textContent
      iframe.className = 'ff-source-iframe'
      button.parentNode.replaceChild(iframe, button)
    }
    link.parentNode.insertBefore(button, link.nextSibling)
  })
}

function getAncestryInfo(body) {
  let name = getText(body, '.conclusion[conclusion="NAME"][subtype="BIRTH"] .dataCell .nameForm')
    , firstName
    , lastName
  if (name) {
    let parts = name.split(' ')
    lastName = parts.pop()
    firstName = parts.join(' ')
  }
  let birthDate = getText(body, '.conclusion[conclusion="BIRTH"][viewtype="EVENT"] .dataCell .datePart')
    , birthYear
  if (birthDate) {
    birthYear = birthDate.match(/\d{4}/)
    birthYear = birthYear && birthYear[0]
  }
  let birthPlace = getText(body, '.conclusion[conclusion="BIRTH"][viewtype="EVENT"] .dataCell .placePart')
  return {
    firstName,
    lastName,
    birthYear,
    birthPlace,
  }
}

function ancestryUrl(config) {
  let {firstName, lastName, birthYear, birthPlace} = config
  let opts = {
    gsfn: firstName,
    gsln: lastName,
    msbdy: birthYear,
    msbpn__ftp: birthPlace,
  }
  let argString = Object.keys(opts).map(name => name + '=' + encodeURIComponent(opts[name])).join('&')
  var base = 'http://search.ancestry.com/cgi-bin/sse.dll?gl=ROOT_CATEGORY&rank=1&new=1&so=3&MSAV=1&gss=ms_r_f-2_s'
  return base + '&' + argString
}

/** helpers **/

function getText(body, selector) {
  let node = body.querySelector(selector)
  return node ? node.textContent : null
}

function getElement(body, selector, multiple, otherEls, wait, done) {
  let tries = 0
  let tryGetting = () => {
    let el
    if (multiple) {
      el = body.querySelectorAll(selector)
      el = el.length && [].slice.call(el)
    } else {
      el = body.querySelector(selector)
      el = el && [el]
    }
    if (el) {
      if (!otherEls) return done(null, el)
      let missing = otherEls.some(sel => !body.querySelector(sel))
      if (!missing) return done(null, el)
    }
    tries += 1
    if (tries < 20) {
      setTimeout(tryGetting, 100 * tries)
    } else {
      done(new Error('unable to find node on page: ' + selector))
    }
  }
  if (!wait) return tryGetting()
  setTimeout(tryGetting, wait)
}

function inject(body, extra, collector) {
  var before = !!extra.before
    , selector = extra.before || extra.after
  getElement(body, selector, extra.multiple, extra.requiredNodes, extra.wait, (err, nodes) => {
    if (err) return console.warn('Failed to add extra: ' + selector)
    if (collector.cleaned) return // the page has been reloaded
    nodes.map(node => {
      var newEl = extra.el(node, body)
      collector.push(newEl)
      if (before) {
        return node.parentNode.insertBefore(newEl, node)
      }
      node.parentNode.insertBefore(newEl, before ? node : node.nextSibling)
    })
  })
}

