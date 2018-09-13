import site from '../config/site';

const padZeros = (number, positions) => {

  const zeros = parseInt(positions, 10) - String(number).length;
  let padded = "";

  for (let i = 0; i < zeros; i++) {
    padded += "0";
  }

  padded += String(number);

  return padded;
}

if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {

  // eslint-disable-next-line
  Object.defineProperty(Date.prototype, "format", {
    value: function (format) {
      var date = this;

      var result = "";

      if (!format) {

        format = ""

      }

      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      if (format.match(/YYYY-mm-dd\sHH:MM:SS/)) {

        result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth(), 10) + 1), 2) + "-" + padZeros(date.getDate(), 2) + " " + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2) + ":" + padZeros(date.getSeconds(), 2);

      } else if (format.match(/YYYY-mm-dd/)) {

        result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth(), 10) + 1), 2) + "-" + padZeros(date.getDate(), 2);

      } else if (format.match(/mmm\/d\/YYYY/)) {

        result = months[parseInt(date.getMonth(), 10)] + "/" + date.getDate() + "/" + date.getFullYear();

      } else if (format.match(/d\smmmm,\sYYYY/)) {

        result = date.getDate() + " " + monthNames[parseInt(date.getMonth(), 10)] + ", " + date.getFullYear();

      } else if (format.match(/d\smmm\sYYYY/)) {

        result = date.getDate() + " " + months[parseInt(date.getMonth(), 10)] + " " + date.getFullYear();

      } else {

        result = date.getDate() + "/" + months[parseInt(date.getMonth(), 10)] + "/" + date.getFullYear();

      }

      return result;
    }
  });

}

const processData = (newState, action) => {

  let today,
    program,
    activeProgram;

  today = (new Date(newState.selectedVisit
    ? newState.selectedVisit
    : (new Date()).getTime())).format("d mmm YYYY");

  program = newState
    .programs
    .filter((p) => {
      return p.name === newState.module
    });

  if (program.length > 0) {

    activeProgram = program[0];

    if (activeProgram)
      activeProgram.visits = [];

    for (let k = 0; k < activeProgram.tasks.length; k++) {

      activeProgram.tasks[k].done = false;

    }

  }

  if (Object.keys(action.payload).indexOf("patientData") >= 0) {

    newState.patientData = Object.assign({}, newState.patientData, action.payload.patientData);

  }

  if (Object.keys(newState.patientData).length > 0 && newState.currentId && newState.module && newState.patientData[newState.currentId] && newState.patientData[newState.currentId][newState.module] && newState.patientData[newState.currentId][newState.module].visits) {

    if (newState.currentId && newState.module && newState.patientData[newState.currentId] && newState.patientData[newState.currentId][newState.module] && newState.patientData[newState.currentId][newState.module].visits) {

      let pos = -1;

      for (let i = 0; i < newState.patientData[newState.currentId][newState.module].visits.length; i++) {

        const row = newState.patientData[newState.currentId][newState.module].visits[i];

        if (Object.keys(row)[0] === today) {

          pos = i;

          break;

        }

      }

      if (pos >= 0) {

        Object
          .keys(newState.patientData[newState.currentId][newState.module].visits[pos][today])
          .forEach((key) => {

            for (let j = 0; j < newState.programs.length; j++) {

              const program = newState.programs[j];

              if (program.name === newState.module) {

                for (let k = 0; k < program.tasks.length; k++) {

                  if (program.tasks[k].label === key) {

                    program.tasks[k].done = true;

                  }

                }

              }

            }

          })

      }

    }

  }

}

const activateSummaries = async (newState) => {

  ["primary", "secondary"].forEach((group) => {

    let partnerId = (group === "primary"
      ? newState.clientId
      : (group === "secondary"
        ? newState.partnerId
        : null));

    if (partnerId && newState.patientData && newState.module && newState.selectedVisit && newState.patientData[partnerId] && newState.patientData[partnerId][newState.module] && newState.patientData[partnerId][newState.module].visits && newState.patientData[partnerId][newState.module].visits.filter((e) => {
      return Object.keys(e)[0] === newState.selectedVisit
    }) && newState.patientData[partnerId][newState.module].visits.filter((e) => {
      return Object.keys(e)[0] === newState.selectedVisit
    }).length > 0 && newState.patientData[partnerId][newState.module].visits.filter((e) => {
      return Object.keys(e)[0] === newState.selectedVisit
    })[0][newState.selectedVisit] && Object.keys(newState.patientData[partnerId][newState.module].visits.filter((e) => {
      return Object.keys(e)[0] === newState.selectedVisit
    })[0][newState.selectedVisit]).length >= newState.order.length) {

      if (group === "secondary") {

        newState.secondarySectionHeader = "Visit Details for " + newState.selectedTask;

        newState.secondSummary = true;

      } else if (group === "primary") {

        newState.sectionHeader = "Visit Details for " + newState.selectedTask;

        newState.firstSummary = true;

      }

    }

  })

}

