import React, { Component } from 'react';
import './u16.css';
import Input from './input';
import Summary from './summary';
import SingleTestResult from './singleTestResult';
import ParallelTestResult from './parallelTestResult';
import DDESearch from './ddeSearch';
import Transcribe from './transcribe';
import FamilyRefs from './familyRefs';

class U16 extends Component {

  onChangeHandler(text) {

    this
      .props
      .handleDirectInputChange(this.props.label, text, this.props.group);

    this
      .props
      .queryOptions(text);

  }

  renderForLongSelect() {

    return (((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || this.props.options || this.props.data || []).map((opt) => {

      return (
        <li
          className={this.props.responses && this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label] && this.props.responses[this.props.group][this.props.label] === opt
            ? "selectedLi"
            : "selectLi"}
          id={opt.replace(/[^a-z0-9]/gi, "_")}
          key={opt.replace(/[^a-z0-9]/gi, "_")}
          onMouseDown={() => {
            this
              .props
              .handleDirectInputChange(this.props.label, opt, this.props.group);
            if ((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].autoNext && this.props.configs[this.props.label].autoNext === true)) {
              this
                .props
                .navNext(opt);
            }
          }}>{opt}</li>
      )

    }))

  }

  renderForShortSelect() {

    return (((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || this.props.options || this.props.data || []).filter((e) => {
      return String(e)
        .toLowerCase()
        .trim()
        .match("^" + (this.props.value ? String(this.props.value).toLowerCase() : ""))
    }).sort((a, b) => {
      return a > b
    }).slice(0, 5).map((opt) => {

      return (
        <li
          className={this.props.responses && this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label] && this.props.responses[this.props.group][this.props.label] === opt
            ? "selectedLi"
            : "selectLi"}
          id={opt.replace(/[^a-z0-9]/gi, "_")}
          key={opt.replace(/[^a-z0-9]/gi, "_")}
          onMouseDown={() => {
            document
              .getElementById("touchscreenTextInputU16")
              .value = opt;
            this
              .props
              .handleDirectInputChange(this.props.label, opt, this.props.group);
            if ((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].autoNext && this.props.configs[this.props.label].autoNext === true)) {
              this
                .props
                .navNext(opt);
            }
          }}>{opt}</li>
      )

    }))

  }

  $(id) {
    return document.getElementById(id);
  }

  tmrHnd = null

  async componentWillUnmount() {

    clearInterval(this.tmrHnd);

  }

  componentDidMount() {

    this.tmrHnd = setInterval(() => {

      if (this.$("touchscreenTextInputU16") && this.props.activeWorkflow === "primary") {

        this
          .$("touchscreenTextInputU16")
          .focus();

      }

    }, 200)

  }

  render() {

    let CustomComponent;
    let properties = {};

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "SingleTestResult") {

      CustomComponent = SingleTestResult;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "ParallelTestResult") {

      CustomComponent = ParallelTestResult;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "DDESearch") {

      CustomComponent = DDESearch;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "Transcribe") {

      CustomComponent = Transcribe;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "FamilyRefs") {

      CustomComponent = FamilyRefs;

    }

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].properties) {

      properties = this.props.configs[this.props.label].properties;

    }

    return (

      <div
        style={{
          width: "calc(50vw - 10px - 2px)",
          cssFloat: "right",
          height: "calc(100vh - 224px)",
          backgroundColor: (this.props.activeWorkflow === "primary"
            ? "#ffffff"
            : "#eeeeee"),
          borderLeft: "3px solid " + (this.props.activeWorkflow === "primary"
            ? "red"
            : "#eeeeee"),
          borderBottom: "3px solid " + (this.props.activeWorkflow === "primary"
            ? "red"
            : "#eeeeee"),
          borderRight: "3px solid " + (this.props.activeWorkflow === "primary"
            ? "red"
            : "#eeeeee"),
          userSelect: "none"
        }}
        onMouseDown={() => {

          let rows = this
            .props
            .app
            .patientData[this.props.app.partnerId][this.props.app.module]
            .visits
            .filter((e) => {
              return Object
                .keys(e)
                .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
            });



          if (rows.length > 0) {

            let canProceed = true;

            for (let entryCode of Object.keys(rows[0][this.props.app.selectedVisit])) {

              if (Object.keys(rows[0][this.props.app.selectedVisit][entryCode]["HTS Visit"]).indexOf("registerNumber") <= 0) {

                canProceed = false;

              }

            }

            if (canProceed) {

              this
                .props
                .switchWorkflow("primary")

            } else {

              this
                .props
                .showInfoMsg("Missing data", "Please capture data for one client first before the next client!");

            }

          } else {

            this
              .props
              .showInfoMsg("Missing data", "Please capture data for one client first before the next client!");

          }

        }}>

        {(this.props.processing
          ? <div className="pleaseWait">Please wait...</div>
          : <div>
            <div className="sectionHeader">
              {this.props.sectionHeader}
            </div>
            <div
              style={{
                borderBottom: "1px solid #0065fd",
                height: "2px"
              }}></div>
            {(this.props.type === "exit"
              ? <Summary
                responses={this.props.responses[this.props.group]}
                summaryIgnores={this.props.summaryIgnores} />
              : (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent
                ? <CustomComponent
                  label={properties.label}
                  test={properties.test}
                  duration={properties.duration}
                  group={this.props.group}
                  handleDirectInputChange={this.props.handleDirectInputChange}
                  responses={(this.props.group && this.props.responses && this.props.responses[this.props.group]
                    ? this.props.responses[this.props.group]
                    : {})}
                  test2={properties.test2}
                  duration2={properties.duration2}
                  ddeResults={this.props.ddeResults}
                  ddeCurrentPatient={this.props.ddeCurrentPatient}
                  searchByNameAndGender={this.props.searchByNameAndGender}
                  selectPatient={this.props.selectPatient}
                  showErrorMsg={this.props.showErrorMsg}
                  handleNextButtonClicks={this.props.handleNextButtonClicks}
                  activeSection={this.props.activeSection}
                  app={this.props.app}
                  sectionHeader={this.props.sectionHeader}
                  updateApp={this.props.updateApp}
                  showConfirmMsg={this.props.showConfirmMsg}
                  showInfoMsg={this.props.showInfoMsg}
                  mini={true}
                  activeWorkflow={this.props.activeWorkflow}
                  wf={this.props.wf} />
                : <div>
                  <table
                    width="100%"
                    style={{
                      borderCollapse: "collapse",
                      color: (this.props.activeWorkflow === "primary"
                        ? "black"
                        : "#eeeeee"),
                      display: (this.props.activeWorkflow === "primary"
                        ? "table"
                        : "none"),
                      width: "100%"
                    }}
                    border="0">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "5px",
                            fontSize: "2em"
                          }}
                          id="u16HelpText">
                          {this.props.label}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingLeft: "10px"
                          }}>
                          {(this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].className && this.props.configs[this.props.label].className === "longSelectList")
                            ? ""
                            : <Input
                              className="touchscreenTextInput"
                              id="touchscreenTextInputU16"
                              value={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
                                ? this.props.responses[this.props.group][this.props.label]
                                : "")}
                              onChangeHandler={this
                                .onChangeHandler
                                .bind(this)}
                              currentString={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
                                ? this.props.responses[this.props.group][this.props.label]
                                : "")}
                              fieldType={this.props.fieldType}
                              navNext={this.props.navNext}
                              configs={this.props.configs}
                              options={this.props.options}
                              placeholder={this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].placeholder
                                ? this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].placeholder
                                : ""}
                              label={this.props.label} />}
                        </td>
                      </tr>

                      {(((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || this.props.options || (this.props.data && this.props.data.length > 0))
                        ? (

                          <tr>
                            <td>
                              <div
                                className={(this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].className
                                  ? this.props.configs[this.props.label].className
                                  : "shortSelectList")}>
                                <ul
                                  className="selectUl"
                                  style={{
                                    listStyle: "none",
                                    textAlign: "left",
                                    padding: "0px"
                                  }}>
                                  {(this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].className && this.props.configs[this.props.label].className === "longSelectList")
                                    ? (this.renderForLongSelect())
                                    : (this.renderForShortSelect())}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )
                        : (

                          <tr>
                            <td></td>
                          </tr>

                        ))}

                    </tbody>
                  </table>

                </div>))}

          </div>)}

      </div>

    )

  }

}

export default U16;