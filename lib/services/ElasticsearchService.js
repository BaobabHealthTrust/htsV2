const Axios = require('axios')

const ESConfig = require(__dirname + "/../../configs/elasticsearch.json");

const ESInstance = Axios.create({
  baseURL: `${ESConfig.protocol}://${ESConfig.host}:${ESConfig.port}/${ESConfig.index}/`,
  headers: { 'Content-Type': 'application/json' }
})

module.exports = () => {
  return {
    /**
     * @param {String} index 
     * @param {Object} document
     * @param {Number|null} documentId
     * @return {Promise}
     */
    createDocument (index, document, documentId = null) {
      return ESInstance.put(`${index}/${ documentId ? `${documentId}` : ''}`, document)
    },
    /**
     * @param {String} docId 
     * @param {Object} payload 
     */
    updateDocument (docId, payload) {
      throw new Error('Not Implemented')
    },
    /**
     * @param {Array} payload 
     */
    bulkDocumentUpdate (payload) {
      throw new Error('Not Implemented')
    },
    /**
     * @param {String} queryString 
     */
    findDocuments (queryString) {
      throw new Error('Not Implemented')
    }
  }
}