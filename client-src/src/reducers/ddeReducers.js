export default function ddeReducers(state = {
  matches: {},
  token: null,
  error: false,
  errorMessage: null,
  status: null,
  currentPatient: {},
  processing: false,
  ddeSearchActive: false,
  ignore: false,
  silentProcessing: false
}, action) {

  let newState;

  switch (action.type) {

    case "SET_CONFIG":

      newState = Object.assign({}, state, action.payload);

      return newState;

    case "SEARCH_BY_IDENTIFIER_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "SEARCH_BY_IDENTIFIER_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      if (action.payload.data.data) {

        newState.token = action.payload.data.data.token;
        newState.error = action.payload.data.error;
        newState.errorMessage = action.payload.data.message;
        newState.status = action.payload.data.status;

        newState.matches = Object.assign({}, action.payload.data.data);

      } else {

        newState.currentPatient = Object.assign({}, action.payload.data);

      }

      return newState;

    case "SEARCH_BY_NAME_AND_GENDER_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "SEARCH_BY_NAME_AND_GENDER_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = Object.assign({}, action.payload.data.data);

      return newState;

    case "SEARCH_BY_NAME_AND_GENDER_REJECTED":
      newState = Object.assign(
        {},
        state,
        {
          processing: false,
          silentProcessing: false,
          token: null,
          ddeSearchActive: true,
          error: action.payload,
          errorMessage: action.payload.message,
          status: 500,
          matches: []
        }
      );

      return newState;

    case "ADVANCED_PATIENT_SEARCH_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "ADVANCED_PATIENT_SEARCH_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = Object.assign({}, action.payload.data.data);

      return newState;

    case "VOID_PATIENT_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "VOID_PATIENT_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = Object.assign({}, action.payload.data.data);

      return newState;

    case "ADD_PATIENT_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "ADD_PATIENT_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = {};

      newState.currentPatient = Object.assign({}, action.payload.data.data);

      return newState;

    case "UPDATE_PATIENT_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "UPDATE_PATIENT_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = {};

      newState.currentPatient = Object.assign({}, action.payload.data.data);

      return newState;

    case "MERGE_RECORDS_PENDING":

      newState = Object.assign({}, state);

      if (!newState.ignore) {

        newState.processing = true;

      } else {

        newState.silentProcessing = true;

      }

      return newState;

    case "MERGE_RECORDS_FULFILLED":

      newState = Object.assign({}, state, {
        processing: false,
        ddeSearchActive: true,
        silentProcessing: false
      });

      newState.token = action.payload.data.data.token;
      newState.error = action.payload.data.error;
      newState.errorMessage = action.payload.data.message;
      newState.status = action.payload.data.status;

      newState.matches = {};

      newState.currentPatient = Object.assign({}, action.payload.data.data);

      return newState;

    case "CLEAR_DATA_STRUCTS":

      newState = Object.assign({}, state, {
        matches: {},
        token: null,
        error: false,
        errorMessage: null,
        status: null,
        currentPatient: {},
        processing: false,
        ddeSearchActive: false,
        silentProcessing: false
      });

      return newState;

    case "SELECT_PATIENT":

      newState = Object.assign({}, state, {currentPatient: action.payload});

      return newState;

    default:

      return state;

  }

}
