import React, { Component } from 'react';
import './backdataEntry.css';
import Keyboard from './keyboard';
import icoSave from '../images/save.js';
import icoClose from '../images/close.js';
import algorithm from '../lib/dhaAlgorithm.js';
import Button from './button';
const alertsMapping = require('../config/alertsMapping.json');
const checkData = require('../constraints').validate;

class BackdataEntry extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      count: 0,
      fieldType: "",
      configs: {},
      label: null,
      currentString: ""
    }

  }

  $ = (id) => {
    return document.getElementById(id);
  }

  coords = {
    1: 158,
    2: 226,
    3: 448,
    4: 497,
    5: 780,
    6: 983,
    7: 1405,
    8: 1522,
    9: 2080,
    10: 2434,
    11: 2829,
    12: 3041,
    13: 3100
  };

  scrollDelay = 100;

  categories = {
    "HTS Provider ID": 1,
    "Sex/Pregnancy": 2,
    "Age": 3,
    "Age Group": 4,
    "HTS Access Type": 5,
    "Last HIV Test": 6,
    "Partner Present": 7,
    "HIV Rapid Test Outcomes": 8,
    "Outcome Summary": 9,
    "Result Given to Client": 10,
    "Partner HIV Status": 11,
    "Client Risk Category": 12,
    "Referral for Re-Testing": 13,
    "Number of Items Given": 14
  }

  handleCellClick(fieldType, category, field, subField, subSubField, j, i, group, e) {

    const scrollDelay = 100;

    const coords = {
      1: 158,
      2: 226,
      3: 448,
      4: 497,
      5: 780,
      6: 983,
      7: 1405,
      8: 1522,
      9: 2080,
      10: 2434,
      11: 2829,
      12: 3041,
      13: 3100
    };

    let newState = this.state;

    if (category && field && subField && subSubField && fieldType.type === "click") {

      const label = (category
        ? category
        : "") + (field
          ? ":" + field
          : "") + (subField
            ? ":" + subField
            : "");

      newState.label = label;

      newState.fieldType = "";

      newState.configs = {};

      if (!newState.data[category])
        newState.data[category] = {};

      if (!newState.data[category][field])
        newState.data[category][field] = {};

      if (newState.data && newState.data[category] && Object.keys(newState.data[category]).indexOf(field) >= 0 && newState.data[category][field] && Object.keys(newState.data[category][field]).indexOf(subField) >= 0 && String(newState.data[category][field][subField]).trim().length > 0) {

        delete newState.data[category][field][subField];

      } else {

        newState.data[category][field][subField] = subSubField;

        setTimeout(() => {

          if (coords[group])
            this.$("bdScroller").scrollLeft = coords[group];

        }
          , scrollDelay)

      }

      this.setState(newState);

      this
        .props
        .handleDirectInputChange(label, subSubField, this.props.group);

    } else if (category && field && subField && !subSubField && fieldType.type === "click") {

      const label = (category
        ? category
        : "") + (field
          ? ":" + field
          : "");

      newState.label = label;

      newState.fieldType = "";

      newState.configs = {};

      if (!newState.data[category])
        newState.data[category] = {};

      if (newState.data && newState.data[category] && Object.keys(newState.data[category]).indexOf(field) >= 0 && String(newState.data[category][field]).trim().length > 0) {

        delete newState.data[category][field];

      } else {

        newState.data[category][field] = subField;

        setTimeout(() => {

          if (coords[group])
            this.$("bdScroller").scrollLeft = coords[group];

        }
          , scrollDelay)

      }

      this.setState(newState);

      this
        .props
        .handleDirectInputChange(label, subField, this.props.group);

    } else if (category && field && !subField && fieldType.type === "click") {

      const label = category;

      newState.label = label;

      newState.fieldType = "";

      newState.configs = {};

      if (newState.data && Object.keys(newState.data).indexOf(category) >= 0 && String(newState.data[category]).trim().length > 0) {

        delete newState.data[category];

      } else {

        newState.data[category] = field;

        setTimeout(() => {

          if (coords[group])
            this.$("bdScroller").scrollLeft = coords[group];

        }
          , scrollDelay)

      }

      this.setState(newState);

      this
        .props
        .handleDirectInputChange(label, field, this.props.group);

    } else if (fieldType && fieldType.type !== "click") {

      const label = (category
        ? category
        : "") + (field
          ? ":" + field
          : "") + (subField
            ? ":" + subField
            : "");

      newState.label = label;

      newState.fieldType = fieldType.type;

      newState.configs = {
        [label]: {
          hiddenButtons: fieldType.hiddens,
          textCase: fieldType.textCase,
          minDate: fieldType.minDate,
          maxDate: fieldType.maxDate
        }
      };

      if (this.state.data && this.state.data[label]) {

        newState.currentString = this.state.data[label];

      } else {

        newState.currentString = "";

      }

      this.setState(newState);

    }

    if (!this.props.app.isDirty) {

      this
        .props
        .updateApp({ isDirty: true });

    }

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

  getDuration = (age) => {

    const parts = String(age)
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

  validated() {

    return new Promise((resolve, reject) => {

      if (!this.state.data["HTS Provider ID"]) {

        this
          .props
          .showErrorMsg("Missing Data", "HTS Provider ID \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["HTS Provider ID"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["HTS Provider ID"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (this.state.data["HTS Provider ID"] && !algorithm.decode(this.state.data["HTS Provider ID"])) {

        this
          .props
          .showErrorMsg("Invalid Entry", "HTS Provider ID \n does not exist");

        setTimeout(() => {

          if (this.coords[this.categories["HTS Provider ID"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["HTS Provider ID"]];

        }
          , this.scrollDelay)

        return reject();

      }

      if (!this.state.data.Age || (this.state.data.Age && String(this.state.data.Age).trim().length <= 0)) {

        this
          .props
          .showErrorMsg("Missing Data", "Age \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (!String(this.state.data.Age).trim().match(/\d+[D|W|M|Y]$/i)) {

        this
          .props
          .showErrorMsg("Missing Data", "Number and time units \n (days, weeks, months, years) \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data.Age).trim().match(/\d+D$/i) && !String(this.state.data.Age).trim().match(/^[1-9]D$|^[1-2][0-9]D$|^30D$/)) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Number of days between 1 and 30 \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data.Age).trim().match(/\d+W$/i) && !String(this.state.data.Age).trim().match(/^[1-9]W$|^[1][0-9]W$|^[2][0-6]W$/)) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Number of weeks between 1 and 26 \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data.Age).trim().match(/\d+M$/i) && !String(this.state.data.Age).trim().match(/^[1-9]M$|^[1][0-9]M$|^[2][0-9]M$|^[3][0-6]M$/)) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Number of months between 1 and 36 \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data.Age).trim().match(/\d+Y$/i) && !String(this.state.data.Age).trim().match(/^[1-9]Y$|^[1-9][0-9]Y$|^[1][0][0-9]Y$|^110Y$/)) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Number of years between 1 and 110 \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      }

      let age;

      const parts = String(this.state.data.Age)
        .trim()
        .match(/(\d+)([D|W|M|Y])$/);

      if (!parts) {

        this
          .props
          .showErrorMsg("Invalid Data", "Invalid units provided for Age");

        setTimeout(() => {

          if (this.coords[this.categories["Age"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age"]];

        }
          , this.scrollDelay)

        return reject();

      }

      switch (String(parts[2]).trim().toUpperCase()) {

        case "D":

          age = parseInt(String(parts[1]).trim(), 10);

          break;

        case "W":

          age = parseInt(String(parts[1]).trim(), 10) * 7;

          break;

        case "M":

          age = parseInt(String(parts[1]).trim(), 10) * 30;

          break;

        default:

          age = parseInt(String(parts[1]).trim(), 10) * 365;

          break;

      }

      // eslint-disable-next-line
      const constraints = {
        ageGroup: {
          "0-11 months": {
            min: 0,
            max: 330
          },
          "1-14 years": {
            min: 331,
            max: 5110
          },
          "15-24 years": {
            min: 5111,
            max: 8760
          },
          "25+ years": {
            min: 8761,
            max: 36500
          }
        }
      };

      if (age < constraints.ageGroup[this.state.data["Age Group"]].min || age > constraints.ageGroup[this.state.data["Age Group"]].max) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Age Group \n does not match entered age");

        setTimeout(() => {

          if (this.coords[this.categories["Age Group"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Age Group"]];

        }
          , this.scrollDelay)

        return reject();

      }

      if (String(this.state.data["Last HIV Test"]).trim() !== "Never Tested" && !this.state.data["Time Since Last Test"]) {

        this
          .props
          .showErrorMsg("Missing Data", "Time since last test \n must be entered \n if client was previously tested");

        setTimeout(() => {

          if (this.coords[this.categories["Last HIV Test"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Last HIV Test"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data["Last HIV Test"]).trim() !== "Never Tested" && !String(this.state.data["Time Since Last Test"]).match(/\d+[D|W|M|Y]$/)) {

        this
          .props
          .showErrorMsg("Missing Data", "Number and time units \n (days, weeks, months, years) \n must be entered");

        setTimeout(() => {

          if (this.coords[this.categories["Last HIV Test"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["Last HIV Test"]];

        }
          , this.scrollDelay)

        return reject();

      } else if (String(this.state.data["Last HIV Test"]).trim() !== "Never Tested") {

        const duration = this.getDuration(String(this.state.data["Time Since Last Test"]));

        const absoluteMin = ((new Date()).getFullYear() - 1998) * 365;

        if (duration > age || duration > absoluteMin || (duration > (age - 12 * 30) && String(this.state.data["Last HIV Test"]).trim() === "Last Positive")) {

          this
            .props
            .showErrorMsg("Invalid Entry", "Time Since Last Test \n entered not plausible");

          setTimeout(() => {

            if (this.coords[this.categories["Last HIV Test"]])
              this.$("bdScroller").scrollLeft = this.coords[this.categories["Last HIV Test"]];

          }
            , this.scrollDelay)

          return reject();

        }

      }

      if (Object.keys(this.state.data).indexOf("HIV Rapid Test Outcomes") >= 0 && Object.keys(this.state.data["HIV Rapid Test Outcomes"]).indexOf("Immediate Repeat") >= 0 && ((Object.keys(this.state.data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).length > 0 && Object.keys(this.state.data["HIV Rapid Test Outcomes"]["First Pass"]).length < 2) || (Object.keys(this.state.data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).length > 0 && this.state.data["HIV Rapid Test Outcomes"]["Immediate Repeat"]).length < 2)) {

        this
          .props
          .showErrorMsg("Invalid Entry", "Test results \n entered not plausible");

        setTimeout(() => {

          if (this.coords[this.categories["HIV Rapid Test Outcomes"]])
            this.$("bdScroller").scrollLeft = this.coords[this.categories["HIV Rapid Test Outcomes"]];

        }
          , this.scrollDelay)

        return reject();


      }

      let result = checkData(this.state.data, alertsMapping, this.categories);

      if (result.error) {

        /*if (result.allowContinue) {

          this.props.showConfirmMsg((result.title ? result.title : "Invalid Data"), result.message, () => { });

        } else {*/

        this
          .props
          .showErrorMsg((result.title ? result.title : "Invalid Data"), result.message);

        // }

        if (result.group) {

          setTimeout(() => {

            this
              .$("bdScroller")
              .scrollLeft = this.coords[result.group];

          }, this.scrollDelay)

        }

        return reject();

      }

      return resolve();

    });

  }

  async handleSave() {

    let requiredFields = [
      "HTS Provider ID",
      "Sex/Pregnancy",
      "Age",
      "Age Group",
      "HTS Access Type",
      "Last HIV Test",
      "Partner Present",
      "HIV Rapid Test Outcomes",
      "Outcome Summary",
      "Result Given to Client",
      "Client Risk Category",
      "Referral for Re-Testing",
      "Number of Items Given:HTS Family Referral Slips",
      "Number of Items Given:Condoms:Male",
      "Number of Items Given:Condoms:Female"
    ];

    if (this.state.data && this.state.data['Referral for Re-Testing'] && ["Confirmatory Test at HIV Clinic", "Re-Test"].indexOf(this.state.data['Referral for Re-Testing']) >= 0) {

      requiredFields.push('Appointment Date Given');

    }

    let missingFields = [];

    requiredFields.forEach((field) => {

      let found = false;

      Object
        .keys(this.state.data)
        .forEach((key) => {

          if (key.match("^" + field)) {

            found = true;

          }

        })

      if (!found)
        missingFields.push(field);

    })

    if (missingFields.length > 0) {

      let fields = missingFields.map((e) => { return e === "Number of Items Given:HTS Family Referral Slips" ? "Number of FRS given" : e === "Number of Items Given:Condoms:Male" ? "Number of male condoms given" : e === "Number of Items Given:Condoms:Female" ? "Number of female condoms given" : e });

      return this
        .props
        .showErrorMsg("Missing Data", fields.join(", ") + "\n must be entered");

    } else if (this.state.data && !String(this.state.data['Number of Items Given:HTS Family Referral Slips']).match(/^[0-9]$|^[1][0-5]$/)) {

      return this
        .props
        .showErrorMsg("Invalid Entry", "Number of FRS given \n must be between 0-15");

    } else if (this.state.data && !String(this.state.data['Number of Items Given:Condoms:Male']).match(/^[0-9]$|^[1-9][0-9]$|^[1-4][0-9][0-9]$|^500$/)) {

      return this
        .props
        .showErrorMsg("Invalid Entry", "Number of male condoms given \n must be between 0-500");

    } else if (this.state.data && !String(this.state.data['Number of Items Given:Condoms:Female']).match(/^[0-9]$|^[1-9][0-9]$|^[1-4][0-9][0-9]$|^500$/)) {

      return this
        .props
        .showErrorMsg("Invalid Entry", "Number of female condoms given \n must be between 0-500");

    }

    if (this.state.data && this.state.data['Referral for Re-Testing'] && ["Re-Test"].indexOf(this.state.data['Referral for Re-Testing']) >= 0) {

      let captureDate = new Date(this.props.responses["Set Date"]);
      let appointmentDate = new Date(this.state.data["Appointment Date Given"]);
      let minDate = (new Date((new Date(captureDate)).setDate(captureDate.getDate() + 7)));
      let maxDate = (new Date((new Date(captureDate)).setDate(captureDate.getDate() + 365)));

      if (appointmentDate < minDate || appointmentDate > maxDate) {

        return this
          .props
          .showErrorMsg("Invalid Entry", "Appointment date for Re-Test \n must be between 1 week and 1 year from current test date");

      }

    }

    if (this.state.data && this.state.data['Referral for Re-Testing'] && ["Confirmatory Test at HIV Clinic"].indexOf(this.state.data['Referral for Re-Testing']) >= 0) {

      let captureDate = new Date(this.props.responses["Set Date"]);
      let appointmentDate = new Date(this.state.data["Appointment Date Given"]);
      let maxDate = (new Date((new Date(captureDate)).setDate(captureDate.getDate() + 90)));
      let minDate = (new Date(captureDate));

      if (appointmentDate < minDate || appointmentDate > maxDate) {

        return this
          .props
          .showErrorMsg("Invalid Entry", "Appointment date for Confirmatory Test \n must be between same day and 3 months from current test date");

      }

    }

    this
      .validated()
      .then(() => {

        let newState = Object.assign({}, this.state.data, {
          "Set Date": this.props.responses["Set Date"],
          "Current Location": (this.props.app && this.props.app.currentLocation
            ? this.props.app.currentLocation
            : null),
          "Register Number (from cover)": this.props.responses["Register Number (from cover)"],
          "Current User": (this.props.app && this.props.app.activeUser
            ? this.props.app.activeUser
            : null)
        })

        this
          .props
          .saveBDRow("/programs/save_bd_data", newState)
          .then(async () => {

            let id = this.props.previous.id;

            this
              .props
              .showInfoMsg("Write this  Entry Code in 'Comments'", id);

            const count = this.state.count + 1;

            this.setState({ data: {}, count: count, label: null, currentString: "", fieldType: "" });

            if (this.$("bdScroller")) {

              this
                .$("bdScroller")
                .scrollLeft = 0;

            }

            await this
              .props
              .updateApp({ isDirty: false });

            this
              .props
              .handleDirectInputChange("Total Captured Entries", count, this.props.group);

          });

      })
      .catch(() => { })

  }

  handleClear() {

    this
      .props
      .showConfirmMsg("Confirm Action", "You are about to delete this record. \n Do you want to continue?", "Delete", () => {

        this.setState({ data: {} });

        this
          .props
          .updateApp({ isDirty: false });

        if (this.$("bdScroller")) {

          this
            .$("bdScroller")
            .scrollLeft = 0;

        }

      })

  }

  onChangeHandler(text) {

    const newState = this.state;

    newState.currentString = text;

    newState.data[this.state.label] = text;

    this.setState(newState);

    this
      .props
      .handleDirectInputChange(this.state.label, text, this.props.group);

  }

  componentDidMount() {

    let id = (this.props.wf && this.props.activeWorkflow && this.props.wf.responses && this.props.wf.responses[this.props.activeWorkflow]
      ? (this.props.wf.responses[this.props.activeWorkflow]['Register Number (from cover)']).replace(/[^\d]+$/i, "")
      : null);

    this
      .props
      .fetchLastBDRow("/programs/fetch_last_bd_record/" + id);

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

    const fieldTypes = {
      1: {
        type: "dha",
        hiddens: [],
        textCase: "UPPER"
      },
      2: {
        type: "click",
        hiddens: []
      },
      3: {
        type: "click",
        hiddens: []
      },
      4: {
        type: "click",
        hiddens: []
      },
      5: {
        type: "period",
        hiddens: ["clear", "abc", "qwe", "Unknown", "-"]
      },
      6: {
        type: "click",
        hiddens: []
      },
      7: {
        type: "click",
        hiddens: []
      },
      8: {
        type: "click",
        hiddens: []
      },
      9: {
        type: "click",
        hiddens: []
      },
      10: {
        type: "click",
        hiddens: []
      },
      11: {
        type: "click",
        hiddens: []
      },
      12: {
        type: "click",
        hiddens: []
      },
      13: {
        type: "click",
        hiddens: []
      },
      14: {
        type: "click",
        hiddens: []
      },
      15: {
        type: "click",
        hiddens: []
      },
      16: {
        type: "click",
        hiddens: []
      },
      17: {
        type: "click",
        hiddens: []
      },
      18: {
        type: "period",
        hiddens: ["clear", "abc", "qwe", "Unknown", "-"]
      },
      19: {
        type: "click",
        hiddens: []
      },
      20: {
        type: "click",
        hiddens: []
      },
      21: {
        type: "click",
        hiddens: []
      },
      22: {
        type: "click",
        hiddens: []
      },
      23: {
        type: "click",
        hiddens: []
      },
      24: {
        type: "click",
        hiddens: []
      },
      25: {
        type: "click",
        hiddens: []
      },
      26: {
        type: "click",
        hiddens: []
      },
      27: {
        type: "click",
        hiddens: []
      },
      28: {
        type: "click",
        hiddens: []
      },
      29: {
        type: "click",
        hiddens: []
      },
      30: {
        type: "click",
        hiddens: []
      },
      31: {
        type: "click",
        hiddens: []
      },
      32: {
        type: "click",
        hiddens: []
      },
      33: {
        type: "click",
        hiddens: []
      },
      34: {
        type: "click",
        hiddens: []
      },
      35: {
        type: "click",
        hiddens: []
      },
      36: {
        type: "click",
        hiddens: []
      },
      37: {
        type: "click",
        hiddens: []
      },
      38: {
        type: "click",
        hiddens: []
      },
      39: {
        type: "click",
        hiddens: []
      },
      40: {
        type: "click",
        hiddens: []
      },
      41: {
        type: "click",
        hiddens: []
      },
      42: {
        type: "click",
        hiddens: []
      },
      43: {
        type: "click",
        hiddens: []
      },
      44: {
        type: "click",
        hiddens: []
      },
      45: {
        type: "click",
        hiddens: []
      },
      46: {
        type: "click",
        hiddens: []
      },
      47: {
        type: "click",
        hiddens: []
      },
      48: {
        type: "click",
        hiddens: []
      },
      49: {
        type: "click",
        hiddens: []
      },
      50: {
        type: "click",
        hiddens: []
      },
      51: {
        type: "date",
        hiddens: [],
        minDate: "today",
        maxDate: "today + 1year"
      },
      52: {
        type: "number",
        hiddens: ["clear", "abc", "qwe", "Unknown", "-"]
      },
      53: {
        type: "number",
        hiddens: ["clear", "abc", "qwe", "Unknown", "-"]
      },
      54: {
        type: "number",
        hiddens: ["clear", "abc", "qwe", "Unknown", "-"]
      }
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
        subSubField: "Non-Reactive",
        group: 8
      },
      22: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 1",
        subSubField: "Reactive",
        group: 8
      },
      23: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 2",
        subSubField: "Non-Reactive",
        group: 8
      },
      24: {
        category: "HIV Rapid Test Outcomes",
        field: "First Pass",
        subField: "Test 2",
        subSubField: "Reactive",
        group: 8
      },
      25: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 1",
        subSubField: "Non-Reactive",
        group: 8
      },
      26: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 1",
        subSubField: "Reactive",
        group: 8
      },
      27: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 2",
        subSubField: "Non-Reactive",
        group: 8
      },
      28: {
        category: "HIV Rapid Test Outcomes",
        field: "Immediate Repeat",
        subField: "Test 2",
        subSubField: "Reactive",
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
        field: "Inconclusive",
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
        field: "HTS Family Referral Slips",
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

      <div className="mainContainer">
        <table width="100%">
          <tbody>
            <tr>
              <td>
                <div
                  id="bdScroller"
                  style={{
                    width: "calc(100vw - 200px)",
                    borderRight: "1px solid #333333",
                    height: "calc(100vh - 222px)",
                    overflow: "auto",
                    padding: "0px"
                  }}>
                  <table
                    cellPadding="5px"
                    style={{
                      borderCollapse: "collapse",
                      color: "rgb(51, 51, 51)"
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

                      {Array(2)
                        .fill()
                        .map((_, j) => {

                          return (
                            <tr
                              id={"row" + j}
                              key={"row" + j}
                              style={{
                                border: (j === 1
                                  ? "4px solid orange"
                                  : ""),
                                cursor: "pointer"
                              }}>

                              {Array(56)
                                .fill()
                                .map((_, i) => {

                                  return (
                                    <td
                                      id={"cell" + j + "_" + i}
                                      key={"cell" + j + "_" + i}
                                      className={"bdcell" + ([
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
                                        : "")}
                                      onMouseDown=
                                      {j === 1 ? (this.handleCellClick.bind(this, fieldTypes[i], (fieldNames[i] && fieldNames[i].category ? fieldNames[i].category : null), (fieldNames[i] && fieldNames[i].field ? fieldNames[i].field : null), (fieldNames[i] && fieldNames[i].subField ? fieldNames[i].subField : null), (fieldNames[i] && fieldNames[i].subSubField ? fieldNames[i].subSubField : null), j, i, (fieldNames[i] && fieldNames[i].group ? fieldNames[i].group : null))) : () => { }}>{fields[i]
                                        ? (j === 1
                                          ? <div
                                            id={"circle" + j + "_" + i}
                                            className={fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && fieldNames[i].subSubField && this.state.data[fieldNames[i].category] && this.state.data[fieldNames[i].category][fieldNames[i].field] && this.state.data[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField
                                              ? "circled"
                                              : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.state.data[fieldNames[i].category] === fieldNames[i].field
                                                ? "circled"
                                                : "normal")}>{fields[i]
                                                  ? fields[i]
                                                  : ""}</div>
                                          : (j === 0
                                            ? <div
                                              id={"circle" + j + "_" + i}
                                              className={this.props.previous && fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && ((fieldNames[i].subSubField && this.props.previous[fieldNames[i].category] && this.props.previous[fieldNames[i].category][fieldNames[i].field] && this.props.previous[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField) || (this.props.previous[fieldNames[i].category] === fieldNames[i].field))
                                                ? "circled"
                                                : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.props.previous[fieldNames[i].category] === fieldNames[i].field
                                                  ? "circled"
                                                  : "normal")}>{fields[i]
                                                    ? fields[i]
                                                    : ""}</div>
                                            : <div id={"circle" + j + "_" + i} className="normal">{fields[i]
                                              ? fields[i]
                                              : ""}</div>))
                                        : (j === 0
                                          ? <div
                                            id={"circle" + j + "_" + i}
                                            className={this.props.previous && fieldNames[i] && fieldNames[i].category && fieldNames[i].field && fieldNames[i].subField && ((fieldNames[i].subSubField && this.props.previous[fieldNames[i].category] && this.props.previous[fieldNames[i].category][fieldNames[i].field] && this.props.previous[fieldNames[i].category][fieldNames[i].field][fieldNames[i].subField] === fieldNames[i].subSubField) || (this.props.previous[fieldNames[i].category] === fieldNames[i].field))
                                              ? "circled"
                                              : (fieldNames[i] && fieldNames[i].category && fieldNames[i].field && this.props.previous[fieldNames[i].category] === fieldNames[i].field
                                                ? "circled"
                                                : "normal")}
                                            style={{
                                              color: "#c50000",
                                              fontSize: "16px",
                                              textAlign: "center",
                                              width: (i === 0
                                                ? "150px"
                                                : (i === 51
                                                  ? "120px"
                                                  : ""))
                                            }}>{fields[i]
                                              ? fields[i]
                                              : (i === 0 && this.props.previous && this.props.previous.id
                                                ? this.props.previous.id
                                                : (this.props.previous && fieldNames[i] && this.props.previous[(fieldNames[i].category
                                                  ? fieldNames[i].category
                                                  : "") + (fieldNames[i].field
                                                    ? ":" + fieldNames[i].field
                                                    : "") + (fieldNames[i].subField
                                                      ? ":" + fieldNames[i].subField
                                                      : "")]
                                                  ? this.props.previous[(fieldNames[i].category
                                                    ? fieldNames[i].category
                                                    : "") + (fieldNames[i].field
                                                      ? ":" + fieldNames[i].field
                                                      : "") + (fieldNames[i].subField
                                                        ? ":" + fieldNames[i].subField
                                                        : "")]
                                                  : ""))}</div >
                                          : (j === 1
                                            ? (i === 56
                                              ? <img src={icoSave} height="45" alt="" onMouseDown={() => this.handleSave()} />
                                              : (i === 57
                                                ? < img src={
                                                  icoClose
                                                }
                                                  height="45" alt="" onMouseDown={
                                                    () => this.handleClear()
                                                  } /> : <div
                                                    id={"circle" + j + "_" + i}
                                                    className=
                                                    {(fields[i] ? "normal" : (fieldNames[i] && this.state.label === (fieldNames[i].category ? fieldNames[i].category : "") + (fieldNames[i].field ? ":" + fieldNames[i].field : "") + (fieldNames[i].subField ? ":" + fieldNames[i].subField : "") ? "active" : "inactive"))}
                                                    style=
                                                    {{ color: "#c50000", fontSize: "16px", textAlign: "center", width: (i === 51 ? "120px" : "60px") }}>
                                                  {fields[i]
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
                                                        : ""))}
                                                </div>))
                                            : ""))}</td>
                                  )
                                })}

                            </tr>
                          )

                        })}

                    </tbody>
                  </table>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "180px",
                    height: "calc(100vh - 222px)",
                    overflow: "hidden",
                    padding: "0px"
                  }}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            height: "266px",
                            borderBottom: "1px solid #333333"
                          }}>
                          &nbsp;
              </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            height: "64px",
                            borderBottom: "3px solid orange"
                          }}>
                          &nbsp;
              </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style={{
                            height: "66px",
                            borderBottom: "3px solid orange"
                          }}>
                          <Button
                            label="Save"
                            handleMouseDown={this
                              .handleSave
                              .bind(this)} />
                          <Button
                            label="Delete"
                            handleMouseDown={this
                              .handleClear
                              .bind(this)} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            position: "absolute",
            zIndex: "100",
            textAlign: "center",
            width: "700px",
            bottom: "10px",
            left: "calc(50vw - 350px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "5px",
            border: "1px solid #cccccc"
          }}>
          <Keyboard
            onChangeHandler={this
              .onChangeHandler
              .bind(this)}
            currentString={this.state.currentString}
            configs={this.state.configs}
            options={this.props.options}
            label={this.state.label}
            responses={this.props.responses}
            fieldType={this.state.fieldType}
            smallButtons={true} /></div>
      </div>

    )

  }

}

export default BackdataEntry;
