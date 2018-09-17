import React, { Component } from 'react';
import './u14.css';
import Input from './input';
import Summary from './summary';
import SingleTestResult from './singleTestResult';
import ParallelTestResult from './parallelTestResult';
import BackdataEntry from './backdataEntry';
import DDESearch from './ddeSearch';
import Transcribe from './transcribe';
import FamilyRefs from './familyRefs';
import EntryCode from './entryCode';
import FindEnteredRecord from './findEnteredRecord';
import ShowUserStats from './showUserStats';
import ReferralOutcome from './ReferralOutcome';

class U14 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      previous: {},
      count: 0,
      busy: false
    }

  }

  handleDataEntryDone(data) {

    data.id = this.state.count + 1;

    this.setState({
      previous: data,
      count: this.state.count + 1
    })

  }

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
    }).slice(0, 20).map((opt) => {

      return (
        <li
          className={this.props.responses && this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label] && this.props.responses[this.props.group][this.props.label] === opt
            ? "selectedLi"
            : "selectLi"}
          id={opt.replace(/[^a-z0-9]/gi, "_")}
          key={opt.replace(/[^a-z0-9]/gi, "_")}
          onMouseDown={() => {
            document
              .getElementById("touchscreenTextInput")
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

      if (this.$("touchscreenTextInput")) {

        this
          .$("touchscreenTextInput")
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

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "BackdataEntry") {

      CustomComponent = BackdataEntry;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "DDESearch") {

      CustomComponent = DDESearch;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "Transcribe") {

      CustomComponent = Transcribe;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "FamilyRefs") {

      CustomComponent = FamilyRefs;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "EntryCode") {

      CustomComponent = EntryCode;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "FindEnteredRecord") {

      CustomComponent = FindEnteredRecord;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "ShowUserStats") {

      CustomComponent = ShowUserStats;

    } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].customComponent && this.props.configs[this.props.label].customComponent === "ReferralOutcome") {

      CustomComponent = ReferralOutcome;

    }

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].properties) {

      properties = this.props.configs[this.props.label].properties;

    }

    return (

      <div
        style={{
          height: (this.props.selectedTask === "Backdata Entry"
            ? "calc(100vh - 180px)"
            : "calc(100vh - 220px)"),
          backgroundColor: "#ffffff",
          userSelect: "none"
        }}>

        {(this.props.processing
          ? <div className="pleaseWait">Please wait...</div>
          : <div>
            <div
              className={this.props.sectionHeader === "Backdata Entry"
                ? "bdeSectionHeader"
                : "sectionHeader"}>
              {this.props.sectionHeader}
            </div>
            <div
              style={{
                borderBottom: "1px solid #0065fd",
                height: "2px"
              }}></div>
            {(this.props.type === "exit"
              ? <Summary
                responses={(this.props.group && this.props.responses && this.props.responses[this.props.group]
                  ? this.props.responses[this.props.group]
                  : {})}
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
                  handleDataEntryDone={this
                    .handleDataEntryDone
                    .bind(this)}
                  previous={this.props.nextBDRow}
                  current={this.props.currentEditRow}
                  fetchLastBDRow={this.props.fetchLastBDRow}
                  saveBDRow={this.props.saveBDRow}
                  fetchEditRow={this.props.fetchEditRow}
                  saveEditRow={this.props.saveEditRow}
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
                  activeWorkflow={this.props.activeWorkflow}
                  wf={this.props.wf}
                  clearField={this.props.clearField}
                  reports={this.props.reports}
                  fetchFilteredVisitSummaries={this.props.fetchFilteredVisitSummaries}
                  fetchARTReferral={this.props.fetchARTReferral} />
                : <div>
                  <table
                    width="100%"
                    style={{
                      borderCollapse: "collapse"
                    }}
                    border="0">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "5px",
                            fontSize: "2em"
                          }}
                          id="u14HelpText">
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
                              id="touchscreenTextInput"
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

                      {(((this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || this.props.options || (this.props.data && this.props.data.length > 0))
                        ? (

                          <tr>
                            <td>
                              <div
                                className={(this.props.configs[this.props.label] && this.props.configs[this.props.label].className
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

export default U14;