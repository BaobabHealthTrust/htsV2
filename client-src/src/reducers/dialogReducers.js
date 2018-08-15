import tests from '../config/tests';
import locations from '../config/pepfarLocations';

const months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

const testNames = (tests
  ? Object.keys(tests).map(e => {
    return tests[e]
  })
  : []);

export default function dialogReducers(state = {
  start: {
    numericalMonth: (new Date()).getMonth(),
    reportMonth: months[(new Date()).getMonth()],
    reportYear: (new Date()).getFullYear()
  },
  end: {
    numericalMonth: (new Date()).getMonth(),
    reportMonth: months[(new Date()).getMonth()],
    reportYear: (new Date()).getFullYear()
  },
  location: (locations && locations.length > 0
    ? locations[0]
    : null),
  test: (testNames && testNames.length > 0
    ? testNames[0]
    : null),
  testType: (testNames && testNames.length > 0
    ? Object.keys(tests).filter(e => {
      return tests[e] === testNames[0]
    })[0]
    : null)
}, action) {

  let newState,
    index;

  switch (action.type) {

    case "SHOW_DIALOG":

      newState = Object.assign({}, state, action.payload);

      return newState;

    case "CLOSE_DIALOG":

      newState = Object.assign({}, state, { title: null });

      return newState;

    case "INCREMENT_MONTH":

      newState = Object.assign({}, state);

      if (newState[action.payload] && newState[action.payload].numericalMonth < 12 && (new Date(newState[action.payload].reportYear, newState[action.payload].numericalMonth + 1, 1)) < (new Date())) {

        newState[action.payload].numericalMonth += 1;

        newState[action.payload].reportMonth = months[newState[action.payload].numericalMonth];

      }

      return newState;

    case "INCREMENT_YEAR":

      newState = Object.assign({}, state);

      if (newState[action.payload] && newState[action.payload].reportYear < (new Date()).getFullYear()) {

        newState[action.payload].reportYear += 1;

      }

      return newState;

    case "DECREMENT_MONTH":

      newState = Object.assign({}, state);

      if (newState[action.payload] && newState[action.payload].numericalMonth > 0) {

        newState[action.payload].numericalMonth -= 1;

        newState[action.payload].reportMonth = months[newState[action.payload].numericalMonth];

      }

      return newState;

    case "DECREMENT_YEAR":

      newState = Object.assign({}, state);

      if (newState[action.payload] && newState[action.payload].reportYear > 1970) {

        newState[action.payload].reportYear -= 1;

      }

      return newState;

    case "SCROLL_LOCATION_UP":

      newState = Object.assign({}, state);

      index = (newState.location !== null
        ? (locations || []).indexOf(newState.location)
        : -1);

      if (index - 1 >= 0) {

        index -= 1;

      } else {

        index = (locations.length - 1);

      }

      if (index >= 0)
        newState.location = locations[index];

      return newState;

    case "SCROLL_LOCATION_DOWN":

      newState = Object.assign({}, state);

      index = (newState.location !== null
        ? (locations || []).indexOf(newState.location)
        : -1);

      if (index + 1 < locations.length) {

        index += 1;

      } else {

        index = 0;

      }

      if (index >= 0)
        newState.location = locations[index];

      return newState;

    case "SCROLL_TEST_UP":

      newState = Object.assign({}, state);

      index = (newState.test !== null
        ? (testNames || []).indexOf(newState.test)
        : -1);

      if (index - 1 >= 0) {

        index -= 1;

      } else {

        index = (testNames.length - 1);

      }

      if (index >= 0) {

        newState.test = testNames[index];

        newState.testType = Object
          .keys(tests)
          .filter(e => {
            return tests[e] === newState.test
          })[0];

      }

      return newState;

    case "SCROLL_TEST_DOWN":

      newState = Object.assign({}, state);

      index = (newState.test !== null
        ? (testNames || []).indexOf(newState.test)
        : -1);

      if (index + 1 < testNames.length) {

        index += 1;

      } else {

        index = 0;

      }

      if (index >= 0) {

        newState.test = testNames[index];

        newState.testType = Object
          .keys(tests)
          .filter(e => {
            return tests[e] === newState.test
          })[0];

      }

      return newState;

    case "UPDATE_REPORT_FIELD":

      newState = Object.assign({}, state);

      const entry = {};

      entry[action.payload.field] = action.payload.result;

      newState[action.payload.group] = Object.assign({}, newState[action.payload.group], entry);

      return newState;

    default:

      return state;

  }

}
