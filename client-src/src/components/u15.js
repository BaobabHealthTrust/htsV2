import React, {Component} from 'react';
import './u15.css';
import Input from './input';
import Summary from './summary';
import SingleTestResult from './singleTestResult';
import ParallelTestResult from './parallelTestResult';
import DDESearch from './ddeSearch';
import Transcribe from './transcribe';
import FamilyRefs from './familyRefs';

class U15 extends Component {

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
            .getElementById("touchscreenTextInputU15")
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

      if (this.$("touchscreenTextInputU15") && this.props.activeWorkflow === "secondary") {

        this
          .$("touchscreenTextInputU15")
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
        cssFloat: "left",
        height: "calc(100vh - 224px)",
        backgroundColor: (this.props.activeWorkflow === "secondary"
          ? "#ffffff"
          : "#eeeeee"),
        borderLeft: "2px solid " + (this.props.activeWorkflow === "secondary"
          ? "red"
          : "#eeeeee"),
        borderBottom: "2px solid " + (this.props.activeWorkflow === "secondary"
          ? "red"
          : "#eeeeee"),
        borderRight: "2px solid " + (this.props.activeWorkflow === "secondary"
          ? "red"
          : "#eeeeee"),
        userSelect: "none"
      }}
        onMouseDown={() => {
        this
          .props
          .switchWorkflow("secondary")
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
                    summaryIgnores={this.props.summaryIgnores}
                    activeWorkflow={this.props.activeWorkflow}/>
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
                      activeWorkflow={this.props.activeWorkflow}
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
                      wf={this.props.wf}/>
                  : <div>
                    <table
                      width="100%"
                      style={{
                      borderCollapse: "collapse",
                      color: (this.props.activeWorkflow === "secondary"
                        ? "black"
                        : "#eeeeee"),
                        display: (this.props.activeWorkflow === "secondary"
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
                            id="u15HelpText">
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
                                id="touchscreenTextInputU15"
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
                                label={this.props.label}/>}
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

export default U15;