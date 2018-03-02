import React, {Component} from 'react';
import './usersViewer.css';
import UserManagement from './userManagement';
import U14 from './u14';
import Keyboard from './keyboard';

class UsersViewer extends Component {

  onChangeHandler(text) {

    this
      .props
      .handleDirectInputChange(this.props.label, text, this.props.group);

    this
      .props
      .queryOptions(text);

  }

  render() {

    let CustomComponent;

    switch (this.props.app.selectedTask) {

      case "Add User":

        CustomComponent = U14;

        break;

      case "Edit User":

        CustomComponent = U14;

        break;

      default:

        CustomComponent = UserManagement;

        break;

    }

    return (
      <div
        style={{
        overflow: "auto",
        padding: "0px",
        height: "calc(100vh - 122px)"
      }}>
        <CustomComponent
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
          fetchUsers={this.props.fetchUsers}
          blockUser={this.props.blockUser}
          activateUser={this.props.activateUser}
          editUser={this.props.editUser}/>

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
                : "text"}/>
            : ""}
        </div>

      </div>
    )

  }
}

export default UsersViewer;