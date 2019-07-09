import axios from "axios";
import oboe from "oboe";

export function fetchReport(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY, { timeout: 3000 });

  return { type: 'FETCH_REPORT', payload: request }

}

export function setPeriod(payload) {

  return { type: 'SET_PERIOD', payload: payload }

}

export function setRawData(data) {
  return { type: "SET_RAW_DATA", payload: data }
}

export function resetRawData() {

  return { type: "RESET_RAW_DATA" };

}

export function setDailyRawData(data) {
  return { type: "SET_DAILY_RAW_DATA", payload: data }
}

export function resetDailyRawData() {

  return { type: "RESET_DAILY_RAW_DATA" };

}

export function setDataHeaders(payload) {

  return { type: "SET_DATA_HEADERS", payload };

}

export function fetchDailyRegister(sMonth, sYear, location, kitType, kitName) {

  return (dispatch) => {

    dispatch({ type: "FETCH_DAILY_REGISTER_PENDING" });

    oboe("/test_kits?t=" + encodeURIComponent(kitType) + "&sm=" + sMonth + "&sy=" + sYear + "&l=" + encodeURIComponent(location) + "&n=" + encodeURIComponent(kitName))
      .on('node', 'row', function (row) {

        dispatch({ type: "FETCH_DAILY_REGISTER", payload: row })

      })
      .done(() => {

        dispatch({ type: "FETCH_DAILY_REGISTER_FULFILLED" });

      })

  }

}

export function fetchVisitSummaries(month, year) {

  return (dispatch) => {

    dispatch({ type: "FETCH_VISIT_SUMMARIES_PENDING" });

    oboe("/visit_summaries?m=" + month + "&y=" + year).on('node', 'row', function (row) {

      dispatch({ type: "FETCH_VISIT_SUMMARIES", payload: row })

    }).done(() => {

      dispatch({ type: "FETCH_VISIT_SUMMARIES_FULFILLED" });

    })

  }

}

export function fetchPepfarData(baseUrl, sMonth, sYear, eMonth, eYear, modality, startPos = 0, endPos = 20, sDate, eDate) {

  return (dispatch) => {

    dispatch({ type: "FETCH_PEPFAR_DATA_PENDING" });

    oboe(baseUrl + "?sm=" + sMonth + "&sy=" + sYear + "&em=" + eMonth + "&ey=" + eYear + "&s=" + startPos + "&e=" + endPos + (modality ? "&m=" + modality : "") + "&sd=" + sDate + "&ed=" + eDate).on('node', 'row', function (row) {

      dispatch({ type: "FETCH_PEPFAR_DATA", payload: row })

    }).done(() => {

      dispatch({ type: "FETCH_PEPFAR_DATA_FULFILLED" });

    })

  }

}

export function resetPepfarData() {

  return { type: "RESET_PEPFAR_DATA" };

}

export function fetchFilteredVisitSummaries(month1, year1, date1, month2, year2, date2) {

  return (dispatch) => {

    dispatch({ type: "FETCH_FILTERED_VISIT_SUMMARIES_PENDING" });

    oboe("/filtered_visit_summaries?m1=" + month1 + "&y1=" + year1 + "&d1=" + date1 + "&m2=" + month2 +
      "&y2=" + year2 + "&d2=" + date2).on('node', 'row', function (row) {

        dispatch({ type: "FETCH_FILTERED_VISIT_SUMMARIES", payload: row })

      }).done(() => {

        dispatch({ type: "FETCH_FILTERED_VISIT_SUMMARIES_FULFILLED" });

      })

  }

}
