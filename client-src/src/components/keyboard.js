import React, { Component } from 'react';
import './keyboard.css';
import Button from './button';
import Input from './input';

class Keyboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      abc: [
        [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j"
        ],
        [
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s"
        ],
        [
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "-",
          "cap"
        ],
        [
          "del",
          "clear",
          ":",
          ".",
          "/",
          "space",
          "num",
          "qwe"
        ]
      ],
      qwe: [
        [
          "q",
          "w",
          "e",
          "r",
          "t",
          "y",
          "u",
          "i",
          "o",
          "p"
        ],
        [
          "a",
          "s",
          "d",
          "f",
          "g",
          "h",
          "j",
          "k",
          "l"
        ],
        [
          "z",
          "x",
          "c",
          "v",
          "b",
          "n",
          "m",
          "-",
          "cap"
        ],
        [
          "del",
          "clear",
          ":",
          ".",
          "/",
          "space",
          "num",
          "abc"
        ]
      ],
      num: [
        [
          "7", "8", "9"
        ],
        [
          "4", "5", "6"
        ],
        [
          "1", "2", "3"
        ],
        [
          "del",
          "clear",
          "/",
          ".",
          "0",
          "-",
          "abc",
          "qwe",
          "Unknown"
        ]
      ],
      days: [
        [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7"
        ],
        [
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14"
        ],
        [
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21"
        ],
        [
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28"
        ],
        ["29", "30", "31", "Unknown"]
      ],
      period: [
        [
          "7", "8", "9"
        ],
        [
          "4", "5", "6"
        ],
        [
          "1", "2", "3"
        ],
        [
          "del",
          "clear",
          "0",
          "day",
          "week",
          "month",
          "year",
          "Unknown"
        ]
      ],
      dha: [
        [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9"
        ],
        [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "J",
          "K"
        ],
        [
          "L",
          "M",
          "N",
          "P",
          "R",
          "T",
          "V",
          "W",
          "X",
          "Y"
        ],
        [
          "del", "clear"
        ]
      ],
      date: true,
      capsLocked: true,
      activeKeyboard: "",
      clickedButton: null,
      currentDate: (new Date()).getTime(),
      currentFieldType: "",
      activeFieldType: "",
      currentLabel: "",
      busy: false
    }

  };

  selectKeyboard(fieldType) {

    let keyboardType = "qwe";

    switch (fieldType) {

      case "number":

        keyboardType = "num";

        break;

      case "dha":

        keyboardType = "dha";

        break;

      case "period":

        keyboardType = "period";

        break;

      case "date":

        keyboardType = "date";

        break;

      case "select":

        keyboardType = "";

        break;

      case "days":

        keyboardType = "days";

        break;

      case "calendar":

        keyboardType = "calendar";

        break;

      case "password":
      case "text":
      case "textarea":

        keyboardType = "qwe";

        break;

      default:

        keyboardType = "";

        break;

    }

    const newState = this.state;

    newState.activeKeyboard = keyboardType;

    newState.activeFieldType = fieldType;

    this.setState(newState);

  }

  monthsLong = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  }

  months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
  }

  async incrementDate() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let tomorrow = (new Date(this.state.currentDate)).setDate(today.getDate() + 1);

    tomorrow = (new Date(tomorrow)).setHours(0, 0, 0, );

    let maxDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].maxDate) {

      let actualMaxdate = "";

      if (String(this.props.configs[this.props.label].maxDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMaxdate = this.props.configs[this.props.label].maxDate;

      } else {

        if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today$/i)) {

          actualMaxdate = (new Date());

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        }

      }

      maxDate = (new Date(actualMaxdate)).setHours(0, 0, 0, );

      maxDate = (new Date(maxDate)).setDate((new Date(maxDate)).getDate() + 1)

    }

    if ((maxDate && tomorrow <= maxDate) || !maxDate) {

      await this.setState({ currentDate: tomorrow })

      currentString = (new Date(tomorrow)).getDate() + " " + this.months[(new Date(tomorrow)).getMonth()] + " " + (new Date(tomorrow)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  async incrementMonth() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let tomorrow = (new Date(this.state.currentDate)).setMonth(today.getMonth() + 1);

    tomorrow = (new Date(tomorrow)).setHours(0, 0, 0, );

    let maxDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].maxDate) {

      let actualMaxdate = "";

      if (String(this.props.configs[this.props.label].maxDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMaxdate = this.props.configs[this.props.label].maxDate;

      } else {

        if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today$/i)) {

          actualMaxdate = (new Date());

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        }

      }

      maxDate = (new Date(actualMaxdate)).setHours(0, 0, 0, );

      maxDate = (new Date(maxDate)).setDate((new Date(maxDate)).getDate() + 1)

    }

    if ((maxDate && tomorrow <= maxDate) || !maxDate) {

      await this.setState({ currentDate: tomorrow })

      currentString = (new Date(tomorrow)).getDate() + " " + this.months[(new Date(tomorrow)).getMonth()] + " " + (new Date(tomorrow)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  async incrementYear() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let tomorrow = (new Date(this.state.currentDate)).setYear(today.getFullYear() + 1);

    tomorrow = (new Date(tomorrow)).setHours(0, 0, 0, );

    let maxDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].maxDate) {

      let actualMaxdate = "";

      if (String(this.props.configs[this.props.label].maxDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMaxdate = this.props.configs[this.props.label].maxDate;

      } else {

        if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today$/i)) {

          actualMaxdate = (new Date());

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].maxDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].maxDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMaxdate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMaxdate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMaxdate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        }

      }

      maxDate = (new Date(actualMaxdate)).setHours(0, 0, 0, );

      maxDate = (new Date(maxDate)).setDate((new Date(maxDate)).getDate() + 1)

    }

    if ((maxDate && tomorrow <= maxDate) || !maxDate) {

      await this.setState({ currentDate: tomorrow })

      currentString = (new Date(tomorrow)).getDate() + " " + this.months[(new Date(tomorrow)).getMonth()] + " " + (new Date(tomorrow)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  async decrementDate() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let yesterday = (new Date(this.state.currentDate)).setDate(today.getDate() - 1);

    yesterday = (new Date(yesterday)).setHours(0, 0, 0, );

    let minDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].minDate) {

      let actualMinDate = "";

      if (String(this.props.configs[this.props.label].minDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMinDate = this.props.configs[this.props.label].minDate;

      } else {

        if (String(this.props.configs[this.props.label].minDate).trim().match(/^today$/i)) {

          actualMinDate = (new Date());

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        }

      }

      minDate = (new Date(actualMinDate)).setHours(0, 0, 0, );

      minDate = (new Date(minDate)).setDate((new Date(minDate)).getDate())

    }

    if ((minDate && yesterday >= minDate) || !minDate) {

      await this.setState({ currentDate: yesterday })

      currentString = (new Date(yesterday)).getDate() + " " + this.months[(new Date(yesterday)).getMonth()] + " " + (new Date(yesterday)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  async decrementMonth() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let yesterday = (new Date(this.state.currentDate)).setMonth(today.getMonth() - 1);

    yesterday = (new Date(yesterday)).setHours(0, 0, 0, );

    let minDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].minDate) {

      let actualMinDate = "";

      if (String(this.props.configs[this.props.label].minDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMinDate = this.props.configs[this.props.label].minDate;

      } else {

        if (String(this.props.configs[this.props.label].minDate).trim().match(/^today$/i)) {

          actualMinDate = (new Date());

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        }

      }

      minDate = (new Date(actualMinDate)).setHours(0, 0, 0, );

      minDate = (new Date(minDate)).setDate((new Date(minDate)).getDate())

    }

    if ((minDate && yesterday >= minDate) || !minDate) {

      await this.setState({ currentDate: yesterday })

      currentString = (new Date(yesterday)).getDate() + " " + this.months[(new Date(yesterday)).getMonth()] + " " + (new Date(yesterday)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  async decrementYear() {

    let currentString = this.props.currentString;

    const today = (new Date(this.state.currentDate));

    let yesterday = (new Date(this.state.currentDate)).setYear(today.getFullYear() - 1);

    yesterday = (new Date(yesterday)).setHours(0, 0, 0, );

    let minDate;

    if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].minDate) {

      let actualMinDate = "";

      if (String(this.props.configs[this.props.label].minDate).trim().match(/^\d{4}-\d{2}-\d{2}$/)) {

        actualMinDate = this.props.configs[this.props.label].minDate;

      } else {

        if (String(this.props.configs[this.props.label].minDate).trim().match(/^today$/i)) {

          actualMinDate = (new Date());

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s-\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s-\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() - parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() - parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() - parseInt(parts[1], 10));

              break;

          }

        } else if (String(this.props.configs[this.props.label].minDate).trim().match(/^today\s\+\s(\d+)(year|month|week|day)$/i)) {

          let parts = String(this.props.configs[this.props.label].minDate)
            .trim()
            .match(/^today\s\+\s(\d+)(year|month|week|day)$/i)

          switch (String(parts[2]).trim().toLowerCase()) {

            case "year":

              actualMinDate = (new Date(new Date())).setYear((new Date()).getFullYear() + parseInt(parts[1], 10));

              break;

            case "month":

              actualMinDate = (new Date(new Date())).setMonth((new Date()).getMonth() + parseInt(parts[1], 10));

              break;

            case "week":

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + (7 * parseInt(parts[1], 10)));

              break;

            default:

              actualMinDate = (new Date((new Date()))).setDate((new Date()).getDate() + parseInt(parts[1], 10));

              break;

          }

        }

      }

      minDate = (new Date(actualMinDate)).setHours(0, 0, 0, );

      minDate = (new Date(minDate)).setDate((new Date(minDate)).getDate())

    }

    if ((minDate && yesterday >= minDate) || !minDate) {

      await this.setState({ currentDate: yesterday })

      currentString = (new Date(yesterday)).getDate() + " " + this.months[(new Date(yesterday)).getMonth()] + " " + (new Date(yesterday)).getFullYear();

    } else {

      await this.setState({ currentDate: today })

      currentString = (new Date(today)).getDate() + " " + this.months[(new Date(today)).getMonth()] + " " + (new Date(today)).getFullYear();

    }

    await this
      .props
      .onChangeHandler(currentString);

  }

  renderDate() {

    const months = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec"
    };

    return (
      <div style={{
        width: "333px",
        margin: "auto"
      }}>
        <table>
          <tbody>
            <tr>
              <td>
                <Button
                  label="+"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .incrementDate
                    .bind(this)}
                  id="btnAddDate" />
              </td>
              <td>
                <Button
                  label="+"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .incrementMonth
                    .bind(this)}
                  id="btnAddMonth" />
              </td>
              <td>
                <Button
                  label="+"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .incrementYear
                    .bind(this)}
                  id="btnAddYear" />
              </td>
            </tr>
            <tr>
              <td>
                <Input
                  className="dateField"
                  id="txtDateDate"
                  readOnly={true}
                  value={(new Date(this.props.currentString)).getDate() || ""} />
              </td>
              <td>
                <Input
                  className="dateField"
                  id="txtDateMonth"
                  readOnly={true}
                  value={months[(new Date(this.props.currentString)).getMonth()] || ""} />
              </td>
              <td>
                <Input
                  className="dateField"
                  id="txtDateYear"
                  readOnly={true}
                  value={(new Date(this.props.currentString)).getFullYear() || ""} />
              </td>
            </tr>
            <tr>
              <td>
                <Button
                  label="-"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .decrementDate
                    .bind(this)}
                  id="btnSubDate" />
              </td>
              <td>
                <Button
                  label="-"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .decrementMonth
                    .bind(this)}
                  id="btnSubMonth" />
              </td>
              <td>
                <Button
                  label="-"
                  buttonClass="dateButton"
                  handleMouseDown={this
                    .decrementYear
                    .bind(this)}
                  id="btnSubYear" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )

  }

  async componentDidUpdate() {

    if (this.state.currentLabel !== this.props.label) {

      await this.setState({
        currentLabel: this.props.label,
        capsLocked: true
      })

    }

  }

  renderKeyboard(keyboardType) {

    if (!this.state[keyboardType])
      return;

    if (keyboardType === "date") {

      return this.renderDate();

    }

    let i = 0;

    const monthLimits = {
      "January": 31,
      "February": 29,
      "March": 31,
      "April": 30,
      "May": 31,
      "June": 30,
      "July": 31,
      "August": 31,
      "September": 30,
      "October": 31,
      "November": 30,
      "December": 31
    }

    const yearField = (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].yearField
      ? this.props.configs[this.props.label].yearField
      : null);

    const monthField = (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].monthField
      ? this.props.configs[this.props.label].monthField
      : null);

    if (yearField != null) {

      try {

        const year = parseInt(this.props.responses[yearField], 10);

        monthLimits["February"] = ((year % 4 === 0 && year % 100 > 0) || (year % 4 === 0 && year % 100 === 0 && year % 400 === 0)
          ? 29
          : 28);

      } catch (e) { }

    }

    return this
      .state[keyboardType]
      .map(row => {

        i++;

        return (
          <div id={"row_" + i} key={"row_" + i}>
            {row.map(key => {

              if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "upper") {

                return ((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].hiddenButtons && this.props.configs[this.props.label].hiddenButtons.indexOf(key) >= 0) || (keyboardType === "days" && monthLimits[this.props.responses[monthField]] && !isNaN(key) && parseInt(key, 10) > monthLimits[this.props.responses[monthField]])
                  ? ""
                  : <Button
                    id={keyboardType + "_" + key}
                    key={keyboardType + "_" + key}
                    buttonClass={"blue" + (this.props.smallButtons ? " small" : "")}
                    label={(key.length === 1)
                      ? String(key).toUpperCase()
                      : (key === "cap"
                        ? key.toUpperCase()
                        : key)}
                    handleMouseDown={this
                      .handleOnMouseDown
                      .bind(this, key)} />)

              } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "lower") {

                return ((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].hiddenButtons && this.props.configs[this.props.label].hiddenButtons.indexOf(key) >= 0) || (keyboardType === "days" && monthLimits[this.props.responses[monthField]] && !isNaN(key) && parseInt(key, 10) > monthLimits[this.props.responses[monthField]])
                  ? ""
                  : <Button
                    id={keyboardType + "_" + key}
                    key={keyboardType + "_" + key}
                    buttonClass={"blue" + (this.props.smallButtons ? " small" : "")}
                    label={(key.length === 1)
                      ? String(key).toLowerCase()
                      : (key === "cap"
                        ? key.toUpperCase()
                        : key)}
                    handleMouseDown={this
                      .handleOnMouseDown
                      .bind(this, key)} />)

              } else {

                return ((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].hiddenButtons && this.props.configs[this.props.label].hiddenButtons.indexOf(key) >= 0) || (keyboardType === "days" && monthLimits[this.props.responses[monthField]] && !isNaN(key) && parseInt(key, 10) > monthLimits[this.props.responses[monthField]])
                  ? ""
                  : <Button
                    id={keyboardType + "_" + key}
                    key={keyboardType + "_" + key}
                    buttonClass={"blue" + (this.props.smallButtons ? " small" : "")}
                    label={this.state.capsLocked && (key.length === 1)
                      ? String(key).toUpperCase()
                      : (key === "cap" && !this.state.capsLocked
                        ? key.toLowerCase()
                        : key)}
                    handleMouseDown={this
                      .handleOnMouseDown
                      .bind(this, key)} />)

              }
            })}
          </div>
        )

      })

  }

  handleOnMouseDown = (text, keyboardType, e) => {

    // eslint-disable-next-line
    let currentString = this.props.currentString;

    this.setState({ clickedButton: null });

    switch (String(text).toLowerCase()) {

      case "abc":

        this.setState({ activeKeyboard: "abc" });

        break;

      case "qwe":

        this.setState({ activeKeyboard: "qwe" });

        break;

      case "num":

        this.setState({ activeKeyboard: "num" });

        break;

      case "period":

        this.setState({ activeKeyboard: "period" });

        break;

      case "cap":

        if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "upper") {

          this.setState({ capsLocked: true });

        } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "lower") {

          this.setState({ capsLocked: false });

        } else {

          this.setState({
            capsLocked: !this.state.capsLocked
          });

        }

        break;

      case "space":

        currentString = String(currentString + " ").replace(/^\s+/, "");

        break;

      case "del":

        currentString = (currentString.match(/unknown/i)
          ? ""
          : currentString.substring(0, (currentString.length - 1)));

        break;

      case "month":

        currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
          ? "Unknown"
          : currentString.replace(/D|W|Y$/i, "") + "M");

        break;

      case "year":

        currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
          ? "Unknown"
          : currentString.replace(/D|W|M$/i, "") + "Y");

        break;

      case "week":

        currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
          ? "Unknown"
          : currentString.replace(/D|M|Y$/i, "") + "W");

        break;

      case "day":

        currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
          ? "Unknown"
          : currentString.replace(/W|M|Y$/i, "") + "D");

        break;

      case "clear":

        currentString = "";

        this.setState({ capsLocked: true });

        break;

      case "Unknown":

        currentString = "Unknown";

        break;

      default:

        this.setState({ clickedButton: text, capsLocked: false });

        if (currentString.match(/unknown/i) || text.match(/unknown/i)) {

          currentString = "Unknown";

        } else if (this.state.activeKeyboard === "days") {

          currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
            ? "Unknown"
            : text);

        } else if (this.state.activeKeyboard === "period") {

          const parts = currentString.match(/([D|W|M|Y])$/i);

          if (parts) {

            const suffix = parts[1];

            currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
              ? "Unknown"
              : currentString.replace(/([D|W|M|Y])$/i, text) + suffix);

          } else {

            currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
              ? "Unknown"
              : currentString + text);

          }

        } else {

          if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "upper") {

            currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
              ? "Unknown"
              : (keyboardType === "days"
                ? text
                : currentString + String(text).toUpperCase()));

          } else if (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].textCase && this.props.configs[this.props.label].textCase.toLowerCase() === "lower") {

            currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
              ? "Unknown"
              : (keyboardType === "days"
                ? text
                : currentString + String(text).toLowerCase()));

          } else {

            currentString = (currentString.match(/unknown/i) || text.match(/unknown/i)
              ? "Unknown"
              : (keyboardType === "days"
                ? text
                : (currentString + (this.state.capsLocked
                  ? String(text).toUpperCase()
                  : text))));

          }

        }

        break;
    }

    this
      .props
      .onChangeHandler(currentString);

  }

  render() {

    return (

      <div>
        {this.props.fieldType === this.state.currentFieldType
          ? this.renderKeyboard(this.state.currentFieldType)
          : (this.state.activeKeyboard !== "" && this.props.fieldType === this.state.activeFieldType
            ? this.renderKeyboard(this.state.activeKeyboard)
            : this.selectKeyboard(this.props.fieldType))}
      </div>

    )

  }

}

export default Keyboard;