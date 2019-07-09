import oboe from 'oboe'

onmessage = (e) => {
  const cache = []
  oboe(`${e.data.url}?startDate=${e.data.date}&endDate=${e.data.date}`)
    .on('node', 'row', row => {
      cache.push(row)
    })
    .fail(() => {
      postMessage({ error: `There was an error fetching visits from ${e.data.date}` })
    })
    .on('end', () => {
      if (cache.length === 0) {
        postMessage({ message: `There were no visits on ${e.data.date}.`})
      } else {
        postMessage(cache)
      }
    })
}