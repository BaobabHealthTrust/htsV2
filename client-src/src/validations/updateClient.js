export async function updateClient(props, state, parent) {

  /*
    Disabled for HTS as the protocol goes directly to a clients data capturing. Need for verification first before one captures the data.
  */
  if (!state.busy && props.app.currentPatient && Object.keys(props.app.currentPatient).length <= 0 && ((props.dde.matches.hits && props.dde.matches.hits.length === 1) || (props.dde.currentPatient && Object.keys(props.dde.currentPatient).length > 0)) && false) {

    await parent.setState({busy: true});

    let currentPatient;

    if (props.dde.matches.hits && props.dde.matches.hits.length === 1) {

      currentPatient = props.dde.matches.hits[0];

      await props.updateApp({currentPatient});

    } else if (props.dde.currentPatient && Object.keys(props.dde.currentPatient).length > 0) {

      currentPatient = props.dde.currentPatient;

      await props.updateApp({currentPatient});

    }

    await props.submitForm(props.app.configs.action, Object.assign({}, currentPatient, {
      primaryId: props.app.scanID || currentPatient._id || currentPatient.npid || currentPatient.otherId || "unknown",
      date: props.selectedVisit && new Date(props.selectedVisit)
        ? new Date(props.selectedVisit).getTime()
        : new Date().getTime(),
      program: props.module,
      group: state.currentWorkflow
    }));

    await parent.setState({busy: false});

  }
}
