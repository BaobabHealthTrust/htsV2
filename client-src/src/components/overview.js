import React, {Component} from 'react';
import './overview.css';
import uuid from 'uuid';

class Overview extends Component {

  loadVisits() {

    return ((this.props.reports.rawData || []).map((row) => {
      return (row.User && row.Total
        ? <tr key={uuid.v4()} id={uuid.v4()}>
            <td align="center">{row.Date}</td>
            <td align="center">{row.User}</td>
            <td>{row.Location}</td>
            <td align="center">{row.Total}</td>
          </tr>
        : <tr>
          <td colSpan="4"></td>
        </tr>)
    }))

  }

  componentDidMount() {

    this
      .props
      .fetchVisitSummaries((new Date()).getMonth(), (new Date()).getFullYear());

  }

  render() {

    return (

      <div style={{
        padding: "5px"
      }}>
        <table
          style={{
          borderCollapse: "collapse",
          width: "100%",
          borderColor: "#cccccc"
        }}
          cellPadding="10"
          border="1">
          <tbody>
            <tr
              style={{
              backgroundColor: "#cccccc",
              color: "#333333",
              border: "1px solid #eeeeee"
            }}>
              <th>
                Date
              </th>
              <th>
                User
              </th>
              <th align="left">
                Location
              </th>
              <th>
                Total
              </th>
            </tr>
            {this.loadVisits()}
          </tbody>
        </table>
      </div>

    )

  }

}

export default Overview;