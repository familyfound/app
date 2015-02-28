
let whiteurls = [
  'https://familysearch.org/',
  'http://search.ancestry.com/',
]

function isGoodUrl(url) {
  url = url.toLowerCase()
  return whiteurls.some(white => url.indexOf(white) === 0)
}

export default class TabListener {
  constructor(actions) {
    this._lastevt = {}
    this.actions = actions
  }

  listen(chrome) {
    chrome.tabs.onUpdated.addListener(this.onUpdated.bind(this))
  }

  onUpdated(tabid, changeInfo, tab) {
    if (changeInfo.status !== 'complete') return
    if (!isGoodUrl(tab.url)) return
    let evt = {
      tabid: tabid,
      url: tab.url,
      title: tab.title,
      prevtabid: tab.openerTabId || tabid,
      date: new Date(),
      type: 'page',
    }

    for (let name in types) {
      if (tab.url.toLowerCase().indexOf(name.toLowerCase()) === -1) continue
      let res = types[name](tab.url)
      evt.type = res.type
      evt.args = res.args
      break
    }

    if (this._lastevt[evt.prevtabid]) {
      evt.prevurl = this._lastevt[evt.prevtabid].url
    }
    this._lastevt[evt.tabid] = evt
    console.log('Page Event', evt)
    this.actions.create(evt)
  }
}

function hash(url) {
  return url.split('#')[1].split('&').reduce((obj, item) => {
    let parts = item.split('=')
    obj[parts[0]] = decodeURIComponent(parts.slice(1).join('='))
    return obj
  }, {})
}

let types = {
  'familysearch.org/tree/#view=ancestor': url => {
    let args = hash(url)
    return {
      type: 'person details/' + (args.person || 'me') + '/' + (args.section || 'details'),
      args: {
        person: args.person || 'me',
        section: args.section,
      },
    }
  },
  'familysearch.org/tree/#view=tree': url => {
    let args = hash(url)
    return {
      type: 'tree view/' + (args.person || 'me') + '/' + (args.section || 'fan'),
      args: {
        person: args.person || 'me',
        section: args.section,
      },
    }
  },
}

