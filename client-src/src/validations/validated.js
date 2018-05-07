const ageToDays = (age) => {

  const parts = String(age)
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

const evalInline = (msg, lDelim = '{{', rDelim = '}}') => {

  const re = new RegExp(lDelim + '[^' + rDelim + ']+' + rDelim, 'g');
  const parts = msg.match(re);

  let result = String(msg);

  const thisYear = (new Date()).getFullYear();

  parts.forEach(part => {

    let row = String(part)
      .replace((new RegExp(lDelim, 'g')), '')
      .replace((new RegExp(rDelim, 'g')), '')
      .replace(/thisyear/ig, thisYear);

    // eslint-disable-next-line
    row = eval(row);

    result = result.replace((new RegExp(part, 'g')), row);

  });

  return result;

}

export function validated(props, state) {

  let valid = true;
  let msg = "Required field empty!";
  let title = "Error";

  if (!props.wf.responses || (props.wf.responses && !props.wf.responses[state.currentWorkflow]) || (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length <= 0)) {

    return { valid: false, msg };

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("optional") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].optional === true) {

    valid = true;
    msg = "";

  } else if (props.wf && (!props.wf.responses || (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length <= 0 && props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""]).indexOf("optional") < 0))) {

    return {
      valid: false, message: (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""]).indexOf("validationMessage") >= 0
        ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].validationMessage
        : msg)
    }

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("visible") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].visible === false) {

    valid = true;
    msg = "";

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("validator") >= 0 && !props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].validator(props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""])) {

    return {
      valid: false,
      message: (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""]).indexOf("validationMessage") >= 0
        ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].validationMessage
        : "Invalid value entered")
    };

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("minDuration") >= 0) {

    let params = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].minDuration;

    let tokens = {
      today: (new Date()),
      age: (props.app && props.app.currentId && props.app.patientData && props.app.patientData[props.app.currentId].age
        ? ageToDays(props.app.patientData[props.app.currentId].age)
        : 0)
    }

    let currentValue = (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]
      ? props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]
      : "");

    if (currentValue.trim().length <= 0) {

      return {
        valid: false, title: "Missing data", message: (props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : "Required field") + " \n must be entered"
      };

    }

    let parts = params.split(" ");

    if (parts.length === 1) {

      if (Object.keys(tokens).indexOf(parts[0]) >= 0) {

        if (parts[0] === "age") {

          if (ageToDays(currentValue) < tokens.age) {

            valid = true;
            msg = "";

          } else {

            return {
              valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
                ? props.wf[state.currentWorkflow].currentNode.label
                : ""].validationMessage ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
                  ? props.wf[state.currentWorkflow].currentNode.label
                  : ""].validationMessage : "Value less than expected minimum")
            };

          }

        }

      }

    }

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("min") >= 0) {

    let params = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].min;

    let currentValue = (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]
      ? props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]
      : "");

    if (String(params).trim().match(/^\d+$/)) {

      if (parseInt(String(params).trim(), 10) > parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage : "Value less than expected minimum")
        };

      }

    } else if (String(params).trim().match(/^thisyear$/i)) {

      if ((new Date()).getFullYear() > parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? evalInline(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage) : "Value less than expected minimum")
        };

      }

    } else if (String(params).trim().match(/^thisyear\s-\s(\d+)$/i)) {

      let parts = String(params)
        .trim()
        .match(/^thisyear\s-\s(\d+)$/i);

      if (((new Date()).getFullYear() - parseInt(parts[1], 10)) > parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? evalInline(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage) : "Value less than expected minimum")
        };

      }

    }

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("max") >= 0) {

    let params = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].max;

    let currentValue = (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]
      ? props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]
      : "");

    if (String(params).trim().match(/^\d+$/)) {

      if (parseInt(String(params).trim(), 10) < parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage : "Value greater than expected maximum")
        };

      }

    } else if (String(params).trim().match(/^thisyear$/i)) {

      if ((new Date()).getFullYear() < parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? evalInline(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage) : "Value greater than expected maximum")
        };

      }

    } else if (String(params).trim().match(/^thisyear\s\+\s(\d+)$/i)) {

      let parts = String(params)
        .trim()
        .match(/^thisyear\s\+\s(\d+)$/i);

      if (((new Date()).getFullYear() + parseInt(parts[1], 10)) < parseInt(currentValue, 10)) {

        return {
          valid: false, message: (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validationMessage ? evalInline(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationMessage) : "Value greater than expected maximum")
        };

      }

    }

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("lockList") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].lockList === true && props.data && Array.isArray(props.data)) {

    let currentValue = (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]
      ? props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]
      : "");

    if (props.data.indexOf(currentValue) < 0) {

      let message = "Select value from provided list only";
      let title = "Invalid Data";

      if (Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]).indexOf("validationMessage") >= 0) {

        message = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].validationMessage;

      }

      if (Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""]).indexOf("title") >= 0 && String(currentValue).trim().length <= 0) {

        title = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].title;

      }

      return { valid: false, message, title };

    }

  }

  if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length > 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].validationRule && !props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].trim().match(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""].validationRule)) {

    valid = false;

    msg = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].validationMessage
      ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].validationMessage
      : "Invalid values entered!";

    title = (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].title ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].title : "Invalid Entry");

  } else if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length > 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""]).indexOf("validationCases") >= 0) {

    valid = true;
    msg = "";
    title = "";

    const rootNode = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].validationCases;

    const fieldValue = props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""];

    for (let rootCase of rootNode.cases) {

      if (String(fieldValue).match(rootCase.patternGroup) && !String(fieldValue).match(rootCase.pattern)) {

        valid = false;

        msg = rootCase.message;

        title = rootCase.title;

        break;

      }

    }

  } else if ((props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length > 0) || (((props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].length <= 0) || (props.wf.responses[state.currentWorkflow] && !props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""])) && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""] && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
                ? props.wf[state.currentWorkflow].currentNode.label
                : ""].optional) || (props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.type
                  ? props.wf[state.currentWorkflow].currentNode.type
                  : "") === "process") {
    valid = true;

    msg = "";

  } else if ((props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.type
    ? props.wf[state.currentWorkflow].currentNode.type
    : "") === "exit") {

    valid = true;
    msg = "";

  } else if ((props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : "") > 0 && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length <= 0) || (props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : "") <= 0)) {

    valid = false;

    if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""] && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].message) {

      msg = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].message;

    } else {

      msg = (props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : "Data") + " \n must be entered";

    }

    if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""] && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].title) {

      title = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].title;

    } else {

      title = "Missing data";

    }

  }

  return { valid: valid, message: msg, title };

}