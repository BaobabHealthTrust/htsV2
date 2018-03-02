import React, {Component} from 'react';
import './u1.css';
import icoBarcode from '../images/barcode';

class U1 extends Component {

  componentDidMount() {

    return (this.props.handleCheckBarcode
      ? this.props.handleCheckBarcode()
      : () => {});

  }

  render() {

    return (

      <div
        className={this.props.selectedTask === "Backdata Entry"
        ? "bdHeadTab"
        : "headTab"}>
        <table
          cellPadding="1"
          width="100%"
          border="0"
          style={{
          marginTop: "0px"
        }}>
          <tbody>
            {this.props.selectedTask === "Backdata Entry"
              ? <tr></tr>
              : <tr>
                <th
                  className="blueText"
                  style={{
                  fontSize: "20px",
                  verticalAlign: "middle",
                  width: "200px",
                  overflow: "hidden",
                  fontWeight: "normal",
                  padding: "5px",
                  paddingTop: "10px",
                  textAlign: "right"
                }}>
                  Scan Patient ID
                </th>
                <td
                  style={{
                  width: "60px",
                  marginTop: "10px",
                  height: "50px"
                }}>
                  <img src={icoBarcode} height="40" alt="-"/>
                </td>
                <td
                  colSpan="6"
                  style={{
                  borderBottom: "1px solid #3c60b1",
                  padding: "0px"
                }}>
                  <input
                    type="input"
                    id="barcode"
                    style={{
                    fontSize: "24px",
                    width: "100%",
                    border: "none"
                  }}/>
                </td>
              </tr>}
            <tr>
              <td
                colSpan="2"
                className="blueText"
                style={{
                fontSize: "20px",
                verticalAlign: "middle",
                width: "200px",
                overflow: "hidden",
                fontWeight: "normal",
                padding: "5px",
                paddingTop: "10px",
                textAlign: "left"
              }}>
                {this.props.selectedTask === "Backdata Entry"
                  ? "Backdata Entry"
                  : ""}&nbsp;
              </td>
              <td
                style={{
                textAlign: "right",
                fontWeight: "bold"
              }}
                className="blueText">
                Facility
              </td>
              <td
                style={{
                textAlign: "center",
                width: "3px"
              }}>
                :
              </td>
              <td id="facility" style={{
                color: "black"
              }}>
                {this.props.facility}
              </td>
              <td
                style={{
                textAlign: "right",
                fontWeight: "bold"
              }}
                className="blueText">
                Date
              </td>
              <td
                style={{
                textAlign: "center",
                width: "3px"
              }}>
                :
              </td>
              <td id="today" style={{
                color: "black"
              }}>
                {(this.props.selectedTask === "Backdata Entry"
                  ? (this.props.wf.responses && this.props.wf.responses.primary
                    ? this.props.wf.responses.primary["Set Date"]
                    : "")
                  : this.props.today)}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                &nbsp;
              </td>
              <td
                style={{
                textAlign: "right",
                fontWeight: "bold"
              }}
                className="blueText">
                {(this.props.selectedTask === "Backdata Entry"
                  ? "Register Number (from cover)"
                  : "Location")}
              </td>
              <td
                style={{
                textAlign: "center",
                width: "3px"
              }}>
                :
              </td>
              <td id="location" style={{
                color: "black"
              }}>
                {(this.props.selectedTask === "Backdata Entry"
                  ? (this.props.wf.responses && this.props.wf.responses.primary
                    ? this.props.wf.responses.primary["Register Number (from cover)"]
                    : "")
                  : this.props.location)}
              </td>
              <td
                style={{
                textAlign: "right",
                fontWeight: "bold"
              }}
                className="blueText">
                User
              </td>
              <td
                style={{
                textAlign: "center",
                width: "3px"
              }}>
                :
              </td>
              <td id="user" style={{
                color: "black"
              }}>
                {this.props.app.activeUser}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default U1;