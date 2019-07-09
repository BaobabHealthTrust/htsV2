export default function reportsReducers(
  state = {
    processing: false,
    rawData: [],
    dailyRawData: [],
    dataHeaders: [],
    location: null,
    test: null,
    testType: null
  },
  action
) {
  let newState;

  switch (action.type) {
    case "SET_PERIOD":
      newState = Object.assign({}, state, action.payload);

      return newState;

    case "FETCH_REPORT_PENDING":
      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "FETCH_REPORT_FULFILLED":
      newState = Object.assign({}, state, { processing: false });

      newState = Object.assign({}, newState, action.payload.data);

      return newState;

    case "SET_RAW_DATA":
      newState = Object.assign({}, state);
      newState.rawData = action.payload;
      return newState;

    case "RESET_RAW_DATA":
      newState = Object.assign({}, state, { rawData: [] });

      return newState;

    case "SET_DAILY_RAW_DATA":
      newState = Object.assign({}, state);
      newState.dailyRawData = action.payload;
      return newState;

    case "RESET_DAILY_RAW_DATA":
      newState = Object.assign({}, state, { dailyRawData: [] });

      return newState;

    case "SET_DATA_HEADERS":
      newState = Object.assign({}, state, { dataHeaders: action.payload });

      return newState;

    case "FETCH_DAILY_REGISTER_PENDING":
      newState = Object.assign({}, state, {
        rawData: [],
        processing: true
      });

      return newState;

    case "FETCH_DAILY_REGISTER":
      newState = Object.assign({}, state);

      newState.rawData.push(action.payload);

      return newState;

    case "FETCH_DAILY_REGISTER_FULFILLED":
      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "FETCH_VISIT_SUMMARIES_PENDING":
      newState = Object.assign({}, state, {
        rawData: [],
        processing: true
      });

      return newState;

    case "FETCH_VISIT_SUMMARIES":
      newState = Object.assign({}, state);

      newState.rawData.push(action.payload);

      return newState;

    case "FETCH_VISIT_SUMMARIES_FULFILLED":
      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "FETCH_PEPFAR_DATA_PENDING":
      newState = Object.assign({}, state, { processing: true });

      return newState;

    case "FETCH_PEPFAR_DATA":
      newState = Object.assign({}, state);

      newState.pepfarData.push(action.payload);

      return newState;

    case "FETCH_PEPFAR_DATA_FULFILLED":
      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "RESET_PEPFAR_DATA":
      newState = Object.assign({}, state, { pepfarData: [] });

      return newState;

    case "FETCH_FILTERED_VISIT_SUMMARIES":
      newState = Object.assign({}, state);

      newState.filteredData.push(action.payload);

      return newState;

    case "FETCH_FILTERED_VISIT_SUMMARIES_FULFILLED":
      newState = Object.assign({}, state, { processing: false });

      return newState;

    case "FETCH_FILTERED_VISIT_SUMMARIES_PENDING":
      newState = Object.assign({}, state, {
        filteredData: [],
        processing: true
      });

      return newState;

    default:
      return state;
  }
}
