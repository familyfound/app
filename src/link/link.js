
var link = document.createElement('a')
link.id = 'ff-link'
document.body.appendChild(link)

var url = chrome.runtime.getURL('dashboard/index.html')
link.href = url
link.target = '_blank'
link.appendChild(document.createTextNode('FamilyFound Dashboard'))

