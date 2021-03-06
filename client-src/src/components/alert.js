import React, { Component } from 'react';
import './alert.css';
import Button from './button';
import uuid from 'uuid';

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
                  <div className="alertContent" id="alertContent">{(this.props.alerts.msg || '').split('\n').map(i => {
                    return <span key={uuid.v4()}>{i}<br />
                    </span>
                  })}</div>
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
                        handleMouseDown={async () => {
                          
                          this.props.updateAlertKey('label', null);

                          this.props.alerts.cancelAction ? (await this
                            .props
                            .alerts
                            .cancelAction()) : this.closePopup();
                      
                        }}
                        id="btnAlertCancel" />
                      <Button
                        label={this.props.alerts.label
                          ? this.props.alerts.label
                          : "OK"}
                        extraStyles={{
                          width: "100px"
                        }}
                        handleMouseDown={async () => {

                          await this
                            .props
                            .alerts
                            .action();

                          this.props.updateAlertKey('label', null);

                          // this.closePopup();

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