const loop = require('loopback')()
const boot = require('loopback-boot')
const path = require('path')

const moment = require('moment')

async function start () {
  const Person = loop.models.Person

  const htsVisit = await loop.models.EncounterType.findOne({
    where: {
      name: 'HTS Visit'
    }
  })

  const Observation = loop.models.Obs
  const ConceptName = loop.models.ConceptName

  const AGE_GROUP_CONCEPT_ID = 8457
  const ageGroups = await getAgeGroups(ConceptName)

  await Person.find({ where: { voided: 0 } })
    .then(async (data) => {
      for (const person of data) {
        if (personHasAValidBirthdate(person) && personWasNotBornInTheFuture(person)) {
          const ageGroupId = getPersonAgeGroupId(person, ageGroups)
          const encounter = await getPersonRegistrationEncounter(
            person.personId,
            htsVisit.encounterTypeId
          )
          
          if (encounter) {
            console.log(`Reclassfying age group of patient id ${person.personId}`)
            await Observation.update(
              {
                personId: person.personId,
                encounterId: encounter.encounterId,
                conceptId: AGE_GROUP_CONCEPT_ID
              },
              { valueCodedNameId: ageGroupId }
            )
          }
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function getPersonRegistrationEncounter (personId, encounterTypeId) {
  return loop.models.Encounter.findOne({
    where: {
      patientId: personId,
      encounterType: encounterTypeId
    }
  })
}

async function getAgeGroups (ConceptName) {
  const zeroToElevenMonths = await ConceptName.findOne({
    where: {
      name: '0-11 months'
    }
  })
  const oneToFourteenYears = await ConceptName.findOne({
    where: {
      name: '1-14 years'
    }
  })
  const fifteenToTwentyFourYears = await ConceptName.findOne({
    where: {
      name: '15-24 years'
    }
  })
  const twentyFivePlusYears = await ConceptName.findOne({
    where: {
      name: '25+ years'
    }
  })

  return {
    zeroToElevenMonths,
    oneToFourteenYears,
    fifteenToTwentyFourYears,
    twentyFivePlusYears
  }
}

function getPersonAgeGroupId (person, ageGroups) {
  const now = moment()
  const personBirthdate = moment(person.birthdate)
  const personAge = now.diff(personBirthdate, 'years')

  if (personAge === 0) {
    return ageGroups.zeroToElevenMonths.conceptNameId
  } else if (personAge >= 1 && personAge <= 14) {
    return ageGroups.oneToFourteenYears.conceptNameId
  } else if (personAge >= 15 && personAge <= 24) {
    return ageGroups.fifteenToTwentyFourYears.conceptNameId
  } else if (personAge >= 25) {
    return ageGroups.twentyFivePlusYears.conceptNameId
  }
}

function personHasAValidBirthdate (person) {
  return moment(person.birthdate).isValid()
}

function personWasNotBornInTheFuture (person) {
  return moment(person.birthdate).isBefore(moment())
}

boot(loop, path.resolve(__dirname + "/../server"), (error) => {
  if (error) {
    throw error
  }
}) 

start()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })