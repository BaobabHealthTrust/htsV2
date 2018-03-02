import React, {Component} from 'react';
import './parallelTestResult.css';
import Button from "./button";

class ParallelTestResult extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group1ActiveButtons: [
        "Non-Reactive", "Reactive"
      ],
      group2ActiveButtons: ["Non-Reactive", "Reactive"]
    }

  }

  $(id) {
    return document.getElementById(id);
  }

  selectResult(e) {

    switch (e.target.id) {

      case "btnNonReactive1":

        this.setState({group1ActiveButtons: ["Non-Reactive"]});

        this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
            ? "Immediate Repeat "
            : "First Pass ") + "Test 1 Result", "Non-Reactive", this.props.group);

        break;

      case "btnReactive1":

        this.setState({group1ActiveButtons: ["Reactive"]});

        this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
            ? "Immediate Repeat "
            : "First Pass ") + "Test 1 Result", "Reactive", this.props.group);

        break;

      case "btnNonReactive2":

        this.setState({group2ActiveButtons: ["Non-Reactive"]});

        this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
            ? "Immediate Repeat "
            : "First Pass ") + "Test 2 Result", "Non-Reactive", this.props.group);

        break;

      case "btnReactive2":

        this.setState({group2ActiveButtons: ["Reactive"]});

        this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
            ? "Immediate Repeat "
            : "First Pass ") + "Test 2 Result", "Reactive", this.props.group);

        break;

      default:

        break;

    }

  }

  componentDidUpdate() {

    if (this.props.responses[(this.props.label.match(/immediate/i)
        ? ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "Immediate Repeat "
        : ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "First Pass ") + "Test 1 Result"] !== undefined && this.props.responses[(this.props.label.match(/immediate/i)
        ? ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "Immediate Repeat "
        : ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "First Pass ") + "Test 1 Result"].trim().length <= 0 && this.state.activeButtons.length < 2) {

      return this.setState({
        group1ActiveButtons: ["Non-Reactive", "Reactive"]
      });

    }

    if (this.props.responses[((this.props.label || "").match(/^partner/i)
        ? "Partner "
        : "") + (this.props.label.match(/immediate/i)
        ? ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "Immediate Repeat "
        : ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "First Pass ") + "Test 2 Result"] !== undefined && this.props.responses[(this.props.label.match(/immediate/i)
        ? ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "Immediate Repeat "
        : ((this.props.label || "").match(/^partner/i)
          ? "Partner "
          : "") + "First Pass ") + "Test 2 Result"].trim().length <= 0 && this.state.activeButtons.length < 2) {

      return this.setState({
        group2ActiveButtons: ["Non-Reactive", "Reactive"]
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
                    marginTop: "calc(10vh)"
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
                            id="btnNonReactive1"
                            buttonClass={this
                            .state
                            .group1ActiveButtons
                            .indexOf("Non-Reactive") >= 0
                            ? (this.state.group1ActiveButtons.length > 1
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
                            id="btnReactive1"
                            buttonClass={this
                            .state
                            .group1ActiveButtons
                            .indexOf("Reactive") >= 0
                            ? (this.state.group1ActiveButtons.length > 1
                              ? "blue"
                              : "depressed")
                            : "gray"}
                            label="Reactive"
                            handleMouseDown={this
                            .selectResult
                            .bind(this)}/>
                        </td>
                      </tr>
                      <tr style={{
                        fontSize: "1.2em"
                      }}>
                        <td align="right">
                          {this.props.test2}
                        </td>
                        <td>
                          -
                        </td>
                        <td
                          style={{
                          color: "green"
                        }}>
                          {this.props.duration2}
                        </td>
                        <td>
                          <Button
                            id="btnNonReactive2"
                            buttonClass={this
                            .state
                            .group2ActiveButtons
                            .indexOf("Non-Reactive") >= 0
                            ? (this.state.group2ActiveButtons.length > 1
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
                            id="btnReactive2"
                            buttonClass={this
                            .state
                            .group2ActiveButtons
                            .indexOf("Reactive") >= 0
                            ? (this.state.group2ActiveButtons.length > 1
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

export default ParallelTestResult;