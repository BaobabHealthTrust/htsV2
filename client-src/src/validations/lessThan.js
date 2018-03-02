export function lessThan(props, state) {

  let result = "No";

  const field = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[0];

  const number = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[2];

  const units = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[4];

  // eslint-disable-next-line
  const encounterType = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[3];

  const currentPatient = (props.app.currentId && props.app.patientData && props.app.patientData[props.app.currentId]
    ? props.app.patientData[props.app.currentId]
    : {});

  switch (units.trim().toLowerCase()) {

    case "months":

      let age = (currentPatient && currentPatient[field]
        ? currentPatient[field]
        : null);

      if (age !== null) {

        if (String(age).trim().match(/d$/i)) {

          let tmp = String(age)
            .trim()
            .replace(/d/gi, "");

          age = parseFloat(tmp) / 365.0;

        } else if (String(age).trim().match(/w$/i)) {

          let tmp = String(age)
            .trim()
            .replace(/w/gi, "");

          age = parseFloat(tmp) / 52;

        } else if (String(age).trim().match(/m$/i)) {

          let tmp = String(age)
            .trim()
            .replace(/m/gi, "");

          age = parseFloat(tmp) / 12;

        } else if (String(age).trim().match(/y$/i)) {

          let tmp = String(age)
            .trim()
            .replace(/y/gi, "");

          age = parseFloat(tmp);

        } else if (!isNaN(age)) {

          age = parseFloat(age);

        } else {

          age = null;

        }

        if (age !== null) {

          age = age * 12;

        }

      }

      if (age !== null && age < parseFloat(number)) {

        result = "Yes";

      } else {

        result = "No";

      }

      break;

    default:

      break;

  }

  return result;

}
