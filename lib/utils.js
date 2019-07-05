const moment = require("moment");
const queries = require("./queries");

module.exports = AppInstance => {
  const QueryService = require("./services/QueryService")(AppInstance);
  const ObservationService = require("./services/ObservationService")(
    AppInstance.models
  );

  /**
   * @param {Number} observationId
   * @return {Object}
   */
  async function mapObservationToElasticEntry(observationId) {
    const entry = (await QueryService.rawQuery(
      `${queries.ObservationAsEsEntry} AND obs.obs_id = ${observationId};`
    ))[0];

    entry.identifier = (await ObservationService.observationFromConcept(
      entry.encounterId,
      "HTS Entry Code"
    )).valueText;

    entry.dateOfBirth = moment(entry.dateOfBirth).format("YYYY-MM-DD");
    delete entry._id;

    return entry;
  }

  return {
    mapObservationToElasticEntry
  };
};
