import React, {Component} from 'react';
import './dailyActivityRegister.css';
import uuid from 'uuid';

class DailyActivityRegister extends Component {

  render() {

    return (

      <div style={{
        overflow: "auto",
        width: "calc(100% - 10px)",
        height: "calc(-122px + 100vh)"
      }}>
        <table
          cellPadding="10"
          style={{
          borderCollapse: "collapse",
          borderColor: "#cccccc",
          margin: "auto"
        }}>
          <tbody>
            <tr>
              <th
                colSpan="9"
                style={{
                fontSize: "24px",
                padding: "20px"
              }}>
                Daily Activity Register
              </th>
            </tr>
            <tr>
              <td>Year</td>
              <td className="regularCell">{this.props.reports && this.props.reports.start && this.props.reports.start.reportYear
                  ? this.props.reports.start.reportYear
                  : ""}</td>
              <td>Site Name</td>
              <td className="regularCell" colSpan="3">{this.props.app.facility}</td>
              <td colSpan="3">&nbsp;</td>
            </tr>
            <tr>
              <td>
                Month
              </td>
              <td className="regularCell">{this.props.reports && this.props.reports.start && this.props.reports.start.reportMonth
                  ? this.props.reports.start.reportMonth
                  : ""}</td>
              <td>HTS Locat.</td>
              <td className="regularCell" colSpan="3">{this.props.reports.location}</td>
              <td>Kit Name</td>
              <td className="regularCell" colSpan="2">{this.props.reports.test}</td>
            </tr>
            <tr>
              <td colSpan="9">&nbsp;</td>
            </tr>
            <tr>
              <th className="header" rowSpan="2">
                Date
              </th>
              <th>
                Opening Stock
              </th>
              <th>
                Receipts
              </th>
              <th colSpan="2">
                Number of Tests User for
              </th>
              <th>
                Losses
              </th>
              <th>
                Closing Stock
              </th>
              <th>
                Remarks
              </th>
              <th>
                Staff
              </th>
            </tr>
            <tr>
              <td align="center">
                Phys. count
              </td>
              <td>&nbsp;</td>
              <td align="center">
                Clients
              </td>
              <td>
                Oth. Purpos.
              </td>
              <td>&nbsp;</td>
              <td align="center">
                Phys. count
              </td>
              <td>&nbsp;</td>
              <td align="center">Name</td>
            </tr>
            {(this.props.reports.rawData || []).map((row) => {
              return <tr key={uuid.v4()}>{Array(9)
                  .fill()
                  .map((_, j) => {
                    return <td
                      style={{
                      textAlign: "center",
                      fontStyle: "italic"
                    }}
                      key={uuid.v4()}
                      className="regularCell">{j === 0
                        ? row.Date
                        : (j === 3
                          ? row.Kits
                          : "")}&nbsp;</td>
                  })}</tr>
            })}
            {(this.props.reports.rawData || []).length <= 0
              ? <tr>
                  {Array(9)
                    .fill()
                    .map((_, j) => {
                      return <td key={uuid.v4()} className="regularCell">&nbsp;</td>
                    })}
                </tr>
              : <tr>
                <td colSpan="9"></td>
              </tr>}
            <tr style={{
              fontSize: "13px"
            }}>
              <th>
                &nbsp;
              </th>
              <td align="center">Opening Stock</td>
              <td align="center">Sum Rec.</td>
              <td align="center" colSpan="2">Sum of Tests Used for</td>
              <td align="center">Sum Loss</td>
              <td align="center">Closing Stock</td>
              <td>&nbsp;</td>
              <td align="center">Staff</td>
            </tr>
            <tr>
              <th>
                Summary
              </th>
              <th className="boldCell"></th>
              <th className="boldCell"></th>
              <th className="boldCell">{(this.props.reports.rawData || []).map(e => {
                  return (e.Kits
                    ? parseInt(e.Kits, 10)
                    : 0)
                }).reduce((a, e, i) => {
                  return a + e;
                }, 0)}</th>
              <th className="boldCell"></th>
              <th className="boldCell"></th>
              <th className="boldCell"></th>
              <th className="boldCell"></th>
              <th className="boldCell"></th>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td style={{
                fontSize: "12px"
              }}>From first day of month</td>
              <td>&nbsp;</td>
              <td style={{
                fontSize: "12px"
              }}>Testing Clients</td>
              <td style={{
                fontSize: "12px"
              }}>Other Purposes</td>
              <td>&nbsp;</td>
              <td style={{
                fontSize: "12px"
              }}>From last day of month</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default DailyActivityRegister;