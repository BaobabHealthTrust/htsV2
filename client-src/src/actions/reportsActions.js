import axios from "axios";
import oboe from "oboe";

export function fetchReport(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY, {timeout: 3000});

  return {type: 'FETCH_REPORT', payload: request}

}

export function setPeriod(payload) {

  return {type: 'SET_PERIOD', payload: payload}

}

export function fetchRaw(baseUrl, sMonth, sYear, eMonth, eYear) {

  return (dispatch) => {

    dispatch({type: "FETCH_RAW_DATA_PENDING"});

    oboe(baseUrl + "?sm=" + sMonth + "&sy=" + sYear + "&em=" + eMonth + "&ey=" + eYear).on('node', 'row', function (row) {

      dispatch({type: "FETCH_RAW_DATA", payload: row})

    }).done(() => {

      dispatch({type: "FETCH_RAW_DATA_FULFILLED"});

    })

  }

}

export function resetRawData() {

  return {type: "RESET_RAW_DATA"};

}

export function setDataHeaders(payload) {

  return {type: "SET_DATA_HEADERS", payload};

}

export function fetchDailyRegister(sMonth, sYear, location, kitType, kitName) {

  return (dispatch) => {

    dispatch({type: "FETCH_DAILY_REGISTER_PENDING"});

    oboe("/test_kits?t=" + encodeURIComponent(kitType) + "&sm=" + sMonth + "&sy=" + sYear + "&l=" + encodeURIComponent(location) + "&n=" + encodeURIComponent(kitName))
      .on('node', 'row', function (row) {

        dispatch({type: "FETCH_DAILY_REGISTER", payload: row})

      })
      .done(() => {

        dispatch({type: "FETCH_DAILY_REGISTER_FULFILLED"});

      })

  }

}

export function fetchVisitSummaries(month, year) {

  return (dispatch) => {

    dispatch({type: "FETCH_VISIT_SUMMARIES_PENDING"});

    oboe("/visit_summaries?m=" + month + "&y=" + year).on('node', 'row', function (row) {

      dispatch({type: "FETCH_VISIT_SUMMARIES", payload: row})

    }).done(() => {

      dispatch({type: "FETCH_VISIT_SUMMARIES_FULFILLED"});

    })

  }

}

export function fetchPepfarData(baseUrl, sMonth, sYear, eMonth, eYear, startPos = 0, endPos = 20) {

  return (dispatch) => {

    dispatch({type: "FETCH_PEPFAR_DATA_PENDING"});

    oboe(baseUrl + "?sm=" + sMonth + "&sy=" + sYear + "&em=" + eMonth + "&ey=" + eYear + "&s=" + startPos + "&e=" + endPos).on('node', 'row', function (row) {

      dispatch({type: "FETCH_PEPFAR_DATA", payload: row})

    }).done(() => {

      dispatch({type: "FETCH_PEPFAR_DATA_FULFILLED"});

    })

  }

}

export function resetPepfarData() {

  return {type: "RESET_PEPFAR_DATA"};

}
