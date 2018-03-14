import React, { Component } from 'react';
import './alert.css';
import Button from './button';

class Alert extends Component {

  closePopup() {

    this
      .props
      .close()

  }

  render() {

    return (

      <div
        className="shield"
        style={{
          display: (this.props.alerts && this.props.alerts.title
            ? "block"
            : "none")
        }}>
        <div className="popup">
          <table>
            <tbody>
              <tr>
                <th
                  style={{
                    padding: "5px",
                    color: "white",
                    backgroundColor: (this.props.alerts.info
                      ? "#345cb4"
                      : "#c50000"),
                    border: "2px outset " + (this.props.alerts.info
                      ? "#345cb4"
                      : "#c50000"),
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    fontSize: "18px"
                  }}
                  id="alertTitle">
                  {this.props.alerts.title
                    ? this.props.alerts.title
                    : "Title"}
                </th>
              </tr>
              <tr>
                <td>
                  <div className="alertContent" id="alertContent">{(this.props.alerts.msg || '').split('\n').map(i => { return <span>{i}<br />
                  </span> })}</div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  {this.props.alerts.label
                    ? <div>
                      <Button
                        label="Cancel"
                        extraStyles={{
                          width: "100px"
                        }}
                        buttonClass="red"
                        handleMouseDown={() => {
                          this.closePopup()
                        }}
                        id="btnAlertCancel" />
                      <Button
                        label={this.props.alerts.label
                          ? this.props.alerts.label
                          : "OK"}
                        extraStyles={{
                          width: "100px"
                        }}
                        handleMouseDown={() => {
                          this
                            .props
                            .alerts
                            .action();
                          this.closePopup()
                        }}
                        id="btnAlertOK" />
                    </div>
                    : <Button
                      label="OK"
                      extraStyles={{
                        width: "100px"
                      }}
                      handleMouseDown={() => {
                        this.closePopup()
                      }}
                      id="btnAlertOK" />}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    )

  }

}

export default Alert;