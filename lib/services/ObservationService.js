module.exports = Models => {
  /**
   * @param {Object} params
   * @return {Promise}
   */
  function destroy(params) {
    return Models.Obs.upsertWithWhere(
      { obsId: params.id },
      { voided: 1, voidReason: params.reason, voidedBy: params.voider }
    );
  }

  /**
   * @param {Object} filter
   * @return {Promise}
   */
  function find(filter) {
    return Models.Obs.findOne({ where: filter });
  }

  /**
   * @param {Number} observationEncounterId
   * @param {String} concept
   * @return {Promise}
   */
  async function observationFromConcept(observationEncounterId, concept) {
    const type = (await Models.ConceptName.findOne({
      where: { name: concept }
    })).conceptId;
    return Models.Obs.findOne({
      where: { encounterId: observationEncounterId, conceptId: type, voided: 0 }
    });
  }

  /**
   * @return {Promise}
   */
  async function requiredObservations() {
    const required = [
      "Sex/Pregnancy",
      "Age Group",
      "Partner Present",
      "HTS Access Type",
      "Result Given to Client",
      "HTS Family Referral Slips",
      "Outcome Summary"
    ];

    return (await Models.ConceptName.find({
      where: { name: { inq: required } }
    })).map(concept => concept.conceptId);
  }

  /**
   * @param {Array} encounters
   * @return {Promise}
   */
  async function encounterEntryCodes(encounters) {
    const entryCodeType = await Models.ConceptName.findOne({
      where: { name: "HTS Entry Code" }
    });

    return (await Models.Obs.find({
      where: {
        encounterId: {
          inq: encounters
        },
        conceptId: entryCodeType.conceptId,
        voided: 0
      }
    })).map(entry => {
      return { entryCode: entry.valueText, createdAt: entry.obsDatetime };
    });
  }

  return {
    destroy,
    find,
    observationFromConcept,
    requiredObservations,
    encounterEntryCodes
  };
};
