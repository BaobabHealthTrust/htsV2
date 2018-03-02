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

export function validated(props, state) {

  let valid = false;
  let msg = "Required field empty!";

  if (!props.wf.responses || (props.wf.responses && !props.wf.responses[state.currentWorkflow]) || (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].length <= 0)) {

    return {valid: false, message: msg};

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("optional") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].optional === true) {

    return {valid: true, message: null};

  }

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("visible") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].visible === false) {

    return {valid: true, message: null};

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
          : ""]).indexOf("validatorMessage") >= 0
        ? props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].validatorMessage
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

    let parts = params.split(" ");

    if (parts.length === 1) {

      if (Object.keys(tokens).indexOf(parts[0]) >= 0) {

        if (parts[0] === "age") {

          if (ageToDays(currentValue) < tokens.age) {

            return {valid: true, message: null};

          } else {

            return {valid: false, message: "Value less than expected minimum"};

          }

        }

      }

    }

    // return {valid: true, message: null};

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

        return {valid: false, message: "Value less than expected minimum"};

      }

    } else if (String(params).trim().match(/^thisyear$/i)) {

      if ((new Date()).getFullYear() > parseInt(currentValue, 10)) {

        return {valid: false, message: "Value less than expected minimum"};

      }

    } else if (String(params).trim().match(/^thisyear\s-\s(\d+)$/i)) {

      let parts = String(params)
        .trim()
        .match(/^thisyear\s-\s(\d+)$/i);

      if (((new Date()).getFullYear() - parseInt(parts[1], 10)) > parseInt(currentValue, 10)) {

        return {valid: false, message: "Value less than expected minimum"};

      }

    }

    // return {valid: true, message: null};

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

        return {valid: false, message: "Value greater than expected maximum"};

      }

    } else if (String(params).trim().match(/^thisyear$/i)) {

      if ((new Date()).getFullYear() < parseInt(currentValue, 10)) {

        return {valid: false, message: "Value greater than expected maximum"};

      }

    } else if (String(params).trim().match(/^thisyear\s\+\s(\d+)$/i)) {

      let parts = String(params)
        .trim()
        .match(/^thisyear\s\+\s(\d+)$/i);

      if (((new Date()).getFullYear() + parseInt(parts[1], 10)) < parseInt(currentValue, 10)) {

        return {valid: false, message: "Value greater than expected maximum"};

      }

    }

    // return {valid: true, message: null};

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

      return {valid: false, message: "Please select only values from the provided list!"};

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
  }

  return {valid: valid, message: msg};

}