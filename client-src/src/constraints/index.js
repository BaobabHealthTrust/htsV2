const fetchAge = (data) => {

  const parts = String(data.Age)
    .trim()
    .match(/(\d+)([D|W|M|Y])$/);

  if (!parts) {

    return null;

  }

  switch (String(parts[2]).trim().toUpperCase()) {

    case "D":

      return parseInt(String(parts[1]).trim(), 10);

    case "W":

      return parseInt(String(parts[1]).trim(), 10) * 7;

    case "M":

      return parseInt(String(parts[1]).trim(), 10) * 30;

    default:

      return parseInt(String(parts[1]).trim(), 10) * 365;

  }

}

const firstPassTest1Negative = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null,
    group: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Single Negative") {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "New Negative") {

    result.error = true;
    result.message = alertsMapping["New Negative"].message;
    result.title = alertsMapping["New Negative"].title;
    result.group = categories[alertsMapping["New Negative"].category];

  } else if (Object.keys(data).indexOf("Client Risk Category") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Client Risk Category"].message;
    result.title = alertsMapping["Missing Client Risk Category"].title;
    result.group = categories[alertsMapping["Missing Client Risk Category"].category];

  } else if (data["Client Risk Category"] === "Low Risk" && data["Referral for Re-Testing"] !== "No Re-Test needed") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  } else if (["On-going Risk", "High Risk Event in last 3 months"].indexOf(data["Client Risk Category"]) >= 0 && data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const test1And2Positive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  const age = fetchAge(data);

  if (age === null) {

    result.error = true;
    result.message = alertsMapping["Missing or invalid Age"].message;
    result.group = categories[alertsMapping["Missing or invalid Age"].category];
    result.title = "Missing data";

  } else {

    if (age <= ((12 * 30) - 1)) {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Exposed Infant") {

        result.error = true;
        result.message = alertsMapping["New Exposed Infant"].message;
        result.title = alertsMapping["New Exposed Infant"].title;
        result.group = categories[alertsMapping["New Exposed Infant"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    } else {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Positive") {

        result.error = true;
        result.message = alertsMapping["New Positive"].message;
        result.title = alertsMapping["New Positive"].title;
        result.group = categories[alertsMapping["New Positive"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    }

  }

  return result;

}

const test1And2Negative = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Test 1 & 2 Negative") {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "New Negative") {

    result.error = true;
    result.message = alertsMapping["New Negative"].message;
    result.title = alertsMapping["New Negative"].title;
    result.group = categories[alertsMapping["New Negative"].category];

  } else if (Object.keys(data).indexOf("Client Risk Category") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Client Risk Category"].message;
    result.title = alertsMapping["Missing Client Risk Category"].title;
    result.group = categories[alertsMapping["Missing Client Risk Category"].category];

  } else if (data["Client Risk Category"] === "Low Risk" && data["Referral for Re-Testing"] !== "No Re-Test needed") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];

  } else if (["On-going Risk", "High Risk Event in last 3 months"].indexOf(data["Client Risk Category"]) >= 0 && data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const test1And2Discordant = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Test 1 & 2 Discordant") {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "New Inconclusive") {

    result.error = true;
    result.message = alertsMapping["New Inconclusive"].message;
    result.title = alertsMapping["New Inconclusive"].title;
    result.group = categories[alertsMapping["New Inconclusive"].category];

  } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Referral for Re-Testing"].message;
    result.title = alertsMapping["Missing Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

  } else if (data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const firstPassTest1Positive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 2") >= 0) {

    if (["Reactive", "Non-Reactive"].indexOf(data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"]) < 0) {

      result.error = true;
      result.message = alertsMapping["Missing 'First Pass: Test 2' result"].message;
      result.title = alertsMapping["Missing 'First Pass: Test 2' result"].title;
      result.group = categories[alertsMapping["Missing 'First Pass: Test 2' result"].category];
      result.title = alertsMapping["Missing 'First Pass: Test 2' result"].title;

    } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Reactive") {

      result = test1And2Positive(data, alertsMapping, categories);

    } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Non-Reactive") {

      if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("Immediate Repeat") >= 0) {

        if (Object.keys(data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).indexOf("Test 1") >= 0 && Object.keys(data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).indexOf("Test 1") >= 0) {

          if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] === "Reactive" && data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] === "Reactive") {

            return test1And2Positive(data, alertsMapping, categories);

          } else if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] === "Non-Reactive" && data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] === "Non-Reactive") {

            return test1And2Negative(data, alertsMapping, categories);

          } else if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] !== data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"]) {

            return test1And2Discordant(data, alertsMapping, categories);

          }

        } else {

          result.error = true;
          result.message = alertsMapping["Missing 'Immediate Repeat' results"].message;
          result.title = alertsMapping["Missing 'Immediate Repeat' results"].title;
          result.group = categories[alertsMapping["Missing 'Immediate Repeat' results"].category];

        }

      } else {

        result.error = true;
        result.message = alertsMapping["Missing 'Immediate Repeat' results"].message;
        result.title = alertsMapping["Missing 'Immediate Repeat' results"].title;
        result.group = categories[alertsMapping["Missing 'Immediate Repeat' results"].category];

      }

    }

  } else {

    result.error = true;

    result.message = alertsMapping["Missing 'First Pass: Test 2' result"].message;
    result.title = alertsMapping["Missing 'First Pass: Test 2' result"].title;

    result.group = categories[alertsMapping["Missing 'First Pass: Test 2' result"].category];

  }

  return result;

}

