export function showDialog(title) {

  return {type: "SHOW_DIALOG", payload: {
      title
    }}

}

export function closeDialog() {

  return {type: "CLOSE_DIALOG"}

}

export function incrementReportMonth(group) {

  return {type: "INCREMENT_MONTH", payload: group}

}

export function incrementReportYear(group) {

  return {type: "INCREMENT_YEAR", payload: group}

}

export function decrementReportMonth(group) {

  return {type: "DECREMENT_MONTH", payload: group}

}

export function decrementReportYear(group) {

  return {type: "DECREMENT_YEAR", payload: group}

}

export function scrollLocationUp() {

  return {type: "SCROLL_LOCATION_UP"};

}

export function scrollLocationDown() {

  return {type: "SCROLL_LOCATION_DOWN"};

}

export function scrollTestUp() {

  return {type: "SCROLL_TEST_UP"};

}

export function scrollTestDown() {

  return {type: "SCROLL_TEST_DOWN"};

}