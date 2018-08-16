import React, { Component } from 'react';
import './dialog.css';
import Button from './button';
import Input from './input';

class Dialog extends Component {

  closePopup() {

    this
      .props
      .close()

  }

  render() {

    return (

      <div
        className="dialogShield"
        style={{
          display: (this.props.dialog && this.props.dialog.title
            ? "block"
            : "none")
        }}>
        <div className="dialogPopup">
          <table>
            <tbody>
              <tr>
                <th
                  style={{
                    padding: "5px",
                    color: "white",
                    backgroundColor: "#345cb4",
                    border: "2px outset #345cb4",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    fontSize: "18px"
                  }}>
                  {this.props.dialog.title
                    ? this.props.dialog.title
                    : "Title"}
                </th>
              </tr>
              <tr>
                <td>
                  <div className="dialogContent">
                    <table style={{
                      margin: "auto"
                    }}>
                      <tbody>
                        <tr>
                          <th>
                            {this.props.app.activeReport !== "daily register"
                              ? "Start Month"
                              : "Reporting Month"}
                          </th>
                          {this.props.app.activeReport !== "daily register"
                            ? <th>
                              End Month
                              </th>
                            : <td></td>}
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="100%"
                              style={{
                                margin: "auto"
                              }}>
                              <tbody>
                                <tr>
                                  <th>
                                    Month
                                  </th>
                                  <th>
                                    Year
                                  </th>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style={{
                                      padding: "10px"
                                    }}
                                    onMouseDown={() => {
                                      this
                                        .props
                                        .incrementReportMonth("start")
                                    }}>
                                    <div className="arrow-up" />
                                  </td>
                                  <td
                                    align="center"
                                    style={{
                                      padding: "10px"
                                    }}
                                    onMouseDown={() => {
                                      this
                                        .props
                                        .incrementReportYear("start")
                                    }}>
                                    <div className="arrow-up" />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Input
                                      className="dialogText"
                                      readOnly={true}
                                      value={this.props.dialog.start.reportMonth} />
                                  </td>
                                  <td>
                                    <Input
                                      className="dialogText"
                                      readOnly={true}
                                      value={this.props.dialog.start.reportYear} />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style={{
                                      padding: "10px"
                                    }}
                                    onMouseDown={() => {
                                      this
                                        .props
                                        .decrementReportMonth("start")
                                    }}>
                                    <div className="arrow-down" />
                                  </td>
                                  <td
                                    align="center"
                                    style={{
                                      padding: "10px"
                                    }}
                                    onMouseDown={() => {
                                      this
                                        .props
                                        .decrementReportYear("start")
                                    }}>
                                    <div className="arrow-down" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          {this.props.app.activeReport !== "daily register"
                            ? <td
                              style={{
                                borderLeft: "2px outset #cccccc"
                              }}>
                              <table
                                width="100%"
                                style={{
                                  margin: "auto"
                                }}>
                                <tbody>
                                  <tr>
                                    <th>
                                      Month
                                      </th>
                                    <th>
                                      Year
                                      </th>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .incrementReportMonth("end")
                                      }}>
                                      <div className="arrow-up" />
                                    </td>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .incrementReportYear("end")
                                      }}>
                                      <div className="arrow-up" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <Input
                                        className="dialogText"
                                        readOnly={true}
                                        value={this.props.dialog.end.reportMonth} />
                                    </td>
                                    <td>
                                      <Input
                                        className="dialogText"
                                        readOnly={true}
                                        value={this.props.dialog.end.reportYear} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .decrementReportMonth("end")
                                      }}>
                                      <div className="arrow-down" />
                                    </td>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .decrementReportYear("end")
                                      }}>
                                      <div className="arrow-down" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            : <td></td>}
                        </tr>
                        {this.props.app.activeReport === "daily register" || this.props.app.activeReport === "monthly report"
                          ? <tr>
                            <td
                              align="center"
                              colSpan={this.props.app.activeReport === "monthly report"
                                ? 2
                                : 1}>
                              <table
                                width="100%"
                                style={{
                                  margin: "auto"
                                }}>
                                <tbody>
                                  <tr>
                                    <th>
                                      Location
                                      </th>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .scrollLocationUp();
                                      }}>
                                      <div className="arrow-up" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <Input
                                        className="dialogText"
                                        readOnly={true}
                                        value={this.props.dialog.location || ""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .scrollLocationDown();
                                      }}>
                                      <div className="arrow-down" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          : <tr>
                            <td></td>
                          </tr>}
                        {this.props.app.activeReport === "daily register"
                          ? <tr>
                            <td align="center">
                              <table
                                width="100%"
                                style={{
                                  margin: "auto"
                                }}>
                                <tbody>
                                  <tr>
                                    <th>
                                      Test
                                      </th>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .scrollTestUp();
                                      }}>
                                      <div className="arrow-up" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <Input className="dialogText" readOnly={true} value={this.props.dialog.test || ""} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style={{
                                        padding: "10px"
                                      }}
                                      onMouseDown={() => {
                                        this
                                          .props
                                          .scrollTestDown();
                                      }}>
                                      <div className="arrow-down" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          : <tr>
                            <td></td>
                          </tr>}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style={{
                  padding: "5px"
                }}>
                  <Button
                    label="Cancel"
                    extraStyles={{
                      width: "100px"
                    }}
                    buttonClass="red"
                    handleMouseDown={() => {
                      this.closePopup()
                    }} />
                  <Button
                    label="Set"
                    extraStyles={{
                      width: "100px"
                    }}
                    handleMouseDown={() => {
                      this
                        .props
                        .setReportingPeriod();
                      this.closePopup()
                    }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    )

  }

}

export default Dialog;