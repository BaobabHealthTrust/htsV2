import React, {Component} from 'react';
import './login.css';
import icoCOA from '../images/coa.js';
import Input from './input';
import Keyboard from './keyboard';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      fieldType: "",
      configs: {},
      label: "",
      currentString: "",
      username: "",
      password: ""
    }

  }

  configs = {
    fieldType: "barcode"
  }

  tmrHnd = null

  async onChangeHandler(text) {

    let value = "";

    value = text;

    const newState = this.state;

    newState.currentString = value;

    newState[this.state.label] = value;

    await this.setState(newState);

    await this
      .props
      .handleDirectInputChange(this.state.label, text, this.props.group);

  }

  async onChangeHandlerWS(text) {

    this
      .props
      .handleDirectInputChange(this.props.label, text, this.props.group);

    this
      .props
      .queryOptions(text);

  }

  $(id) {
    return document.getElementById(id);
  }

  componentDidMount() {

    this.tmrHnd = setInterval(() => {

      if (this.$("touchscreenTextInput")) {

        if (this.$("touchscreenTextInput").value.trim().match(/\$$/)) {

          const text = this
            .$("touchscreenTextInput")
            .value
            .trim()
            .replace(/\$/g, "");

          this
            .$("touchscreenTextInput")
            .value = "";

          this.onChangeHandlerWS("");

          if (text.trim().length > 0) {

            this
              .props
              .setLocation(text, this.props.app.accessToken)
              .catch(e => {
                this
                  .props
                  .showErrorMsg("Login Error", "Workstation location not recognized");
              });

          }

        }

        this
          .$("touchscreenTextInput")
          .focus();

      }

      if (this.props.app.activeUser && this.props.app.activeUser !== "") {

        this.setState({label: "", currentString: "", username: "", password: ""})

      }

    }, 200);

  }

  componentWillUnmount() {

    clearInterval(this.tmrHnd);

  }

  render() {

    return (

      <div
        style={{
        width: "calc(100% - 3px)",
        height: "84.7vh",
        textAlign: "center",
        paddingTop: "5vh"
      }}>
        {this.props.app.activeUser && this.props.app.activeUser !== ""
          ? <table
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
                    fontSize: "2em",
                    textAlign: "left",
                    paddingLeft: "20px"
                  }}
                    id="u14HelpText">
                    {this.props.label}
                  </td>
                </tr>
                <tr>
                  <td style={{
                    paddingLeft: "10px"
                  }}>
                    {(this.configs && this.configs[this.props.label] && this.configs[this.props.label].className && this.configs[this.props.label].className === "longSelectList")
                      ? ""
                      : <Input
                        className="touchscreenTextInput"
                        id="touchscreenTextInput"
                        value={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
                        ? this.props.responses[this.props.group][this.props.label]
                        : "")}
                        onChangeHandler={this
                        .onChangeHandlerWS
                        .bind(this)}
                        currentString={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
                        ? this.props.responses[this.props.group][this.props.label]
                        : "")}
                        fieldType={this.props.fieldType}
                        navNext={this.props.navNext}
                        configs={this.configs}
                        options={this.props.options}
                        placeholder={this.configs && this.configs[this.props.label] && this.configs[this.props.label].placeholder
                        ? this.configs && this.configs[this.props.label] && this.configs[this.props.label].placeholder
                        : ""}
                        label={this.props.label}/>}
                  </td>
                </tr>

              </tbody>
            </table>
          : <table style={{
            margin: "auto"
          }} cellPadding="5">
            <tbody>
              <tr>
                <th colSpan="2">
                  <img
                    src={icoCOA}
                    style={{
                    height: "20vh"
                  }}
                    alt="COA"/>
                </th>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                  fontSize: "32px",
                  padding: "20px",
                  fontWeight: "normal"
                }}>
                  Ministry of Health
                </th>
              </tr>
              <tr>
                <td colSpan="2">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  style={{
                  fontSize: "1.8em"
                }}>Username</td>
                <td><Input
                  className={"touchscreenTextInput" + (this.state.label === "username"
            ? " activeField"
            : " size2Border")}
                  value={this.state.username}
                  onMouseDown={() => {
            this.setState({label: "username", currentString: this.state.username})
          }}/></td>
              </tr>
              <tr>
                <td
                  align="right"
                  style={{
                  fontSize: "1.8em"
                }}>Password</td>
                <td><Input
                  className={"touchscreenTextInput" + (this.state.label === "password"
            ? " activeField"
            : " size2Border")}
                  value={this.state.password}
                  onMouseDown={() => {
            this.setState({label: "password", currentString: this.state.password})
          }}
                  fieldType="password"/></td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;
                </td>
              </tr>
            </tbody>
          </table>}

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
          border: "1px solid #cccccc",
          display: (this.state.label !== ""
            ? this.props.app.activeUser && this.props.app.activeUser !== ""
              ? "none"
              : "block"
            : "none")
        }}>
          <Keyboard
            onChangeHandler={this
            .onChangeHandler
            .bind(this)}
            currentString={this.state.currentString}
            configs={{
            username: {
              hiddenButtons: [
                '/', '.', '-', 'Unknown'
              ],
              textCase: "upper",
              fieldType: "dha"
            },
            password: {
              hiddenButtons: [
                '/', '.', '-', 'Unknown'
              ],
              fieldType: "password",
              textCase: "lower"
            }
          }}
            label={this.state.label}
            fieldType={this.state.label === "password"
            ? "password"
            : "dha"}/>
        </div>
      </div>

    )

  }

}

export default Login;