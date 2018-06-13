import React, { Component } from 'react';
import './container.css';
import Dashboard from './dashboard';
import Home from './home';
import U14 from './u14';
import U15 from './u15';
import U16 from './u16';
import U12 from './u12';
import Keyboard from './keyboard';

class Container extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dual: false,
      busy: false
    }

  }

  onChangeHandler(text) {

    this
      .props
      .handleDirectInputChange(this.props.label, text, this.props.group);

    this
      .props
      .queryOptions(text);

  }

  async componentDidUpdate() {

    if (this.props.currentPatient && this.props.selectedVisit && this.props.module && this.props.currentPatient[this.props.module] && this.props.currentPatient[this.props.module].visits) {

      const currentVisit = (this.props.currentPatient && this.props.selectedVisit && this.props.module && this.props.currentPatient[this.props.module] && this.props.currentPatient[this.props.module].visits && this.props.currentPatient[this.props.module].visits.filter((e) => {
        return Object.keys(e)[0] === this.props.selectedVisit
      }).length > 0
        ? this.props.currentPatient[this.props.module].visits.filter((e) => {
          return Object.keys(e)[0] === this.props.selectedVisit
        })[0][this.props.selectedVisit]
        : {});

      if (currentVisit && currentVisit["Pre-Test Counseling"] && currentVisit["Pre-Test Counseling"]["Partner present?"] === "Yes") { } else { }

    }

  }

  async switchTab(tab, task) {

    await this
      .props
      .updateApp({ currentTab: tab, selectedTask: task })

  }

  loadComponents() {

    return (this.props.activeSection === "patient" && !this.props.formActive && !this.props.app.dual
      ? <Dashboard
        programs={this.props.programs}
        handleSwitchProgram={this.props.handleSwitchProgram}
        selectedModule={this.props.module}
        module={this.props.module}
        activeSection={this.props.activeSection}
        handleVisitUrl={this.props.handleVisitUrl}
        tasks={this.props.tasks}
        handleNavigateToUrl={this.props.handleNavigateToUrl}
        selectedVisit={this.props.selectedVisit}
        selectedTask={this.props.selectedTask}
        order={this.props.order}
        visits={this.props.visits}
        handleVoidEncounter={this.props.handleVoidEncounter}
        currentPatient={this.props.currentPatient}
        icon={this.props.icon}
        app={this.props.app}
        transcribe={this.props.transcribe} />

      : (this.props.app.formActive || this.props.app.dual
        ? (this.props.app.dual
          ? <div>{((this.props.app.secondary.summary || this.props.app.secondary.forceSummary)
            ? <U12
              visitDate={this.props.app.selectedVisit}
              visits={this.props.app.partnerId && this.props.app.module && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId] && this.props.app.patientData[this.props.app.partnerId][this.props.app.module] && this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits
                ? this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits
                : []}
              handleVoidEncounter={this.props.handleVoidEncounter}
              module={this.props.app.module}
              icon={this.props.icon}
              mini={true}
              switchWorkflow={this
                .props
                .switchWorkflow
                .bind(this)}
              borderBottom={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
              borderLeft={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
              borderRight={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
              backgroundColor={(this.props.activeWorkflow === "secondary"
                ? ""
                : "#eeeeee")}
              targetWorkflow="secondary"
              app={this.props.app}
              transcribe={this.props.transcribe} />
            : <U15
              label={(this.props.wf && this.props.wf["secondary"] && this.props.wf["secondary"].currentNode && this.props.wf["secondary"].currentNode.label
                ? this.props.wf["secondary"].currentNode.label
                : "")}
              responses={this.props.responses}
              handleDirectInputChange={this.props.handleDirectInputChange}
              configs={this.props.configs}
              value={(this.props.responses && this.props.responses.secondary && this.props.responses.secondary[this.props.label]
                ? this.props.responses.secondary[this.props.label]
                : "")}
              type={(this.props.wf && this.props.wf["secondary"] && this.props.wf["secondary"].currentNode && this.props.wf["secondary"].currentNode.type
                ? this.props.wf["secondary"].currentNode.type
                : "")}
              summaryIgnores={this.props.summaryIgnores}
              sectionHeader={this.props.app.secondary.sectionHeader}
              processing={this.props.processing}
              options={(this.props.wf && this.props.wf["secondary"] && this.props.wf["secondary"].currentNode && this.props.wf["secondary"].currentNode.options
                ? this.props.wf["secondary"].currentNode.options
                : null)}
              fieldType={this.props.fieldType}
              handleInputChange={this.props.handleInputChange}
              queryOptions={this.props.queryOptions}
              data={this.props.data}
              navNext={this.props.navNext}
              group="secondary"
              activeWorkflow={this.props.activeWorkflow}
              switchWorkflow={this
                .props
                .switchWorkflow
                .bind(this)}
              cancelForm={this.props.cancelForm}
              fetchPatientData={this.props.fetchPatientData}
              app={this.props.app}
              ddeResults={this.props.ddeResults}
              ddeCurrentPatient={this.props.ddeCurrentPatient}
              searchByNameAndGender={this.props.searchByNameAndGender}
              selectPatient={this.props.selectPatient}
              showErrorMsg={this.props.showErrorMsg}
              handleNextButtonClicks={this.props.handleNextButtonClicks}
              activeSection={this.props.activeSection}
              searchByIdentifier={this.props.searchByIdentifier}
              updateApp={this.props.updateApp}
              showConfirmMsg={this.props.showConfirmMsg}
              showInfoMsg={this.props.showInfoMsg}
              wf={this.props.wf}
              clearField={this.props.clearField} />)}{((this.props.app.primary.summary || this.props.app.primary.forceSummary)
                ? <U12
                  visitDate={this.props.app.selectedVisit}
                  visits={this.props.app.clientId && this.props.app.module && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId] && this.props.app.patientData[this.props.app.clientId][this.props.app.module] && this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits
                    ? this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits
                    : []}
                  handleVoidEncounter={this.props.handleVoidEncounter}
                  module={this.props.module}
                  icon={this.props.icon}
                  mini={true}
                  switchWorkflow={this
                    .props
                    .switchWorkflow
                    .bind(this)}
                  borderBottom={(this.props.activeWorkflow === "primary"
                    ? "red"
                    : "#eeeeee")}
                  borderLeft={(this.props.activeWorkflow === "primary"
                    ? "red"
                    : "#eeeeee")}
                  borderRight={(this.props.activeWorkflow === "primary"
                    ? "red"
                    : "#eeeeee")}
                  backgroundColor={(this.props.activeWorkflow === "primary"
                    ? ""
                    : "#eeeeee")}
                  targetWorkflow="primary"
                  app={this.props.app}
                  transcribe={this.props.transcribe} />
                : <U16
                  label={(this.props.wf && this.props.wf["primary"] && this.props.wf["primary"].currentNode && this.props.wf["primary"].currentNode.label
                    ? this.props.wf["primary"].currentNode.label
                    : "")}
                  responses={this.props.responses}
                  handleDirectInputChange={this.props.handleDirectInputChange}
                  configs={this.props.configs}
                  value={(this.props.responses && this.props.responses.primary && this.props.responses.primary[this.props.label]
                    ? this.props.responses.primary[this.props.label]
                    : "")}
                  type={(this.props.wf && this.props.wf["primary"] && this.props.wf["primary"].currentNode && this.props.wf["primary"].currentNode.type
                    ? this.props.wf["primary"].currentNode.type
                    : "")}
                  summaryIgnores={this.props.summaryIgnores}
                  sectionHeader={this.props.app.primary.sectionHeader}
                  processing={this.props.processing}
                  options={(this.props.wf && this.props.wf["primary"] && this.props.wf["primary"].currentNode && this.props.wf["primary"].currentNode.options
                    ? this.props.wf["primary"].currentNode.options
                    : null)}
                  fieldType={this.props.fieldType}
                  handleInputChange={this.props.handleInputChange}
                  queryOptions={this.props.queryOptions}
                  data={this.props.data}
                  navNext={this.props.navNext}
                  group="primary"
                  activeWorkflow={this.props.activeWorkflow}
                  switchWorkflow={this
                    .props
                    .switchWorkflow
                    .bind(this)}
                  cancelForm={this.props.cancelForm}
                  fetchPatientData={this.props.fetchPatientData}
                  ddeResults={this.props.ddeResults}
                  ddeCurrentPatient={this.props.ddeCurrentPatient}
                  searchByNameAndGender={this.props.searchByNameAndGender}
                  selectPatient={this.props.selectPatient}
                  showErrorMsg={this.props.showErrorMsg}
                  handleNextButtonClicks={this.props.handleNextButtonClicks}
                  activeSection={this.props.activeSection}
                  app={this.props.app}
                  searchByIdentifier={this.props.searchByIdentifier}
                  updateApp={this.props.updateApp}
                  showConfirmMsg={this.props.showConfirmMsg}
                  showInfoMsg={this.props.showInfoMsg}
                  wf={this.props.wf}
                  clearField={this.props.clearField} />)}
          </div>
          : <U14
            label={this.props.label}
            responses={this.props.responses}
            handleDirectInputChange={this.props.handleDirectInputChange}
            configs={this.props.configs}
            value={this.props.value}
            type={this.props.type}
            summaryIgnores={this.props.summaryIgnores}
            sectionHeader={this.props.sectionHeader}
            processing={this.props.processing}
            options={this.props.options}
            fieldType={this.props.fieldType}
            handleInputChange={this.props.handleInputChange}
            queryOptions={this.props.queryOptions}
            data={this.props.data}
            navNext={this.props.navNext}
            group={this.props.group}
            fetchPatientData={this.props.fetchPatientData}
            cancelForm={this.props.cancelForm}
            selectedTask={this.props.selectedTask}
            previous={this.props.previous}
            nextBDRow={this.props.nextBDRow}
            currentEditRow={this.props.currentEditRow}
            fetchLastBDRow={this.props.fetchLastBDRow}
            fetchEditRow={this.props.fetchEditRow}
            saveBDRow={this.props.saveBDRow}
            saveEditRow={this.props.saveEditRow}
            ddeResults={this.props.ddeResults}
            ddeCurrentPatient={this.props.ddeCurrentPatient}
            searchByNameAndGender={this.props.searchByNameAndGender}
            selectPatient={this.props.selectPatient}
            showErrorMsg={this.props.showErrorMsg}
            handleNextButtonClicks={this.props.handleNextButtonClicks}
            activeSection={this.props.activeSection}
            app={this.props.app}
            searchByIdentifier={this.props.searchByIdentifier}
            updateApp={this.props.updateApp}
            showConfirmMsg={this.props.showConfirmMsg}
            showInfoMsg={this.props.showInfoMsg}
            activeWorkflow={this.props.activeWorkflow}
            wf={this.props.wf}
            clearField={this.props.clearField} />)
        : <Home
          programs={this.props.programs}
          handleSwitchProgram={this.props.handleSwitchProgram}
          selectedModule={this.props.module}
          tasks={this.props.userDashTasks}
          handleNavigateToUrl={this.props.handleNavigateToUrl}
          selectedTask={this.props.selectedTask}
          order={(this.props.userDashTasks || []).map((task) => {
            return task.label
          })}
          switchTab={this
            .switchTab
            .bind(this)}
          updateApp={this.props.updateApp}
          icon={this.props.icon}
          currentTab={this.props.currentTab}
          app={this.props.app}
          addRegister={this.props.addRegister}
          closeRegister={this.props.closeRegister}
          fetchRegisterStats={this.props.fetchRegisterStats}
          fetchVisitSummaries={this.props.fetchVisitSummaries}
          reports={this.props.reports}
          changePassword={this.props.changePassword}
          printLabel={this.props.printLabel}
          addLocation={this.props.addLocation}
          addVillages={this.props.addVillages} />))
  }
  render() {
    return (

      <div
        style={{
          borderCollapse: "collapse",
          marginLeft: "4px",
          boxShadow: "5px 2px 5px 0px rgba(0, 0, 0, 0.75)",
          width: "calc(100vw - 14px)",
          border: "1px solid #004586",
          height: (this.props.selectedTask === "Backdata Entry"
            ? "calc(100vh - 180px)"
            : "calc(100vh - 220px)")
        }}>
        {this.loadComponents()}

        <div
          style={{
            position: "absolute",
            bottom: "90px",
            textAlign: "center",
            width: "calc(100% - 10px)",
            left: "5px"
          }}>
          {((((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || this.props.options || []).length <= 0) && !(this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].fieldType === "barcode")) && this.props.formActive && this.props.type !== "exit" && (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].fieldType !== undefined
            ? this.props.configs[this.props.label].fieldType
            : "") !== "" && ((this.props.activeWorkflow === "secondary" && !this.props.app.secondSummary) || (this.props.activeWorkflow === "primary" && !this.props.app.firstSummary))
            ? <Keyboard
              onChangeHandler={this
                .onChangeHandler
                .bind(this)}
              currentString={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
                ? this.props.responses[this.props.group][this.props.label]
                : "")}
              configs={this.props.configs}
              options={this.props.options}
              label={this.props.label}
              responses={this.props.responses[this.props.group]}
              fieldType={this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].fieldType !== undefined
                ? this.props.configs[this.props.label].fieldType
                : "text"} />
            : ""}
        </div>

      </div>

    )
  }

}

export default Container;