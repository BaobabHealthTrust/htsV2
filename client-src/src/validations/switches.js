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

        props.handleInputChange(props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label
          ? props.wf[state.currentWorkflow].currentNode.label
          : "", "", state.currentWorkflow);

        props.goForward(state.currentWorkflow, "");

      }

    }

  }

}
