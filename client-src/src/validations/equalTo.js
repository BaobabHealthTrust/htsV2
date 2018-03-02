export function equal(props, state) {

  let fn,
    currentVisit,
    result;

  // eslint-disable-next-line
  fn = new Function("object", "label", "pattern", 'return (object[label] && String(object[label]).trim() === pattern ? "Yes" : "No"' +
      ')');

  const currentPatient = (props.app.currentId && props.app.patientData && props.app.patientData[props.app.currentId]
    ? props.app.patientData[props.app.currentId]
    : {});

  if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func.length > 2 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[3] === "Patient") {

    if (currentPatient[props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].func[0]] === props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].func[2]) {

      result = "Yes";

    } else {

      result = "No";

    }

  } else {

    currentVisit = currentPatient && props.app.selectedVisit && props.app.module && currentPatient[props.app.module] && currentPatient[props.app.module].visits && currentPatient[props.app.module]
      .visits
      .filter(e => {
        return Object.keys(e)[0] === props.app.selectedVisit;
      })
      .length > 0
      ? currentPatient[props.app.module]
        .visits
        .filter(e => {
          return Object.keys(e)[0] === props.app.selectedVisit;
        })[0][props.app.selectedVisit]
      : {};

    if (currentVisit && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].func.length > 2 && props.app.module) {

      currentVisit = currentVisit[props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[3]];

    }

    if (currentVisit) {

      if (Array.isArray(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].func[0])) {

        let outcome = [];

        props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""]
          .func[0]
          .forEach(e => {

            outcome.push(fn(currentVisit, e, props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
                ? props.wf[state.currentWorkflow].currentNode.label
                : ""].func[2]));

          });

        if (outcome.indexOf("No") >= 0) {

          result = "No";

        } else {

          result = "Yes";

        }

      } else {

        result = fn(currentVisit, props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[0], props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[2]);

      }

    } else {

      if (Array.isArray(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].func[0])) {

        let outcome = [];

        props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
              ? props.wf[state.currentWorkflow].currentNode.label
              : ""]
          .func[0]
          .forEach(e => {

            outcome.push(fn(props.wf.responses && props.wf.responses[state.currentWorkflow]
              ? props.wf.responses[state.currentWorkflow]
              : {}, e, props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
                ? props.wf[state.currentWorkflow].currentNode.label
                : ""].func[2]));

          });

        if (outcome.indexOf("No") >= 0) {

          result = "No";

        } else {

          result = "Yes";

        }

      } else {

        result = fn(props.wf.responses && props.wf.responses[state.currentWorkflow]
          ? props.wf.responses[state.currentWorkflow]
          : {}, props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[0], props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[2]);

      }

    }

  }

  return result;

}
