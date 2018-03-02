import React, {Component} from 'react';
import './singleTestResult.css';
import Button from "./button";

class SingleTestResult extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeButtons: ["Non-Reactive", "Reactive"]
    }

  }

  $(id) {
    return document.getElementById(id);
  }

  selectResult(e) {

    switch (e.target.innerHTML) {

      case "Non-Reactive":

        this.setState({activeButtons: ["Non-Reactive"]});

        break;

      case "Reactive":

        this.setState({activeButtons: ["Reactive"]});

        break;

      default:

        break;

    }

    this
      .props
      .handleDirectInputChange(this.props.label, e.target.innerHTML, this.props.group);

  }

  componentDidUpdate() {

    if (this.props.responses[this.props.label] !== undefined && this.props.responses[this.props.label].trim().length <= 0 && this.state.activeButtons.length < 2) {

      return this.setState({
        activeButtons: ["Non-Reactive", "Reactive"]
      });

    }

  }

  render() {

    return (
      <div>
        <table width="100%" cellPadding="10">
          <tbody>
            <tr>
              <td
                style={{
                fontSize: "2em"
              }}
                align="left"
                id="lblResult">
                {this.props.label}
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                  verticalAlign: "middle",
                  width: "100%",
                  height: "calc(100vh - 350px)"
                }}>
                  <table
                    style={{
                    margin: "auto",
                    marginTop: "calc(20vh)"
                  }}>
                    <tbody>
                      <tr style={{
                        fontSize: "1.2em"
                      }}>
                        <td align="right">
                          {this.props.test}
                        </td>
                        <td>
                          -
                        </td>
                        <td
                          style={{
                          color: "green"
                        }}>
                          {this.props.duration}
                        </td>
                        <td>
                          <Button
                            id="btnNonReactive"
                            buttonClass={this
                            .state
                            .activeButtons
                            .indexOf("Non-Reactive") >= 0
                            ? (this.state.activeButtons.length > 1
                              ? "blue"
                              : "depressed")
                            : "gray"}
                            label="Non-Reactive"
                            handleMouseDown={this
                            .selectResult
                            .bind(this)}/>
                        </td>
                        <td>
                          <Button
                            id="btnReactive"
                            buttonClass={this
                            .state
                            .activeButtons
                            .indexOf("Reactive") >= 0
                            ? (this.state.activeButtons.length > 1
                              ? "blue"
                              : "depressed")
                            : "gray"}
                            label="Reactive"
                            handleMouseDown={this
                            .selectResult
                            .bind(this)}/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )

  }

}

export default SingleTestResult;