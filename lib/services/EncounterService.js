module.exports = AppInstance => {
  const QueryService = require("./QueryService")(AppInstance);
  const ObservationService = require("./ObservationService")(
    AppInstance.models
  );

  /**
   * @param {Array} requiredObs
   * @param {Array} encounterObs
   * @return {Array}
   */
  function findInvalidEncounters(requiredObs, encounters) {
    const invalids = [];
    for (const entry of encounters) {
      const valid = requiredObs.reduce(
        (acc, val) => acc && entry.concepts.indexOf(val) >= 0,
        true
      );
      if (!valid) invalids.push(entry);
    }
    return invalids;
  }

  async function invalidEncounters() {
    try {
      // retrieve all encounters
      const entries = await QueryService.rawQuery(
        `SELECT encounter_id, group_concat(concept_id) as concepts, date_created FROM obs where voided = 0 GROUP BY encounter_id`
      );

      const required = await ObservationService.requiredObservations();
      const invalids = findInvalidEncounters(required, entries);

      // if they exist then return an array of encounter objects with an entry code and creation time
      if (invalids.length) {
        return await ObservationService.encounterEntryCodes(
          invalids.map(invalid => invalid.encounter_id)
        );
      }
      return [];
    } catch (e) {
      console.error(e.message);
      return [];
    }
  }

  return { invalidEncounters };
};
