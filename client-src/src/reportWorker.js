import oboe from 'oboe'
import moment from 'moment'

async function fetchReport (url, startDate, endDate) {
  /**
    * set the interval to the literal `1` 
    * because Elasticsearch could not reliably 
    * tell me if it'll be able to meet the request
  */
  await iterativelyFetch(url, startDate, endDate, 1)
}

async function iterativelyFetch (url, startDate, endDate, interval) {
  let cache = []
  let payload = null

  let tempStartDate = moment(startDate)
  let tempEndDate = moment(startDate).add(interval, 'days')

  while (tempEndDate.diff(moment(endDate), 'days') <= 0 ) {
    try {
      payload = await promisedOboe(`${url}?startDate=${tempStartDate.format('YYYY-MM-DD')}&endDate=${tempEndDate.format('YYYY-MM-DD')}`)
      cache = [...cache, ...payload]
    } catch (e) {
      postMessage({ error: 'There was an error downloading the report.' })
    }
    tempStartDate = moment(tempEndDate.format('YYYY-MM-DD'))
    tempEndDate = tempEndDate.add(interval, 'days')
  }
  postMessage(cache)
}

function promisedOboe (path) {
  const cache = []
  return new Promise((resolve, reject) => {
    oboe(path)
      .on('node', 'row', row => {
        cache.push(row)
      })
      .done(_ => { resolve(cache) })
      .fail(reject)
  })
}

onmessage = async (e) => {
  await fetchReport(e.data.url, e.data.startDate, e.data.endDate)
}