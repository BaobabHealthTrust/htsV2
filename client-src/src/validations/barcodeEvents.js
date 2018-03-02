export async function barcode(props, state) {

  if (props.app.configs && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label ?
      props.wf[state.currentWorkflow].currentNode.label :
      ""] && props.app.configs[props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label ?
      props.wf[state.currentWorkflow].currentNode.label :
      ""].fieldType === "barcode" && props.wf.responses && (props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label ?
      props.wf[state.currentWorkflow].currentNode.label :
      null) !== null && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label ?
      props.wf[state.currentWorkflow].currentNode.label :
      null
    ] && props.wf.responses[state.currentWorkflow][props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.label ?
      props.wf[state.currentWorkflow].currentNode.label :
      null
    ].match(/\$$/)) {

    let target = props.wf[state.currentWorkflow].currentNode.label;

    let value = String(props.wf.responses[state.currentWorkflow][target])
      .trim()
      .replace(/\$$/g, "");

    await props
      .goForward(state.currentWorkflow, value);

    props
      .handleInputChange(target, value, state.currentWorkflow);

  }

}
