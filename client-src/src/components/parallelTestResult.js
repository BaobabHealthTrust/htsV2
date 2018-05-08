import React, { Component } from 'react';
import './parallelTestResult.css';
import Button from "./button";

class ParallelTestResult extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group1ActiveButtons: [
        "Non-Reactive", "Reactive"
      ],
      group2ActiveButtons: [
        "Non-Reactive", "Reactive"
      ],
      busy: false
    }

  }

  $(id) {
    return document.getElementById(id);
  }

  async selectResult(e) {

    switch (e.target.id) {

      case "btnNonReactive1":

        await this.setState({ group1ActiveButtons: ["Non-Reactive"] });

        await this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
              ? "Immediate Repeat "
              : "First Pass ") + "Test 1 Result", "Non-Reactive", this.props.group);

        break;

      case "btnReactive1":

        await this.setState({ group1ActiveButtons: ["Reactive"] });

        await this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
              ? "Immediate Repeat "
              : "First Pass ") + "Test 1 Result", "Reactive", this.props.group);

        break;

      case "btnNonReactive2":

        await this.setState({ group2ActiveButtons: ["Non-Reactive"] });

        await this
          .props
          .handleDirectInputChange(((this.props.label || "").match(/^partner/i)
            ? "Partner "
            : "") + (this.props.label.match(/immediate/i)
              ? "Immediate Repeat "
              : "First Pass ") + "Test 2 Result", "Non-Reactive", this.props.group);

        break;

      case "btnReactive2":

        await this.setState({ group2ActiveButtons: ["Reactive"] });

        await this
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

    if ((this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 1 Result") >= 0 && ["Non-Reactive", "Reactive"].indexOf(this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 1 Result"]) >= 0 && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 2 Result") >= 0 && ["Non-Reactive", "Reactive"].indexOf(this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 2 Result"]) >= 0)) {

      await this.props.handleDirectInputChange("Immediate Parallel Repeat Test 1 & 2 Results", this.state.group1ActiveButtons.concat(this.state.group2ActiveButtons).join(","), this.props.group);

    } else if ((this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 1 Result") >= 0 && ["Non-Reactive", "Reactive"].indexOf(this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 1 Result"]) >= 0 && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 2 Result") >= 0 && ["Non-Reactive", "Reactive"].indexOf(this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 2 Result"]) >= 0)) {

      await this.props.handleDirectInputChange("First Pass Parallel Test 1 & 2 Results", this.state.group1ActiveButtons.concat(this.state.group2ActiveButtons).join(","), this.props.group);

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
                            buttonClass={(this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 1 Result") < 0 && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 1 Result") < 0 && this.props.label === "First Pass Parallel Test 1 & 2 Results")
                              ? "blue"
                              : (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 1 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 1 Result"] === "Non-Reactive" && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 1 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 1 Result"] === "Non-Reactive" && this.props.label === "First Pass Parallel Test 1 & 2 Results") ? "depressed" : "blue"}
                            label="Non-Reactive"
                            handleMouseDown={this
                              .selectResult
                              .bind(this)} />
                        </td>
                        <td>
                          <Button
                            id="btnReactive1"
                            buttonClass={(this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 1 Result") < 0 && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 1 Result") < 0 && this.props.label === "First Pass Parallel Test 1 & 2 Results")
                              ? "blue"
                              : (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 1 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 1 Result"] === "Reactive") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 1 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 1 Result"] === "Reactive" && this.props.label === "First Pass Parallel Test 1 & 2 Results") ? "depressed" : "blue"}
                            label="Reactive"
                            handleMouseDown={this
                              .selectResult
                              .bind(this)} />
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
                            buttonClass={(this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 2 Result") < 0 && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 2 Result") < 0 && this.props.label === "First Pass Parallel Test 1 & 2 Results")
                              ? "blue"
                              : (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 2 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 2 Result"] === "Non-Reactive" && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 2 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 2 Result"] === "Non-Reactive" && this.props.label === "First Pass Parallel Test 1 & 2 Results") ? "depressed" : "blue"}
                            label="Non-Reactive"
                            handleMouseDown={this
                              .selectResult
                              .bind(this)} />
                        </td>
                        <td>
                          <Button
                            id="btnReactive2"
                            buttonClass={(this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 2 Result") < 0 && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 2 Result") < 0 && this.props.label === "First Pass Parallel Test 1 & 2 Results")
                              ? "blue"
                              : (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("Immediate Repeat Test 2 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["Immediate Repeat Test 2 Result"] === "Reactive" && this.props.label === "Immediate Parallel Repeat Test 1 & 2 Results") || (this.props.wf && this.props.wf.responses && this.props.activeWorkflow && this.props.wf.responses[this.props.activeWorkflow] && Object.keys(this.props.wf.responses[this.props.activeWorkflow]).indexOf("First Pass Test 2 Result") >= 0 && this.props.wf.responses[this.props.activeWorkflow]["First Pass Test 2 Result"] === "Reactive" && this.props.label === "First Pass Parallel Test 1 & 2 Results") ? "depressed" : "blue"}
                            label="Reactive"
                            handleMouseDown={this
                              .selectResult
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
      </div>
    )

  }

}

export default ParallelTestResult;