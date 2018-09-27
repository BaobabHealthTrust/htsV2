import React, { Component } from "react";
import { connect } from "react-redux";
import Topbar from "./components/topbar";
import U13 from "./components/u13";
import Container from "./components/container";
import {
  initApp,
  updateApp,
  submitForm,
  fetchJSON,
  fetchPatientData,
  voidEncounter,
  fetchVisits,
  voidMultipleEncounters,
  fetchRegisterStats,
  logout,
  login,
  setLocation,
  sessionValid,
  fetchUsers,
  blockUser,
  activateUser,
  loadData,
  flagRegisterFilled,
  updatePartnerRecord,
  getVersion,
  usernameValid,
  updatePassword,
  checkRedirectToPortal
} from "./actions/appAction";
import { fetchData, clearCache, setData } from "./actions/fetchDataAction";
import { ClipLoader } from "react-spinners";
import { loadWorkflow, goForward, clearWorkflow, goBackward, handleInputChange, clearField } from "./actions/wfActions";
import { fetchLastBDRow, saveBDRow, fetchEditRow, saveEditRow, resetErrorMessage } from "./actions/bdAction";
import {
  searchByIdentifier,
  searchByNameAndGender,
  advancedPatientSearch,
  voidPatient,
  addPatient,
  updatePatient,
  mergeRecords,
  clearDataStructs,
  selectPatient,
  setConfig
} from "./actions/ddeActions";
import Alert from "./components/alert";
import Dialog from "./components/dialog";
import { showInfoMsg, showErrorMsg, showConfirmMsg, closeMsg, updateAlertKey } from "./actions/alertActions";
import ReportsViewer from "./components/reportsViewer";
import {
  showDialog,
  closeDialog,
  incrementReportMonth,
  incrementReportYear,
  decrementReportMonth,
  decrementReportYear,
  scrollLocationUp,
  scrollLocationDown,
  scrollTestUp,
  scrollTestDown,
  updateReportField
} from "./actions/dialogActions";
import {
  fetchReport,
  setPeriod,
  fetchRaw,
  resetRawData,
  setDataHeaders,
  fetchDailyRegister,
  fetchVisitSummaries,
  fetchPepfarData,
  resetPepfarData,
  fetchFilteredVisitSummaries
} from "./actions/reportsActions";
import { processes } from './processes';
import { barcode } from './validations/barcodeEvents';
import { updateClient } from './validations/updateClient';
import { switches } from "./validations/switches";
import { validated } from './validations/validated';
import UsersViewer from './components/usersViewer';
// eslint-disable-next-line
import algorithm from './lib/dhaAlgorithm.js';
import Login from './components/login';
import tests from './config/tests';
import locations from './config/pepfarLocations';
import modalities from './config/htsModalities';
import Axios from 'axios';
import FileDownload from 'react-file-download';
// eslint-disable-next-line
import uuid from 'uuid';
// eslint-disable-next-line
import password from "./images/password";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentWorkflow: "",
      suspendedWorkflow: "",
      loaded: {},
      busy: false,
      scanID: null
    };

    this.login = this
      .login
      .bind(this)

  }

  processedConfigs = {};

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  async componentDidMount() {

    let accessToken = this.getCookie('accessToken');

    if (accessToken.trim().length <= 0)
      return;

    this
      .props
      .sessionValid(accessToken)
      .then(async () => {

        accessToken = this.getCookie('accessToken');
        const username = this.getCookie('username');
        const role = this.getCookie('role');
        const location = this.getCookie('location');

        if (username.trim().length > 0 && role.length > 0 && accessToken.trim().length > 0 && location.trim().length > 0) {

          await this
            .props
            .updateApp({
              currentLocation: location,
              activeLocation: location,
              location,
              activeUser: username,
              accessToken,
              role
            });

          this
            .props
            .initApp("/programs?role=" + role);

        }

      })
      .catch(() => {

        this.setCookie('username', '', 1);
        this.setCookie('role', '', 1);
        this.setCookie('location', '', 1);
        this.setCookie('accessToken', '', 1);

      });

  }

  componentWillMount() {

    this.props.checkRedirectToPortal();

    this.props.getVersion();

  }

  async componentDidUpdate() {

    updateClient(this.props, this.state, this);

    barcode(this.props, this.state);

    processes(this.props, this.state, this, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].configs
      ? this.props.app.data[this.props.app.module]["PatientRegistration"].configs
      : {}), (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
        ? this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
        : {}), tests, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module].referrals
          ? this.props.app.data[this.props.app.module].referrals
          : {}));

    switches(this.props, this.state);

    this
      .props
      .app
      .tasks
      .forEach(task => {

        if (this.processedConfigs[task.label])
          return;

        this.processedConfigs[task.label] = true;

        this
          .props
          .fetchJSON("/programs/fetch_json", task.path, this.props.app.module, task.label);

      });

    if (this.props.app.refresh && this.props.app.currentId) {

      setTimeout(() => {

        this
          .props
          .fetchVisits(this.props.app.currentId);

      }, 1000);

    }

    if (!this.state.busy && this.props.bd.errorMessage !== null) {

      await this.setState({ busy: true });

      const message = this.props.bd.errorMessage;

      await this.props.resetErrorMessage();

      this.props.showErrorMsg("Invalid Entry", message);

      await this.setState({ busy: false });

    }

  }

  $(id) {
    return document.getElementById(id);
  }

  intBarcode = null;

  async searchById(id) {

    await this.setState({ currentWorkflow: "primary", scanID: id });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["PatientRegistration"].data);

    await this
      .props
      .goForward(this.state.currentWorkflow, "Yes");

    await this
      .props
      .goForward(this.state.currentWorkflow, "No");

    await this
      .props
      .goForward(this.state.currentWorkflow, id);

    await this
      .props
      .handleInputChange("Client consents to be contacted", "Yes", this.state.currentWorkflow);

    await this
      .props
      .updateApp({ ignore: true, scanID: id });

    await this
      .props
      .searchByIdentifier(id)
      .then(async () => {

        await this
          .props
          .updateApp({
            selectedTask: "Search By ID",
            formActive: true,
            currentSection: "registration",
            configs: Object.assign({}, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].configs
              ? this.props.app.data[this.props.app.module]["PatientRegistration"].configs
              : {})),
            summaryIgnores: Object.assign([], (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
              ? this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
              : {})),
            sectionHeader: "Search By ID",
            fieldPos: 0,
            notSaved: true
          });

        await this
          .props
          .setConfig({ ignore: false });

        setTimeout(() => {

          this
            .props
            .updateApp({ ignore: false, silentProcessing: false });

        }, 3000)

      })

  }

  checkDigit = (id, check = null) => {

    const parts = String(id).split("");

    const sum = parts.reduce((a, e, i) => {
      return a + parseInt(e, 10);
    }, 0);

    const digit = sum % 10;

    if (check !== null) {

      return digit === parseInt(check, 10);

    } else {

      return digit;

    }

  }

  checkBarcode() {

    const self = this;

    if (this.$("touchscreenTextInput") && ((this.props.app.dual && this.state.currentWorkflow === "secondary") || (!this.props.app.dual && this.state.currentWorkflow === "primary"))) {

      this
        .$("touchscreenTextInput")
        .focus();

      return (this.intBarcode = setTimeout(() => {
        self.checkBarcode();
      }, 200));

    } else if (this.$("touchscreenTextInputU16")) {

      this
        .$("touchscreenTextInputU16")
        .focus();

      return (this.intBarcode = setTimeout(() => {
        self.checkBarcode();
      }, 200));

    }

    if (this.$("barcode") && this.props.app.module !== "") {

      if (this.$("barcode").value.trim().match(/\$$/)) {

        const text = this
          .$("barcode")
          .value
          .trim()
          .replace(/\$/g, "");

        if (text.trim().length > 0) {

          this
            .$("barcode")
            .value = "";

          if (String(text).match(/^ec/i)) {

            let number = String(text)
              .trim()
              .replace(/^ec/i, "");

            const check = number.substring(number.length - 1, number.length);

            number = number.substring(0, number.length - 2);

            if (!this.checkDigit(number, check)) {

              this
                .props
                .showErrorMsg("Error!", "Invalid Entry Code Scanned!");

              this
                .$("barcode")
                .focus();

              this.intBarcode = setTimeout(() => {
                self.checkBarcode();
              }, 200);

            } else {

              this.searchById(text);

            }

          } else {

            this.searchById(text);

          }

        } else {

          this
            .$("barcode")
            .value = "";

          this
            .$("barcode")
            .focus();

          this.intBarcode = setTimeout(() => {
            self.checkBarcode();
          }, 200);

        }
      } else {
        this
          .$("barcode")
          .focus();

        this.intBarcode = setTimeout(() => {
          self.checkBarcode();
        }, 200);
      }
    } else {
      if (this.$("barcode")) {
        if (this.$("barcode").value.trim().match(/\$$/)) {
          this
            .$("barcode")
            .value = "";
        }

        this
          .$("barcode")
          .focus();
      }

      this.intBarcode = setTimeout(() => {
        self.checkBarcode();
      }, 200);
    }
  }

  switchProgram(programName) {

    this
      .props
      .fetchRegisterStats();

    const program = this
      .props
      .app
      .programs
      .filter(p => {
        return p.name === programName;
      })[0];

    const payload = {
      module: programName,
      icon: program.icon,
      tasks: program.tasks,
      selectedTask: "",
      selectedVisit: new Date().format("d mmm YYYY"),
      userDashTasks: program.userDashTasks,
      order: this.props.app.data && this.props.app.data[programName]
        ? this.props.app.data[programName].order
        : [],
      currentTab: null
    };

    this
      .props
      .updateApp(payload);

  }

  async navigateToRoute(task, url, group) {

    if (!this.props.app.data[this.props.app.module][task])
      return;

    await this.setState({
      currentWorkflow: group
        ? group
        : task.toLowerCase()
    });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module][task].data);

    let payload = {
      configs: Object.assign({}, this.props.app.data[this.props.app.module][task].configs),
      summaryIgnores: Object.assign([], this.props.app.data[this.props.app.module][task].ignores)
    };

    if (task === "HTS Visit") {

      await this
        .props
        .handleInputChange("Partner Present", (this.props.app.dual
          ? "Yes"
          : "No"), this.state.currentWorkflow);

      if (this.state.currentWorkflow === "secondary") {

        await this
          .props
          .handleInputChange("Partner HIV Status", "HIV Unknown", this.state.currentWorkflow);

      }

    }

    switch (group) {

      case "primary":

        payload.primary = {
          selectedTask: task,
          formActive: true,
          sectionHeader: task
        };

        payload.formActive = true;
        payload.selectedTask = task;
        payload.sectionHeader = task;

        break;

      case "secondary":

        payload.secondary = {
          selectedTask: task,
          formActive: true,
          sectionHeader: task
        };

        payload.selectedTask = task;
        payload.formActive = true;
        payload.sectionHeader = task;

        break;

      default:

        payload.selectedTask = task;
        payload.formActive = true;
        payload.sectionHeader = task;

        break;

    }

    await this
      .props
      .updateApp(payload);

  }

  navigateToVisit(visit) {
    this
      .props
      .updateApp({ selectedVisit: visit });
  }

  async switchPage(target) {

    if (this.props.app.dual) {

      if (this.props.app.partnerId) {

        if (!this.props.app.formActive && this.props.app.patientActivated && this.props.app.partnerId && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.partnerId][this.props.app.module] && this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits && this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits.filter((e) => {
          return Object
            .keys(e)
            .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
        })) {

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

            for (let entryCode of Object.keys(rows[0][this.props.app.selectedVisit])) {

              if (Object.keys(rows[0][this.props.app.selectedVisit][entryCode]["HTS Visit"]).indexOf("registerNumber") <= 0) {

                return this
                  .props
                  .showInfoMsg("Transcribe in Register", "The current partner visit does not have a register number associated. Please enter in re" +
                    "gister first to proceed!");

              }

            }

          }

        }

      } else {

        return this.props.showInfoMsg("Incomplete Data", "The current visit is missing partner data. Please capture partner data first before closing session.")

      }

      if (this.props.app.clientId) {

        if (!this.props.app.formActive && this.props.app.patientActivated && this.props.app.clientId && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.clientId][this.props.app.module] && this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits && this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits.filter((e) => {
          return Object
            .keys(e)
            .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
        })) {

          let rows = this
            .props
            .app
            .patientData[this.props.app.clientId][this.props.app.module]
            .visits
            .filter((e) => {
              return Object
                .keys(e)
                .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
            });

          if (rows.length > 0) {

            for (let entryCode of Object.keys(rows[0][this.props.app.selectedVisit])) {

              if (Object.keys(rows[0][this.props.app.selectedVisit][entryCode]["HTS Visit"]).indexOf("registerNumber") <= 0) {

                return this
                  .props
                  .showInfoMsg("Transcribe in Register", "The current partner visit does not have a register number associated. Please enter in re" +
                    "gister first to proceed!");

              }

            }

          }

        }

      } else {

        return this.props.showInfoMsg("Incomplete Data", "The current visit is missing partner data. Please capture partner data first before closing session.")

      }

    } else {

      if (!this.props.app.formActive && this.props.app.patientActivated && this.props.app.currentId && this.props.app.patientData && this.props.app.patientData[this.props.app.currentId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.currentId][this.props.app.module] && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits.filter((e) => {
        return Object
          .keys(e)
          .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
      })) {

        let rows = this
          .props
          .app
          .patientData[this.props.app.currentId][this.props.app.module]
          .visits
          .filter((e) => {
            return Object
              .keys(e)
              .length > 0 && Object.keys(e)[0] === this.props.app.selectedVisit
          });

        if (rows.length > 0) {

          for (let entryCode of Object.keys(rows[0][this.props.app.selectedVisit])) {

            if (Object.keys(rows[0][this.props.app.selectedVisit][entryCode]["HTS Visit"]).indexOf("registerNumber") <= 0) {

              return this
                .props
                .showInfoMsg("Transcribe in Register", "The current visit does not have a register number associated. Please enter in re" +
                  "gister first to proceed!");

            }

          }

        }

      }

    }

    let nextPage = target;

    let payload = {
      patientActivated: nextPage === "home"
        ? false
        : true,
      dual: nextPage === "home"
        ? false
        : true,
      silentProcessing: false,
      ignore: false
    };

    if (nextPage)
      payload.currentSection = nextPage;

    if (nextPage === "home") {

      await this
        .props
        .clearCache();

      await this
        .props
        .clearDataStructs();

      ["primary", "secondary"].forEach(workflow => {
        this
          .props
          .clearWorkflow(workflow);
      });

      payload = {
        formActive: false,
        selectedTask: "",
        fieldPos: 0,
        configs: {},
        summaryIgnores: [],
        dual: false,
        silentProcessing: false,
        ignore: false,
        scanID: null,
        primary: {},
        secondary: {},
        patientActivated: false,
        firstSummary: null,
        secondSummary: null
      };

      payload.currentSection = "home";
      payload.clientId = null;
      payload.partnerId = null;
      payload.currentPatient = {};
      payload.partner = {};
      payload.currentId = null;

      this.checkBarcode();

      if (this.props.app.currentId && this.props.app.flagged) {

        delete this.props.app.flagged[this.props.app.currentId];

      }

      if (this.props.app.partnerId && this.props.app.flagged) {

        delete this.props.app.flagged[this.props.app.partnerId];

      }

    }

    await this
      .props
      .updateApp(payload);

  }

  queryOptions(value) {

    if (this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
      ? this.props.wf[this.state.currentWorkflow].currentNode.label
      : ""] && Object.keys(this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
        ? this.props.wf[this.state.currentWorkflow].currentNode.label
        : ""]).indexOf("ajaxURL") >= 0) {
      let queryPath = this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
        ? this.props.wf[this.state.currentWorkflow].currentNode.label
        : ""].ajaxURL;

      if (queryPath !== "" && this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
        ? this.props.wf[this.state.currentWorkflow].currentNode.label
        : ""].ajaxURLDummies) {
        Object.keys(this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : ""].ajaxURLDummies).forEach(fieldName => {
            if (this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][fieldName]) {
              queryPath = queryPath.replace(this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                ? this.props.wf[this.state.currentWorkflow].currentNode.label
                : ""].ajaxURLDummies[fieldName], this.props.wf.responses[this.state.currentWorkflow][fieldName]);
            }
          });
      }

      this
        .props
        .fetchData(queryPath + (value
          ? value
          : ""));
    }
  }

  async navBack() {

    if (this.state.currentWorkflow && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label === "Immediate Parallel Repeat Test 1 & 2 Results") {

      this.props.clearField("Immediate Repeat Test 1 Result", this.state.currentWorkflow);

      this.props.clearField("Immediate Repeat Test 2 Result", this.state.currentWorkflow);

      this.props.clearField("Immediate Parallel Repeat Test 1 & 2 Results", this.state.currentWorkflow);

    }

    if (this.state.currentWorkflow && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && (this.props.wf[this.state.currentWorkflow].currentNode.label === "HTS Referral Slips Recipients" || this.props.wf[this.state.currentWorkflow].currentNode.label === "Comments")) {

      this.props.clearField("HTS Referral Slips Recipients", this.state.currentWorkflow);

      this.props.clearField("HTS Family Referral Slips", this.state.currentWorkflow);

    }

    if (this.props.app.fieldPos <= 0) {
      return;
    }

    await this
      .props
      .clearDataStructs();

    await this
      .props
      .clearCache();

    await this
      .props
      .updateApp({
        fieldPos: this.props.app.fieldPos - 1,
        reversing: true
      });

    await this
      .props
      .goBackward(this.state.currentWorkflow);

    await this
      .props
      .updateApp({
        reversing: false
      });

    await this.queryOptions("");

    if (this.props.app.selectedTask === "Backdata Entry") {

      await this.props.updateApp({ isDirty: false });

      if (this.props.wf && this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow]) {

        Object.keys(this.props.wf.responses[this.state.currentWorkflow]).forEach(async (field) => {

          if (["Register Number (from cover)", "Testing Date"].indexOf(field) < 0)
            this.props.clearField(field, this.state.currentWorkflow);

        })

      }

    }

  }

  async navNext(value) {

    if (this.props.app.currentSection === "home" && !this.props.app.formActive) {

      this.switchPage("patient");

    } else if (this.props.app.formActive) {

      const valid = await validated(this.props, this.state);

      if (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label === "Service Delivery Point" && this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow]["Service Delivery Point"]) {
        this
          .props
          .updateApp({
            activeLocation: this.props.wf.responses[this.state.currentWorkflow]["Service Delivery Point"]
          });
      }

      if ((this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
        ? this.props.wf[this.state.currentWorkflow].currentNode.type
        : "") && (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
          ? this.props.wf[this.state.currentWorkflow].currentNode.type
          : "") !== "exit" && valid.valid) {

        await this
          .props
          .clearCache();

        await this
          .props
          .updateApp({
            fieldPos: this.props.app.fieldPos + 1
          });

        await this
          .props
          .goForward(this.state.currentWorkflow, value);

        await this.queryOptions("");

      } else if (!valid.valid) {

        this
          .props
          .showErrorMsg((valid.title ? valid.title : "Invalid Entry"), valid.message);

      } else if ((this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
        ? this.props.wf[this.state.currentWorkflow].currentNode.type
        : "") === "exit") {

        this
          .props
          .updateApp({ formActive: false, selectedTask: "" });

      }

    } else {

      this.switchPage("home");

    }

  }

  handleOnKeyDown(event) {

    const valid = validated(this.props, this.state);

    if (event.keyCode === 13 && valid.valid) {
      this
        .props
        .clearCache();

      this.navNext(event.target.value);
    }
  }

  async handleInputChange(field, e) {
    this
      .props
      .handleInputChange(field, e.target.value, this.state.currentWorkflow);

    this.queryOptions(e.target.value);
  }

  async registerAnonymous() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["PatientRegistration"].data);

    await this
      .props
      .goForward(this.state.currentWorkflow, "Yes");

    this
      .props
      .updateApp({
        selectedTask: "Anonymous Registration",
        formActive: true,
        currentSection: "registration",
        configs: Object.assign({}, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          : {})),
        summaryIgnores: Object.assign([], (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          : {})),
        sectionHeader: "Anonymous Registration",
        fieldPos: 0
      });
  }

  async cancelForm() {

    if (this.$("btnNext"))
      this.$("btnNext").className = "green nav-buttons";

    await this.setState({ busy: true });

    if (this.props.app.dual) {

      if (this.props.app.sectionHeader === "Transcribe in Register") {

        let activeSession;

        if (this.props.app.currentId === this.props.app.clientId) {

          activeSession = "primary";

        } else if (this.props.app.currentId === this.props.app.partnerId) {

          activeSession = "secondary";

        }

        await this
          .props
          .clearCache();

        await this
          .props
          .clearDataStructs();

        if (activeSession) {

          await this
            .props
            .clearWorkflow(activeSession);

          const payload = {
            patientActivated: this.props.app.patientActivated,
            configs: {},
            summaryIgnores: [],
            silentProcessing: false,
            ignore: false,
            formActive: false,
            isDirty: false
          };

          if (activeSession === "primary") {

            payload.primary = {
              summary: true,
              formActive: false,
              selectedTask: "",
              fieldPos: 0
            }

          } else if (activeSession === "secondary") {

            payload.secondary = {
              summary: true,
              formActive: false,
              selectedTask: "",
              fieldPos: 0
            }

          }

          payload.summary = true;

          payload.formActive = false;

          payload.selectedTask = "";

          payload.fieldPos = 0;

          await this
            .props
            .updateApp(payload);

        }

      } else if (this.props.app.formActive) {

        let activeSession;

        if (this.props.app.currentId === this.props.app.clientId) {

          activeSession = "primary";

        } else if (this.props.app.currentId === this.props.app.partnerId) {

          activeSession = "secondary";

        }

        await this
          .props
          .clearCache();

        await this
          .props
          .clearDataStructs();

        if (activeSession) {

          await this
            .props
            .clearWorkflow(activeSession);

          const payload = {
            patientActivated: this.props.app.patientActivated,
            configs: {},
            summaryIgnores: [],
            silentProcessing: false,
            ignore: false,
            formActive: false,
            isDirty: false
          };

          if (activeSession === "primary") {

            payload.primary = {
              summary: true,
              formActive: false,
              selectedTask: "",
              fieldPos: 0
            }

          } else if (activeSession === "secondary") {

            payload.secondary = {
              summary: true,
              formActive: false,
              selectedTask: "",
              fieldPos: 0
            }

          }

          payload.summary = true;

          payload.formActive = false;

          payload.selectedTask = "";

          payload.fieldPos = 0;

          await this
            .props
            .updateApp(payload);

        }

      }

    } else if (this.props.app.sectionHeader === "Transcribe in Register") {

      await this
        .props
        .clearCache();

      await this
        .props
        .clearDataStructs();

      ["primary", "secondary"].forEach(workflow => {
        this
          .props
          .clearWorkflow(workflow);
      });

      const payload = {
        formActive: false,
        selectedTask: "",
        fieldPos: 0,
        patientActivated: this.props.app.patientActivated,
        configs: {},
        summaryIgnores: [],
        dual: false,
        silentProcessing: false,
        ignore: false,
        scanID: null,
        primary: {},
        secondary: {},
        currentSection: "patient",
        isDirty: false,
        firstSummary: null,
        secondSummary: null
      };

      await this
        .props
        .updateApp(payload);

    } else {

      await this
        .props
        .clearCache();

      await this
        .props
        .clearDataStructs();

      ["primary", "secondary"].forEach(workflow => {
        this
          .props
          .clearWorkflow(workflow);
      });

      const payload = {
        formActive: false,
        selectedTask: "",
        fieldPos: 0,
        patientActivated: this.props.app.patientActivated,
        configs: {},
        summaryIgnores: [],
        dual: false,
        silentProcessing: false,
        ignore: false,
        scanID: null,
        primary: {},
        secondary: {},
        isDirty: false,
        firstSummary: null,
        secondSummary: null
      };

      if (["registration", "admin"].indexOf(this.props.app.currentSection) >= 0) {

        payload.currentSection = "home";
        payload.clientId = null;
        payload.partnerId = null;
        payload.currentPatient = {};
        payload.partner = {};
        payload.currentId = null;

        this.checkBarcode();

      }

      await this
        .props
        .updateApp(payload);

    }

    await this.setState({ busy: false, scanID: null });

  }

  async cancelSession() {

    if (this.$("btnNext"))
      this.$("btnNext").className = "green nav-buttons";

    if (!this.props.app.formActive && this.props.app.dual && this.props.app.patientActivated && ((this.props.app.clientId && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.clientId][this.props.app.module] && this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits && this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit && Object
        .keys(e[this.props.app.selectedVisit])
        .length > 0
    }).length > 0) || (this.props.app.partnerId && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.partnerId][this.props.app.module] && this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits && this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit && Object
        .keys(e[this.props.app.selectedVisit])
        .length > 0
    }).length > 0))) {

      this
        .props
        .showConfirmMsg("Confirm", "Visit not complete. All captured entries in the visit will be deleted. Would you" +
          " want to delete them?",
          "Delete", async () => {

            let ids = (!this.props.app.clientId
              ? []
              : (this.props.app.patientData[this.props.app.clientId][this.props.app.module].visits.map((e) => {
                return Object
                  .keys(e[this.props.app.selectedVisit])
                  .map((r) => {
                    return e[this.props.app.selectedVisit][r].encounterId
                  })
                  .reduce((a, e, i) => {
                    if (e)
                      a.push(e);
                    return a;
                  }, [])
              }).reduce((a, e, i) => {
                if (e)
                  a = e;
                return a
              }, []))).concat(!this.props.app.partnerId
                ? []
                : (this.props.app.patientData[this.props.app.partnerId][this.props.app.module].visits.map((e) => {
                  return Object
                    .keys(e[this.props.app.selectedVisit])
                    .map((r) => {
                      return e[this.props.app.selectedVisit][r].encounterId
                    })
                    .reduce((a, e, i) => {
                      if (e)
                        a.push(e);
                      return a;
                    }, [])
                }).reduce((a, e, i) => {
                  if (e)
                    a = e;
                  return a
                }, [])));

            await this
              .props
              .voidMultipleEncounters("/programs/void_multiple_encounters", {
                encounterIds: ids,
                id: this.props.app.clientId,
                partnerId: this.props.app.partnerId,
                visitDate: this.props.app.selectedVisit
              });

            await this
              .props
              .clearCache();

            await this
              .props
              .clearDataStructs();

            ["primary", "secondary"].forEach(workflow => {
              this
                .props
                .clearWorkflow(workflow);
            });

            let nextPage = !this.props.app.patientActivated
              ? "patient"
              : "home";

            let payload = {
              patientActivated: false,
              selectedVisit: new Date().format("d mmm YYYY"),
              currentId: null,
              formActive: false,
              selectedTask: "",
              fieldPos: 0,
              configs: {},
              summaryIgnores: [],
              dual: false,
              currentTab: null,
              activeReport: null,
              clientId: null,
              partnerId: null,
              currentPatient: {},
              partner: {},
              scanID: null,
              primary: {},
              secondary: {},
              isDirty: false,
              firstSummary: null,
              secondSummary: null
            };

            if (nextPage)
              payload.currentSection = nextPage;

            if (this.props.app.currentSection === "reports") {
              payload.currentSection = "home";
            }

            payload.currentPatient = {};
            payload.partner = {};
            payload.dual = false;

            this
              .props
              .updateApp(payload);

          });

    } else if (!this.props.app.formActive && this.props.app.patientActivated && this.props.app.currentId && this.props.app.patientData && this.props.app.patientData[this.props.app.currentId] && this.props.app.selectedVisit && this.props.app.module && this.props.app.patientData[this.props.app.currentId][this.props.app.module] && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit && Object
        .keys(e[this.props.app.selectedVisit])
        .length > 0
    }).length > 0) {

      this
        .props
        .showConfirmMsg("Confirm", "Visit not complete. All captured entries in the visit will be deleted. Would you" +
          " want to delete them?",
          "Delete", async () => {

            let ids = this
              .props
              .app
              .patientData[this.props.app.currentId][this.props.app.module]
              .visits
              .map((e) => {
                return Object
                  .keys(e[this.props.app.selectedVisit])
                  .map((r) => {
                    return e[this.props.app.selectedVisit][r].encounterId
                  })
                  .reduce((a, e, i) => {
                    if (e)
                      a.push(e);
                    return a;
                  }, [])
              })
              .reduce((a, e, i) => {
                if (e)
                  a = e;
                return a
              }, []);

            await this
              .props
              .voidMultipleEncounters("/programs/void_multiple_encounters", {
                encounterIds: ids,
                id: this.props.app.currentId,
                visitDate: this.props.app.selectedVisit
              });

            await this
              .props
              .clearCache();

            await this
              .props
              .clearDataStructs();

            ["primary", "secondary"].forEach(workflow => {
              this
                .props
                .clearWorkflow(workflow);
            });

            let nextPage = !this.props.app.patientActivated
              ? "patient"
              : "home";

            let payload = {
              patientActivated: false,
              selectedVisit: new Date().format("d mmm YYYY"),
              currentId: null,
              formActive: false,
              selectedTask: "",
              fieldPos: 0,
              configs: {},
              summaryIgnores: [],
              dual: false,
              currentTab: null,
              activeReport: null,
              clientId: null,
              partnerId: null,
              currentPatient: {},
              partner: {},
              scanID: null,
              primary: {},
              secondary: {},
              isDirty: false,
              firstSummary: null,
              secondSummary: null
            };

            if (nextPage)
              payload.currentSection = nextPage;

            if (this.props.app.currentSection === "reports") {
              payload.currentSection = "home";
            }

            payload.currentPatient = {};
            payload.partner = {};
            payload.dual = false;

            this
              .props
              .updateApp(payload);

          });

    } else {

      await this
        .props
        .clearCache();

      await this
        .props
        .clearDataStructs();

      ["primary", "secondary"].forEach(workflow => {
        this
          .props
          .clearWorkflow(workflow);
      });

      let nextPage = !this.props.app.patientActivated
        ? "patient"
        : "home";

      let payload = {
        patientActivated: false,
        selectedVisit: new Date().format("d mmm YYYY"),
        currentId: null,
        formActive: false,
        selectedTask: "",
        fieldPos: 0,
        configs: {},
        summaryIgnores: [],
        dual: false,
        currentTab: null,
        activeReport: null,
        clientId: null,
        partnerId: null,
        currentPatient: {},
        partner: {},
        scanID: null,
        primary: {},
        secondary: {},
        isDirty: false,
        firstSummary: null,
        secondSummary: null
      };

      if (nextPage)
        payload.currentSection = nextPage;

      if (this.props.app.currentSection === "reports") {
        payload.currentSection = "home";

        await this
          .props
          .resetRawData();

        await this
          .props
          .resetPepfarData();

      }

      payload.currentPatient = {};
      payload.partner = {};
      payload.dual = false;

      this
        .props
        .updateApp(payload);

    }

  }

  sendBarcode(uri) {

    let ifrm = document.createElement("iframe");

    ifrm.setAttribute("src", uri);

    document
      .body
      .appendChild(ifrm);

    setTimeout(function () {

      document
        .body
        .removeChild(ifrm);

    }, 1000);

  }

  async submitForm() {

    await this.props.updateApp({ processing: true });

    if (this.props.app.sectionHeader === "Transcribe in Register") {

      await this
        .props
        .clearDataStructs();

      const data = Object.assign({}, this.props.wf.responses[this.state.currentWorkflow]);

      await this
        .props
        .submitForm(this.props.app.configs.action, Object.assign({}, data))
        .catch((e) => {
          this
            .props
            .showErrorMsg('Error', e)
        });

      await this.props.flagRegisterFilled(this.props.app.currentId, this.props.app.module, this.props.app.selectedVisit, this.props.app.entryCode);

      if (this.props.app.dual) {

        if (this.props.app.flagged && this.props.app.clientId && this.props.app.partnerId && this.props.app.flagged[this.props.app.clientId] && this.props.app.flagged[this.props.app.partnerId]) {

          this.switchPage("home");

        } else {

          this.cancelForm();

          if (this.props.app.currentId)
            this
              .props
              .fetchVisits(this.props.app.currentId);

        }

      } else if (this.props.app.patientActivated) {

        this.switchPage("home");

      } else {

        this.cancelSession();

      }

    } else if (this.props.app.configs.action) {

      if (this.props.app.sectionHeader === "HTS Visit") {

        if (this.props.wf && this.props.wf.responses && this.state.currentWorkflow && this.props.wf.responses[this.state.currentWorkflow] && Object.keys(this.props.wf.responses[this.state.currentWorkflow]).indexOf("Client gives consent to be tested?") && this.props.wf.responses[this.state.currentWorkflow]["Client gives consent to be tested?"] === "No") {

          return false;

        }

        await this.props.updateApp({ processing: true });

      }

      const selectedTask = this.props.app.selectedTask;

      await this
        .props
        .clearDataStructs();

      let currentEncounter = this.props.app.sectionHeader;

      await this
        .props
        .submitForm(this.props.app.configs.action, Object.assign({}, this.props.app.currentSection !== "registration"
          ? {
            [currentEncounter]: this.props.wf.responses[this.state.currentWorkflow]
          }
          : this.props.wf.responses[this.state.currentWorkflow], {
            primaryId: this.props.app.currentId,
            date: this.props.app.selectedVisit && new Date(this.props.app.selectedVisit)
              ? new Date(this.props.app.selectedVisit).getTime()
              : new Date().getTime(),
            program: this.props.app.module,
            group: this.state.currentWorkflow,
            location: this.props.app.currentLocation,
            user: this.props.app.activeUser
          })).then(() => {

            if (this.props.app.sectionHeader === "Close Register") {

              this.props.showInfoMsg("Confirmation", "Register closed");

            } else if (this.props.app.sectionHeader === "Change Password") {

              this.props.showInfoMsg("Confirmation", "Password changed");

            }

          })
        .catch((e) => {
          this
            .props
            .showErrorMsg('Error', this.props.app.errorMessage);
        });

      if (selectedTask === "Add User") {

        await this.props.fetchUsers();

      }

      if (this.props.app.infoMessage !== null) {

        await this.props.showInfoMsg("Info", this.props.app.infoMessage);

        await this.props.updateApp({ infoMessage: null });

      }

      await this
        .props
        .clearWorkflow(this.state.currentWorkflow)
        .then(async () => {

          await this.autoReroute(this.state.currentWorkflow, currentEncounter);

          if (this.props.app.currentId)
            this
              .props
              .fetchVisits(this.props.app.currentId);

        });

      if (this.props.app.sectionHeader === "HTS Visit") {

        const entryCode = this.props
          .app
          .patientData[this.props.app.currentId][this.props.app.module]
          .visits
          .filter((e) => {
            return Object.keys(e)[0] === this.props.app.selectedVisit
          })
          .map((e) => {
            return Object.keys(e[Object.keys(e)[0]])
          }).sort().pop();

        this.transcribe(entryCode);

      } else {

        this.props.updateApp({ processing: false });

      }

    }

  }

  async autoReroute(group, currentEncounter) {

    let nextTask;

    for (let i = 0; i < this.props.app.order.length; i++) {

      if (!nextTask && currentEncounter === this.props.app.order[i] && i + 1 < this.props.app.order.length) {

        nextTask = this.props.app.order[i + 1];

        break;

      }

    }

    if (nextTask) {

      if (group === "secondary") {

        await this
          .props
          .updateApp({
            sectionHeader: nextTask,
            secondary: {
              sectionHeader: nextTask,
              summary: false
            }
          });

      } else {

        await this
          .props
          .updateApp({
            sectionHeader: nextTask,
            primary: {
              sectionHeader: nextTask,
              summary: false
            }
          });

      }

      await this.navigateToRoute(nextTask, "/", group);

    } else {

      if (this.props.app.dual) {

        if (group === "primary") {

          await this
            .props
            .updateApp({
              primary: {
                summary: true
              }
            });

        } else {

          await this
            .props
            .updateApp({
              secondary: {
                summary: true
              }
            });

        }

      } else {

        this.cancelForm();

      }

    }

  }

  async voidEncounter(encounter, encounterId) {

    this
      .props
      .showConfirmMsg("Confirmation", "Do you really want to delete '" + encounter + "'?", "Delete", async () => {

        await this
          .props
          .voidEncounter("/programs/void_encounter", {
            encounter: encounter,
            date: new Date(this.props.app.selectedVisit)
              ? new Date(this.props.app.selectedVisit).getTime()
              : new Date().getTime(),
            program: this.props.app.module,
            primaryId: this.props.app.currentId,
            encounterId
          });

      });

  }

  async findOrRegisterPatient() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["PatientRegistration"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Find or Register Client",
        formActive: true,
        currentSection: "registration",
        configs: Object.assign({}, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          : {})),
        summaryIgnores: Object.assign([], (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          : {})),
        sectionHeader: "Find or Register Client"
      });

    await this
      .props
      .handleInputChange(this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
        ? this.props.wf[this.state.currentWorkflow].currentNode.label
        : "", "", this.state.currentWorkflow);

    await this.queryOptions("");
  }

  async switchWorkflow(targetWorkflow) {

    return new Promise(async resolve => {

      const activeWorkflow = this.state.currentWorkflow;

      await this.setState({ suspendedWorkflow: activeWorkflow, currentWorkflow: targetWorkflow });

      let currentId;
      let payload = {};

      if (targetWorkflow === "secondary") {

        [
          "formActive",
          "selectedTask",
          "selectedVisit",
          "fieldPos",
          "summaryIgnores",
          "sectionHeader",
          "configs",
          "summaryIgnores"
        ].forEach(field => {

          if (this.props.app.secondary[field] || (typeof this.props.app.secondary[field] === "boolean" && Object.keys(this.props.app.secondary).indexOf(field)))
            payload[field] = this.props.app.secondary[field]

        })

        currentId = String(this.props.app.partnerId);

      } else {

        [
          "formActive",
          "selectedTask",
          "selectedVisit",
          "fieldPos",
          "summaryIgnores",
          "sectionHeader",
          "configs",
          "summaryIgnores"
        ].forEach(field => {

          if (this.props.app.primary[field] || (typeof this.props.app.primary[field] === "boolean" && Object.keys(this.props.app.primary).indexOf(field)))
            payload[field] = this.props.app.primary[field]

        })

        currentId = String(this.props.app.clientId);

      }

      payload.currentId = currentId;

      if (!payload.selectedVisit)
        payload.selectedVisit = (new Date()).format("d mmm YYYY");

      payload.currentPatient = this.props.app.patientData[currentId]

      if (payload.sectionHeader === "Find or Register Client") {

        payload.configs = Object.assign({}, (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].configs
          : {}));
        payload.summaryIgnores = Object.assign([], (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module]["PatientRegistration"] && this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          ? this.props.app.data[this.props.app.module]["PatientRegistration"].ignores
          : {}));

      } else if (this.props.app.data && this.props.app.module && payload.selectedTask && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module][payload.selectedTask]) {

        payload.configs = Object.assign({}, this.props.app.data[this.props.app.module][payload.selectedTask].configs);
        payload.summaryIgnores = Object.assign([], this.props.app.data[this.props.app.module][payload.selectedTask].ignores);

      }

      await this
        .props
        .updateApp(payload)

      resolve();

    });

  }

  async backdataEntry() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Backdata Entry"].data);

    this
      .props
      .updateApp({
        selectedTask: "Backdata Entry",
        formActive: true,
        currentSection: "home",
        sectionHeader: "Backdata Entry",
        fieldPos: 0,
        configs: {
          "Testing Date": {
            fieldType: "date",
            validationRule: "^\\d+\\s[A-Za-z]+\\s\\d{4}$",
            validationMessage: "Enter valid date (day, month, year)",
            hiddenButtons: [
              "clear",
              "/",
              ".",
              "abc",
              "qwe",
              "Unknown"
            ],
            placeholder: new Date().format("d mmm YYYY"),
            maxDate: new Date().format("YYYY-mm-dd"),
            // minDate: new Date((new Date()).setDate(-10)).format("d mmm YYYY"),
            format: "d mmm YYYY"
          },
          "Register Number (from cover)": {
            fieldType: "number",
            hiddenButtons: [
              "/",
              ".",
              "-",
              "abc",
              "qwe",
              "Unknown",
              "del"
            ],
            ajaxURL: '/programs/fetch_active_registers?q=',
            lockList: true,
            validationMessage: "Select register number from list",
            title: "Missing Data"
          },
          "Enter Data": {
            customComponent: "BackdataEntry",
            properties: {},
            optional: true
          },
          action: null
        },
        summaryIgnores: Object.assign([], [
          "Age",
          "Age Group",
          "Client Risk Category",
          "HIV Rapid Test Outcomes:First Pass:Test 1",
          "HIV Rapid Test Outcomes:First Pass:Test 2",
          "HIV Rapid Test Outcomes:Immediate Repeat:Test 1",
          "HIV Rapid Test Outcomes:Immediate Repeat:Test 2",
          "HTS Access Type",
          "HTS Provider ID",
          "Last HIV Test",
          "Outcome Summary",
          "Partner Present",
          "Referral for Re-Testing",
          "Result Given to Client",
          "Sex/Pregnancy",
          "Time Since Last Test",
          "Partner HIV Status",
          "Number of Items Given:HTS Family Ref Slips",
          "Appointment Date Given"
        ])
      });

  }

  async handleNextButtonClicks() {

    if (this.$("btnNext").className.match(/gray/i))
      return;

    if (this.props.app.sectionHeader === "Print Label") {

      const valid = await validated(this.props, this.state);

      if (!valid.valid) {

        this
          .props
          .showErrorMsg((valid.title ? valid.title : "Invalid Entry"), valid.message);

        return;

      }

      const label = this.props.wf.responses[this.state.currentWorkflow]["Label Text"];

      const data = "\nN\nq801\nQ329,026\nZT\nA50,50,0,2,2,2,N,\"" + label + "\"\nB10,100,0,1,5,15,120,N,\"" + label + "\"\nP1\n";

      const uri = 'data:application/label; charset=utf-8; filename=label.lbl; disposition=inline,' + encodeURIComponent(data);

      this.sendBarcode(uri);

      await this
        .props
        .clearCache();

      await this
        .props
        .clearDataStructs();

      ["primary", "secondary"].forEach(workflow => {
        this
          .props
          .clearWorkflow(workflow);
      });

      this.props.updateApp({ sectionHeader: null });

      this.switchPage("home");

      return;

    }

    if (this.props.wf && this.state.currentWorkflow && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label && this.props.app.configs && this.props.app.configs[this.props.wf[this.state.currentWorkflow].currentNode.label] && Object.keys(this.props.app.configs[this.props.wf[this.state.currentWorkflow].currentNode.label]).indexOf("onUnLoad") >= 0) {

      this
        .props
        .app
        .configs[this.props.wf[this.state.currentWorkflow].currentNode.label]
        .onUnLoad();

    }

    if (this.props.dde.ddeSearchActive) {

      await this
        .props
        .handleInputChange(this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : "", (this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
            ? this.props.wf[this.state.currentWorkflow].currentNode.label
            : ""]
            ? this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
              ? this.props.wf[this.state.currentWorkflow].currentNode.label
              : ""]
            : ""), this.state.currentWorkflow);

      await this
        .props
        .goForward(this.state.currentWorkflow, (this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : "Yes"]
          ? this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
            ? this.props.wf[this.state.currentWorkflow].currentNode.label
            : "Yes"]
          : "Yes"));

    } else if (this.props.app.formActive && (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
      ? this.props.wf[this.state.currentWorkflow].currentNode.type
      : "") === "exit") {

      return;

    } else if (this.props.app.formActive) {

      if (this.props.app.isDirty) {

        this
          .props
          .showInfoMsg("Unsaved Data", "You have unsaved data. Please save or " + (this.props.app.selectedTask === "Backdata Entry" ? "delete" : "clear") + " to proceed!");

      } else {

        this.navNext(this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : ""]
          ? this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
            ? this.props.wf[this.state.currentWorkflow].currentNode.label
            : ""]
          : "");

      }

    } else if (this.props.app.patientActivated) {

      this.switchPage("home");

    } else {

      this.findOrRegisterPatient();

    }
  }

  async fetchNextTask(currentId, group) {

    let nextTask;

    let selectedVisit = (this.props.app.selectedVisit
      ? this.props.app.selectedVisit
      : (new Date()).format("d mmm YYYY"));

    for (let task of this.props.app.order) {

      if (currentId && this.props.app.patientData && this.props.app.module && selectedVisit && this.props.app.patientData[currentId] && this.props.app.patientData[currentId][this.props.app.module] && this.props.app.patientData[currentId][this.props.app.module].visits && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === selectedVisit
      }) && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === selectedVisit
      })[0] && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === selectedVisit
      })[0][selectedVisit] && !this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === selectedVisit
      })[0][selectedVisit][task]) {

        nextTask = task;

        break;

      }

    }

    if (nextTask) {

      await this
        .props
        .updateApp({
          sectionHeader: nextTask,
          [group]: {
            sectionHeader: nextTask,
            selectedTask: nextTask,
            summary: false,
            forceSummary: false,
            formActive: true,
            fieldPos: 0,
            selectedVisit: this.props.app.selectedVisit
          },
          currentId,
          selectedTask: nextTask,
          formActive: true,
          fieldPos: 0,
          [this.state.currentWorkflow.match(/second/i) ? "secondSummary" : "firstSummary"]: false
        });

      await this.navigateToRoute(nextTask, "/", group);

      await this
        .props
        .handleInputChange("Do you have a partner?", "Yes", group);

      await this
        .props
        .handleInputChange("Partner present?", "Yes", group);

    } else if (currentId && this.props.app.patientData && this.props.app.module && this.props.app.selectedVisit && this.props.app.patientData[currentId] && this.props.app.patientData[currentId][this.props.app.module] && this.props.app.patientData[currentId][this.props.app.module].visits && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit
    }) && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit
    }).length > 0 && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit
    })[0][this.props.app.selectedVisit] && Object.keys(this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
      return Object.keys(e)[0] === this.props.app.selectedVisit
    })[0][this.props.app.selectedVisit]).length >= this.props.app.order.length) {

      await this
        .props
        .updateApp({
          [group]: {
            sectionHeader: "Visit Details for " + this.props.app.selectedTask,
            summary: true,
            forceSummary: false,
            formActive: false,
            fieldPos: 0,
            selectedVisit: this.props.app.selectedVisit
          },
          formActive: false,
          selectedTask: null,
          fieldPos: 0,
          sectionHeader: null,
          [this.state.currentWorkflow.match(/second/i) ? "secondSummary" : "firstSummary"]: true
        });

    } else {

      if (this.props.app.order.length > 0 && !(currentId && this.props.app.patientData && this.props.app.module && this.props.app.selectedVisit && this.props.app.patientData[currentId] && this.props.app.patientData[currentId][this.props.app.module] && this.props.app.patientData[currentId][this.props.app.module].visits && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === this.props.app.selectedVisit
      }) && this.props.app.patientData[currentId][this.props.app.module].visits.filter((e) => {
        return Object.keys(e)[0] === this.props.app.selectedVisit
      })[0])) {

        await this
          .props
          .updateApp({
            [group]: {
              sectionHeader: this.props.app.order[0],
              selectedTask: this.props.app.order[0],
              summary: false,
              forceSummary: false,
              formActive: true,
              fieldPos: 0,
              selectedVisit: this.props.app.selectedVisit
            },
            currentId,
            formActive: true,
            selectedTask: this.props.app.order[0],
            fieldPos: 0,
            sectionHeader: this.props.app.order[0],
            [this.state.currentWorkflow.match(/second/i) ? "secondSummary" : "firstSummary"]: false
          });

        await this.navigateToRoute(this.props.app.order[0], "/", group);

        await this
          .props
          .handleInputChange("Do you have a partner?", "Yes", group);

        await this
          .props
          .handleInputChange("Partner present?", "Yes", group);

      }

    }

  }

  async handleClearClicks() {

    if (this.props.dde.ddeSearchActive && this.$('btnClear') && this.$('btnClear').innerHTML === "New Client") {

      await this
        .props
        .handleInputChange(this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : "", "No", this.state.currentWorkflow);

      await this
        .props
        .clearDataStructs();

      this.navNext("No");

    } else if (!this.props.app.formActive && this.props.app.dual && (this.props.app.dual && ((this.props.app.primary.summary || this.props.app.primary.forceSummary) || (this.props.app.secondary.summary || this.props.app.secondary.forceSummary)))) {

      this.fetchNextTask(this.props.app.currentId, this.state.currentWorkflow);

    } else {

      if (this.state.currentWorkflow && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label === "Immediate Parallel Repeat Test 1 & 2 Results") {

        this.props.clearField("Immediate Repeat Test 1 Result", this.state.currentWorkflow);

        this.props.clearField("Immediate Repeat Test 2 Result", this.state.currentWorkflow);

        this.props.clearField("Immediate Parallel Repeat Test 1 & 2 Results", this.state.currentWorkflow);

      }

      if (this.state.currentWorkflow && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label === "First Pass Parallel Test 1 & 2 Results") {

        this.props.clearField("First Pass Test 1 Result", this.state.currentWorkflow);

        this.props.clearField("First Pass Test 2 Result", this.state.currentWorkflow);

        this.props.clearField("First Pass Parallel Test 1 & 2 Results", this.state.currentWorkflow);

      }

      this
        .props
        .handleInputChange(this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : "", "", this.state.currentWorkflow);

      this
        .queryOptions(this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
          ? this.props.wf[this.state.currentWorkflow].currentNode.label
          : "");

    }

  }

  async setReportingPeriod() {

    await this
      .props
      .setPeriod({
        start: {
          reportMonth: this.props.app.report.start.reportMonth,
          reportYear: this.props.app.report.start.reportYear
        },
        end: {
          reportMonth: this.props.app.report.end.reportMonth,
          reportYear: this.props.app.report.end.reportYear
        },
        location: this.props.app.report.location,
        test: this.props.app.report.test,
        testType: this.props.app.report.testType,
        modality: this.props.app.report.modality
      });

    const monthlReport = [
      "Male",
      "Female Non-Pregnant",
      "Female Pregnant",
      "0-11 months",
      "1-14 years",
      "15-24 years",
      "25+ years",
      "Never Tested",
      "Last Negative",
      "Last Positive",
      "Last Exposed infant",
      "Last Inconclusive",
      "Partner Present",
      "Partner not present",
      "Single Negative",
      "Single Positive",
      "Test 1 & 2 Negative",
      "Test 1 & 2 Positive",
      "Test 1 & 2 Discordant",
      "New negative",
      "New positive",
      "New exposed infant",
      "New inconclusive",
      "Confirmatory positive",
      "Confirmatory Inconclusive",
      "Routine HTS (PITC) within Health Service",
      "Comes with HTS Family Referral Slip",
      "Other (VCT, etc.)",
      "Sum of all slips",
      "Test 1 Used for Clients",
      "Test 2 Used for Clients"
    ];

    const monthValues = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
    };

    const startNumericalMonth = monthValues[this.props.app.report.start.reportMonth];
    const startYear = this.props.app.report.start.reportYear;
    const endNumericalMonth = monthValues[this.props.app.report.end.reportMonth];
    const endYear = this.props.app.report.end.reportYear;

    await this.props.updateReportField('numericalMonth', startNumericalMonth, 'start');
    await this.props.updateReportField('reportYear', startYear, 'start');
    await this.props.updateReportField('numericalMonth', endNumericalMonth, 'end');
    await this.props.updateReportField('reportYear', endYear, 'end');

    if (this.props.app.activeReport === "monthly report") {

      monthlReport.forEach(field => {

        this
          .props
          .fetchReport("/reports?f=" + encodeURIComponent(field) + "&sm=" + this.props.dialog.start.numericalMonth + "&sy=" + this.props.reports.start.reportYear + "&em=" + this.props.dialog.end.numericalMonth + "&ey=" + this.props.reports.end.reportYear + "&l=" + encodeURIComponent(this.props.reports.location));
      });

    } else if (this.props.app.activeReport === "daily register") {

      await this
        .props
        .resetRawData();

      this
        .props
        .fetchDailyRegister(this.props.dialog.start.numericalMonth, this.props.dialog.start.reportYear, this.props.reports.location, this.props.reports.testType, this.props.reports.test);

    } else if (this.props.app.activeReport === "raw data report") {

      await this
        .props
        .resetRawData();

      this
        .props
        .fetchRaw("/raw", this.props.dialog.start.numericalMonth, this.props.reports.start.reportYear, this.props.dialog.end.numericalMonth, this.props.reports.end.reportYear);

    } else if (this.props.app.activeReport === "pepfar report") {

      await this
        .props
        .resetPepfarData();

      this
        .props
        .fetchPepfarData("/full_disaggregated", this.props.dialog.start.numericalMonth, this.props.reports.start.reportYear, this.props.dialog.end.numericalMonth, this.props.reports.end.reportYear, this.props.reports.modality);

    }

  }

  async scrollPepfarData(startPos, endPos) {

    if (!this.props.reports || (this.props.reports && !this.props.reports.start) || (this.props.reports && !this.props.reports.end))
      return;

    this
      .props
      .fetchPepfarData("/full_disaggregated", this.props.dialog.start.numericalMonth, this.props.reports.start.reportYear, this.props.dialog.end.numericalMonth, this.props.reports.end.reportYear, this.props.reports.modality, startPos, endPos);

  }

  async selectPatient(activePatient) {

    await this
      .props
      .updateApp({ ignore: true });

    await this
      .props
      .selectPatient(activePatient);

    await this
      .props
      .updateApp({ ignore: false });

  }

  downloadCSV(headers = [], data = [], filename = "download", delimiter = '\t') {

    if (this.props.app.activeReport === "pepfar report") {

      Axios
        .get("/full_disaggregated?sm=" + this.props.dialog.start.numericalMonth + "&sy=" + this.props.reports.start.reportYear + "&em=" + this.props.dialog.end.numericalMonth + "&ey=" + this.props.reports.end.reportYear + "&d=1" + (this.props.reports.modality ? "&m=" + this.props.reports.modality : ""))
        .then(response => {
          FileDownload(response.data, 'report.csv');
        })

    } else {

      try {

        let csv = headers.join(delimiter) + '\n';

        for (let record of data) {

          let row = [];

          for (let title of headers) {

            row.push((String(record[title]).length > 0
              ? record[title]
              : ""));

          }

          csv += row.join(delimiter) + '\n';

        }

        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename + '.csv';

        document.body.appendChild(hiddenElement);

        hiddenElement.click();

        document.body.removeChild(hiddenElement);

      } catch (e) {

        this.showErrorMsg("CSV Download Error", e);

      }

    }

  }

  loadEntryCodes() {

    const currentId = this.props.app.currentId;

    const selectedVisit = this.props.app.selectedVisit;

    const module = this.props.app.module;

    if (!this.props.app.patientData || (this.props.app.patientData && !this.props.app.patientData[currentId]) || (this.props.app.patientData[currentId] && !this.props.app.patientData[currentId][module]) || (this.props.app.patientData[currentId][module] && !this.props.app.patientData[currentId][module].visits))
      return [];

    let entryCodes = this
      .props
      .app
      .patientData[currentId][module]
      .visits
      .filter((e) => {
        return Object.keys(e)[0] === selectedVisit
      })
      .map((e) => {
        return Object.keys(e[Object.keys(e)[0]])
      })[0];

    // this.props.setData(entryCodes);

    return entryCodes;

  }

  async transcribe(entryCode) {

    await this.setState({ currentWorkflow: this.state.currentWorkflow });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .updateApp({ entryCode: (Array.isArray(entryCode) ? entryCode.sort().pop() : entryCode) });

    const configs = {
      "Register Number (from cover)": {
        fieldType: "number",
        hiddenButtons: [
          "del",
          "/",
          ".",
          "-",
          "abc",
          "qwe",
          "Unknown"
        ],
        ajaxURL: '/programs/fetch_active_registers?q=',
        lockList: true
      },
      "Select Entry Code": {
        options: this.loadEntryCodes(),
        lockList: true
      },
      "Entry Code Not Set?": {
        visible: false,
        condition: "!String('{{entryCode}}').match(/^ec/i)"
      },
      "Display": {
        customComponent: "Transcribe",
        properties: {},
        optional: true
      },
      action: '/programs/save_register_number'
    };

    const summaryIgnores = Object.assign([], ["Display", "encounterId", "id", "client"]);

    await this
      .props
      .updateApp({
        [this.state.currentWorkflow]: {
          selectedTask: "Transcribe",
          formActive: true,
          sectionHeader: "Transcribe in Register",
          fieldPos: 0,
          configs,
          summaryIgnores
        },
        selectedTask: "Transcribe",
        formActive: true,
        sectionHeader: "Transcribe in Register",
        fieldPos: 0,
        configs,
        summaryIgnores,
        processing: false
      });

    await this
      .props
      .loadData(this.props.app.module, this.props.app.selectedTask, configs, summaryIgnores);

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Transcribe"].data);

    this.queryOptions("");

  }

  async addRegister() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["HTS Registers"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Add Register",
        formActive: true,
        currentSection: "admin",
        configs: {
          "Register Number": {
            fieldType: "number",
            hiddenButtons: [
              "/",
              "qwe",
              "abc",
              "Unknown",
              ".",
              "-"
            ],
            ajaxURL: '/programs/fetch_active_registers?q=',
            validationRule: "^[1-9]$|^[1-9][0-9]$",
            validationMessage: "Expecting a number between 1 and 99 only"
          },
          "Location Type": {
            options: [
              "Community", "Health Facility", "Standalone"
            ],
            className: "longSelectList",
            onUnLoad: () => {

              if (this.props.app.configs && Object.keys(this.props.app.configs).indexOf("Service Delivery Point") >= 0) {

                this.props.app.configs["Service Delivery Point"].options = locations[(this.props.wf && this.state.currentWorkflow && this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow]["Location Type"]
                  ? this.props.wf.responses[this.state.currentWorkflow]["Location Type"]
                  : "")].sort();

              }

            }
          },
          "Service Delivery Point": {
            options: locations[this.props.wf && this.state.currentWorkflow && this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow]["Location Type"]
              ? this.props.wf.responses[this.state.currentWorkflow]["Location Type"]
              : ""],
            className: "longSelectList"
          },
          "HTS Location": {
            fieldType: "text",
            ajaxURL: "/list_locations?name=",
            lockList: true
          },
          action: "/programs/add_register"
        },
        summaryIgnores: [],
        sectionHeader: "Add Register",
        fieldPos: 0
      });

    this
      .props
      .fetchRegisterStats();

    this.queryOptions("");

  }

  async closeRegister() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Close Register"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Close Register",
        formActive: true,
        currentSection: "admin",
        configs: {
          "Register Number": {
            fieldType: "number",
            hiddenButtons: [
              "clear",
              "/",
              "qwe",
              "abc",
              "Unknown",
              ".",
              "-"
            ],
            ajaxURL: '/programs/fetch_active_registers?q='
          },
          "Location Type": {
            options: [
              "Community", "Health Facility", "Standalone"
            ],
            "className": "longSelectList"
          },
          "Service Delivery Point": {
            options: locations,
            "className": "longSelectList"
          },
          action: "/programs/close_register"
        },
        summaryIgnores: [],
        sectionHeader: "Close Register",
        fieldPos: 0
      });

    this
      .props
      .fetchRegisterStats();

    this.queryOptions("");

  }

  async findEnteredRecord() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Find Entered Record"].data);

    this
      .props
      .updateApp({
        selectedTask: "Find Entered Record",
        formActive: true,
        currentSection: "home",
        sectionHeader: "Find Entered Record",
        fieldPos: 0,
        configs: {
          "Entry Code": {
            customComponent: "EntryCode",
            optional: true,
            properties: {
              label: "Entry Code"
            }
          },
          "Display Match": {
            customComponent: "FindEnteredRecord",
            properties: {},
            optional: true
          },
          action: null
        },
        summaryIgnores: Object.assign([], ["Display Match", "Entry Code"])
      });

  }

  checkIfUsernameValid(token) {

    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', '/username_valid/' + token);

      req.onload = function () {
        // This is called even on 404 etc
        // so check the status
        if (req.status === 200) {
          // Resolve the promise with the response text
          if (JSON.parse(req.response).valid === true) {

            resolve(true);

          } else {

            reject(false);

          }
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function () {
        reject(Error("Network Error"));
      };

      // Make the request
      req.send();
    });

  }

  async addUser() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Add User"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Add User",
        formActive: true,
        currentSection: "user management",
        configs: {
          "Username": {
            fieldType: "dha",
            textCase: "upper",
            validator: this.checkIfUsernameValid, // algorithm.decode,
            validationMessage: "Invalid ID format entered"
          },
          "Password": {
            fieldType: "password",
            textCase: "lower"
          },
          "Confirm Password": {
            fieldType: "password",
            textCase: "lower",
            onUnLoad: () => {
              if (this.props.wf && this.props.wf.responses && this.state.currentWorkflow && this.props.wf.responses[this.state.currentWorkflow] && Object.keys(this.props.wf.responses[this.state.currentWorkflow]).indexOf("Password") >= 0 && Object.keys(this.props.wf.responses[this.state.currentWorkflow]).indexOf("Confirm Password") >= 0 && this.props.wf.responses[this.state.currentWorkflow]["Confirm Password"].trim().length > 0 && this.props.wf.responses[this.state.currentWorkflow]["Password"] !== this.props.wf.responses[this.state.currentWorkflow]["Confirm Password"]) {

                this.props.showErrorMsg("Invalid Data", "Password mismatch");

                this.navBack();

              }
            }
          },
          "Role": {
            options: [
              "Admin", "Counselor", "HTS Coordinator"
            ],
            className: "longSelectList"
          },
          "First Name": {
            fieldType: "text"
          },
          "Last Name": {
            fieldType: "text"
          },
          "Gender": {
            options: ["Female", "Male"]
          },
          action: "/user/add_user"
        },
        summaryIgnores: [],
        sectionHeader: "Add User",
        fieldPos: 0
      });

  }

  deactivateAllPrograms() {

    const payload = {
      module: null,
      icon: null,
      tasks: [],
      selectedTask: "",
      selectedVisit: new Date().format("d mmm YYYY"),
      userDashTasks: [],
      order: [],
      currentTab: null,
      currentSection: "home",
      userManagementActive: false
    };

    this
      .props
      .updateApp(payload);

  }

  async login() {

    await this
      .props
      .login(this.props.wf && this.props.wf.responses && this.props.wf.responses['primary']
        ? this.props.wf.responses['primary']
        : {})
      .catch(e => { });

    if (this.props.app.activeUser && this.props.app.activeUser !== "") {

      this
        .props
        .initApp("/programs?role=" + (this.props.app.role
          ? this.props.app.role
          : "regular"));

    } else {

      this
        .props
        .showErrorMsg("Login Error", "Wrong username or password");

    }

  }

  logout() {

    this.deactivateAllPrograms();

    this.setCookie('username', '', 1);
    this.setCookie('role', '', 1);
    this.setCookie('location', '', 1);
    this.setCookie('accessToken', '', 1);

    this
      .props
      .logout(this.props.app.accessToken);

  }

  async editUser(username, firstName, lastName, gender, role) {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Edit User"].data);

    if (firstName) {

      await this
        .props
        .handleInputChange("First Name", firstName, this.state.currentWorkflow);

    }

    if (lastName) {

      await this
        .props
        .handleInputChange("Last Name", lastName, this.state.currentWorkflow);

    }

    if (gender) {

      await this
        .props
        .handleInputChange("Gender", gender, this.state.currentWorkflow);

    }

    if (role) {

      await this
        .props
        .handleInputChange("Role", role, this.state.currentWorkflow);

    }

    await this
      .props
      .updateApp({
        selectedTask: "Edit User",
        formActive: true,
        currentSection: "user management",
        configs: {
          "Role": {
            options: [
              "Admin", "Counselor", "HTS Coordinator", "Registration Clerk"
            ],
            className: "longSelectList"
          },
          "First Name": {
            fieldType: "text"
          },
          "Last Name": {
            fieldType: "text"
          },
          "Gender": {
            options: ["Female", "Male"]
          },
          action: "/user/update_user/" + username
        },
        summaryIgnores: [],
        sectionHeader: "Edit User",
        fieldPos: 0
      });

  }

  async changePassword(username) {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Change Password"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Change Password",
        formActive: true,
        currentSection: "user management",
        configs: {
          "Current Password": {
            fieldType: "password",
            textCase: "lower"
          },
          "New Password": {
            fieldType: "password",
            textCase: "lower"
          },
          "Confirm Password": {
            fieldType: "password",
            textCase: "lower"
          },
          action: "/user/change_password/" + username
        },
        summaryIgnores: [],
        sectionHeader: "Change Password",
        fieldPos: 0
      });

  }

  async filterReport() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Report Filter"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Report Filter",
        formActive: true,
        currentSection: "reports",
        configs: {
          "Start Month": {
            options: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            className: "longSelectList",
            autoNext: true
          },
          "Start Year": {
            fieldType: "number",
            min: ((new Date()).getFullYear() - 10),
            max: (new Date()).getFullYear(),
            hiddenButtons: [
              "clear",
              "/",
              ".",
              "-",
              "abc",
              "qwe",
              "Unknown"
            ]
          },
          "Ask End Month?": {
            visible: false,
            condition: "'{{activeReport}}' !== 'daily register'"
          },
          "Filter by Modality?": {
            visible: true,
            options: [
              "Yes",
              "No"
            ]
          },
          "Pepfar report?": {
            visible: false,
            condition: "'{{activeReport}}' === 'pepfar report'"
          },
          "End Month": {
            options: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            className: "longSelectList",
            autoNext: true
          },
          "Modality": {
            options: modalities,
            className: "longSelectList",
            autoNext: true
          },
          "End Year": {
            fieldType: "number",
            min: ((new Date()).getFullYear() - 10),
            max: (new Date()).getFullYear(),
            hiddenButtons: [
              "clear",
              "/",
              ".",
              "-",
              "abc",
              "qwe",
              "Unknown"
            ]
          },
          "Ask Location?": {
            visible: false,
            condition: "'{{activeReport}}' === 'daily register' || '{{activeReport}}' === 'monthly report'"
          },
          "Location": {
            ajaxURL: "/programs/fetch_locations",
            lockList: true,
            className: "longSelectList"
          },
          "Ask Test?": {
            visible: false,
            condition: "'{{activeReport}}' === 'daily register'"
          },
          "Test": {
            options: (tests
              ? Object.keys(tests).map(e => {
                return tests[e]
              })
              : []),
            className: "longSelectList"
          }
        },
        summaryIgnores: [],
        sectionHeader: "Report Filter",
        fieldPos: 0
      });

  }

  async printLabel() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Print Label"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Print Label",
        formActive: true,
        currentSection: "user management",
        configs: {
          "Label Text": {
            fieldType: "text",
            ajaxURL: "/list_locations?name=",
            lockList: true
          },
          action: null
        },
        summaryIgnores: [],
        sectionHeader: "Print Label",
        fieldPos: 0
      });

  }

  printBarcode(data = {
    npid: "",
    first_name: "",
    family_name: "",
    date_of_birth_estimated: "",
    date_of_birth: "",
    gender: "",
    residence: ""
  }) {

    const text = "\nN\nq801\nQ329,026\nZT\nB10,180,0,1,5,15,120,N,\"" + data.npid + "\"\nA40,50,0,2,2,2,N,\"" + data.first_name + " " + data.family_name + "\"\nA40,96,0,2,2,2,N,\"" + data
      .npid
      .replace(/\B(?=([A-Za-z0-9]{3})+(?![A-Za-z0-9]))/g, "-") + " " + (parseInt(data.date_of_birth_estimated, 10) === 1
        ? "~"
        : "") + (String((new Date(data.date_of_birth))) !== "Invalid Date"
          ? (new Date(data.date_of_birth)).format("dd/mmm/YYYY")
          : "") + "(" + (data.gender ? String(data.gender).substring(0, 1) : "") + ")\"\nA40,142,0,2,2,2,N,\"" + data.residence + "\"\nP1\n";

    const uri = 'data:application/label; charset=utf-8; filename=label.lbl; disposition=inline,' + encodeURIComponent(text);

    this.sendBarcode(uri);

  }

  async addLocation() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Add Location"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Add Location",
        formActive: true,
        currentSection: "add location",
        configs: {
          "Location Name": {
            fieldType: "text"
          },
          action: "/add_location"
        },
        summaryIgnores: [],
        sectionHeader: "Add Location",
        fieldPos: 0
      });

  }

  async findUser() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Find User"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Find User",
        formActive: true,
        currentSection: "find user",
        configs: {
          "Username": {
            fieldType: "dha",
            textCase: "upper"
          },
          action: "/find_user"
        },
        summaryIgnores: [],
        sectionHeader: "Find User",
        fieldPos: 0
      });

  }

  async addVillages() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Add Village"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Add Village",
        formActive: true,
        currentSection: "add village",
        configs: {
          Region: {
            ajaxURL: "/dde/search_by_region?name=",
            autoNext: true,
            lockList: true,
            validationMessage: "Region \n must be entered",
            title: "Missing Data",
            className: "longSelectList"
          },
          District: {
            ajaxURL: "/dde/search_by_district?region=REGION&district=",
            ajaxURLDummies: {
              Region: "REGION",
              autoNext: true
            },
            fieldType: "text",
            validationMessage: "District \n must be entered",
            title: "Missing Data"
          },
          "T/A": {
            ajaxURL: "/dde/search_by_t_a?district=DISTRICT&ta=",
            ajaxURLDummies: {
              District: "DISTRICT"
            },
            fieldType: "text",
            validationMessage: "T/A \n must be entered",
            title: "Missing Data"
          },
          Village: {
            ajaxURL: "/dde/search_by_village?ta=TA&village=",
            ajaxURLDummies: {
              TA: "T/A"
            },
            fieldType: "text",
            validationMessage: "Village \n must be entered",
            title: "Missing Data"
          },
          action: "/add_village"
        },
        summaryIgnores: [],
        sectionHeader: "Add Village",
        fieldPos: 0
      });

    this.queryOptions("");

  }

  redirectToPortal() {

    window.location = this.props.app.portal_url;

  }

  async showUserStats() {

    await this.setState({ currentWorkflow: "primary" });

    await this.setState({
      loaded: Object.assign({}, this.state.loaded, {
        [this.state.currentWorkflow]: true
      })
    });

    await this
      .props
      .loadWorkflow(this.state.currentWorkflow, this.props.app.data[this.props.app.module]["Show User Stats"].data);

    await this
      .props
      .updateApp({
        selectedTask: "Show User Stats",
        formActive: true,
        currentSection: "show user stats",
        configs: {
          "Start Month": {
            options: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            className: "longSelectList",
            title: "Missing Data",
            message: "Start Month \n must be selected"
          },
          "End Month": {
            options: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            className: "longSelectList",
            title: "Missing Data",
            message: "Start Month \n must be selected"
          },
          "Start Year": {
            fieldType: "number",
            validationRule: "^\\d{4}$",
            min: "thisYear - 10",
            max: "thisYear",
            validationMessage: "Start Year \n must between {{thisYear - 10}} and {{thisYear}}",
            hiddenButtons: [
              "clear",
              "/",
              ".",
              "-",
              "abc",
              "qwe",
              "Unknown"
            ]
          },
          "End Year": {
            fieldType: "number",
            validationRule: "^\\d{4}$",
            min: "thisYear - 10",
            max: "thisYear",
            validationMessage: "End Year \n must between {{thisYear - 10}} and {{thisYear}}",
            hiddenButtons: [
              "clear",
              "/",
              ".",
              "-",
              "abc",
              "qwe",
              "Unknown"
            ]
          },
          "Start Date": {
            fieldType: "days",
            yearField: "Start Year",
            monthField: "Start Month",
            title: "Missing Data",
            message: "Start Date \n must be entered",
            validationRule: "^\\d+$",
            validationMessage: "Start Date \n must be entered",
            hiddenButtons: [
              "Unknown"
            ]
          },
          "End Date": {
            fieldType: "days",
            yearField: "End Year",
            monthField: "End Month",
            title: "Missing Data",
            message: "End Date \n must be entered",
            validationRule: "^\\d+$",
            validationMessage: "End Date \n must be entered",
            hiddenButtons: [
              "Unknown"
            ]
          },
          "Display Stats": {
            customComponent: "ShowUserStats",
            properties: {
              label: "User Stats"
            },
            optional: true
          },
          action: null
        },
        summaryIgnores: [],
        sectionHeader: "Show User Stats",
        fieldPos: 0
      });

    this.queryOptions("");

  }

  render() {

    const nextLabel = (this.props.app.currentSection === "home" || this.props.app.currentSection === "registration"
      ? this.props.app.formActive
        ? (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
          ? this.props.wf[this.state.currentWorkflow].currentNode.type
          : "") === "exit" || (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label === "Enter Data")
          ? "Finish"
          : "Next" : "Realtime Data Entry" : this.props.app.formActive
        ? (this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
          ? this.props.wf[this.state.currentWorkflow].currentNode.type
          : "") === "exit"
          ? "Finish"
          : "Next" : "Finish");

    const buttons = [
      {
        id: "btnRegister",
        buttonClass: "green nav-buttons",
        onMouseDown: () => {
          this.findOrRegisterPatient()
        },
        label: "Find or Register Client",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px",
          marginRight: "15px"
        },
        disabled: this.props.app.module !== "Registration"
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnCancel",
        buttonClass: "red nav-buttons",
        onMouseDown: () => {

          if (this.props.app.working)
            return;

          if (this.props.app.selectedTask === "Report Filter")
            return this.props.updateApp({ selectedTask: "reports", formActive: false, configs: {} });

          this.props.app.currentSection === "home" && !this.props.app.formActive
            ? !this.props.app.activeUser ? this.redirectToPortal() : this.logout()
            : this.props.app.formActive && this.props.app.currentSection !== "reports"
              ? this.cancelForm()
              : this.cancelSession();

        },
        label: this.props.app.currentSection === "home" && !this.props.app.formActive
          ? this.props.app.activeUser ? "Logout" : "Home"
          : "Cancel",
        extraStyles: {
          cssFloat: "left",
          marginTop: "15px",
          marginLeft: "15px"
        },
        disabled: ((this.props.app.userManagementActive === true && !this.props.app.formActive) || !this.props.app.activeUser
          ? (!this.props.app.activeUser && this.props.app.redirect_to_portal ? false : true)
          : false)
      }, {
        id: "btnNext",
        buttonClass: (this.props.app.processing ?
          "gray nav-buttons" :
          (this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] &&
            this.props.app.data[this.props.app.module]["PatientRegistration"] &&
            this.props.app.data[this.props.app.module]["PatientRegistration"].data
            ? "green nav-buttons"
            : (this.props.app.sectionHeader === "Find or Register Client" &&
              Object.keys(this.props.app.currentPatient).length > 0 ? "green nav-buttons" : "gray nav-buttons"))),
        onMouseDown: () => {
          this.handleNextButtonClicks();
        },
        label: nextLabel,
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px",
          marginRight: "15px"
        },
        disabled: (this.props.app.currentSection === "reports" || (["HTS"].indexOf(this.props.app.module) < 0) || this.props.app.userManagementActive === true) && this.props.app.selectedTask !== "Report Filter"
          ? true
          : false,
        inactive: (this.props.app.module === "" && !this.props.app.formActive) || (this.props.app.silentProcessing && !this.props.app.patientActivated) || (nextLabel === "Realtime Data Entry" && this.props.app.activeRegisters <= 0)
          ? true
          : false
      }, {
        id: "btnBD",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.backdataEntry();
        },
        label: "Back Data Entry",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: this.props.app.currentSection !== "home" || this.props.app.formActive || this.props.app.module !== "HTS" || this.props.app.userManagementActive === true
          ? true
          : false,
        inactive: (this.props.app.module === "" && !this.props.app.formActive) || (nextLabel === "Realtime Data Entry" && this.props.app.activeRegisters <= 0)
          ? true
          : false
      }, {
        id: "btnNext",
        buttonClass: "green nav-buttons",
        onMouseDown: () => {
          if (this.props.app.formActive) {
            this.handleNextButtonClicks();
          } else {
            this.deactivateAllPrograms();
          }
        },
        label: this.props.app.formActive
          ? "Next"
          : "Finish",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px",
          marginRight: "15px"
        },
        disabled: this.props.app.userManagementActive !== true
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnAddUser",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          if (this.props.app.formActive) {
            this.handleClearClicks();
          } else {
            this.addUser();
          }
        },
        label: this.props.app.formActive
          ? "Clear"
          : "Add User",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: this.props.app.userManagementActive !== true
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnBack",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.navBack();
        },
        label: "Back",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: !this.props.app.formActive || (this.props.app.formActive && (this.props.app.fieldPos < 1 || (this.$('u14HelpText') && this.$('u14HelpText').innerHTML.trim() === 'Partner present')))
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnClear",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.handleClearClicks();
        },
        label: (!this.props.app.formActive && this.props.app.dual && (this.props.app.dual && ((this.props.app.primary.summary || this.props.app.primary.forceSummary) || (this.props.app.secondary.summary || this.props.app.secondary.forceSummary)))
          ? "HTS Visit"
          : "Clear"),
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: (!this.props.app.formActive || this.props.app.selectedTask === "Backdata Entry" || this.props.app.userManagementActive === true) && !(this.props.app.dual && ((this.props.app.primary.summary || this.props.app.primary.forceSummary) || (this.props.app.secondary.summary || this.props.app.secondary.forceSummary)))
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnPeriod",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.filterReport();
        },
        label: (["monthly report", "pepfar report", "daily register"].indexOf(this.props.app.activeReport) >= 0
          ? "Set Reporting Period"
          : "Set Reporting Period"),
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px",
          marginRight: "15px"
        },
        disabled: this.props.app.currentSection !== "reports" || this.props.app.selectedTask === "Report Filter"
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnDownloadCSV",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.downloadCSV(this.props.reports.dataHeaders, this.props.reports.rawData, (this.props.app.activeReport
            ? String(this.props.app.activeReport).trim().replace(/\s/g, "_")
            : null));
        },
        label: "Download CSV",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: this.props.app.currentSection !== "reports" || this.props.app.activeReport === "monthly report" || this.props.app.selectedTask === "Report Filter"
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnTranscribe",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {

          const entryCode = this.props
            .app
            .patientData[this.props.app.currentId][this.props.app.module]
            .visits
            .filter((e) => {
              return Object.keys(e)[0] === this.props.app.selectedVisit
            })
            .map((e) => {
              return Object.keys(e[Object.keys(e)[0]])
            }).sort().pop();

          this.transcribe(entryCode);

        },
        label: "Transcribe",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: true // !this.props.app.patientActivated || this.props.app.formActive 
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnSearch",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          this.findEnteredRecord()
        },
        label: "Find Entered Record",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: this.props.app.currentSection !== "home" || this.props.app.formActive || this.props.app.module !== "HTS" || this.props.app.userManagementActive === true
          ? true
          : false,
        inactive: this.props.app.module === "" && !this.props.app.formActive
          ? true
          : false
      }, {
        id: "btnLogin",
        buttonClass: "green nav-buttons",
        onMouseDown: () => {
          this.login(this)
        },
        label: "Login",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px",
          marginRight: "15px"
        },
        disabled: this.props.app.activeUser
          ? true
          : false
      }, {
        id: "btnPrint",
        buttonClass: "blue nav-buttons",
        onMouseDown: () => {
          const client = this.props.app.patientData[this.props.app.clientId];
          const data = {
            npid: this.props.app.clientId || "",
            first_name: client.firstName || "-",
            family_name: client.lastName || "-",
            date_of_birth_estimated: "",
            date_of_birth: client.dateOfBirth || "",
            gender: client.gender || "",
            residence: client.currentVillage || ""
          };
          this.printBarcode(data);
        },
        label: "Print Barcode",
        extraStyles: {
          cssFloat: "right",
          marginTop: "15px"
        },
        disabled: !this.props.app.patientActivated || (this.props.app.patientActivated && this.props.app.formActive)
          ? (this.props.app.patientActivated && this.props.app.selectedTask === "Transcribe" ? false : true)
          : false
      }
    ];

    return (
      <div>
        <div
          id="progressShield"
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(128, 128, 128, 0.1)",
            zIndex: "1001",
            display: (this.props.dde.processing || this.props.app.processing || this.props.reports.processing
              ? "block"
              : "none")
          }} />
        <div
          style={{
            position: "absolute",
            left: "calc(50vw - 20px)",
            top: "calc(50vh - 20px)"
          }}>
          <ClipLoader
            color={"#123abc"}
            loading={this.props.dde.processing || this.props.app.processing || this.props.reports.processing}
            size={50} />
        </div>
        <Alert
          alerts={this.props.alerts}
          close={this
            .props
            .closeMsg
            .bind(this)}
          updateAlertKey={this.props.updateAlertKey.bind(this)} />
        <Dialog
          dialog={this.props.dialog}
          close={this
            .props
            .closeDialog
            .bind(this)}
          incrementReportMonth={this.props.incrementReportMonth}
          incrementReportYear={this.props.incrementReportYear}
          decrementReportMonth={this.props.decrementReportMonth}
          decrementReportYear={this.props.decrementReportYear}
          scrollLocationUp={this.props.scrollLocationUp}
          scrollLocationDown={this.props.scrollLocationDown}
          scrollTestUp={this.props.scrollTestUp}
          scrollTestDown={this.props.scrollTestDown}
          setReportingPeriod={this
            .setReportingPeriod
            .bind(this)}
          app={this.props.app} />{" "} {(!this.props.app.activeUser || !this.props.app.location)
            ? <Login
              handleDirectInputChange={this.props.handleInputChange}
              app={this.props.app}
              responses={this.props.wf.responses}
              label="Scan Workstation Location"
              queryOptions={this
                .queryOptions
                .bind(this)}
              group="primary"
              setLocation={this
                .props
                .setLocation
                .bind(this)}
              showErrorMsg={this
                .props
                .showErrorMsg
                .bind(this)} />
            : this.props.app.currentSection === "reports"
              ? (<ReportsViewer
                activeReport={this.props.app.activeReport}
                reports={this.props.reports}
                setDataHeaders={this
                  .props
                  .setDataHeaders
                  .bind(this)}
                app={this.props.app}
                dialog={this.props.dialog}
                responses={this.props.wf.responses}
                configs={this.props.app.configs}
                label={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                  ? this.props.wf[this.state.currentWorkflow].currentNode.label
                  : ""}
                selectedTask={this.props.app.selectedTask}
                sectionHeader={this.props.app.sectionHeader}
                handleDirectInputChange={this.props.handleInputChange}
                queryOptions={this
                  .queryOptions
                  .bind(this)}
                group={this.state.currentWorkflow}
                navNext={this
                  .navNext
                  .bind(this)}
                data={this.props.data}
                options={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.options
                  ? this.props.wf[this.state.currentWorkflow].currentNode.options
                  : null}
                scrollPepfarData={this
                  .scrollPepfarData
                  .bind(this)} />)
              : this.props.app.userManagementActive === true
                ? <UsersViewer
                  editUser={this
                    .editUser
                    .bind(this)}
                  activateUser={this
                    .props
                    .activateUser
                    .bind(this)}
                  blockUser={this
                    .props
                    .blockUser
                    .bind(this)}
                  activeSection={this.props.app.currentSection}
                  handleSwitchProgram={this
                    .switchProgram
                    .bind(this)}
                  handleVisitUrl={this
                    .navigateToVisit
                    .bind(this)}
                  programs={this.props.app.programs}
                  handleNavigateToUrl={this
                    .navigateToRoute
                    .bind(this)}
                  module={this.props.app.module}
                  selectedVisit={this.props.app.selectedVisit}
                  tasks={this.props.app.tasks}
                  selectedTask={this.props.app.selectedTask}
                  userDashTasks={this.props.app.userDashTasks}
                  formActive={this.props.app.formActive}
                  responses={this.props.wf.responses}
                  label={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                    ? this.props.wf[this.state.currentWorkflow].currentNode.label
                    : ""}
                  handleDirectInputChange={this.props.handleInputChange}
                  configs={this.props.app.configs}
                  value={this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                    ? this.props.wf[this.state.currentWorkflow].currentNode.label
                    : ""]
                    ? this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                      ? this.props.wf[this.state.currentWorkflow].currentNode.label
                      : ""]
                    : ""}
                  type={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
                    ? this.props.wf[this.state.currentWorkflow].currentNode.type
                    : ""}
                  summaryIgnores={this.props.app.summaryIgnores}
                  sectionHeader={this.props.app.sectionHeader}
                  processing={this.props.app.processing}
                  options={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.options
                    ? this.props.wf[this.state.currentWorkflow].currentNode.options
                    : null}
                  order={this.props.app.order}
                  fieldType={this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                    ? this.props.wf[this.state.currentWorkflow].currentNode.label
                    : ""] && this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                      ? this.props.wf[this.state.currentWorkflow].currentNode.label
                      : ""].fieldType
                    ? this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                      ? this.props.wf[this.state.currentWorkflow].currentNode.label
                      : ""].fieldType
                    : "text"}
                  visits={this.props.app.patientData && this.props.app.currentId && this.props.app.today && this.props.app.module && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId][this.props.app.module] && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits
                    ? this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits
                    : []}
                  handleVoidEncounter={this
                    .voidEncounter
                    .bind(this)}
                  handleInputChange={this
                    .handleInputChange
                    .bind(this)}
                  queryOptions={this
                    .queryOptions
                    .bind(this)}
                  data={this.props.data}
                  navNext={this
                    .navNext
                    .bind(this)}
                  dual={this.props.app.dual}
                  group={this.state.currentWorkflow}
                  fetchPatientData={this
                    .props
                    .fetchPatientData
                    .bind(this)}
                  goForward={this
                    .props
                    .goForward
                    .bind(this)}
                  activeWorkflow={this.state.currentWorkflow}
                  switchWorkflow={this
                    .switchWorkflow
                    .bind(this)}
                  wf={this.props.wf}
                  cancelForm={this
                    .cancelForm
                    .bind(this)}
                  currentPatient={this.props.app.currentId && this.props.app.patientData && this.props.app.patientData[this.props.app.currentId]
                    ? this.props.app.patientData[this.props.app.currentId]
                    : {}}
                  nextBDRow={(this.props.bd && this.props.bd.lastRow
                    ? this.props.bd.lastRow
                    : null)}
                  currentEditRow={(this.props.bd && this.props.bd.currentRow
                    ? this.props.bd.currentRow
                    : {})}
                  fetchLastBDRow={this
                    .props
                    .fetchLastBDRow
                    .bind(this)}
                  saveBDRow={this
                    .props
                    .saveBDRow
                    .bind(this)}
                  fetchEditRow={this
                    .props
                    .fetchEditRow
                    .bind(this)}
                  saveEditRow={this
                    .props
                    .saveEditRow
                    .bind(this)}
                  ddeResults={this.props.dde.matches.hits}
                  ddeCurrentPatient={this.props.dde.currentPatient}
                  searchByNameAndGender={this
                    .props
                    .searchByNameAndGender
                    .bind(this)}
                  selectPatient={this
                    .selectPatient
                    .bind(this)}
                  updateApp={this
                    .props
                    .updateApp
                    .bind(this)}
                  showErrorMsg={this
                    .props
                    .showErrorMsg
                    .bind(this)}
                  handleNextButtonClicks={this
                    .handleNextButtonClicks
                    .bind(this)}
                  icon={this.props.app.icon}
                  currentTab={this.props.app.currentTab}
                  app={this.props.app}
                  searchByIdentifier={this.props.searchByIdentifier}
                  firstSummary={this.props.app.firstSummary}
                  secondSummary={this.props.app.secondSummary}
                  client={this.props.app.clientId && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId]
                    ? this.props.app.patientData[this.props.app.clientId]
                    : {}}
                  partner={this.props.app.partnerId && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId]
                    ? this.props.app.patientData[this.props.app.partnerId]
                    : {}}
                  showConfirmMsg={this
                    .props
                    .showConfirmMsg
                    .bind(this)}
                  showInfoMsg={this
                    .props
                    .showInfoMsg
                    .bind(this)}
                  addRegister={this
                    .addRegister
                    .bind(this)}
                  closeRegister={this
                    .closeRegister
                    .bind(this)}
                  fetchRegisterStats={this
                    .props
                    .fetchRegisterStats
                    .bind(this)}
                  fetchVisitSummaries={this
                    .props
                    .fetchVisitSummaries
                    .bind(this)}
                  reports={this.props.reports}
                  fetchUsers={this
                    .props
                    .fetchUsers
                    .bind(this)}
                  findUser={this.findUser.bind(this)}
                  updatePassword={this.props.updatePassword.bind(this)} />
                : (
                  <div>
                    <Topbar
                      patientActivated={this.props.app.patientActivated}
                      module={this.props.app.module}
                      icon={this.props.app.icon}
                      handleCheckBarcode={this
                        .checkBarcode
                        .bind(this)}
                      today={this.props.app.today}
                      facility={this.props.app.facility}
                      user={this.props.app.user}
                      location={this.props.app.location}
                      data={{}}
                      age={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].age
                        ? this.props.app.patientData[this.props.app.currentId].age
                        : ""}
                      primaryId={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].npid
                        ? this.props.app.patientData[this.props.app.currentId].npid
                        : ""}
                      otherId={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].otherId
                        ? this.props.app.patientData[this.props.app.currentId].otherId
                        : ""}
                      otherIdLabel={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].otherIdType
                        ? this.props.app.patientData[this.props.app.currentId].otherIdType
                        : ""}
                      gender={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].gender
                        ? this.props.app.patientData[this.props.app.currentId].gender
                        : ""}
                      patientName={this.props.app.currentId && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId].patientName
                        ? this.props.app.patientData[this.props.app.currentId].patientName
                        : ""}
                      patientData={this.props.app.patientData}
                      currentId={this.props.app.currentId}
                      title={this.props.wf && this.props.wf.currentNode && this.props.wf.currentNode.label
                        ? this.props.wf.currentNode.label
                        : ""}
                      switchWorkflow={this
                        .switchWorkflow
                        .bind(this)}
                      selectedTask={this.props.app.selectedTask}
                      app={this.props.app}
                      activeWorkflow={this.state.currentWorkflow}
                      client={this.props.app.dual === true && this.props.app.partnerId && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId]
                        ? this.props.app.patientData[this.props.app.partnerId]
                        : (!this.props.app.dual && this.props.app.currentId && this.props.app.patientData && this.props.app.patientData[this.props.app.currentId]
                          ? this.props.app.patientData[this.props.app.currentId]
                          : {})}
                      partner={this.props.app.dual === true && this.props.app.clientId && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId]
                        ? this.props.app.patientData[this.props.app.clientId]
                        : {}}
                      wf={this.props.wf} />
                    <Container
                      activeSection={this.props.app.currentSection}
                      handleSwitchProgram={this
                        .switchProgram
                        .bind(this)}
                      handleVisitUrl={this
                        .navigateToVisit
                        .bind(this)}
                      programs={this.props.app.programs}
                      handleNavigateToUrl={this
                        .navigateToRoute
                        .bind(this)}
                      module={this.props.app.module}
                      selectedVisit={this.props.app.selectedVisit}
                      tasks={this.props.app.tasks}
                      selectedTask={this.props.app.selectedTask}
                      userDashTasks={this.props.app.userDashTasks}
                      formActive={this.props.app.formActive}
                      responses={this.props.wf.responses}
                      label={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                        ? this.props.wf[this.state.currentWorkflow].currentNode.label
                        : ""}
                      handleDirectInputChange={this.props.handleInputChange}
                      configs={this.props.app.configs}
                      value={this.props.wf.responses && this.props.wf.responses[this.state.currentWorkflow] && this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                        ? this.props.wf[this.state.currentWorkflow].currentNode.label
                        : ""]
                        ? this.props.wf.responses[this.state.currentWorkflow][this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                          ? this.props.wf[this.state.currentWorkflow].currentNode.label
                          : ""]
                        : ""}
                      type={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.type
                        ? this.props.wf[this.state.currentWorkflow].currentNode.type
                        : ""}
                      summaryIgnores={this.props.app.summaryIgnores}
                      sectionHeader={this.props.app.sectionHeader}
                      processing={this.props.app.processing}
                      options={this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.options
                        ? this.props.wf[this.state.currentWorkflow].currentNode.options
                        : null}
                      order={this.props.app.order}
                      fieldType={this.props.app && this.props.app.configs && this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                        ? this.props.wf[this.state.currentWorkflow].currentNode.label
                        : ""] && this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                          ? this.props.wf[this.state.currentWorkflow].currentNode.label
                          : ""].fieldType
                        ? this.props.app.configs[this.props.wf && this.props.wf[this.state.currentWorkflow] && this.props.wf[this.state.currentWorkflow].currentNode && this.props.wf[this.state.currentWorkflow].currentNode.label
                          ? this.props.wf[this.state.currentWorkflow].currentNode.label
                          : ""].fieldType
                        : "text"}
                      visits={this.props.app.patientData && this.props.app.currentId && this.props.app.today && this.props.app.module && this.props.app.patientData[this.props.app.currentId] && this.props.app.patientData[this.props.app.currentId][this.props.app.module] && this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits
                        ? this.props.app.patientData[this.props.app.currentId][this.props.app.module].visits
                        : []}
                      handleVoidEncounter={this
                        .voidEncounter
                        .bind(this)}
                      handleInputChange={this
                        .handleInputChange
                        .bind(this)}
                      queryOptions={this
                        .queryOptions
                        .bind(this)}
                      data={this.props.data}
                      navNext={this
                        .navNext
                        .bind(this)}
                      dual={this.props.app.dual}
                      group={this.state.currentWorkflow}
                      fetchPatientData={this
                        .props
                        .fetchPatientData
                        .bind(this)}
                      goForward={this
                        .props
                        .goForward
                        .bind(this)}
                      activeWorkflow={this.state.currentWorkflow}
                      switchWorkflow={this
                        .switchWorkflow
                        .bind(this)}
                      wf={this.props.wf}
                      cancelForm={this
                        .cancelForm
                        .bind(this)}
                      currentPatient={this.props.app.currentId && this.props.app.patientData && this.props.app.patientData[this.props.app.currentId]
                        ? this.props.app.patientData[this.props.app.currentId]
                        : {}}
                      nextBDRow={(this.props.bd && this.props.bd.lastRow
                        ? this.props.bd.lastRow
                        : null)}
                      currentEditRow={(this.props.bd && this.props.bd.currentRow
                        ? this.props.bd.currentRow
                        : {})}
                      fetchLastBDRow={this
                        .props
                        .fetchLastBDRow
                        .bind(this)}
                      saveBDRow={this
                        .props
                        .saveBDRow
                        .bind(this)}
                      fetchEditRow={this
                        .props
                        .fetchEditRow
                        .bind(this)}
                      saveEditRow={this
                        .props
                        .saveEditRow
                        .bind(this)}
                      ddeResults={this.props.dde.matches.hits}
                      ddeCurrentPatient={this.props.dde.currentPatient}
                      searchByNameAndGender={this
                        .props
                        .searchByNameAndGender
                        .bind(this)}
                      selectPatient={this
                        .selectPatient
                        .bind(this)}
                      updateApp={this
                        .props
                        .updateApp
                        .bind(this)}
                      showErrorMsg={this
                        .props
                        .showErrorMsg
                        .bind(this)}
                      handleNextButtonClicks={this
                        .handleNextButtonClicks
                        .bind(this)}
                      icon={this.props.app.icon}
                      currentTab={this.props.app.currentTab}
                      app={this.props.app}
                      searchByIdentifier={this.props.searchByIdentifier}
                      firstSummary={this.props.app.firstSummary}
                      secondSummary={this.props.app.secondSummary}
                      client={this.props.app.clientId && this.props.app.patientData && this.props.app.patientData[this.props.app.clientId]
                        ? this.props.app.patientData[this.props.app.clientId]
                        : {}}
                      partner={this.props.app.partnerId && this.props.app.patientData && this.props.app.patientData[this.props.app.partnerId]
                        ? this.props.app.patientData[this.props.app.partnerId]
                        : {}}
                      showConfirmMsg={this
                        .props
                        .showConfirmMsg
                        .bind(this)}
                      showInfoMsg={this
                        .props
                        .showInfoMsg
                        .bind(this)}
                      addRegister={this
                        .addRegister
                        .bind(this)}
                      closeRegister={this
                        .closeRegister
                        .bind(this)}
                      fetchRegisterStats={this
                        .props
                        .fetchRegisterStats
                        .bind(this)}
                      fetchVisitSummaries={this
                        .props
                        .fetchVisitSummaries
                        .bind(this)}
                      reports={this.props.reports}
                      changePassword={this
                        .changePassword
                        .bind(this)}
                      transcribe={this
                        .transcribe
                        .bind(this)}
                      printLabel={this
                        .printLabel
                        .bind(this)}
                      addLocation={this.addLocation.bind(this)}
                      clearField={this.props.clearField.bind(this)}
                      addVillages={this.addVillages.bind(this)}
                      showUserStats={this.showUserStats.bind(this)}
                      fetchFilteredVisitSummaries={this.props.fetchFilteredVisitSummaries} />
                  </div>
                )}
        <U13 buttons={buttons} version={this.props.app.version} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.queryData,
    wf: state.wf,
    bd: state.bd,
    alerts: state.alerts,
    dialog: state.dialog,
    reports: state.reports,
    app: state.app,
    dde: state.dde
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initApp: url => {
      return new Promise(resolve => {
        dispatch(initApp(url));
        resolve();
      });
    },
    updateApp: payload => {
      return new Promise(resolve => {
        dispatch(updateApp(payload));
        resolve();
      });
    },
    handleInputChange: (field, value, group) => {
      return new Promise(resolve => {
        dispatch(handleInputChange(field, value, group));
        resolve();
      });
    },
    fetchData: url => {
      return new Promise(resolve => {
        dispatch(fetchData(url));
        resolve();
      });
    },
    clearCache: () => {
      return new Promise(resolve => {
        dispatch(clearCache());
        resolve();
      });
    },
    submitForm: (url, payload) => {
      return new Promise((resolve, reject) => {
        dispatch(submitForm(url, payload)).then(() => {
          resolve();
        }).catch((e) => {
          reject();
        })
      });
    },
    fetchJSON: (url, path, group, subGroup) => {
      return new Promise(resolve => {
        dispatch(fetchJSON(url, path, group, subGroup));
        resolve();
      });
    },
    fetchPatientData: url => {
      return new Promise(resolve => {
        dispatch(fetchPatientData(url));
        resolve();
      });
    },
    voidEncounter: (url, payload) => {
      return new Promise(resolve => {
        dispatch(voidEncounter(url, payload));
        resolve();
      });
    },
    loadWorkflow: (group, payload) => {
      return new Promise(resolve => {
        dispatch(loadWorkflow(group, payload));
        resolve();
      });
    },
    goForward: (group, result) => {
      return new Promise(resolve => {
        dispatch(goForward(group, result));
        resolve();
      });
    },
    clearWorkflow: group => {
      return new Promise(resolve => {
        dispatch(clearWorkflow(group));
        resolve();
      });
    },
    goBackward: group => {
      return new Promise(resolve => {
        dispatch(goBackward(group));
        resolve();
      });
    },
    fetchLastBDRow: url => {
      return new Promise(resolve => {
        dispatch(fetchLastBDRow(url));
        resolve();
      });
    },
    saveBDRow: (url, payload) => {
      return new Promise(resolve => {
        dispatch(saveBDRow(url, payload)).then(() => {
          resolve();
        })
      });
    },
    searchByIdentifier: identifier => {
      return new Promise(resolve => {
        dispatch(searchByIdentifier(identifier));
        resolve();
      });
    },
    searchByNameAndGender: payload => {
      return new Promise(resolve => {
        dispatch(searchByNameAndGender(payload));
        resolve();
      });
    },
    advancedPatientSearch: payload => {
      return new Promise(resolve => {
        dispatch(advancedPatientSearch(payload));
        resolve();
      });
    },
    voidPatient: identifier => {
      return new Promise(resolve => {
        dispatch(voidPatient(identifier));
        resolve();
      });
    },
    addPatient: payload => {
      return new Promise(resolve => {
        dispatch(addPatient(payload));
        resolve();
      });
    },
    updatePatient: payload => {
      return new Promise(resolve => {
        dispatch(updatePatient(payload));
        resolve();
      });
    },
    mergeRecords: payload => {
      return new Promise(resolve => {
        dispatch(mergeRecords(payload));
        resolve();
      });
    },
    clearDataStructs: () => {
      return new Promise(resolve => {
        dispatch(clearDataStructs());
        resolve();
      });
    },
    selectPatient: json => {
      return new Promise(resolve => {
        dispatch(selectPatient(json));
        resolve();
      });
    },
    showInfoMsg: (msg, topic, deletePrompt, deleteLabel, deleteAction) => {
      return new Promise(resolve => {
        dispatch(showInfoMsg(msg, topic, deletePrompt, deleteLabel, deleteAction));
        resolve();
      });
    },
    showErrorMsg: (msg, topic) => {
      return new Promise(resolve => {
        dispatch(showErrorMsg(msg, topic));
        resolve();
      });
    },
    showConfirmMsg: (title, msg, label, action, cancelAction) => {
      return new Promise(resolve => {
        dispatch(showConfirmMsg(title, msg, label, action, cancelAction));
        resolve();
      });
    },
    closeMsg: () => {
      return new Promise(resolve => {
        dispatch(closeMsg());
        resolve();
      });
    },
    showDialog: title => {
      return new Promise(resolve => {
        dispatch(showDialog(title));
        resolve();
      });
    },
    closeDialog: () => {
      return new Promise(resolve => {
        dispatch(closeDialog());
        resolve();
      });
    },
    incrementReportMonth: (group) => {
      return new Promise(resolve => {
        dispatch(incrementReportMonth(group));
        resolve();
      });
    },
    incrementReportYear: (group) => {
      return new Promise(resolve => {
        dispatch(incrementReportYear(group));
        resolve();
      });
    },
    decrementReportMonth: (group) => {
      return new Promise(resolve => {
        dispatch(decrementReportMonth(group));
        resolve();
      });
    },
    decrementReportYear: (group) => {
      return new Promise(resolve => {
        dispatch(decrementReportYear(group));
        resolve();
      });
    },
    setPeriod: payload => {
      return new Promise(resolve => {
        dispatch(setPeriod(payload));
        resolve();
      });
    },
    fetchReport: url => {
      return new Promise(resolve => {
        dispatch(fetchReport(url));
        resolve();
      });
    },
    setConfig: payload => {
      return new Promise(resolve => {
        dispatch(setConfig(payload));
        resolve();
      })
    },
    fetchVisits: (id, flashId) => {
      return new Promise(resolve => {
        dispatch(fetchVisits(id, flashId));
        resolve();
      })
    },
    fetchRaw: (baseUrl, sMonth, sYear, eMonth, eYear) => {
      return new Promise(resolve => {
        dispatch(fetchRaw(baseUrl, sMonth, sYear, eMonth, eYear));
        resolve();
      })
    },
    resetRawData: () => {
      return new Promise(resolve => {
        dispatch(resetRawData());
        resolve();
      })
    },
    setDataHeaders: (payload) => {
      return new Promise(resolve => {
        dispatch(setDataHeaders(payload));
        resolve();
      })
    },
    scrollLocationUp: () => {
      return new Promise(resolve => {
        dispatch(scrollLocationUp());
        resolve();
      })
    },
    scrollLocationDown: () => {
      return new Promise(resolve => {
        dispatch(scrollLocationDown());
        resolve();
      })
    },
    scrollTestUp: () => {
      return new Promise(resolve => {
        dispatch(scrollTestUp());
        resolve();
      })
    },
    scrollTestDown: () => {
      return new Promise(resolve => {
        dispatch(scrollTestDown());
        resolve();
      })
    },
    fetchDailyRegister: (sMonth, sYear, location, kitType, kitName) => {
      return new Promise(resolve => {
        dispatch(fetchDailyRegister(sMonth, sYear, location, kitType, kitName));
        resolve();
      })
    },
    voidMultipleEncounters: (url, payload) => {
      return new Promise(resolve => {
        dispatch(voidMultipleEncounters(url, payload));
        resolve();
      });
    },
    fetchRegisterStats: (url = "/programs/fetch_register_stats") => {
      return new Promise(resolve => {
        dispatch(fetchRegisterStats(url));
        resolve();
      })
    },
    fetchEditRow: (url) => {
      return new Promise(resolve => {
        dispatch(fetchEditRow(url));
        resolve();
      })
    },
    saveEditRow: (url, payload) => {
      return new Promise((resolve, reject) => {
        dispatch(saveEditRow(url, payload)).then(() => {
          resolve();
        }).catch((e) => {
          reject();
        })
      })
    },
    fetchVisitSummaries: (month, year) => {
      return new Promise(resolve => {
        dispatch(fetchVisitSummaries(month, year));
        resolve();
      })
    },
    logout: (token) => {
      return new Promise(resolve => {
        dispatch(logout(token));
        resolve();
      })
    },
    login: async (payload) => {
      return await dispatch(login(payload));
    },
    setLocation: async (location, token) => {
      return await dispatch(setLocation(location, token));
    },
    sessionValid: async (token) => {
      return await dispatch(sessionValid(token));
    },
    fetchUsers: async (page = 1, pageSize = 6) => {
      return await dispatch(fetchUsers(page, pageSize));
    },
    blockUser: async (username) => {
      return await dispatch(blockUser(username));
    },
    activateUser: async (username) => {
      return await dispatch(activateUser(username));
    },
    fetchPepfarData: async (baseUrl, sMonth, sYear, eMonth, eYear, startPos, endPos) => {
      return await dispatch(fetchPepfarData(baseUrl, sMonth, sYear, eMonth, eYear, startPos, endPos));
    },
    resetPepfarData: async () => {
      return await dispatch(resetPepfarData());
    },
    loadData: async (group, subGroup, configs, ignores, data) => {
      return await dispatch(loadData(group, subGroup, configs, ignores, data));
    },
    resetErrorMessage: async () => {
      return await dispatch(resetErrorMessage());
    },
    setData: async (data) => {
      return await dispatch(setData(data));
    },
    flagRegisterFilled: async (clientId, module, visitDate, entryCode) => {
      return await dispatch(flagRegisterFilled(clientId, module, visitDate, entryCode));
    },
    updatePartnerRecord: async (clientId, concept, visitDate, valuecurrentUser, url) => {
      return await dispatch(updatePartnerRecord(clientId, concept, visitDate, valuecurrentUser, url));
    },
    clearField: async (field, group) => {
      return await dispatch(clearField(field, group));
    },
    getVersion: async () => {
      return await dispatch(getVersion());
    },
    usernameValid: async (username) => {
      return await dispatch(usernameValid(username));
    },
    updatePassword: async (username, password) => {
      return await dispatch(updatePassword(username, password));
    },
    checkRedirectToPortal: async () => {
      return await dispatch(checkRedirectToPortal());
    },
    fetchFilteredVisitSummaries: async (month1, year1, date1, month2, year2, date2) => {
      return await dispatch(fetchFilteredVisitSummaries(month1, year1, date1, month2, year2, date2));
    },
    updateReportField: async (field, value, group) => {
      return await dispatch(updateReportField(field, value, group));
    },
    updateAlertKey: async (key, value) => {
      return await dispatch(updateAlertKey(key, value));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
