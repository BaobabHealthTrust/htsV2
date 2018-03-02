import {equal} from './equalTo';
import {lessThan} from './lessThan';
import {notEqual} from './notEqualTo';
import {match} from './matchWith';
import {inRange} from './inRange';
import {greaterThan} from './greaterThan';

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
      
    } else if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].answer) {

      result = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].answer;

    } else if (props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
        ? props.wf[state.currentWorkflow].currentNode.label
        : ""].condition) {

      result = props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : ""].condition;

    }

    props.handleInputChange(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
      ? props.wf[state.currentWorkflow].currentNode.label
      : "", result, state.currentWorkflow);

    props.goForward(state.currentWorkflow, result);

  }

}
