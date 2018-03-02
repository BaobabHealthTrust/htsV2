import React, {Component} from 'react';
import './entryCode.css';
import Input from './input';
import Keyboard from './keyboard';
import {setTimeout} from 'timers';

class EntryCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentString: "",
      label: "number",
      number: "",
      check: ""
    }

  }

  $(id) {

    return document.getElementById(id);

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

      return false;

    }

  }

  async onChangeHandler(text) {

    let value = "";

    if (this.state.label === "check") {

      value = (String(text).trim().match(/\d$/g)
        ? String(text).trim().match(/\d$/g)[0]
        : text);

    } else {

      value = text;

    }

    const newState = this.state;

    newState.currentString = value;

    newState[this.state.label] = value;

    this.setState(newState);

    let valid = this.checkDigit(this.state.number, this.state.check);

    if (this.$("btnNext")) {

      if (valid) {

        await this
          .props
          .handleDirectInputChange(this.props.label, ("EC" + this.state.number + "-" + this.state.check), this.props.group);

        this
          .$("btnNext")
          .className = "green nav-buttons";

      } else {

        this
          .$("btnNext")
          .className = "gray nav-buttons";

      }

    }

  }

  componentDidMount() {

    if (!this.$("btnNext")) {

      setTimeout(() => {
        this
          .$("btnNext")
          .className = "gray nav-buttons";

      }, 1000);

    } else {

      this
        .$("btnNext")
        .className = "gray nav-buttons";

    }

    if (this.$("btnClear")) {

      this
        .$("btnClear")
        .style
        .display = "none";

    }

    this
      .props
      .updateApp({sectionHeader: "Find Entered Record"});

  }

  render() {

    return (
      <div>
        <table style={{
          width: "100%"
        }}>
          <tbody>
            <tr>
              <td
                style={{
                fontSize: "2em",
                padding: "10px"
              }}>
                {this.props.label}
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                  width: "100%",
                  height: "calc(100vh - 500px)"
                }}>
                  <table
                    cellPadding="5"
                    style={{
                    margin: "auto"
                  }}>
                    <tbody>
                      <tr>
                        <td>
                          &nbsp;
                        </td>
                        <th>
                          Code Number
                        </th>
                        <td>
                          &nbsp;
                        </td>
                        <th>
                          Check Digit
                        </th>
                      </tr>
                      <tr>
                        <td
                          style={{
                          fontSize: "2em"
                        }}
                          align="right">
                          EC
                        </td>
                        <td align="center">
                          <Input
                            className={"touchscreenTextInput field1" + (this.state.label === "number"
                            ? " activeField"
                            : "")}
                            value={this.state.number}
                            onMouseDown={() => {
                            this.setState({label: "number", currentString: this.state.number})
                          }}/>
                        </td>
                        <th
                          style={{
                          fontSize: "2.1em"
                        }}>
                          -
                        </th>
                        <td align="center">
                          <Input
                            className={"touchscreenTextInput field2" + (this.state.label === "check"
                            ? " activeField"
                            : "")}
                            value={this.state.check}
                            onMouseDown={() => {
                            this.setState({label: "check", currentString: this.state.check})
                          }}/>
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
          width: "210px",
          bottom: "10px",
          left: "calc(50vw - 105px)",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "5px",
          border: "1px solid #cccccc"
        }}>
          <Keyboard
            onChangeHandler={this
            .onChangeHandler
            .bind(this)}
            currentString={this.state.currentString}
            configs={{
            number: {
              hiddenButtons: [
                '/',
                '.',
                '-',
                'abc',
                'qwe',
                'Unknown'
              ]
            },
            check: {
              hiddenButtons: [
                '/',
                '.',
                '-',
                'abc',
                'qwe',
                'Unknown'
              ]
            }
          }}
            label={this.state.label}
            fieldType="number"/></div>
      </div>
    )

  }

}

export default EntryCode;