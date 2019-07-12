module.exports = {
  ObservationAsEsEntry: `SELECT
  DISTINCT DATE_FORMAT(encounter_datetime, '%Y-%m-%d') AS visitDate,
  encounter_type.name AS encounterType,
  concept_name.name AS observation,
  CASE
    WHEN COALESCE(obs.value_coded_name_id, '') != ''
      THEN (SELECT name FROM concept_name WHERE concept_name_id = obs.value_coded_name_id LIMIT 1)
    WHEN COALESCE(obs.value_datetime, '') != ''
      THEN DATE_FORMAT(obs.value_datetime, '%Y-%m-%d')
    WHEN COALESCE(obs.value_numeric, '') != ''
      THEN CONCAT(obs.value_numeric,
                  CASE
                    WHEN COALESCE(obs.value_modifier, '') != ''
                      THEN obs.value_modifier ELSE ''
    END)
  ELSE obs.value_text END AS observationValue,
  'HTS PROGRAM' AS program,
  location.name AS location,
  u.username AS provider,
  users.username AS user,
  encounter.encounter_id AS encounterId,
  person.birthdate AS dateOfBirth,
  hts_register.register_number AS registerNumber,
  hts_register_location_type.name AS locationType,
  hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATEDIFF
  (CURRENT_DATE, person.birthdate) / 365.0 AS age,
  obs.obs_id AS obsId,
  obs.obs_id AS _id
FROM encounter
  LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id
  LEFT OUTER JOIN program ON program.program_id = patient_program.program_id
  LEFT OUTER JOIN encounter_type ON encounter_type.encounter_type_id = encounter.encounter_type
  LEFT OUTER JOIN obs ON obs.encounter_id = encounter.encounter_id
  LEFT OUTER JOIN concept ON concept.concept_id = obs.concept_id
  LEFT OUTER JOIN concept_name ON concept_name.concept_id = concept.concept_id
  LEFT OUTER JOIN location ON location.location_id = encounter.location_id
  LEFT OUTER JOIN users ON users.user_id = encounter.creator
  LEFT OUTER JOIN users u ON u.person_id = encounter.provider_id
  LEFT OUTER JOIN person ON person.person_id = obs.person_id
  LEFT OUTER JOIN hts_register_encounter_mapping ON hts_register_encounter_mapping.encounter_id = encounter.encounter_id
  LEFT OUTER JOIN hts_register ON hts_register.register_id = hts_register_encounter_mapping.register_id
  LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id
  LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id
WHERE
  program.name = 'HTS PROGRAM' AND concept_name.concept_name_id IN
    (SELECT
      concept_name_id
    FROM concept_name_tag_map
    WHERE concept_name_tag_id = (SELECT
                                  concept_name_tag_id
                                FROM concept_name_tag WHERE tag = 'preferred_hts' AND encounter.encounter_id IN 
                                  (SELECT encounter_id FROM hts_register_encounter_mapping) LIMIT 1)) AND obs.voided = 0 AND encounter.voided = 0`
}