const confirmatoryInconclusive = (data, category, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Test 1 & 2 " + category) {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "Confirmatory Inconclusive") {

    result.error = true;
    result.message = alertsMapping["Confirmatory Inconclusive"].message;
    result.title = alertsMapping["Confirmatory Inconclusive"].title;
    result.group = categories[alertsMapping["Confirmatory Inconclusive"].category];

  } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Referral for Re-Testing"].message;
    result.title = alertsMapping["Missing Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

  } else if (data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const confirmatoryPositive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  const age = fetchAge(data);

  if (age === null) {

    result.error = true;
    result.message = alertsMapping["Missing or invalid Age"].message;
    result.title = alertsMapping["Missing or invalid Age"].title;
    result.group = categories[alertsMapping["Missing or invalid Age"].category];

  } else {

    if (age <= ((12 * 30) - 1)) {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Exposed Infant") {

        result.error = true;
        result.message = alertsMapping["New Exposed Infant"].message;
        result.title = alertsMapping["New Exposed Infant"].title;
        result.group = categories[alertsMapping["New Exposed Infant"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    } else if (age >= ((12 * 30) - 1) && age <= (23 * 30)) {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "Confirmatory Positive") {

        result.error = true;
        result.message = alertsMapping["Confirmatory Positive"].message;
        result.title = alertsMapping["Confirmatory Positive"].title;
        result.group = categories[alertsMapping["Confirmatory Positive"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    } else {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "Confirmatory Positive") {

        result.error = true;
        result.message = alertsMapping["Confirmatory Positive"].message;
        result.title = alertsMapping["Confirmatory Positive"].title;
        result.group = categories[alertsMapping["Confirmatory Positive"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "No Re-Test needed") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    }

  }

  return result;

}

const lastPositiveTest1And2Negative = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Test 1 & 2 Negative") {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "Confirmatory Inconclusive") {

    result.error = true;
    result.message = alertsMapping["Confirmatory Inconclusive"].message;
    result.title = alertsMapping["Confirmatory Inconclusive"].title;
    result.group = categories[alertsMapping["Confirmatory Inconclusive"].category];

  } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Referral for Re-Testing"].message;
    result.title = alertsMapping["Missing Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

  } else if (data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const lastPositiveTest1And2Discordant = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("Immediate Repeat") >= 0) {

    if (Object.keys(data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).indexOf("Test 1") >= 0 && Object.keys(data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).indexOf("Test 1") >= 0) {

      if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] === "Reactive" && data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] === "Reactive") {

        return confirmatoryPositive(data, alertsMapping, categories);

      } else if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] === "Non-Reactive" && data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] === "Non-Reactive") {

        return confirmatoryInconclusive(data, "Non-Reactive", alertsMapping, categories);

      } else if (data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] !== data["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"]) {

        return confirmatoryInconclusive(data, "Discordant", alertsMapping, categories);

      }

    } else {

      result.error = true;
      result.message = alertsMapping["Missing 'Immediate Repeat' results"].message;
      result.title = alertsMapping["Missing 'Immediate Repeat' results"].title;
      result.group = categories[alertsMapping["Missing 'Immediate Repeat' results"].category];

    }

  } else {

    result.error = true;
    result.message = alertsMapping["Missing 'Immediate Repeat' results"].message;
    result.title = alertsMapping["Missing 'Immediate Repeat' results"].title;
    result.group = categories[alertsMapping["Missing 'Immediate Repeat' results"].category];

  }

  return result;

}

