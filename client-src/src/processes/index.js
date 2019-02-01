const fetchAge = (data) => {

  const parts = String(data.Age)
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

const padZeros = (number, positions) => {
  const zeros = parseInt(positions, 10) - String(number).length;
  let padded = "";

  for (let i = 0; i < zeros; i++) {
    padded += "0";
  }

  padded += String(number);

  return padded;
};

export async function processes(props, state, parent, regConfigs, regSummaryIgnores, tests, referrals) {

  if ((props.wf && props.wf[state.currentWorkflow] && !props.wf[state.currentWorkflow].currentNode)) {

    if (!state.busy) {

      await parent.setState({ busy: true });

      if (props.app.patientActivated)
        parent.cancelForm();
      else
        parent.switchPage("home");

      await parent.setState({ busy: false });

      return;

    } else {

      return;

    }

  } else if ((props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.type
    ? props.wf[state.currentWorkflow].currentNode.type
    : "") === "exit") {

    if (!state.busy) {

      await parent.setState({ busy: true });

      if (props.app.sectionHeader === "Report Filter") {

        await props.updateApp({
          formActive: false,
          selectedTask: "reports",
          fieldPos: 0,
          processing: false,
          report: {
            start: {
              reportMonth: props.wf.responses[state.currentWorkflow]["Start Month"],
              reportYear: props.wf.responses[state.currentWorkflow]["Start Year"],
              reportDate: props.wf.responses[state.currentWorkflow]["Start Date"]
            },
            end: {
              reportMonth: props.wf.responses[state.currentWorkflow]["End Month"],
              reportYear: props.wf.responses[state.currentWorkflow]["End Year"],
              reportDate: props.wf.responses[state.currentWorkflow]["End Date"]
            },
            location: props.wf.responses[state.currentWorkflow]["Location"],
            test: props.wf.responses[state.currentWorkflow]["Test"],
            testType: (props.wf.responses[state.currentWorkflow]["Test"] && tests && Object.keys(tests).filter((e) => {
              return tests[e] === props.wf.responses[state.currentWorkflow]["Test"]
            }).length > 0
              ? Object.keys(tests).filter((e) => {
                return tests[e] === props.wf.responses[state.currentWorkflow]["Test"]
              })[0]
              : null),
            modality: (props.wf.responses[state.currentWorkflow]["Modality"] ? props.wf.responses[state.currentWorkflow]["Modality"]
              : null)
          }
        });

        await props.clearWorkflow("primary");

        await props.clearWorkflow("secondary");

        await props.clearDataStructs();

        parent.setReportingPeriod();

        return parent.setState({ busy: false });

      } else if (props.app.currentPatient && Object.keys(props.app.currentPatient).length > 0 && ["Find or Register Client", "Search By ID"].indexOf(props.app.sectionHeader) >= 0) {

        await props.updateApp({
          formActive: false,
          selectedTask: "",
          fieldPos: 0,
          currentSection: "patient",
          patientActivated: true,
          processing: false,
          dual: (Object.keys(props.app.partner).length > 0
            ? true
            : false)
        });

        await props.clearWorkflow("primary");

        await props.clearWorkflow("secondary");

        await props.clearDataStructs();

      } else if (props.app.sectionHeader === "Backdata Entry") {

        parent.switchPage("home");

      } else {

        if (props.app.sectionHeader === "Transcribe in Register") {

          await props.flagRegisterFilled(props.app.currentId, props.app.module, props.app.selectedVisit, props.app.entryCode);

        }

        parent.submitForm().then(async (result) => {

          if (props.app.sectionHeader === "HTS Visit") {

            if (result === false) {

              await props.updateApp({ processing: false });

              parent.cancelForm();

            } else {

              const entryCode = props
                .app
                .patientData[props.app.currentId][props.app.module]
                .visits
                .filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })
                .map((e) => {
                  return Object.keys(e[Object.keys(e)[0]])
                }).sort().pop();

              parent.transcribe(entryCode);

            }

          } else {

            props.updateApp({ processing: false });

          }

        });

      }

      await parent.setState({ busy: false });

      return props.goForward(state.currentWorkflow, "");

    } else {

      return props.goForward(state.currentWorkflow, "");

    }

  } else if ((props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.type
    ? props.wf[state.currentWorkflow].currentNode.type
    : "") === "process") {

    if (props.wf[state.currentWorkflow].currentNode.label === "Run protocol") {

      if (!state.busy) {

        await parent.setState({ busy: true });

        return await props
          .updateApp({
            formActive: false,
            selectedTask: "",
            fieldPos: 0,
            currentSection: "patient",
            patientActivated: true,
            processing: false,
            dual: (Object.keys(props.app.partner).length > 0
              ? true
              : false)
          })
          .then(async () => {

            await props.clearWorkflow("primary");

            await props.clearWorkflow("secondary");

            await props.clearDataStructs();

            let nextTask;

            for (let task of props.app.order) {

              if (props.app.currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[props.app.currentId] && props.app.patientData[props.app.currentId][props.app.module] && props.app.patientData[props.app.currentId][props.app.module].visits && props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0] && props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && !props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit][task]) {

                nextTask = task;

                break;

              }

            }

            if (nextTask) {

              await props.updateApp({ sectionHeader: nextTask });

              await parent.navigateToRoute(nextTask, "/", "primary");

              props.handleInputChange("Partner Present", "No", state.currentWorkflow);

            } else {

              if (props.app.order.length > 0 && !(props.app.currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[props.app.currentId] && props.app.patientData[props.app.currentId][props.app.module] && props.app.patientData[props.app.currentId][props.app.module].visits && props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[props.app.currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0])) {

                await props.updateApp({
                  primary: {
                    sectionHeader: props.app.order[0]
                  },
                  sectionHeader: props.app.order[0]
                });

                await parent.navigateToRoute(props.app.order[0], "/", "primary");

                props.handleInputChange("Partner Present", "No", state.currentWorkflow);

              }

            }

            parent.setState({ busy: false });

          })

      } else {

        return;

      }

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Register partner") {

      if (!state.busy) {

        await parent.setState({ busy: true });

        await props.updateApp({
          partner: Object.assign({}, props.app.currentPatient),
          partnerId: (props.app.currentPatient._id || props.app.currentPatient.npid || props.app.currentPatient.primaryId || props.app.currentPatient.otherId || props.app.currentId)
        });

        return await props
          .clearCache()
          .then(async () => {

            await props.clearDataStructs();

            await props.clearWorkflow("primary");

            props.handleInputChange("Partner Present", "Yes", state.currentWorkflow);

            await parent.findOrRegisterPatient();

            await props.updateApp({
              formActive: true,
              selectedTask: "",
              sectionHeader: "Find or Register Client",
              fieldPos: 0,
              currentSection: "patient",
              patientActivated: true,
              processing: false,
              dual: true,
              selectedVisit: (new Date()).format("d mmm YYYY"),
              primary: {
                sectionHeader: "Find or Register Client",
                selectedTask: "Find or Register Client",
                summary: false,
                formActive: true,
                forceSummary: false,
                fieldPos: 0,
                selectedVisit: (new Date()).format("d mmm YYYY")
              },
              clientId: null,
              currentPatient: {},
              configs: Object.assign({}, regConfigs),
              summaryIgnores: Object.assign([], regSummaryIgnores)
            });

            await props.clearWorkflow("secondary");

            let partnerTask;

            let partnerId = props.app.partnerId;

            for (let task of props.app.order) {

              if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0] && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && !props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit][task]) {

                partnerTask = task;

                break;

              }

            }

            if (partnerTask) {

              await props.updateApp({
                secondary: {
                  sectionHeader: partnerTask,
                  selectedTask: partnerTask,
                  summary: false,
                  formActive: true,
                  forceSummary: false,
                  fieldPos: 0,
                  selectedVisit: props.app.selectedVisit
                }
              });

              await parent.navigateToRoute(partnerTask, "/", "secondary");

              props.handleInputChange("Partner Present", "Yes", "secondary");

              props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

            } else if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
              return Object.keys(e)[0] === props.app.selectedVisit
            }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
              return Object.keys(e)[0] === props.app.selectedVisit
            }).length > 0 && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
              return Object.keys(e)[0] === props.app.selectedVisit
            })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
              return Object.keys(e)[0] === props.app.selectedVisit
            })[0][props.app.selectedVisit]).length >= props.app.order.length) {

              await props.updateApp({
                secondary: {
                  sectionHeader: "Visit Details for " + props.app.selectedTask,
                  summary: true,
                  formActive: false,
                  selectedTask: null,
                  forceSummary: false,
                  fieldPos: 0,
                  selectedVisit: props.app.selectedVisit
                }
              });

            } else {

              if (props.app.order.length > 0 && !(partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0])) {

                await props.updateApp({
                  secondary: {
                    sectionHeader: props.app.order[0],
                    selectedTask: props.app.order[0],
                    summary: false,
                    forceSummary: false,
                    formActive: true,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  }
                });

                await parent.navigateToRoute(props.app.order[0], "/", "secondary");

                props.handleInputChange("Partner Present", "Yes", "secondary");

                props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

              }

            }

            parent.setState({ busy: false });

          });

      }

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Save Locally") {

      if (!state.busy && (props.dde.matches.hits || []).length > 0) {

        await parent.setState({ busy: true });

        let primaryId;

        if (props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf("Client consents to be contacted") >= 0 && props.wf.responses[state.currentWorkflow]["Client consents to be contacted"] !== "No") {

          primaryId = props.app.scanID || props.dde.currentPatient._id || props.app.npid || props.app.otherId || props.app.currentId;

        }

        return await props.submitForm(props.app.configs.action, Object.assign({}, props.dde.currentPatient, {
          primaryId: primaryId,
          date: props.selectedVisit && new Date(props.selectedVisit)
            ? new Date(props.selectedVisit).getTime()
            : new Date().getTime(),
          program: props.module,
          group: state.currentWorkflow
        })).then(async () => {

          await props.fetchVisits(primaryId);

          if (props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf("Partner Present") >= 0) {

            props
              .goForward(state.currentWorkflow, "")
              .then(async () => {

                await props.goForward(state.currentWorkflow, "No");

                await props.updateApp({
                  formActive: true,
                  selectedTask: "",
                  fieldPos: 0,
                  currentSection: "patient",
                  patientActivated: true,
                  processing: false,
                  dual: true,
                  clientId: primaryId,
                  selectedVisit: (new Date()).format("d mmm YYYY")
                });

                await props.clearWorkflow("primary");

                await props.clearWorkflow("secondary");

                await props.clearDataStructs();

                let nextTask,
                  partnerTask;

                let partnerId = props.app.partnerId;

                for (let task of props.app.order) {

                  if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0] && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0][props.app.selectedVisit] && !props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0][props.app.selectedVisit][task]) {

                    partnerTask = task;

                    break;

                  }

                }

                if (partnerTask) {

                  await props.updateApp({
                    secondary: {
                      sectionHeader: partnerTask,
                      selectedTask: partnerTask,
                      summary: false,
                      formActive: true,
                      forceSummary: false,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    }
                  });

                  await parent.navigateToRoute(partnerTask, "/", "secondary");

                  props.handleInputChange("Partner Present", "Yes", "secondary");

                  props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

                } else if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }).length > 0 && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                  await props.updateApp({
                    secondary: {
                      sectionHeader: "Visit Details for " + props.app.selectedTask,
                      summary: true,
                      formActive: false,
                      selectedTask: null,
                      forceSummary: false,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    }
                  });

                } else {

                  if (props.app.order.length > 0 && !(partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0])) {

                    await props.updateApp({
                      secondary: {
                        sectionHeader: props.app.order[0],
                        selectedTask: props.app.order[0],
                        summary: false,
                        forceSummary: false,
                        formActive: true,
                        fieldPos: 0,
                        selectedVisit: props.app.selectedVisit
                      }
                    });

                    await parent.navigateToRoute(props.app.order[0], "/", "secondary");

                    props.handleInputChange("Partner Present", "Yes", "secondary");

                    props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

                  }

                }

                let currentId = props.app.clientId;

                for (let task of props.app.order) {

                  if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0] && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0][props.app.selectedVisit] && !props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0][props.app.selectedVisit][task]) {

                    nextTask = task;

                    break;

                  }

                }

                if (nextTask) {

                  await props.updateApp({
                    sectionHeader: nextTask,
                    primary: {
                      sectionHeader: nextTask,
                      selectedTask: nextTask,
                      summary: false,
                      forceSummary: false,
                      formActive: true,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    },
                    currentId,
                    selectedTask: nextTask,
                    formActive: true,
                    fieldPos: 0
                  });

                  await parent.navigateToRoute(nextTask, "/", "primary");

                  props.handleInputChange("Partner Present", "Yes", "primary");

                } else if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }).length > 0 && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                  await props.updateApp({
                    primary: {
                      sectionHeader: "Visit Details for " + props.app.selectedTask,
                      summary: true,
                      forceSummary: false,
                      formActive: false,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    },
                    formActive: false,
                    selectedTask: null,
                    fieldPos: 0,
                    sectionHeader: null
                  });

                } else {

                  if (props.app.order.length > 0 && !(currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                    return Object.keys(e)[0] === props.app.selectedVisit
                  })[0])) {

                    await props.updateApp({
                      primary: {
                        sectionHeader: props.app.order[0],
                        selectedTask: props.app.order[0],
                        summary: false,
                        forceSummary: false,
                        formActive: true,
                        fieldPos: 0,
                        selectedVisit: props.app.selectedVisit
                      },
                      currentId,
                      formActive: true,
                      selectedTask: props.app.order[0],
                      fieldPos: 0,
                      sectionHeader: props.app.order[0]
                    });

                    await parent.navigateToRoute(props.app.order[0], "/", "primary");

                    props.handleInputChange("Partner Present", "Yes", "primary");

                  }

                }

                parent.setState({ busy: false });

              });

          } else {

            parent.setState({ busy: false });

            return;

          }

        })

      } else if (!state.busy && props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).length > 0) {

        await parent.setState({ busy: true });

        let primaryId;

        if (props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf("Client consents to be contacted") >= 0 && props.wf.responses[state.currentWorkflow]["Client consents to be contacted"] !== "No") {

          primaryId = props.app.scanID || props.dde.currentPatient._id || props.app.npid || props.app.otherId || props.app.currentId;

        }

        await props.submitForm(props.app.configs.action, Object.assign({}, props.wf.responses[state.currentWorkflow], {
          primaryId: primaryId,
          date: props.selectedVisit && new Date(props.selectedVisit)
            ? new Date(props.selectedVisit).getTime()
            : new Date().getTime(),
          program: props.module,
          group: state.currentWorkflow
        }));

        if (props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf("Partner Present") >= 0) {

          return await props
            .goForward(state.currentWorkflow, "")
            .then(async () => {

              await props.goForward(state.currentWorkflow, "No");

              await props.updateApp({
                formActive: false,
                selectedTask: "",
                fieldPos: 0,
                currentSection: "patient",
                patientActivated: true,
                processing: false,
                dual: (Object.keys(props.app.partner).length > 0
                  ? true
                  : false)
              });

              await props.clearWorkflow("primary");

              await props.clearWorkflow("secondary");

              await props.clearDataStructs();

              let nextTask,
                partnerTask;

              let partnerId = props.app.partnerId;

              for (let task of props.app.order) {

                if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0] && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && !props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit][task]) {

                  partnerTask = task;

                  break;

                }

              }

              if (partnerTask) {

                await props.updateApp({
                  secondary: {
                    sectionHeader: partnerTask,
                    selectedTask: partnerTask,
                    summary: false,
                    formActive: true,
                    forceSummary: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  }
                });

                await parent.navigateToRoute(partnerTask, "/", "secondary");

                props.handleInputChange("Partner Present", "Yes", "secondary");

                props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

              } else if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }).length > 0 && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                await props.updateApp({
                  secondary: {
                    sectionHeader: "Visit Details for " + props.app.selectedTask,
                    summary: true,
                    formActive: false,
                    selectedTask: null,
                    forceSummary: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  }
                });

              } else {

                if (props.app.order.length > 0 && !(partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0])) {

                  await props.updateApp({
                    secondary: {
                      sectionHeader: props.app.order[0],
                      selectedTask: props.app.order[0],
                      summary: false,
                      forceSummary: false,
                      formActive: true,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    }
                  });

                  await parent.navigateToRoute(props.app.order[0], "/", "secondary");

                  props.handleInputChange("Partner Present", "Yes", "secondary");

                  props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

                }

              }

              let currentId = props.app.clientId;

              for (let task of props.app.order) {

                if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0] && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && !props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit][task]) {

                  nextTask = task;

                  break;

                }

              }

              if (nextTask) {

                await props.updateApp({
                  sectionHeader: nextTask,
                  primary: {
                    sectionHeader: nextTask,
                    selectedTask: nextTask,
                    summary: false,
                    forceSummary: false,
                    formActive: true,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  },
                  currentId,
                  selectedTask: nextTask,
                  formActive: true,
                  fieldPos: 0
                });

                await parent.navigateToRoute(nextTask, "/", "primary");

                props.handleInputChange("Partner Present", "Yes", "primary");

              } else if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }).length > 0 && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                await props.updateApp({
                  primary: {
                    sectionHeader: "Visit Details for " + props.app.selectedTask,
                    summary: true,
                    forceSummary: false,
                    formActive: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  },
                  formActive: false,
                  selectedTask: null,
                  fieldPos: 0,
                  sectionHeader: null
                });

              } else {

                if (props.app.order.length > 0 && !(currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0])) {

                  await props.updateApp({
                    primary: {
                      sectionHeader: props.app.order[0],
                      selectedTask: props.app.order[0],
                      summary: false,
                      forceSummary: false,
                      formActive: true,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    },
                    currentId,
                    formActive: true,
                    selectedTask: props.app.order[0],
                    fieldPos: 0,
                    sectionHeader: props.app.order[0]
                  });

                  await parent.navigateToRoute(props.app.order[0], "/", "primary");

                  props.handleInputChange("Partner Present", "Yes", "primary");

                }

              }

              parent.setState({ busy: false });

            });

        } else {

          parent.setState({ busy: false });

          return;

        }

      }

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Save client details") {

      if (!state.busy) {

        await parent.setState({ busy: true });

        await props.submitForm(props.app.configs.action, Object.assign({}, props.app.currentSection !== "registration"
          ? {
            [props.app.sectionHeader]: props.wf.responses[state.currentWorkflow]
          }
          : props.wf.responses[state.currentWorkflow], {
            primaryId: props.app.scanID,
            date: props.selectedVisit && new Date(props.selectedVisit)
              ? new Date(props.selectedVisit).getTime()
              : new Date().getTime(),
            program: props.module,
            group: state.currentWorkflow,
            location: props.app.activeLocation,
            user: props.app.activeUser
          }));

        if (props.wf.responses && props.wf.responses[state.currentWorkflow] && Object.keys(props.wf.responses[state.currentWorkflow]).indexOf("Partner Present") >= 0) {

          return await props
            .goForward(state.currentWorkflow, "")
            .then(async () => {

              await props.goForward(state.currentWorkflow, "No");

              await props.updateApp({
                formActive: false,
                selectedTask: "",
                fieldPos: 0,
                currentSection: "patient",
                patientActivated: true,
                processing: false,
                dual: true,
                selectedVisit: (new Date()).format("d mmm YYYY")
              });

              await props.clearWorkflow("primary");

              await props.clearWorkflow("secondary");

              await props.clearDataStructs();

              let nextTask,
                partnerTask;

              let partnerId = props.app.partnerId;

              for (let task of props.app.order) {

                if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0] && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && !props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit][task]) {

                  partnerTask = task;

                  break;

                }

              }

              if (partnerTask) {

                await props.updateApp({
                  secondary: {
                    sectionHeader: partnerTask,
                    selectedTask: partnerTask,
                    summary: false,
                    formActive: true,
                    forceSummary: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  }
                });

                await parent.navigateToRoute(partnerTask, "/", "secondary");

                props.handleInputChange("Partner Present", "Yes", "secondary");

                props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

              } else if (partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }).length > 0 && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                await props.updateApp({
                  secondary: {
                    sectionHeader: "Visit Details for " + props.app.selectedTask,
                    summary: true,
                    formActive: false,
                    selectedTask: null,
                    forceSummary: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  }
                });

              } else {

                if (props.app.order.length > 0 && !(partnerId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[partnerId] && props.app.patientData[partnerId][props.app.module] && props.app.patientData[partnerId][props.app.module].visits && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[partnerId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0])) {

                  await props.updateApp({
                    secondary: {
                      sectionHeader: props.app.order[0],
                      selectedTask: props.app.order[0],
                      summary: false,
                      forceSummary: false,
                      formActive: true,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    }
                  });

                  await parent.navigateToRoute(props.app.order[0], "/", "secondary");

                  props.handleInputChange("Partner Present", "Yes", "secondary");

                  props.handleInputChange("Partner HIV Status", "HIV Unknown", "secondary");

                }

              }

              let currentId = props.app.clientId;

              for (let task of props.app.order) {

                if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0] && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit] && !props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0][props.app.selectedVisit][task]) {

                  nextTask = task;

                  break;

                }

              }

              if (nextTask) {

                await props.updateApp({
                  sectionHeader: nextTask,
                  primary: {
                    sectionHeader: nextTask,
                    selectedTask: nextTask,
                    summary: false,
                    forceSummary: false,
                    formActive: true,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  },
                  currentId,
                  selectedTask: nextTask,
                  formActive: true,
                  fieldPos: 0
                });

                await parent.navigateToRoute(nextTask, "/", "primary");

                props.handleInputChange("Partner Present", "Yes", "primary");

              } else if (currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              }).length > 0 && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit] && Object.keys(props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                return Object.keys(e)[0] === props.app.selectedVisit
              })[0][props.app.selectedVisit]).length >= props.app.order.length) {

                await props.updateApp({
                  primary: {
                    sectionHeader: "Visit Details for " + props.app.selectedTask,
                    summary: true,
                    forceSummary: false,
                    formActive: false,
                    fieldPos: 0,
                    selectedVisit: props.app.selectedVisit
                  },
                  formActive: false,
                  selectedTask: null,
                  fieldPos: 0,
                  sectionHeader: null
                });

              } else {

                if (props.app.order.length > 0 && !(currentId && props.app.patientData && props.app.module && props.app.selectedVisit && props.app.patientData[currentId] && props.app.patientData[currentId][props.app.module] && props.app.patientData[currentId][props.app.module].visits && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                }) && props.app.patientData[currentId][props.app.module].visits.filter((e) => {
                  return Object.keys(e)[0] === props.app.selectedVisit
                })[0])) {

                  await props.updateApp({
                    primary: {
                      sectionHeader: props.app.order[0],
                      selectedTask: props.app.order[0],
                      summary: false,
                      forceSummary: false,
                      formActive: true,
                      fieldPos: 0,
                      selectedVisit: props.app.selectedVisit
                    },
                    currentId,
                    formActive: true,
                    selectedTask: props.app.order[0],
                    fieldPos: 0,
                    sectionHeader: props.app.order[0]
                  });

                  await parent.navigateToRoute(props.app.order[0], "/", "primary");

                  props.handleInputChange("Partner Present", "Yes", "primary");

                }

              }

              parent.setState({ busy: false });

            });

        } else {

          parent.setState({ busy: false });

          return;

        }

      }

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Search in DDE by name") {

      const given_name = props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["First Name"]
        ? props.wf.responses[state.currentWorkflow]["First Name"]
        : "";

      const family_name = props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Last Name"]
        ? props.wf.responses[state.currentWorkflow]["Last Name"]
        : "";

      const gender = props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Gender"]
        ? props.wf.responses[state.currentWorkflow]["Gender"]
        : "";

      props.searchByNameAndGender({ given_name, family_name, gender, page_size: 6, page: 1 });

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Search in DDE by ID") {

      if (!state.busy && props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Scan barcode"]) {

        parent.setState({ busy: true });

        const id = props.wf.responses && props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Scan barcode"]
          ? String(props.wf.responses[state.currentWorkflow]["Scan barcode"])
            .trim()
            .replace(/\$$/gi, "")
          : "";

        props.updateApp({ scanID: id })

        props.searchByIdentifier(id);

        parent.setState({ busy: false });

      }

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Set Month to July") {

      props.handleInputChange("Month of Birth", "July", state.currentWorkflow);

      props.handleInputChange("Date of Birth", "01", state.currentWorkflow);

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Set Date to 1") {

      props.handleInputChange("Date of Birth", "01", state.currentWorkflow);

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Set Date to 15") {

      props.handleInputChange("Date of Birth", "15", state.currentWorkflow);

    } else if (props.wf[state.currentWorkflow].currentNode.label === "Set Date of Birth") {

      const months = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12"
      };

      let dateOfBirth;

      if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Age"]) {

        const yob = new Date().getFullYear() - parseInt(props.wf.responses[state.currentWorkflow]["Age"], 10);

        dateOfBirth = yob + "-07-10";

      } else if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Year of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] && props.wf.responses[state.currentWorkflow]["Date of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] !== "Unknown" && props.wf.responses[state.currentWorkflow]["Year of Birth"] !== "Unknown" && props.wf.responses[state.currentWorkflow]["Date of Birth"] !== "Unknown") {

        dateOfBirth = props.wf.responses[state.currentWorkflow]["Year of Birth"] + "-" + months[props.wf.responses[state.currentWorkflow]["Month of Birth"]] + "-" + padZeros(props.wf.responses[state.currentWorkflow]["Date of Birth"], 2);

      } else if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Year of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] && props.wf.responses[state.currentWorkflow]["Date of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] !== "Unknown" && props.wf.responses[state.currentWorkflow]["Year of Birth"] !== "Unknown" && props.wf.responses[state.currentWorkflow]["Date of Birth"] === "Unknown") {

        dateOfBirth = props.wf.responses[state.currentWorkflow]["Year of Birth"] + "-" + months[props.wf.responses[state.currentWorkflow]["Month of Birth"]] + "-01";

      } else if (props.wf.responses[state.currentWorkflow] && props.wf.responses[state.currentWorkflow]["Year of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] && props.wf.responses[state.currentWorkflow]["Date of Birth"] && props.wf.responses[state.currentWorkflow]["Month of Birth"] === "Unknown" && props.wf.responses[state.currentWorkflow]["Year of Birth"] !== "Unknown" && props.wf.responses[state.currentWorkflow]["Date of Birth"] === "Unknown") {

        dateOfBirth = props.wf.responses[state.currentWorkflow]["Year of Birth"] + "-07-01";

      }

      props.handleInputChange("Date of Birth", dateOfBirth, state.currentWorkflow);

      props.handleInputChange("Birthdate Estimated?", "Yes", state.currentWorkflow);

    } else {

      switch (props.wf[state.currentWorkflow].currentNode.label) {

        case "Single Negative":
        case "Single Positive":
        case "Test 1 & 2 Negative":
        case "Test 1 & 2 Positive":
        case "Test 1 & 2 Discordant":
          props.handleInputChange("Outcome Summary", props.wf[state.currentWorkflow].currentNode.label, state.currentWorkflow);

          break;

        case "New Negative":
        case "New Positive":
        case "New Exposed Infant":
        case "New Inconclusive":
        case "Confirmatory Inconclusive":
        case "Confirmatory Positive":
        case "Confirmatory (Antibody) Positive":
          props.handleInputChange("Result Given to Client", props.wf[state.currentWorkflow].currentNode.label, state.currentWorkflow);

          break;

        case "Set Sex/Pregnancy to Male":

          props.handleInputChange("Sex/Pregnancy", "Male", state.currentWorkflow);

          break;

        case "Set Sex/Pregnancy to Female Non-Pregnant":
          props.handleInputChange("Sex/Pregnancy", "Female Non-Pregnant", state.currentWorkflow);

          break;

        case "Set Sex/Pregnancy to Female Pregnant":
          props.handleInputChange("Sex/Pregnancy", "Female Pregnant", state.currentWorkflow);

          break;

        case "Set Partner Age":
          break;

        case "Set Age Group":

          let ageGroup;

          let age = fetchAge({
            Age: String(props.app.currentPatient.age).trim()
          });

          if (age >= 0 && age <= (11 * 30)) {

            ageGroup = "0-11 months";

            props.handleInputChange("Partner HIV Status", "No Partner", state.currentWorkflow);

          } else if (age <= (14 * 365)) {

            ageGroup = "1-14 years";

            props.handleInputChange("Partner HIV Status", "No Partner", state.currentWorkflow);

          } else if (age <= (24 * 365)) {

            ageGroup = "15-24 years";

          } else {

            ageGroup = "25+ years";

          }

          props.handleInputChange("Age Group", ageGroup, state.currentWorkflow);

          break;

        default:

          break;

      }

    }

    return props.goForward(state.currentWorkflow, "");

  } else if ((props.wf && props.wf[state.currentWorkflow] && props.wf[state.currentWorkflow].currentNode && props.wf[state.currentWorkflow].currentNode.type
    ? props.wf[state.currentWorkflow].currentNode.type
    : "") === "alert") {

    if (referrals && referrals[props.wf[state.currentWorkflow].currentNode.label])
      props.handleInputChange("Referral for Re-Testing", referrals[props.wf[state.currentWorkflow].currentNode.label], state.currentWorkflow);

    props.showInfoMsg("Referral", props.wf[state.currentWorkflow].currentNode.label);

    return props.goForward(state.currentWorkflow, "");

  }

}