export default function appReducer(state = {
  flagged: {},
  patientActivated: false,
  formActive: false,
  module: "",
  icon: "",
  tasks: [],
  selectedTask: "",
  selectedVisit: (new Date()).format("d mmm YYYY"),
  today: "",
  facility: site.facility,
  user: "admin",
  location: null,
  currentSection: "home",
  userDashTasks: [],
  programs: [
    {
      name: "",
      icon: "",
      tasks: [
        {
          label: "",
          url: "",
          done: false
        }
      ],
      visits: [],
      userDashTasks: []
    }
  ],
  role: "",
  configs: {},
  fieldPos: 0,
  summaryIgnores: [],
  sectionHeader: "",
  processing: false,
  age: "",
  gender: "",
  otherId: "",
  otherIdType: "",
  npid: "",
  patientName: "",
  data: {},
  order: [],
  working: false,
  patientData: {},
  currentId: null,
  currentPatient: {},
  dual: false,
  currentMatches: [],
  alerting: false,
  currentTab: null,
  activeReport: null,
  reportingMonth: null,
  reportingYear: null,
  currentLocation: null,
  activeLocation: null,
  activeUser: null,
  notSaved: false,
  partner: {},
  ignore: false,
  silentProcessing: false,
  clientId: null,
  partnerId: null,
  scanID: null,
  primary: {
    formActive: false,
    selectedTask: "",
    selectedVisit: (new Date()).format("d mmm YYYY"),
    fieldPos: 0,
    summaryIgnores: [],
    sectionHeader: "",
    forceSummary: false,
    summary: false,
    configs: {}
  },
  secondary: {
    formActive: false,
    selectedTask: "",
    selectedVisit: (new Date()).format("d mmm YYYY"),
    fieldPos: 0,
    summaryIgnores: [],
    sectionHeader: "",
    forceSummary: false,
    summary: false,
    configs: {}
  },
  entryCode: null,
  activeRegisters: 0,
  firstSummary: false,
  secondSummary: false,
  reversing: false,
  version: "",
  infoMessage: null
}, action) {

  let newState,
    today,
    primaryId;

  const genders = {
    F: "Female",
    M: "Male"
  };

  switch (action.type) {

    case "INIT_APP_FULFILLED":

      newState = Object.assign({}, state, action.payload.data);

      newState.programs = action.payload.data.programs;

      newState.alerting = false;

      return newState;

    case "UPDATE_APP":

      newState = Object.assign({}, state);

      [
        "reportingMonth",
        "reportingYear",
        "patientActivated",
        "formActive",
        "module",
        "icon",
        "tasks",
        "selectedTask",
        "selectedVisit",
        "today",
        "user",
        "location",
        "currentSection",
        "userDashTasks",
        "role",
        "configs",
        "fieldPos",
        "summaryIgnores",
        "sectionHeader",
        "processing",
        "age",
        "gender",
        "otherId",
        "otherIdType",
        "npid",
        "patientName",
        "data",
        "order",
        "working",
        "currentId",
        "dual",
        "alerting",
        "currentTab",
        "activeReport",
        "currentLocation",
        "activeLocation",
        "activeUser",
        "notSaved",
        "partner",
        "ignore",
        "silentProcessing",
        "clientId",
        "partnerId",
        "scanID",
        "userManagementActive",
        "entryCode",
        "report",
        "isDirty",
        "firstSummary",
        "secondSummary",
        "reversing",
        "infoMessage"
      ].forEach((e) => {

        if (Object.keys(action.payload).indexOf(e) >= 0) {

          newState[e] = action.payload[e];

        }

      });

      if (action.payload && action.payload.currentPatient && Object.keys(action.payload).indexOf("currentPatient") >= 0 && Object.keys(action.payload.currentPatient).length > 0) {

        let payload = Object.assign({}, action.payload);

        primaryId = payload.currentPatient.primaryId;

        if (!primaryId)
          primaryId = (payload.currentPatient.npid
            ? payload.currentPatient.npid
            : payload.currentPatient.otherId);

        delete payload.currentPatient.primaryId;

        newState.currentId = primaryId;

        newState.patientData[primaryId] = Object.assign({}, newState.patientData[primaryId], payload.currentPatient);

        newState.currentPatient = Object.assign({}, action.payload.currentPatient);

        newState.currentMatches = [];

      }

      if (Object.keys(action.payload).indexOf("primary") >= 0) {

        newState.primary = Object.assign({}, action.payload.primary);

      }

      if (Object.keys(action.payload).indexOf("secondary") >= 0) {

        newState.secondary = Object.assign({}, action.payload.secondary);

      }

      processData(newState, action);

      return newState;

    case "SUBMIT_FORM_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "SUBMIT_FORM_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        silentProcessing: false
      });

      if (newState.sectionHeader !== "Find or Register Client") {

        newState = Object.assign({}, state, {
          processing: false,
          age: (action.payload.data && action.payload.data.age
            ? action.payload.data.age
            : ""),
          gender: (action.payload.data && action.payload.data.gender
            ? (genders[action.payload.data.gender] ? genders[action.payload.data.gender] : action.payload.data.gender)
            : ""),
          otherId: (action.payload.data && action.payload.data.otherId
            ? action.payload.data.otherId
            : ""),
          npid: (action.payload.data && action.payload.data.npid
            ? action.payload.data.npid
            : ""),
          otherIdType: (action.payload.data && action.payload.data.otherIdType
            ? action.payload.data.otherIdType
            : ""),
          patientName: (action.payload.data && action.payload.data.patientName
            ? action.payload.data.patientName
            : "")
        });

        for (let j = 0; j < newState.programs.length; j++) {

          const program = newState.programs[j];

          if (program.name === newState.module) {

            for (let k = 0; k < program.tasks.length; k++) {

              program.tasks[k].done = false;

            }

          }

        }

        const npid = (action.payload.data.npid || action.payload.data.otherId);

        if (npid) {

          if (!newState.patientData)
            newState.patientData = {};

          if (!newState.patientData[npid])
            newState.patientData[npid] = {};
          [
            "age",
            "gender",
            "otherId",
            "otherIdType",
            "npid",
            "patientName",
            "firstName",
            "lastName",
            "dateOfBirth",
            "districtOfOrigin",
            "currentRegion",
            "currentDistrict",
            "currentTA",
            "currentVillage",
            "cellPhoneNumber"
          ].forEach((e) => {

            if (e === "gender") {

              newState.patientData[npid][e] = (genders[action.payload.data[e]] ? genders[action.payload.data[e]] : action.payload.data[e])

            } else if (Object.keys(action.payload.data).indexOf(e) >= 0) {

              newState.patientData[npid][e] = action.payload.data[e];

            }

          }
          );

          newState.patientData[npid].primaryId = npid;

          newState.currentId = npid;

          newState.clientId = npid;

        }

        if (action.payload.data && action.payload.data.primaryId) {

          today = (new Date(action.payload.data.date
            ? action.payload.data.date
            : (new Date()).getTime())).format("d mmm YYYY");

          const npid = action.payload.data.primaryId;

          if (!newState.patientData)
            newState.patientData = {};

          if (!newState.patientData[npid])
            newState.patientData[npid] = {};

          if (!newState.patientData[npid][newState.module])
            newState.patientData[npid][newState.module] = {};

          if (!newState.patientData[npid][newState.module].visits)
            newState.patientData[npid][newState.module].visits = [];

          let pos = -1;

          for (let i = 0; i < newState.patientData[npid][newState.module].visits.length; i++) {

            const row = newState.patientData[npid][newState.module].visits[i];

            if (Object.keys(row)[0] === today) {

              pos = i;

              break;

            }

          }

          let data = action.payload.data;

          delete data.date;
          delete data.primaryId;

          if (pos >= 0) {

            Object
              .keys(action.payload.data)
              .forEach((key) => {

                newState.patientData[npid][newState.module].visits[pos][today][key] = {
                  ...newState.patientData[npid][newState.module].visits[pos][today][key],
                  ...action.payload.data[key]
                };

              })

          } else {

            pos = newState.patientData[npid][newState.module].visits.length;

            newState
              .patientData[npid][newState.module]
              .visits
              .push({ [today]: action.payload.data })

          }

          newState.currentPatient = Object.assign({}, newState.patientData[npid]);

          if (newState.patientData[npid] && newState.patientData[npid][newState.module] && newState.patientData[npid][newState.module].visits && newState.patientData[npid][newState.module].visits[pos] && newState.patientData[npid][newState.module].visits[pos][today]) {

            Object
              .keys(newState.patientData[npid][newState.module].visits[pos][today])
              .forEach((key) => {

                for (let j = 0; j < newState.programs.length; j++) {

                  const program = newState.programs[j];

                  if (program.name === newState.module) {

                    for (let k = 0; k < program.tasks.length; k++) {

                      if (program.tasks[k].label === key) {

                        program.tasks[k].done = true;

                      }

                    }

                  }

                }

              })

          }

        } else {

          const npid = (action.payload.data.npid && action.payload.data.npid.trim().length > 0
            ? action.payload.data.npid
            : action.payload.data.otherId);

          newState.patientData[npid] = Object.assign({}, action.payload.data);

          today = (new Date()).format("d mmm YYYY");

          let pos = -1;

          if (!newState.patientData)
            newState.patientData = {};

          if (!newState.patientData[npid])
            newState.patientData[npid] = {};

          if (!newState.patientData[npid][newState.module])
            newState.patientData[npid][newState.module] = {};

          if (!newState.patientData[npid][newState.module].visits)
            newState.patientData[npid][newState.module].visits = [];

          for (let i = 0; i < newState.patientData[npid][newState.module].visits.length; i++) {

            const row = newState.patientData[npid][newState.module].visits[i];

            if (Object.keys(row)[0] === today) {

              pos = i;

              break;

            }

          }

          newState.currentPatient = Object.assign({}, newState.patientData[npid]);

          if (pos >= 0 && newState.patientData[npid] && newState.patientData[npid][newState.module] && newState.patientData[npid][newState.module].visits && newState.patientData[npid][newState.module].visits[pos] && newState.patientData[npid][newState.module].visits[pos][today]) {

            Object
              .keys(newState.patientData[npid][newState.module].visits[pos][today])
              .forEach((key) => {

                for (let j = 0; j < newState.programs.length; j++) {

                  const program = newState.programs[j];

                  if (program.name === newState.module) {

                    for (let k = 0; k < program.tasks.length; k++) {

                      if (program.tasks[k].label === key) {

                        program.tasks[k].done = true;

                      }

                    }

                  }

                }

              })

          }

        }

      } else if (newState.sectionHeader === "Find or Register Client") {

        newState = Object.assign({}, state, {
          processing: false,
          age: (action.payload.data && action.payload.data.age
            ? action.payload.data.age
            : ""),
          gender: (action.payload.data && action.payload.data.gender
            ? (genders[action.payload.data.gender] ? genders[action.payload.data.gender] : action.payload.data.gender)
            : ""),
          otherId: (action.payload.data && action.payload.data.otherId
            ? action.payload.data.otherId
            : ""),
          npid: (action.payload.data && action.payload.data.npid
            ? action.payload.data.npid
            : ""),
          otherIdType: (action.payload.data && action.payload.data.otherIdType
            ? action.payload.data.otherIdType
            : ""),
          patientName: (action.payload.data && action.payload.data.patientName
            ? action.payload.data.patientName
            : "")
        });

        newState.currentPatient = Object.assign({}, action.payload.data);

        const npid = (action.payload.data.npid && action.payload.data.npid.trim().length > 0
          ? action.payload.data.npid
          : action.payload.data.otherId);

        newState.patientData[npid] = Object.assign({}, action.payload.data);

        newState.patientData[npid].gender = (genders[action.payload.data.gender] ? genders[action.payload.data.gender] : action.payload.data.gender);

        newState.currentId = npid;

        newState.clientId = npid;

        today = (new Date()).format("d mmm YYYY");

        let pos = -1;

        if (!newState.patientData)
          newState.patientData = {};

        if (!newState.patientData[npid])
          newState.patientData[npid] = {};

        if (!newState.patientData[npid][newState.module])
          newState.patientData[npid][newState.module] = {};

        if (!newState.patientData[npid][newState.module].visits)
          newState.patientData[npid][newState.module].visits = [];

        for (let i = 0; i < newState.patientData[npid][newState.module].visits.length; i++) {

          const row = newState.patientData[npid][newState.module].visits[i];

          if (Object.keys(row)[0] === today) {

            pos = i;

            break;

          }

        }

        if (pos >= 0 && newState.patientData[npid] && newState.patientData[npid][newState.module] && newState.patientData[npid][newState.module].visits && newState.patientData[npid][newState.module].visits[pos] && newState.patientData[npid][newState.module].visits[pos][today]) {

          Object
            .keys(newState.patientData[npid][newState.module].visits[pos][today])
            .forEach((key) => {

              for (let j = 0; j < newState.programs.length; j++) {

                const program = newState.programs[j];

                if (program.name === newState.module) {

                  for (let k = 0; k < program.tasks.length; k++) {

                    if (program.tasks[k].label === key) {

                      program.tasks[k].done = true;

                    }

                  }

                }

              }

            })

        }

      }

      if (newState.dual) {

        activateSummaries(newState);

      }

      newState.ignore = true;

      if (action.payload && action.payload.data && action.payload.data.message) {

        newState.infoMessage = action.payload.data.message;

      }

      console.log(action);

      if (action.payload && action.payload.data && action.payload.data.canPrint) {

        newState.canPrint = action.payload.data.canPrint;

      }

      return newState;

    case "SUBMIT_FORM_REJECTED":

      newState = Object.assign({}, state, { processing: false });

      if (action.payload && action.payload.response && action.payload.response.data && action.payload.response.data.message) {

        newState.errorMessage = action.payload.response.data.message;

      }

      return newState;

    case "FETCH_JSON_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "FETCH_JSON_FULFILLED":

      const data = Object.assign({}, state.data);

      if (!data[action.payload.data.group])
        data[action.payload.data.group] = {};

      if (!data[action.payload.data.group][action.payload.data.subGroup])
        data[action.payload.data.group][action.payload.data.subGroup] = {};

      data[action.payload.data.group][action.payload.data.subGroup].data = action.payload.data.data;

      data[action.payload.data.group][action.payload.data.subGroup].configs = action.payload.data.configs;

      data[action.payload.data.group][action.payload.data.subGroup].ignores = action.payload.data.ignores;

      data[action.payload.data.group].order = action.payload.data.order;

      if (action.payload.data.referrals && Object.keys(action.payload.data.referrals).length > 0)
        data[action.payload.data.group].referrals = action.payload.data.referrals;

      newState = Object.assign({}, state, {
        data: data,
        order: action.payload.data.order,
        processing: false
      });

      processData(newState, action);

      return newState;

    case "FETCH_PATIENT_DATA_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "FETCH_PATIENT_DATA_FULFILLED":

      newState = Object.assign({}, state, { processing: false });

      let payload = Object.assign({}, action.payload.data);

      if (Object.keys(payload).length === 1) {

        primaryId = payload.primaryId;

        delete payload.primaryId;

        newState.patientData[primaryId] = Object.assign({}, newState.patientData[primaryId], payload);

        newState.currentPatient = Object.assign({}, action.payload.data);

        newState.currentMatches = [];

        processData(newState, action);

      } else {

        newState.currentPatient = {};

        newState.currentMatches = Object.assign({}, action.payload.data);

      }

      return newState;

    case "VOID_ENCOUNTER_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "VOID_ENCOUNTER_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        refresh: true
      });

      return newState;

    case "FETCHING_VISITS":

      newState = Object.assign({}, state, { processing: false });

      if (newState.refresh && newState.patientData[action.payload] && newState.patientData[action.payload][newState.module]) {

        newState.patientData[action.payload][newState.module] = {};

        newState.refresh = false;

      }

      return newState;

    case "FETCHED_VISIT":

      newState = Object.assign({}, state);

      const program = (action.payload.program
        ? action.payload.program.replace(/program/i, "").trim()
        : null);

      const identifier = (action.payload.identifier
        ? action.payload.identifier.trim()
        : null);

      const encounterId = (action.payload.encounterId
        ? action.payload.encounterId
        : null);

      const encounterType = (action.payload.encounterType
        ? action.payload.encounterType
        : null);

      const visitDate = (action.payload.visitDate
        ? (new Date(action.payload.visitDate)).format("d mmm YYYY")
        : null);

      const observation = (action.payload.observation
        ? action.payload.observation.trim()
        : null);

      const observationValue = (String(action.payload.observationValue).trim().length > 0
        ? String(action.payload.observationValue).trim()
        : null);

      const registerNumber = (action.payload.registerNumber
        ? String(action.payload.registerNumber).trim()
        : null);

      const entryCode = (action.payload.entryCode
        ? String(action.payload.entryCode).trim()
        : null);

      if (program !== null && identifier !== null && encounterId !== null && encounterType !== null && visitDate !== null && observation !== null && observationValue !== null) {

        let pos = -1;

        if (!newState.patientData)
          newState.patientData = {};

        if (!newState.patientData[identifier])
          newState.patientData[identifier] = {};

        if (!newState.patientData[identifier][program])
          newState.patientData[identifier][program] = {};

        if (!newState.patientData[identifier][program].visits)
          newState.patientData[identifier][program].visits = [];

        for (let i = 0; i < newState.patientData[identifier][program].visits.length; i++) {

          const row = newState.patientData[identifier][program].visits[i];

          if (Object.keys(row)[0] === visitDate) {

            pos = i;

            break;

          }

        }

        if (pos >= 0) {

          if (!newState.patientData[identifier][program].visits[pos][visitDate][entryCode]) {
            newState.patientData[identifier][program].visits[pos][visitDate][entryCode] = {};
          }

          if (!newState.patientData[identifier][program].visits[pos][visitDate][entryCode][encounterType]) {
            newState.patientData[identifier][program].visits[pos][visitDate][entryCode][encounterType] = {};
          }

          newState.patientData[identifier][program].visits[pos][visitDate][entryCode][encounterType][observation] = observationValue;

          newState.patientData[identifier][program].visits[pos][visitDate][entryCode][encounterType].encounterId = encounterId;

          if (registerNumber) {
            newState.patientData[identifier][program].visits[pos][visitDate][entryCode][encounterType].registerNumber = registerNumber;
          }

        } else {

          const entry = {
            [visitDate]: {
              [entryCode]: {
                [encounterType]: {
                  [observation]: observationValue,
                  encounterId
                }
              }
            }
          };

          if (registerNumber)
            entry[visitDate][entryCode][encounterType].registerNumber = registerNumber;

          newState
            .patientData[identifier][program]
            .visits
            .push(entry);

        }

      }

      return newState;

    case "FETCH_VISITS_DONE":

      newState = Object.assign({}, state, { processing: false });

      if (action.payload.id && action.payload.flashId && newState.patientData[action.payload.id] && newState.patientData[action.payload.id][newState.module] && newState.patientData[action.payload.id][newState.module].visits) {

        let pos = -1;

        for (let i = 0; i < newState.patientData[action.payload.id][newState.module].visits.length; i++) {

          const row = newState.patientData[action.payload.id][newState.module].visits[i];

          if (Object.keys(row)[0] === newState.selectedVisit) {

            pos = i;

            break;

          }

        }

        if (pos >= 0 && newState.patientData[action.payload.id][newState.module].visits[pos] && newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit]) {

          Object
            .keys(newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit])
            .forEach((key) => {

              if (newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit] && newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit][key] && newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit][key].encounterId && newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit][key].encounterId === action.payload.flashId) {

                delete newState.patientData[action.payload.id][newState.module].visits[pos][newState.selectedVisit][key];

                for (let j = 0; j < newState.programs.length; j++) {

                  const program = newState.programs[j];

                  if (program.name === newState.module) {

                    for (let k = 0; k < program.tasks.length; k++) {

                      if (program.tasks[k].label === key) {

                        program.tasks[k].done = false;

                      }

                    }

                  }

                }

              }

            })

        }

      }

      return newState;

    case "FETCH_REGISTER_STATS_FULFILLED":

      newState = Object.assign({}, state, {
        activeRegisters: (action.payload.data.active || 0),
        closedRegisters: (action.payload.data.closed || 0)
      });

      return newState;

    case "LOGOUT_FULFILLED":

      newState = Object.assign({}, state, {
        activeUser: null,
        currentLocation: null,
        activeLocation: null,
        location: null,
        role: null,
        accessToken: null
      });

      return newState;

    case "LOGIN_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "LOGIN_FULFILLED":

      newState = Object.assign({}, state, {
        activeUser: action.payload.data.username,
        currentLocation: null,
        activeLocation: null,
        location: null,
        role: action.payload.data.role,
        accessToken: action.payload.data.accessToken,
        processing: false
      });

      return newState;

    case "LOGIN_REJECTED":

      newState = Object.assign({}, state, {
        activeUser: null,
        currentLocation: null,
        activeLocation: null,
        location: null,
        role: null,
        accessToken: null,
        processing: false
      });

      return newState;

    case "SET_LOCATION_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "SET_LOCATION_REJECTED":

      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "SET_LOCATION_FULFILLED":

      newState = Object.assign({}, state, {
        currentLocation: action.payload.data.location,
        activeLocation: action.payload.data.location,
        location: action.payload.data.location,
        processing: false
      });

      return newState;

    case "SESSION_VALID_PENDING":

      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "SESSION_VALID_FULFILLED":

      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "SESSION_VALID_REJECTED":

      newState = Object.assign({}, state, {
        activeUser: null,
        currentLocation: null,
        activeLocation: null,
        location: null,
        role: null,
        accessToken: null,
        processing: false
      });

      return newState;

    case "FETCH_USERS_FULFILLED":

      newState = Object.assign({}, state, {
        usersList: action.payload.data.users,
        page: action.payload.data.page,
        pages: action.payload.data.pages,
        processing: false
      });

      return newState;

    case "BLOCK_USER_FULFILLED":

      newState = Object.assign({}, state, {
        usersList: action.payload.data,
        processing: false
      });

      return newState;

    case "ACTIVATE_USER_FULFILLED":

      newState = Object.assign({}, state, {
        usersList: action.payload.data,
        processing: false
      });

      return newState;

    case "LOAD_DATA":

      newState = Object.assign({}, state, { processing: false });

      if (!newState.data[action.payload.data.group])
        newState.data[action.payload.data.group] = {};

      if (!newState.data[action.payload.data.group][action.payload.data.subGroup])
        newState.data[action.payload.data.group][action.payload.data.subGroup] = {};

      if (action.payload.data.data)
        newState.data[action.payload.data.group][action.payload.data.subGroup].data = action.payload.data.data;

      if (action.payload.data.configs)
        newState.data[action.payload.data.group][action.payload.data.subGroup].configs = action.payload.data.configs;

      if (action.payload.data.ignores)
        newState.data[action.payload.data.group][action.payload.data.subGroup].ignores = action.payload.data.ignores;

      return newState;

    case "FLAG_REGISTER_FILLED":

      newState = Object.assign({}, state);

      let pos = -1;

      for (let i = 0; i < newState.patientData[action.payload.data.clientId][action.payload.data.module].visits.length; i++) {

        const row = newState.patientData[action.payload.data.clientId][action.payload.data.module].visits[i];

        if (Object.keys(row)[0] === action.payload.data.visitDate) {

          pos = i;

          break;

        }

      }

      if (pos >= 0) {

        newState.patientData[action.payload.data.clientId][action.payload.data.module].visits[pos][action.payload.data.visitDate][action.payload.data.entryCode]["HTS Visit"].registerNumber = -1;

      }

      newState.flagged[action.payload.data.clientId] = true;

      return newState;

    case "UPDATE_PARTNER_RECORD":

      newState = Object.assign({}, state);

      return newState;

    case "GET_VERSION_FULFILLED":

      newState = Object.assign({}, state, { version: action.payload.data.version });

      return newState;

    case "USERNAME_VALID_FULFILLED":

      newState = Object.assign({}, state, { usernameValid: action.payload.data.valid });

      return newState;

    case "USERNAME_VALID_REJECTED":

      newState = Object.assign({}, state, { usernameValid: false });

      return newState;

    case "REDIRECT_TO_PORTAL_FULFILLED":

      newState = Object.assign({}, state, { redirect_to_portal: action.payload.data.redirect_to_portal, portal_url: action.payload.data.portal_url });

      return newState;

    default:

      return state;

  }

}
