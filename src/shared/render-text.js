
import marked from 'marked'

let renderer = new marked.Renderer()
renderer.link = function (href, title, text) {
  if (text.length > 50) {
    title = title || text
    text = text.slice(0, 47) + '...'
  }
  let ttext = title ? ` title="${title}"` : ''
  return '<a href="' + href + '" target="_blank"' + ttext + '>' + text + '</a>';
}

marked.setOptions({
  gfm: true,
  sanitize: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: true,
  renderer: renderer
})

export default function render(text) {
  return text ? marked(text) : ''
}

