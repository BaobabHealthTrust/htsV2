const loop = require('loopback')()
const boot = require('loopback-boot')
const path = require('path')
const uuid = require('uuid/v1')

const moment = require('moment')

async function start () {
  const Person = loop.models.Person

  const Observation = loop.models.Obs
  const ConceptName = loop.models.ConceptName

  const AGE_GROUP_CONCEPT_ID = 8457
  const ageGroups = await getAgeGroups(ConceptName)

  await Person.find({ where: { voided: 0 } })
    .then(async (data) => {
      for (const person of data) {
        if (personHasAValidBirthdate(person) && personWasNotBornInTheFuture(person)) {
          const ageGroup = getPersonAgeGroup(person, ageGroups)

          const ageGroupObservation = await getPatientAgeGroupObservation(
            person.personId,
            AGE_GROUP_CONCEPT_ID
          )

          if (ageGroupObservation) {
            console.log(`Voiding initial age group observation for patient id ${person.personId}`)
            await Observation.update(
              {
                obsId: ageGroupObservation.obsId
              },
              {
                voided: 1,
                voidedBy: ageGroupObservation.creator,
                voidReason: 'Reclassifying age group.'
              }
            )

            console.log(`Creating new observation for patient id ${person.personId}`)
            await Observation.create({
              personId: person.personId,
              conceptId: AGE_GROUP_CONCEPT_ID,
              valueCoded: ageGroup.conceptId,
              valueCodedNameId: ageGroup.conceptNameId,
              encounterId: ageGroupObservation.encounterId,
              obsDatetime: ageGroupObservation.obsDatetime,
              dateCreated: moment().format('Y-MM-DD H:m:s'),
              creator: ageGroupObservation.creator,
              uuid: uuid()
            })
          }
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function getPatientAgeGroupObservation (patientId, conceptId) {
  return loop.models.Obs.findOne({
    where: {
      patientId: patientId,
      conceptId: conceptId,
      voided: 0
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

function getPersonAgeGroup (person, ageGroups) {
  const now = moment()
  const personBirthdate = moment(person.birthdate)
  const personAge = now.diff(personBirthdate, 'years')

  if (personAge === 0) {
    return ageGroups.zeroToElevenMonths
  } else if (personAge >= 1 && personAge <= 14) {
    return ageGroups.oneToFourteenYears
  } else if (personAge >= 15 && personAge <= 24) {
    return ageGroups.fifteenToTwentyFourYears
  } else if (personAge >= 25) {
    return ageGroups.twentyFivePlusYears
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