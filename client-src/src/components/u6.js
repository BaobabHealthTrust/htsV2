import React, {Component} from 'react';
import './u6.css';

class U6 extends Component {

  render() {

    return (

      <div
        style={{
        borderLeft: "3px solid " + (this.props.borderLeft),
        borderTop: "3px solid " + (this.props.borderTop),
        backgroundColor: this.props.backgroundColor,
        color: (this.props.backgroundColor === "#eeeeee"
          ? "#999999"
          : "#3c60b1")
      }}>
        <div
          className={this.props.borderTop
          ? "headTabFlat"
          : "headTab"}
          id="tableDiv1">
          <table cellPadding="1" width="100%">
            <tbody>
              <tr>
                <th
                  style={{
                  fontSize: "24px",
                  textAlign: "left",
                  width: "100%",
                  overflow: "hidden",
                  fontWeight: "normal",
                  padding: "5px"
                }}
                  id="patient_name"
                  className={(this.props.backgroundColor || "") !== ""
                  ? "disabledText"
                  : "blueText"}>
                  {this.props.patientName}
                </th>
              </tr>
              <tr>
                <th
                  style={{
                  textAlign: "left",
                  fontSize: "14px",
                  paddingLeft: "5px",
                  borderBottom: "1px solid #004586"
                }}
                  className={(this.props.backgroundColor || "") !== ""
                  ? "disabledText"
                  : "blueText"}>
                  Identifiers
                </th>
              </tr>
              <tr>
                <td>
                  <table
                    width="100%"
                    style={{
                    fontSize: "12px"
                  }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                          textAlign: "right",
                          fontWeight: "bold"
                        }}
                          className={(this.props.backgroundColor || "") !== ""
                          ? "disabledText"
                          : "blueText"}
                          id="primary_id_label">
                          {this.props.primary_id_label}
                        </td>
                        <td
                          style={{
                          textAlign: "center",
                          width: "3px"
                        }}>
                          :
                        </td>
                        <td id="primary_id" align="left">
                          {this.props.primary_id}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                          textAlign: "right",
                          fontWeight: "bold"
                        }}
                          className={(this.props.backgroundColor || "") !== ""
                          ? "disabledText"
                          : "blueText"}
                          id="other_id_label">
                          {this.props.other_id_label}
                        </td>
                        <td
                          style={{
                          textAlign: "center",
                          width: "3px"
                        }}>
                          :
                        </td>
                        <td id="other_id" align="left">
                          {this.props.other_id}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    )

  }

}

export default U6;