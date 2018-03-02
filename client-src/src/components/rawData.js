import React, {Component} from 'react';
import './rawData.css';
import uuid from 'uuid';

class RawData extends Component {

  fields = [
    "Visit Date",
    "Entry Code",
    "HTS Provider ID",
    "Service Delivery Point",
    "Sex/Pregnancy",
    "Date of Birth",
    "Age Group",
    "HTS Access Type",
    "Last HIV Test Result",
    "Time Since Last Test",
    "Partner Present",
    "First Pass Test 1 Result",
    "First Pass Test 2 Result",
    "Immediate Repeat Test 1 Result",
    "Immediate Repeat Test 2 Result",
    "Outcome Summary",
    "Result Given to Client",
    "Partner HIV Status",
    "Client Risk Category",
    "Referral for Re-Testing",
    "HTS Family Ref Slips"
  ]

  loadReport() {

    let k = 1;

    return (this.props.reports.rawData || []).map((row) => {

      return <tr key={uuid.v4()}>
        {Array(
          <th key={uuid.v4()} style={{
            fontSize: "12px",
            verticalAlign: "top"
          }}>{k++}</th>
        ).concat(Array(this.fields.length).fill().map((_, j) => {
          return <td key={uuid.v4()} style={{
            fontSize: "12px",
            verticalAlign: "top"
          }}>{row[this.fields[j]]
              ? row[this.fields[j]]
              : "-"}&nbsp;</td>
        }))}
      </tr>

    })

  }

  render() {

    return (

      <table
        cellPadding="10"
        border="1"
        style={{
        borderCollapse: "collapse",
        borderColor: "#cccccc"
      }}>
        <tbody>
          <tr>
            <th
              style={{
              fontSize: "22px"
            }}
              colSpan={this.fields.length + 1}>
              Raw Data
            </th>
          </tr>
          <tr
            style={{
            backgroundColor: "#cccccc",
            color: "#333333",
            borderColor: "#eeeeee"
          }}>
            {Array(
              <th key={uuid.v4()} style={{
                fontSize: "12px"
              }}>#</th>
            ).concat(this.fields.map((field) => {
              return <th key={uuid.v4()} style={{
                fontSize: "12px"
              }}>{field}</th >
            }))}
          </tr>
          {this.loadReport()}
        </tbody>
      </table>

    )

  }

}

export default RawData;