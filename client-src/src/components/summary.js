import React, {Component} from 'react';
import './summary.css';

class Summary extends Component {

  render() {

    return (
      <div>
        <table width="100%">
          <tbody>
            <tr>
              <td
                colSpan="3"
                className="label"
                style={{
                padding: "10px"
              }}>
                Summary
              </td>
            </tr>
            <tr>
              <td>
                <div className="viewPort">
                  <table width="100%">
                    <tbody>
                      {Object
                        .keys(this.props.responses || {})
                        .map(field => {

                          return ((this.props.summaryIgnores && this.props.summaryIgnores.indexOf(field) >= 0)
                            ? null
                            : (
                              <tr
                                style={{
                                fontSize: "1.8em"
                              }}
                                key={field}>
                                <th
                                  align="right"
                                  style={{
                                  fontSize: "0.7em",
                                  width: "40%"
                                }}>
                                  {field}
                                </th>
                                <td
                                  style={{
                                  width: "10px"
                                }}>:</td>
                                <td>
                                  {this.props.responses[field]}
                                </td>
                              </tr>
                            ))
                        })
                        .reduce((a, e, i) => {
                          if (e) 
                            a.push(e);
                          return a;
                        }, [])}

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

export default Summary;