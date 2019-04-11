import oboe from 'oboe'

onmessage = (e) => {
  const cache = []
  oboe(`${e.data.url}?startDate=${e.data.startDate}&endDate=${e.data.endDate}`)
    .on('node', 'row', row => {
      cache.push(row)
    })
    .fail((error) => {
      const message = (error.statusCode === 503) ? 'The report is too large to download. Please browse it page by page.' : 'There was an error creating the report.'
      postMessage({ error: message })
    })
    .on('end', () => {
      postMessage(cache)
    })
}