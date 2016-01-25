
// setInterval(checkCookies, 10 * 1000)

/*
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tabId, changeInfo, tab.url, tab.title, tab.openerTabId)
})

function checkCookies() {

  chrome.cookies.get({
    url: 'https://familysearch.org/',
    name: 'fssessionid',
  }, function (cookie) {
    if (!cookie) return

  })

}

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    sendResponse('wat')
    chrome.cookies.get({
      url: 'https://familysearch.org/',
      name: 'fssessionid',
    }, function (cookie) {
      sendResponse(cookie ? cookie.value : null)
    });
  });

chrome.runtime.onConnectExternal.addListener(function (port) {
  var _int = setInterval(checkCookies, 1 * 1000)

  function checkCookies() {

    chrome.cookies.get({
      url: 'https://familysearch.org/',
      name: 'fssessionid',
    }, function (cookie) {
      if (!cookie) return port.postMessage(null)
      clearInterval(_int)
      port.postMessage(cookie.value)
    })

  }

  checkCookies()
});
*/
