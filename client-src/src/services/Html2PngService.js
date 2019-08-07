import Html2Canvas from 'html2canvas'

async function elementToPng (element) {
  const svg = await Html2Canvas(element)
  return svg.toDataURL('image/png')
}

function createDownloadLink (payload, filename) {
  const link = document.createElement('a')
  link.setAttribute('download', `${filename}.png`)
  link.setAttribute('href', payload)
  return link
}

export default async (selector, filename) => {
  const element = document.querySelector(selector)
  const stream = (await elementToPng(element)).replace('image/png', 'image/octet-stream')
  const link = createDownloadLink(stream, filename)
  link.click()
}