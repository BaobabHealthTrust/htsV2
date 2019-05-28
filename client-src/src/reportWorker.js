import oboe from 'oboe'
import moment from 'moment'

async function estimateFetchableInterval (url, startDate, endDate) {
  try {
    const payload = await fetch(`${url}?startDate=${startDate}&endDate=${endDate}`)
    if (payload.ok) return moment(endDate).diff(moment(startDate), 'days')

    return await estimateFetchableInterval(url,
                                           startDate,
                                           moment(startDate)
                                            .add(diff(endDate, startDate) / 2, 'days')
                                            .format('YYYY-MM-DD'))
  } catch (e) {
    postMessage({ error: 'There was a problem estimating the report interval.' })
  }
}

async function fetchReport (url, startDate, endDate) {
  const interval = await estimateFetchableInterval(url, startDate, endDate)

  if (diff(endDate, startDate) === interval) {
    await fetchOnce(url, startDate, endDate)
  } else {
    /**
     * set the interval to the literal `1` 
     * because Elasticsearch could not reliably 
     * tell me if it'll be able to meet the request
     */
    await iterativelyFetch(url, startDate, endDate, 1)
  }
}

async function iterativelyFetch (url, startDate, endDate, interval) {
  let cache = []
  let payload = null

  let intermediateStartDate = moment(startDate)
  let intermediateEndDate = moment(startDate).add(interval, 'days')

  while (intermediateEndDate.diff(moment(endDate), 'days') <= 0 ) {
    try {
      payload = await promisedOboe(`${url}?startDate=${intermediateStartDate.format('YYYY-MM-DD')}&endDate=${intermediateEndDate.format('YYYY-MM-DD')}`)
      cache = [...cache, ...payload]
    } catch (e) {
      postMessage({ error: 'There was an error downloading the report.' })
    }
    intermediateStartDate = moment(intermediateEndDate.format('YYYY-MM-DD'))
    intermediateEndDate = intermediateEndDate.add(interval, 'days')
  }
  postMessage(cache)
}

async function fetchOnce (url, startDate, endDate) {
  try {
    const payload = await promisedOboe(`${url}?startDate=${startDate}&endDate=${endDate}`)
    postMessage(payload)
  } catch (e) {
    postMessage({ error: 'There was an error downloading the report.' })
  }
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

const diff = (firstDate, secondDate) => {
  return moment(firstDate).diff(moment(secondDate), 'days')
}

onmessage = async (e) => {
  await fetchReport(e.data.url, e.data.startDate, e.data.endDate)
}