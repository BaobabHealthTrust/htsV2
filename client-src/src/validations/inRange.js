export function inRange(props, state) {

  let currentVisit,
    result;

  const rangeField = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[0];

  const number1 = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[2];

  const number2 = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[3];

  const category = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func[4];

  let age;

  const currentPatient = (props.app.currentId && props.app.patientData && props.app.patientData[props.app.currentId]
    ? props.app.patientData[props.app.currentId]
    : {});

  if (category === "Patient") {

    age = (currentPatient && currentPatient[rangeField]
      ? currentPatient[rangeField]
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

    }

    if (age !== null && age >= parseFloat(number1) && age <= parseFloat(number2)) {

      result = "Yes";

    } else {

      result = "No";

    }

  } else {

    currentVisit = currentPatient && props.selectedVisit && props.module && currentPatient[props.module] && currentPatient[props.module].visits && this
      .props
      .currentPatient[props.module]
      .visits
      .filter(e => {
        return Object.keys(e)[0] === props.selectedVisit;
      })
      .length > 0
      ? this
        .props
        .currentPatient[props.module]
        .visits
        .filter(e => {
          return Object.keys(e)[0] === props.selectedVisit;
        })[0][props.selectedVisit]
      : {};

    if (currentVisit && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].func.length > 2 && props.module) {

      currentVisit = currentVisit[props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].func[4]];

      if (currentVisit) {

        age = (currentVisit && currentVisit[rangeField]
          ? currentVisit[rangeField]
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

        }

        if (age !== null && age >= parseFloat(number1) && age <= parseFloat(number2)) {

          result = "Yes";

        } else {

          result = "No";

        }

      } else {

        age = (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][rangeField]
          ? props.wf.responses[state.currentWorkflow][rangeField]
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

        }

        if (age !== null && age >= parseFloat(number1) && age <= parseFloat(number2)) {

          result = "Yes";

        } else {

          result = "No";

        }

      }

    } else {

      age = (currentPatient && currentPatient[rangeField]
        ? currentPatient[rangeField]
        : null);

      if (!age) {

        age = (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][rangeField]
          ? props.wf.responses[state.currentWorkflow][rangeField]
          : null);

      }

      if (!age && rangeField.toLowerCase() === "age") {

        age = (props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Age"]
          ? props.wf.responses[state.currentWorkflow]["Age"]
          : null);

      }

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

      }

      if (age !== null && age >= parseFloat(number1) && age <= parseFloat(number2)) {

        result = "Yes";

      } else {

        result = "No";

      }

    }

  }

  return result;

}