const lastInconclusiveNewPositive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  const age = fetchAge(data);

  if (age === null) {

    result.error = true;
    result.message = alertsMapping["Missing or invalid Age"].message;
    result.title = alertsMapping["Missing or invalid Age"].title;
    result.group = categories[alertsMapping["Missing or invalid Age"].category];

  } else {

    if (age <= ((12 * 30) - 1)) {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Exposed Infant") {

        result.error = true;
        result.message = alertsMapping["New Exposed Infant"].message;
        result.title = alertsMapping["New Exposed Infant"].title;
        result.group = categories[alertsMapping["New Exposed Infant"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    } else if (age >= ((12 * 30) - 1) && age <= (23 * 30)) {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Positive") {

        result.error = true;
        result.message = alertsMapping["New Positive"].message;
        result.title = alertsMapping["New Positive"].title;
        result.group = categories[alertsMapping["New Positive"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "Confirmatory Test at HIV Clinic") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    } else {

      if (Object.keys(data).indexOf("Outcome Summary") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Outcome Summary"].message;
        result.title = alertsMapping["Missing Outcome Summary"].title;
        result.group = categories[alertsMapping["Missing Outcome Summary"].category];

      } else if (data["Outcome Summary"] !== "Test 1 & 2 Positive") {

        result.error = true;
        result.message = alertsMapping["Invalid Outcome Summary"].message;
        result.title = alertsMapping["Invalid Outcome Summary"].title;
        result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

      } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Result Given to Client"].message;
        result.title = alertsMapping["Missing Result Given to Client"].title;
        result.group = categories[alertsMapping["Missing Result Given to Client"].category];

      } else if (data["Result Given to Client"] !== "New Positive") {

        result.error = true;
        result.message = alertsMapping["New Positive"].message;
        result.title = alertsMapping["New Positive"].title;
        result.group = categories[alertsMapping["New Positive"].category];

      } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

        result.error = true;
        result.message = alertsMapping["Missing Referral for Re-Testing"].message;
        result.title = alertsMapping["Missing Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

      } else if (data["Referral for Re-Testing"] !== "No Re-Test needed") {

        result.error = true;
        result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
        result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
        result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
        result.allowContinue = true;

      }

    }

  }

  return result;

}

const neverTestedOrLastNegative = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("HIV Rapid Test Outcomes") >= 0) {

    if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("First Pass") >= 0) {

      if (Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 1") >= 0) {

        if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Non-Reactive") {

          return firstPassTest1Negative(data, alertsMapping, categories);

        } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Reactive") {

          return firstPassTest1Positive(data, alertsMapping, categories);

        } else {

          result.error = true;
          result.message = alertsMapping["Other error!"].message;
          result.title = alertsMapping["Other error!"].title;
          result.group = categories[alertsMapping["Other error!"].category];

        }

      } else {

        result.error = true;
        result.message = alertsMapping["Missing 'First Pass: Test 1' result"].message;
        result.title = alertsMapping["Missing 'First Pass: Test 1' result"].title;
        result.group = categories[alertsMapping["Missing 'First Pass: Test 1' result"].category];

      }

    } else {

      result.error = true;
      result.message = alertsMapping["Missing 'First Pass' result(s)"].message;
      result.title = alertsMapping["Missing 'First Pass' result(s)"].title;
      result.group = categories[alertsMapping["Missing 'First Pass' result(s)"].category];

    }

  } else {

    result.error = true;
    result.message = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].message;
    result.title = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].title;
    result.group = categories[alertsMapping["Missing 'HIV Rapid Test Outcomes'"].category];

  }

  return result;

}

