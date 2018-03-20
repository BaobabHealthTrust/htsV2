import React, { Component } from 'react';
import './transcribe.css';

class Transcribe extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      count: 0,
      fieldType: "",
      configs: {},
      label: null,
      currentString: "",
      visitDetails: {},
      visitDetails2: {}
    }

  }

  $ = (id) => {
    return document.getElementById(id);
  }

  componentDidMount() {

    let entryCode = this.props.app.entryCode;

    if (!entryCode) {

      entryCode = (this.props.wf && this.props.activeWorkflow && this.props.wf.responses && this.props.wf.responses[this.props.activeWorkflow]
        ? (this.props.wf.responses[this.props.activeWorkflow]['Select Entry Code'])
        : null);

    }

    this
      .props
      .handleDirectInputChange("Entry Code", entryCode);

    let visit = (this.props.app.patientData && this.props.app.currentId && this.props.app.module && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId][this.props.app.module] && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits
      ? this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === this.props.app.selectedVisit
      })[0]
      : {});

    let visitDetails = {
      "Age": (this.props.app.patientData && this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].age
        ? this.props.app.patientData[this.props.app.currentId].age
        : ""),
      "id": entryCode,
      "HTS Provider ID": this.props.app.activeUser
    }

    this
      .props
      .handleDirectInputChange("client", {
        [entryCode]: visit[this.props.app.selectedVisit][entryCode]
      }, this.props.activeWorkflow);

    if (Object.keys(visit).length > 0) {

      Object
        .keys(visit[this.props.app.selectedVisit][entryCode])
        .forEach((encounter) => {

          Object
            .keys(visit[this.props.app.selectedVisit][entryCode][encounter])
            .forEach((concept) => {

              if (concept === "encounterId") {

                if (encounter === "HTS Visit") {

                  this
                    .props
                    .handleDirectInputChange("encounterId", visit[this.props.app.selectedVisit][entryCode][encounter][concept], this.props.activeWorkflow);

                  this
                    .props
                    .handleDirectInputChange("id", this.props.app.currentId, this.props.activeWorkflow);

                }

              } else {

                if (["Immediate Repeat Test 1 Result", "Immediate Repeat Test 2 Result", "First Pass Test 1 Result", "First Pass Test 2 Result"].indexOf(concept) >= 0) {

                  if (!visitDetails["HIV Rapid Test Outcomes"])
                    visitDetails["HIV Rapid Test Outcomes"] = {};

                  const testResults = {
                    "Non-Reactive": "Negative",
                    "Reactive": "Positive"
                  };

                  switch (concept) {

                    case "Immediate Repeat Test 1 Result":

                      if (!visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"])
                        visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"] = {};

                      visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] = testResults[visit[this.props.app.selectedVisit][entryCode][encounter][concept]];

                      break;

                    case "Immediate Repeat Test 2 Result":

                      if (!visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"])
                        visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"] = {};

                      visitDetails["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] = testResults[visit[this.props.app.selectedVisit][entryCode][encounter][concept]];

                      break;

                    case "First Pass Test 1 Result":

                      if (!visitDetails["HIV Rapid Test Outcomes"]["First Pass"])
                        visitDetails["HIV Rapid Test Outcomes"]["First Pass"] = {};

                      visitDetails["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] = testResults[visit[this.props.app.selectedVisit][entryCode][encounter][concept]];

                      break;

                    case "First Pass Test 2 Result":

                      if (!visitDetails["HIV Rapid Test Outcomes"]["First Pass"])
                        visitDetails["HIV Rapid Test Outcomes"]["First Pass"] = {};

                      visitDetails["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] = testResults[visit[this.props.app.selectedVisit][entryCode][encounter][concept]];

                      break;

                    default:
                      break;

                  }

                } else {

                  if (concept === "Last HIV Test Result") {

                    visitDetails["Last HIV Test"] = visit[this.props.app.selectedVisit][entryCode][encounter][concept];

                  } else if (concept === "HTS Family Referral Slips") {

                    visitDetails["Number of Items Given:HTS Family Ref Slips"] = visit[this.props.app.selectedVisit][entryCode][encounter][concept];

                  } else if (concept === "Number of female condoms given") {

                    visitDetails["Number of Items Given:Condoms:Female"] = visit[this.props.app.selectedVisit][entryCode][encounter][concept];

                  } else if (concept === "Number of male condoms given") {

                    visitDetails["Number of Items Given:Condoms:Male"] = visit[this.props.app.selectedVisit][entryCode][encounter][concept];

                  } else {

                    visitDetails[concept] = visit[this.props.app.selectedVisit][entryCode][encounter][concept];

                  }

                }

              }

            })

        })

    }

    this.setState({ visitDetails });

  }

  render() {

    const fields = {
      2: "M",
      3: "FNP",
      4: "FP",
      6: "A",
      7: "B",
      8: "C",
      9: "D",
      10: "PITC",
      11: "FRS",
      12: "Oth",
      13: "LNev",
      14: "L-",
      15: "L+",
      16: "LEx",
      17: "LIn",
      19: "N",
      20: "Y",
      21: "-",
      22: "+",
      23: "-",
      24: "+",
      25: "-",
      26: "+",
      27: "-",
      28: "+",
      29: "-",
      30: "+",
      31: "--",
      32: "++",
      33: "Disc",
      34: "N-",
      35: "N+",
      36: "NEx",
      37: "NIn",
      38: "C+",
      39: "CIn",
      40: "NoP",
      41: "P?",
      42: "P-",
      43: "P+",
      44: "Low",
      45: "Ong",
      46: "Hi",
      47: "ND",
      48: "NoT",
      49: "ReT",
      50: "CT"
    };

    const fieldNames = {
      1: {
        category: "HTS Provider ID",
        field: "",
        group: 1
      },
      2: {
        category: "Sex/Pregnancy",
        field: "Male",
        group: 2
      },
      3: {
        category: "Sex/Pregnancy",
        field: "Female Non-Pregnant",
        group: 2
      },
      4: {
        category: "Sex/Pregnancy",
        field: "Female Pregnant",
        group: 2
      },
      5: {
        category: "Age",
        field: "",
        group: 3
      },
      6: {
        category: "Age Group",
        field: "0-11 months",
        group: 4
      },
      7: {
        category: "Age Group",
        field: "1-14 years",
        group: 4
      },
      8: {
        category: "Age Group",
        field: "15-24 years",
        group: 4
      },
      9: {
        category: "Age Group",
        field: "25+ years",
        group: 4
      },
      10: {
        category: "HTS Access Type",
        field: "Routine HTS (PITC) within Health Service",
        group: 5
      },
      11: {
        category: "HTS Access Type",
        field: "Comes with HTS Family Referral Slip",
        group: 5
      },
      12: {
        category: "HTS Access Type",
        field: "Other (VCT, etc.)",
        group: 5
      },
      13: {
        category: "Last HIV Test",
        field: "Never Tested",
        group: 6
      },
      14: {
        category: "Last HIV Test",
        field: "Last Negative",
        group: 6
      },
      15: {
        category: "Last HIV Test",
        field: "Last Positive",
        group: 6
      },
      16: {
        category: "Last HIV Test",
        field: "Last Exposed Infant",
        group: 6
      },
      17: {
        category: "Last HIV Test",
        field: "Last Inconclusive",
        group: 6
      },
      18: {
        category: "Time Since Last Test",
        field: "",
        group: 6
      },
      19: {
        category: "Partner Present",
        field: "No",
        group: 7
      },
      20: {
        category: "Partner Present",
        field: "Yes",
        group: 7
      },
      21: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 1",
        subSubField: "Negative",
        group: 8
      },
      22: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 1",
        subSubField: "Positive",
        group: 8
      },
      23: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 2",
        subSubField: "Negative",
        group: 8
      },
      24: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 2",
        subSubField: "Positive",
        group: 8
      },
      25: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 1",
        subSubField: "Negative",
        group: 8
      },
      26: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 1",
        subSubField: "Positive",
        group: 8
      },
      27: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 2",
        subSubField: "Negative",
        group: 8
      },
      28: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 2",
        subSubField: "Positive",
        group: 8
      },
      29: {
        category: "Outcome Summary",
        field: "Single Negative",
        group: 9
      },
      30: {
        category: "Outcome Summary",
        field: "Single Positive",
        group: 9
      },
      31: {
        category: "Outcome Summary",
        field: "Test 1 & 2 Negative",
        group: 9
      },
      32: {
        category: "Outcome Summary",
        field: "Test 1 & 2 Positive",
        group: 9
      },
      33: {
        category: "Outcome Summary",
        field: "Test 1 & 2 Discordant",
        group: 9
      },
      34: {
        category: "Result Given to Client",
        field: "New Negative",
        group: 10
      },
      35: {
        category: "Result Given to Client",
        field: "New Positive",
        group: 10
      },
      36: {
        category: "Result Given to Client",
        field: "New Exposed Infant",
        group: 10
      },
      37: {
        category: "Result Given to Client",
        field: "New Inconclusive",
        group: 10
      },
      38: {
        category: "Result Given to Client",
        field: "Confirmatory Positive",
        group: 10
      },
      39: {
        category: "Result Given to Client",
        field: "Confirmatory Inconclusive",
        group: 10
      },
      40: {
        category: "Partner HIV Status",
        field: "No Partner",
        group: 11
      },
      41: {
        category: "Partner HIV Status",
        field: "HIV Unknown",
        group: 11
      },
      42: {
        category: "Partner HIV Status",
        field: "Partner Negative",
        group: 11
      },
      43: {
        category: "Partner HIV Status",
        field: "Partner Positive",
        group: 11
      },
      44: {
        category: "Client Risk Category",
        field: "Low Risk",
        group: 12
      },
      45: {
        category: "Client Risk Category",
        field: "On-going Risk",
        group: 12
      },
      46: {
        category: "Client Risk Category",
        field: "High Risk Event in last 3 months",
        group: 12
      },
      47: {
        category: "Client Risk Category",
        field: "Risk assessment Not Done",
        group: 12
      },
      48: {
        category: "Referral for Re-Testing",
        field: "No Re-Test needed",
        group: 13
      },
      49: {
        category: "Referral for Re-Testing",
        field: "Re-Test",
        group: 13
      },
      50: {
        category: "Referral for Re-Testing",
        field: "Confirmatory Test at HIV Clinic",
        group: 13
      },
      51: {
        category: "Appointment Date Given",
        group: 13
      },
      52: {
        category: "Number of Items Given",
        field: "HTS Family Ref Slips",
        group: 14
      },
      53: {
        category: "Number of Items Given",
        field: "Condoms",
        subField: "Male",
        group: 14
      },
      54: {
        category: "Number of Items Given",
        field: "Condoms",
        subField: "Female",
        group: 14
      }
    };

    return (

      <div
        className="tMainContainer"
        id="bdScroller"
        style={{
          border: "1px solid red"
        }}>
        <table
          cellPadding="5px"
          border="0"
          style={{
            borderCollapse: "collapse",
            color: "#000000",
            borderColor: "#999999"
          }}>
          <tbody>
            <tr>
              <th
                rowSpan="4"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "100px",
                  verticalAlign: "top",
                  height: "50px"
                }}
                className="boldRight">Entry Code</th>
              <th
                rowSpan="4"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  borderColor: "rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">HTS Provider ID</th>
              <th
                colSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Sex/Pregnancy</th>
              <th
                rowSpan="4"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Age</th>
              <th
                colSpan="4"
                style={{
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Age Group</th>
              <th
                colSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">HTS Access Type</th>
              <th
                colSpan="5"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}>Last HIV Test</th>
              <td
                rowSpan="4"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">
                <b>Time<br />Since Last<br />Test</b><br />
                <br />
                <span
                  style={{
                    fontSize: "12px"
                  }}>No.of<br />Days<br />Weeks<br />Months or<br />Years</span>
              </td>
              <td
                colSpan="2"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px",
                  verticalAlign: "top",
                  textAlign: "center",
                  fontSize: "14px"
                }}
                className="boldRight">
                <b>Partner Present</b><br />
                <span
                  style={{
                    fontSize: "11px"
                  }}>at this session</span>
              </td>
              <th
                colSpan="8"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">HIV Rapid Test Outcomes</th>
              <th
                colSpan="5"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Outcome Summary</th>
              <th
                colSpan="6"
                style={{
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Result Given to Client</th>
              <th
                colSpan="4"
                rowSpan="2"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Partner HIV Status</th>
              <th
                colSpan="4"
                rowSpan="2"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Client Risk Category</th>
              <th
                colSpan="4"
                rowSpan="2"
                style={{
                  padding: "10px",
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Referral for Re - Testing</th>
              <th
                colSpan="3"
                style={{
                  padding: "10px",
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "14px"
                }}
                className="boldRight">Number of Items
                          <br />Given</th>
              <th
                style={{
                  padding: "10px",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  fontSize: "14px"
                }}
                className="boldRight">Comments</th>
              <td
                rowSpan="4"
                colSpan="2"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>&nbsp;</td>
            </tr>
            <tr>
              <td
                rowSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  height: "70px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Male</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "100px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Female
                              <i
                      style={{
                        color: "#fff"
                      }}>_</i>Non-Preg.</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderRight: "3px solid rgb(0,0,0)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "100px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Female
                              <i
                      style={{
                        color: "#fff"
                      }}>_</i>Pregnant</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "100px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>0 - 11
                              <i
                      style={{
                        color: "#fff"
                      }}>_</i>months</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>1 - 14
                              <i
                      style={{
                        color: "#fff"
                      }}>_</i>years</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>15 - 24 < i style={{
                      color: "#fff"
                    }}
                    >_</i>years</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>25 +
                            <i
                      style={{
                        color: "#fff"
                      }}>_</i>years</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-85px"
                    }}>Routine
                            <i
                      style={{
                        color: "#fff"
                      }}>_</i>HTS
                            <i
                      style={{
                        color: "#fff"
                      }}>_</i>within Health<i style={{
                        color: "#fff"
                      }}>_</i>Service</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-85px"
                    }}>Comes<i style={{
                      color: "#fff"
                    }}>_</i>with<i style={{
                      color: "#fff"
                    }}>_</i>HTS Family<i style={{
                      color: "#fff"
                    }}>_</i>Ref.<i style={{
                      color: "#fff"
                    }}>_</i>Slip</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Other<i style={{
                      color: "#fff"
                    }}>_</i>(VCT,etc.)<i style={{
                      color: "#fff"
                    }}>________________________</i>
                  </div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Never Tested</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Last Negative</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Last Positive</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-85px"
                    }}>Last
                            <i
                      style={{
                        color: "#fff"
                      }}>_</i>Expos. < i style={{
                        color: "#fff"
                      }}
                      >_</i>Infant</div >
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Last Inconclusive</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}>
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>No</div>
                </div>
              </td>
              <td
                rowSpan="3"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  width: "30px",
                  height: "50px"
                }}
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-100px"
                    }}>Yes</div>
                </div>
              </td>
              <td
                colSpan="8"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)"
                }}
                className="boldRight"></td>
              <td
                colSpan="2"
                style={{
                  fontSize: "12px",
                  textAlign: "center"
                }}>Only Test 1 used</td>
              <td
                colSpan="3"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  fontSize: "12px",
                  textAlign: "center"
                }}
                className="boldRight">Test 1 &amp; Test 2
                      <br />Used± Repeat</td>
              <td colSpan="4">&nbsp;</td>
              <td
                colSpan="2"
                style={{
                  borderRight: "3px solid rgb(0,0,0)",
                  borderBottom: "1px dotted rgb(51, 51, 51)",
                  fontSize: "12px",
                  textAlign: "center",
                  verticalAlign: "bottom"
                }}>Confirmatory
                      <br />Results for
                      <br />Clients Last +</td>
              <td
                align="center"
                style={{
                  verticalAlign: "top",
                  fontSize: "12px"
                }}>
                <b>HTS
                        <br />Family
                        <br />Ref Slips</b>
              </td>
              <td
                colSpan="2"
                align="center"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "12px"
                }}
                className="boldRight">
                <b>Condoms</b>
              </td>
              <td
                style={{
                  borderRight: "3px solid rgb(0,0,0)",
                  verticalAlign: "top",
                  fontSize: "12px",
                  textAlign: "center"
                }}>
                <i >Specimen ID for DBS
                        <br />samples sent to lab.</i><br />
              </td>
            </tr>
            <tr>
              <td
                colSpan="4"
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  verticalAlign: "bottom"
                }}>First Pass</td>
              <td
                colSpan="4"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  fontSize: "12px",
                  textAlign: "center",
                  verticalAlign: "bottom"
                }}
                className="boldRight">Immediate Repeat</td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "right bottom 0px",
                      marginLeft: "-89px"
                    }}>Single
                          <i
                      style={{
                        color: "#fff"
                      }}>_</i>Neg</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-95px"
                    }}>Single
                          <i
                      style={{
                        color: " #fff"
                      }}>_</i>Pos</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Test
                          <i
                      style={{
                        color: " #fff"
                      }}>_</i>1&amp;2 < i style={{
                        color: " #fff"
                      }}
                      >_</i>Neg</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Test < i style={{
                      color: " #fff"
                    }}
                    >_</i>1&amp;2 < i style={{
                      color: " #fff"
                    }}
                    >_</i>Pos</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2"
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Test
                    <i style={{
                      color: " #fff"
                    }}>_</i>1&amp;2
                    <i style={{
                      color: " #fff"
                    }}>_</i>disc.</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-75px"
                    }}>New
                    <i style={{
                      color: " #fff"
                    }}>_</i>Negative</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-85px"
                    }}>New
                    <i style={{
                      color: " #fff"
                    }}>_</i>Positive</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-67px"
                    }}>New
                    <i style={{
                      color: " #fff"
                    }}>_</i>Exp.
                    <i style={{
                      color: " #fff"
                    }}>_</i>Infant</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-67px"
                    }}>New
                    <i style={{
                      color: " #fff"
                    }}>_</i>Inconclusive</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-80px"
                    }}>Conf.
                    <i style={{
                      color: " #fff"
                    }}>_</i>Positive</div >
                </div>
              </td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                rowSpan="2"
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-90px"
                    }}>Inconclusive</div>
                </div>
              </td>
              <td
                style={{
                  borderLeft: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>No Partner</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>HIV Unknown</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Partner Neg.</div>
                </div>
              </td>
              <td
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2"
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Partner Pos.</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Low
                    <i style={{
                      color: " #fff"
                    }}>_</i>Risk</div >
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>On - going
                    <i style={{
                      color: " #fff"
                    }}>_</i>Risk</div >
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-56px"
                    }}>High<i style={{
                      color: " #fff"
                    }}>_</i>Risk<i style={{
                      color: " #fff"
                    }}>_</i>Event<i style={{
                      color: " #fff"
                    }}>_</i>in<br />last<i style={{
                      color: " #fff"
                    }}>_</i>3<i style={{
                      color: " #fff"
                    }}>_</i>months</div >
                </div>
              </td>
              <td
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2"
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-57px"
                    }}>Risk<i style={{
                      color: " #fff"
                    }}>_</i>assessment<br />Not<i style={{
                      color: " #fff"
                    }}>_</i>Done</div >
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-55px"
                    }}>No Re - Test needed</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-70px"
                    }}>Re - Test</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-40px"
                    }}>Confirmatory Test at HIV Clinic</div>
                </div>
              </td>
              <td
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontSize: "12px",
                  verticalAlign: "bottom"
                }}
                rowSpan="2"
                className="boldRight">Appointment
                <br />Date Given</td>
              <td
                align="center"
                style={{
                  borderRight: "1px solid rgb(51, 51, 51)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "bottom",
                  fontSize: "12px"
                }}
                rowSpan="2"
                className="boldRight">
                <i>1 Slip for each
                  <br />partner + each
                  <br />U5 child with
                  <br />unk.status</i>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-65px"
                    }}>Male</div>
                </div>
              </td>
              <td
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  borderRight: "1px solid rgb(51, 51, 51)"
                }}
                rowSpan="2"
                className="boldRight">
                <div
                  style={{
                    height: "120px",
                    fontSize: "12px",
                    width: "30px"
                  }}>
                  <div
                    style={{
                      transform: " rotate(-90deg)",
                      transformOrigin: " right bottom 0px",
                      marginLeft: "-65px"
                    }}>Female</div>
                </div>
              </td>
              <td
                style={{
                  borderRight: "3px solid rgb(0,0,0)",
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  verticalAlign: "top",
                  fontSize: "12px",
                  textAlign: "center"
                }}
                rowSpan="2">
                <i>Follow - up outcome for
                  <br />clients referred, etc.</i>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                colSpan="2">Test 1</td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                colSpan="2">Test 2</td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                colSpan="2">Test 1</td>
              <td
                align="center"
                style={{
                  borderBottom: "1px solid rgb(51, 51, 51)",
                  borderRight: "3px solid rgb(0,0,0)",
                  fontStyle: "italic",
                  fontSize: "12px"
                }}
                colSpan="2">Test 2</td>
            </tr>

            {Array(1)
              .fill()
              .map((_, j) => {

                return (
                  <tr
                    id={"row" + j}
                    key={"row" + j}
                    style={{
                      backgroundColor: (j === 1
                        ? "lightblue"
                        : ""),
                      cursor: "pointer"
                    }}>

                    {Array(58)
                      .fill()
                      .map((_, i) => {

                        return (
                          <td
                            id={"cell" + j + "_" + i}
                            key={"cell" + j + "_" + i}
                            className={"tcell" + ([
                              0,
                              1,
                              4,
                              5,
                              9,
                              12,
                              17,
                              18,
                              20,
                              22,
                              24,
                              26,
                              28,
                              33,
                              39,
                              43,
                              47,
                              50,
                              51,
                              52,
                              54,
                              55
                            ].indexOf(i) >= 0
                              ? " boldRight"
                              : "")}>
                            {fields[i]
                              ? (j === 1
                                ? <div
                                  id={"circle" + j + "_" + i}
                                  className={fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && fieldNames[i].subSubField && this.state.data[fieldNames[i].category] && this.state.data[fieldNames[i].category][fieldNames[i].field] && this.state.data[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField
                                    ? "circled"
                                    : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.state.data[fieldNames[i].category] === fieldNames[i].field
                                      ? "circled"
                                      : "normal")}>
                                  {fields[i]
                                    ? fields[i]
                                    : ""}
                                </div>
                                : (j === 0
                                  ? <div
                                    id={"circle" + j + "_" + i}
                                    className={this.state.visitDetails && fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && ((fieldNames[i].subSubField && this.state.visitDetails[fieldNames[i].category] && this.state.visitDetails[fieldNames[i].category][fieldNames[i].field] && this.state.visitDetails[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField) || (this.state.visitDetails[fieldNames[i].category] === fieldNames[i].field))
                                      ? "circled"
                                      : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.state.visitDetails[fieldNames[i].category] === fieldNames[i].field
                                        ? "circled"
                                        : "normal")}>
                                    {fields[i]
                                      ? fields[i]
                                      : ""}
                                  </div>
                                  : <div id={"circle" + j + "_" + i} className="normal">{fields[i]
                                    ? fields[i]
                                    : ""}</div>))
                              : (j === 0
                                ? <div
                                  id={"circle" + j + "_" + i}
                                  className={this.state.visitDetails && fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && ((fieldNames[i].subSubField && this.state.visitDetails[fieldNames[i].category] && this.state.visitDetails[fieldNames[i].category][fieldNames[i].field] && this.state.visitDetails[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField) || (this.state.visitDetails[fieldNames[i].category] === fieldNames[i].field))
                                    ? "circled"
                                    : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.state.visitDetails[fieldNames[i].category] === fieldNames[i].field
                                      ? "circled"
                                      : "normal")}
                                  style={{
                                    color: "#c50000",
                                    fontSize: "16px",
                                    width: (i === 0
                                      ? "150px"
                                      : (i === 51
                                        ? "100px"
                                        : ""))
                                  }}>
                                  {fields[i]
                                    ? fields[i]
                                    : (i === 0 && this.state.visitDetails && this.state.visitDetails.id
                                      ? this.state.visitDetails.id
                                      : (this.state.visitDetails && fieldNames[i] && fieldNames[i].category && this.state.visitDetails[(fieldNames[i].category
                                        ? fieldNames[i].category
                                        : "") + (fieldNames[i].field
                                          ? ":" + fieldNames[i].field
                                          : "") + (fieldNames[i].subField
                                            ? ":" + fieldNames[i].subField
                                            : "")]
                                        ? this.state.visitDetails[(fieldNames[i].category
                                          ? fieldNames[i].category
                                          : "") + (fieldNames[i].field
                                            ? ":" + fieldNames[i].field
                                            : "") + (fieldNames[i].subField
                                              ? ":" + fieldNames[i].subField
                                              : "")]
                                        : ""))}
                                </div>
                                : (j === 1
                                  ? (i === 56
                                    ? ""
                                    : (i === 57
                                      ? ""
                                      : <div
                                        id={"circle" + j + "_" + i}
                                        className={(fields[i]
                                          ? "normal"
                                          : (fieldNames[i] && this.state.label === (fieldNames[i].category
                                            ? fieldNames[i].category
                                            : "") + (fieldNames[i].field
                                              ? ":" + fieldNames[i].field
                                              : "") + (fieldNames[i].subField
                                                ? ":" + fieldNames[i].subField
                                                : "")
                                            ? "active"
                                            : "inactive"))}
                                        style={{
                                          color: "#c50000",
                                          fontSize: "16px",
                                          width: (i === 51
                                            ? "100px"
                                            : "60px")
                                        }}>{fields[i]
                                          ? fields[i]
                                          : (fieldNames[i] && this.state.label === (fieldNames[i].category
                                            ? fieldNames[i].category
                                            : "") + (fieldNames[i].field
                                              ? ":" + fieldNames[i].field
                                              : "") + (fieldNames[i].subField
                                                ? ":" + fieldNames[i].subField
                                                : "")
                                            ? this.state.currentString
                                            : (fieldNames[i] && this.state.data && this.state.data[(fieldNames[i].category
                                              ? fieldNames[i].category
                                              : "") + (fieldNames[i].field
                                                ? ":" + fieldNames[i].field
                                                : "") + (fieldNames[i].subField
                                                  ? ":" + fieldNames[i].subField
                                                  : "")]
                                              ? this.state.data[(fieldNames[i].category
                                                ? fieldNames[i].category
                                                : "") + (fieldNames[i].field
                                                  ? ":" + fieldNames[i].field
                                                  : "") + (fieldNames[i].subField
                                                    ? ":" + fieldNames[i].subField
                                                    : "")]
                                              : ""))}</div>))
                                  : ""))}
                          </td>
                        )

                      })}

                  </tr>
                )

              })}

          </tbody>
        </table>
      </div>

    )

  }

}

export default Transcribe;