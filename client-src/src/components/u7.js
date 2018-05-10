import React, {Component} from 'react';
import './u7.css';

class U7 extends Component {

  render() {

    return (
      <div
        style={{
        borderRight: "3px solid " + (this.props.borderLeft),
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
          id="tableDiv2">
          <table
            width="100%"
            cellPadding="0"
            style={{
            fontSize: "12px"
          }}>
            <tbody>
              <tr>
                <td
                  style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "70px"
                }}
                  className={(this.props.backgroundColor || "") !== ""
                  ? "disabledText"
                  : "blueText"}>
                  Gender
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  :
                </td>
                <td id="gender" align="left">
                  {this.props.gender}
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
                  : "blueText"}>
                  Age
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  :
                </td>
                <td id="other_id" align="left">
                  {this.props.age}
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
                  : "blueText"}>
                  Address
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  :
                </td>
                <td id="addressl1" align="left">
                  {this.props.addressl1}
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
                  : "blueText"}>
                  &nbsp;
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  &nbsp;
                </td>
                <td id="addressl2" align="left">
                  {this.props.addressl2}
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
                  : "blueText"}>
                  &nbsp;
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  &nbsp;
                </td>
                <td id="addressl3" align="left">
                  {this.props.addressl3}
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
                  : "blueText"}>
                  Phone
                </td>
                <td
                  style={{
                  textAlign: "center",
                  width: "3px"
                }}>
                  :
                </td>
                <td id="phone" align="left">
                  {this.props.phone}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    )

  }

}

export default U7;