const lastPositive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("HIV Rapid Test Outcomes") >= 0) {

    if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("First Pass") >= 0) {

      if (Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 1") >= 0 && Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 2") >= 0) {

        if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Reactive" && data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Reactive") {

          return confirmatoryPositive(data, alertsMapping, categories);

        } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Non-Reactive" && data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Non-Reactive") {

          return lastPositiveTest1And2Negative(data, alertsMapping, categories);

        } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] !== data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"]) {

          return lastPositiveTest1And2Discordant(data, alertsMapping, categories);

        }

      } else {

        result.error = true;
        result.message = alertsMapping["Incomplete 'First Pass' result(s)"].message;
        result.title = alertsMapping["Incomplete 'First Pass' result(s)"].title;
        result.group = categories[alertsMapping["Incomplete 'First Pass' result(s)"].category];

      }

    } else {

      result.error = true;
      result.message = alertsMapping["Missing 'First Pass' result(s)"].message;
      result.title = alertsMapping["Missing 'First Pass' result(s)"].title;
      result.group = categories[alertsMapping["Missing 'First Pass' result(s)"].category];

    }

  } else {

    result.error = true;
    result.message = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].message;
    result.title = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].title;
    result.group = categories[alertsMapping["Missing 'HIV Rapid Test Outcomes'"].category];

  }

  return result;

}

const newInconclusive = (data, category, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("Outcome Summary") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Outcome Summary"].message;
    result.title = alertsMapping["Missing Outcome Summary"].title;
    result.group = categories[alertsMapping["Missing Outcome Summary"].category];

  } else if (data["Outcome Summary"] !== "Test 1 & 2 " + category) {

    result.error = true;
    result.message = alertsMapping["Invalid Outcome Summary"].message;
    result.title = alertsMapping["Invalid Outcome Summary"].title;
    result.group = categories[alertsMapping["Invalid Outcome Summary"].category];

  } else if (Object.keys(data).indexOf("Result Given to Client") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Result Given to Client"].message;
    result.title = alertsMapping["Missing Result Given to Client"].title;
    result.group = categories[alertsMapping["Missing Result Given to Client"].category];

  } else if (data["Result Given to Client"] !== "New Inconclusive") {

    result.error = true;
    result.message = alertsMapping["New Inconclusive"].message;
    result.title = alertsMapping["New Inconclusive"].title;
    result.group = categories[alertsMapping["New Inconclusive"].category];

  } else if (Object.keys(data).indexOf("Referral for Re-Testing") < 0) {

    result.error = true;
    result.message = alertsMapping["Missing Referral for Re-Testing"].message;
    result.title = alertsMapping["Missing Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Missing Referral for Re-Testing"].category];

  } else if (data["Referral for Re-Testing"] !== "Re-Test") {

    result.error = true;
    result.message = alertsMapping["Invalid Referral for Re-Testing"].message;
    result.title = alertsMapping["Invalid Referral for Re-Testing"].title;
    result.group = categories[alertsMapping["Invalid Referral for Re-Testing"].category];
    result.allowContinue = true;

  }

  return result;

}

