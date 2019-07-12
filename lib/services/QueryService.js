module.exports = AppInstance => {
  return {
    /**
     * Run a promisied version of execute()
     * @param {String} query
     * @return {Promise}
     */
    rawQuery (query = '') {
      return new Promise((resolve, reject) => {
        AppInstance.dataSources.hts.connector.execute(query, (error, data) => {
          if (error) reject(error)
          else resolve(data)
        })
      })
    }
  }
}