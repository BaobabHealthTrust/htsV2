import { equal } from './equalTo';
import { lessThan } from './lessThan';
import { notEqual } from './notEqualTo';
import { match } from './matchWith';
import { inRange } from './inRange';
import { greaterThan } from './greaterThan';

const mapVar2Props = (expression, props, lDelim = '{{', rDelim = '}}') => {

  const re = new RegExp(lDelim + '[^' + rDelim + ']+' + rDelim, 'g');
  const parts = expression.match(re);

  let result = true;

  if (parts) {

    for (let part of parts) {

      let term = String(part)
        .replace((new RegExp(lDelim, 'g')), '')
        .replace((new RegExp(rDelim, 'g')), '');

      let row = (props && props.app && props.app[term] ? props.app[term] : null);

      if (row !== null) {

        // eslint-disable-next-line
        result = eval(String(expression).replace((new RegExp(part, 'g')), row));

        if (!result)
          break;

      }

    }

  };

  return result;

}

// eslint-disable-next-line
const updatePartnerStatus = (group, props, state) => {

  let output = "";

  switch (group) {

    case 'hiv status':

      /*
        If active client is on the LEFT, change value on the RIGHT
      */
      if (props && props.app && props.app.currentId && props.app.clientId && props.app.currentId !== props.app.clientId) {

        if (props.app.patientData && Object.keys(props.app.patientData).indexOf(props.app.clientId) >= 0 && Object.keys(props.app.patientData[props.app.clientId]).indexOf(props.app.module) >= 0 && Object.keys(props.app.patientData[props.app.clientId][props.app.module]).indexOf('visits') >= 0) {

          const visit = props.app.patientData[props.app.clientId][props.app.module].visits.filter((e) => { return Object.keys(e)[0] === props.app.selectedVisit });

          if (visit.length > 0) {

            const entryCode = Object.keys(visit[0][props.app.selectedVisit])[0];

            const entry = (visit[0] && visit[0][props.app.selectedVisit] && visit[0][props.app.selectedVisit][entryCode] && visit[0][props.app.selectedVisit][entryCode]['HTS Visit'] ? visit[0][props.app.selectedVisit][entryCode]['HTS Visit'] : null);

            props.handleInputChange("Partner HIV Status", (String(entry['Result Given to Client']).match(/negative/i) ? "Partner Negative" : String(entry['Result Given to Client']).match(/positive/i) ? "Partner Positive" : "HIV Unknown"), state.currentWorkflow);

            output = (String(entry['Result Given to Client']).match(/negative/i) ? "Partner Negative" : String(entry['Result Given to Client']).match(/positive/i) ? "Partner Positive" : "HIV Unknown");

          } else {

            props.handleInputChange("Partner HIV Status", "HIV Unknown", state.currentWorkflow);

            output = "HIV Unknown";

          }

        } else {

          props.handleInputChange("Partner HIV Status", "HIV Unknown", state.currentWorkflow);

          output = "HIV Unknown";

        }

      }

      if (props && props.app && props.app.currentId && props.app.clientId && props.app.currentId === props.app.clientId) {

        if (props.wf && props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Result Given to Client"]) {

          props.updatePartnerRecord(
            props.app.partnerId,
            "Partner HIV Status",
            props.app.selectedVisit,
            (String(props.wf.responses[state.currentWorkflow]["Result Given to Client"]).match(/negative/i) ?
              "Partner Negative" : String(props.wf.responses[state.currentWorkflow]["Result Given to Client"]).match(/positive/i) ? "Partner Positive" : "HIV Unknown"), props.app.activeUser)

        }

      }

      /*
        If active client is on the RIGHT, change value on the LEFT
      */
      if (props && props.app && props.app.currentId && props.app.partnerId && props.app.currentId !== props.app.partnerId) {

        if (props.app.patientData && Object.keys(props.app.patientData).indexOf(props.app.partnerId) >= 0 && Object.keys(props.app.patientData[props.app.partnerId]).indexOf(props.app.module) >= 0 && Object.keys(props.app.patientData[props.app.partnerId][props.app.module]).indexOf('visits') >= 0) {

          const visit = props.app.patientData[props.app.partnerId][props.app.module].visits.filter((e) => { return Object.keys(e)[0] === props.app.selectedVisit });

          if (visit.length > 0) {

            const entryCode = Object.keys(visit[0][props.app.selectedVisit])[0];

            const entry = (visit[0] && visit[0][props.app.selectedVisit] && visit[0][props.app.selectedVisit][entryCode] && visit[0][props.app.selectedVisit][entryCode]['HTS Visit'] ? visit[0][props.app.selectedVisit][entryCode]['HTS Visit'] : null);

            props.handleInputChange("Partner HIV Status", (String(entry['Result Given to Client']).match(/negative/i) ? "Partner Negative" : String(entry['Result Given to Client']).match(/positive/i) ? "Partner Positive" : "HIV Unknown"), state.currentWorkflow);

            output = (String(entry['Result Given to Client']).match(/negative/i) ? "Partner Negative" : String(entry['Result Given to Client']).match(/positive/i) ? "Partner Positive" : "HIV Unknown");

          } else {

            props.handleInputChange("Partner HIV Status", "HIV Unknown", state.currentWorkflow);

            output = "HIV Unknown";

          }

        } else {

          props.handleInputChange("Partner HIV Status", "HIV Unknown", state.currentWorkflow);

          output = "HIV Unknown";

        }

      }

      if (props && props.app && props.app.currentId && props.app.partnerId && props.app.currentId === props.app.partnerId) {

        if (props.wf && props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Result Given to Client"]) {

          props.updatePartnerRecord(
            props.app.clientId,
            "Partner HIV Status",
            props.app.selectedVisit,
            (String(props.wf.responses[state.currentWorkflow]["Result Given to Client"]).match(/negative/i) ?
              "Partner Negative" : String(props.wf.responses[state.currentWorkflow]["Result Given to Client"]).match(/positive/i) ? "Partner Positive" : "HIV Unknown"), props.app.activeUser)

        }

      }

      break;

    default:

      break;

  }

  return output;

}

export function switches(props, state) {

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("visible") >= 0 && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].visible === false) {

    let result = "No";

    if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].func) {

      switch (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].func[1]) {
        case "match":

          result = match(props, state);

          break;

        case "equal":

          result = equal(props, state);

          break;

        case "notEqual":

          result = notEqual(props, state);

          break;

        case "lessThan":

          result = lessThan(props, state);

          break;

        case "inRange":

          result = inRange(props, state);

          break;

        case "greaterThan":

          result = greaterThan(props, state);

          break;

        default:
          break;
      }

    } else if (Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("answer") >= 0) {

      result = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].answer;

    } else if (Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("condition") >= 0) {

      result = mapVar2Props((props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].condition), props);

    }

    props.handleInputChange(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : "", result, state.currentWorkflow);

    props.goForward(state.currentWorkflow, result);

  } else if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
    ? props.wf[state.currentWorkflow].currentNode.label
    : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""]).indexOf("condition") >= 0) {

    let result = mapVar2Props((props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : ""].condition), props);

    if (!result) {

      if (props.app.reversing) {

        props.goBackward(state.currentWorkflow);

      } else {

        if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""] && Object.keys(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""]).indexOf("action") >= 0) {

          // eslint-disable-next-line
          const output = eval(props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : ""].action);

          props.goForward(state.currentWorkflow, output);

        } else {

          props.handleInputChange(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
            ? props.wf[state.currentWorkflow].currentNode.label
            : "", "", state.currentWorkflow);

          props.goForward(state.currentWorkflow, "");

        }

      }

    }

  }

}
