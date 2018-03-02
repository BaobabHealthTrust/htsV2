export function greaterThan(props, state) {

  let result;

  const fieldG = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[0];

  const numberG = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[2];

  const unitsG = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[4];

  const encounterTypeG = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[3];

  const currentPatient = (props.app.currentId && props.app.patientData && props.app.patientData[props.app.currentId]
    ? props.app.patientData[props.app.currentId]
    : {});

  switch (unitsG.trim().toLowerCase()) {
    case "months":
      const parts = String(currentPatient && currentPatient[fieldG] !== undefined
        ? currentPatient[fieldG]
        : currentPatient && currentPatient[props.module] && currentPatient[props.module][encounterTypeG] && currentPatient[props.module][encounterTypeG][fieldG]
          ? currentPatient[props.module][encounterTypeG][fieldG]
          : "")
        .trim()
        .match(/^(\d+)(.+)*/);

      if (parts) {
        if (parts[2]) {
          result = "Yes";
        } else {
          if (parseInt(parts[1], 10) * 12 > parseInt(numberG, 10)) {
            result = "Yes";
          } else {
            result = "No";
          }
        }
      }

      break;

    default:
      break;
  }

  return result;

}
