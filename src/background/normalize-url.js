
function parseHash(url) {
  return url.split('#')[1].split('&').reduce((obj, item) => {
    let parts = item.split('=')
    obj[parts[0]] = decodeURIComponent(parts.slice(1).join('='))
    return obj
  }, {})
}

let knowns = {
  'familysearch.org/tree/#view=ancestor': url => {
    let args = parseHash(url)
    return url.split('#')[0] + '#view=ancestor&person=' + (args.person || 'me')// + '&section=' + (args.section || 'details')
  },
  'familysearch.org/tree/#view=tree': url => {
    let args = parseHash(url)
    return url.split('#')[0] + '#view=tree&person=' + (args.person || 'me')// + '&section=' + (args.section || 'fan')
  },
  'familysearch.org/pal:/': url => {
    return url.split('?')[0].split('#')[0]
  },
}

export default function normalizeUrl(url) {
  for (let partial in knowns) {
    if (url.indexOf(partial) === -1) continue
    return knowns[partial](url)
  }
  return url
}