const lastInconclusive = (data, alertsMapping, categories) => {

  let result = {
    error: false,
    message: null
  };

  if (Object.keys(data).indexOf("HIV Rapid Test Outcomes") >= 0) {

    if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("First Pass") >= 0) {

      if (Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 1") >= 0 && Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 2") >= 0) {

        if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Reactive" && data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Reactive") {

          return lastInconclusiveNewPositive(data, alertsMapping, categories);

        } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Non-Reactive" && data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Non-Reactive") {

          return test1And2Negative(data, alertsMapping, categories);

        } else if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] !== data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"]) {

          return newInconclusive(data, "Discordant", alertsMapping, categories);

        }

      } else {

        result.error = true;
        result.message = alertsMapping["Incomplete 'First Pass' result(s)"].message;
        result.title = alertsMapping["Incomplete 'First Pass' result(s)"].title;
        result.group = categories[alertsMapping["Incomplete 'First Pass' result(s)"].category];

      }

    } else {

      result.error = true;
      result.message = alertsMapping["Missing 'First Pass' result(s)"].message;
      result.title = alertsMapping["Missing 'First Pass' result(s)"].title;
      result.group = categories[alertsMapping["Missing 'First Pass' result(s)"].category];

    }

  } else {

    result.error = true;
    result.message = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].message;
    result.title = alertsMapping["Missing 'HIV Rapid Test Outcomes'"].title;
    result.group = categories[alertsMapping["Missing 'HIV Rapid Test Outcomes'"].category];

  }

  return result;

}

module.exports.validate = (data = {}, alertsMapping = {}, categories = {}) => {

  let result = {
    error: false,
    message: null
  };

  const age = fetchAge(data);

  if ((age < 10 * 365 || age > 45 * 365) && data["Sex/Pregnancy"] === "Female Pregnant") {

    result.error = true;
    result.message = alertsMapping["Sex/Pregnancy does not match entered age"].message;
    result.title = alertsMapping["Sex/Pregnancy does not match entered age"].title;
    result.group = categories[alertsMapping["Sex/Pregnancy does not match entered age"].category];

  } else if (Object.keys(data).indexOf("Last HIV Test") >= 0) {

    let nonReactive = false;

    if (Object.keys(data).indexOf("HIV Rapid Test Outcomes") >= 0) {

      if (Object.keys(data["HIV Rapid Test Outcomes"]).indexOf("First Pass") >= 0) {

        if (Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 1") >= 0 && Object.keys(data["HIV Rapid Test Outcomes"]["First Pass"]).indexOf("Test 2") >= 0) {

          if (data["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] === "Non-Reactive" && data["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] === "Non-Reactive") {

            nonReactive = true;

          }

        }

      }

    }

    if (["Never Tested", "Last Negative", "Last Positive"].indexOf(data["Last HIV Test"]) >= 0 && nonReactive) {

      return {
        error: true,
        message: alertsMapping["Invalid Outcome Summary"].message,
        title: alertsMapping["Invalid Outcome Summary"].title,
        group: categories[alertsMapping["Invalid Outcome Summary"].category]
      };

    }

    switch (data["Last HIV Test"]) {

      // eslint-disable-next-line
      case "Never Tested":
      case "Last Negative":

        return neverTestedOrLastNegative(data, alertsMapping, categories);

      case "Last Positive":

        return lastPositive(data, alertsMapping, categories);

      case "Last Inconclusive":

        return lastInconclusive(data, alertsMapping, categories);

      default:
        break;
    }

  } else {

    result.error = true;
    result.message = alertsMapping["Missing 'Last HIV Test'"].message;
    result.title = alertsMapping["Missing 'Last HIV Test'"].title;
    result.group = categories[alertsMapping["Missing 'Last HIV Test'"].category];

  }

  return result;

}
