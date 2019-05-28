import React, {Component} from 'react';
import './monthlyReport.css';

class MonthlyReport extends Component {

  render() {

    return (

      <table
        style={{
        borderCollapse: "collapse",
        margin: "auto"
      }}
        cellPadding="8">
        <tbody>
          <tr>
            <th
              style={{
              fontSize: "14px",
              width: "100px",
              textAlign: "left"
            }}
              colSpan="2"
              className="bold">M<span style={{
        fontSize: "12px"
      }}>ALAWI&nbsp;</span>
              HTS R<span style={{
        fontSize: "11px"
      }}>EGISTER&nbsp;
              </span><br/>V<span style={{
        fontSize: "10px"
      }}>ERSION&nbsp;
              </span>
              3</th>
            <th
              style={{
              fontSize: "20px"
            }}
              colSpan="3"
              className="bold">HIV T<span style={{
        fontSize: "18px"
      }}>ESTING&nbsp;AND&nbsp;</span>
              C<span style={{
        fontSize: "18px"
      }}>OUNSELLING&nbsp;
              </span>
              - M<span style={{
        fontSize: "18px"
      }}>ONTHLY&nbsp;
              </span>S<span style={{
        fontSize: "18px"
      }}>ITE&nbsp;</span>R<span style={{
        fontSize: "18px"
      }}>EPORT</span>
            </th>

            <th
              style={{
              fontSize: "13px",
              fontWeight: "normal",
              marginTop: "-1px",
              fontStyle: "italic"
            }}>F<span style={{
        fontSize: "11px"
      }}>ILL&nbsp;
              </span>
              S<span style={{
        fontSize: "11px"
      }}>EPARATE&nbsp;
              </span>
              R<span style={{
        fontSize: "11px"
      }}>EPORT&nbsp;
              </span>
              F<span style={{
        fontSize: "11px"
      }}>OR&nbsp;
              </span>
              E<span style={{
        fontSize: "11px"
      }}>ACH&nbsp;
              </span>
              D<span style={{
        fontSize: "11px"
      }}>IFFERENT&nbsp;
              </span>
              HTS L<span style={{
        fontSize: "11px"
      }}>OCATION AT THIS&nbsp;
              </span>
              S<span style={{
        fontSize: "11px"
      }}>ITE</span>
            </th>

            <th
              style={{
              fontSize: "13px",
              width: "180px",
              textAlign: "right",
              fontWeight: "normal",
              fontStyle: "italic"
            }}>{(this.props.reports.end && this.props.reports.end.reportMonth
                ? this.props.reports.end.reportMonth
                : "")}<br/>{(this.props.reports.end && this.props.reports.end.reportYear
                ? this.props.reports.end.reportYear
                : "")}</th>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
            <td
              style={{
              borderLeft: "1px solid #333",
              borderTop: "1px solid #333",
              width: "150px"
            }}>Facility/Site
            </td>
            <td
              style={{
              borderLeft: "1px solid #333",
              borderTop: "1px solid #333",
              borderRight: "1px solid #333"
            }}
              colSpan="5">{this.props.app.facility}&nbsp;</td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
            <td style={{
              borderLeft: "1px solid #333"
            }}>Reporting Year
            </td>
            <td style={{
              border: "1px solid #333"
            }}>{(this.props.reports.start && this.props.reports.start.reportYear
                ? this.props.reports.start.reportYear
                : "")}{(this.props.reports.end && this.props.reports.end.reportYear && this.props.reports.end.reportYear !== (this.props.reports.start && this.props.reports.start.reportYear
                ? this.props.reports.start.reportYear
                : "")
                ? <br/>
                : "")}{(this.props.reports.end && this.props.reports.end.reportYear && this.props.reports.end.reportYear !== (this.props.reports.start && this.props.reports.start.reportYear
                ? this.props.reports.start.reportYear
                : "")
                ? this.props.reports.end.reportYear
                : "")}&nbsp;
            </td>
            <td
              style={{
              borderTop: "1px solid #333",
              width: "120px"
            }}
              align="center">Month
            </td>
            <td style={{
              border: "1px solid #333"
            }}>{(this.props.reports.start && this.props.reports.start.reportMonth
                ? this.props.reports.start.reportMonth
                : "")}{(this.props.reports.end && this.props.reports.end.reportMonth && this.props.reports.end.reportMonth !== (this.props.reports.start && this.props.reports.start.reportMonth
                ? this.props.reports.start.reportMonth
                : "")
                ? <br/>
                : "")}{(this.props.reports.end && this.props.reports.end.reportMonth && this.props.reports.end.reportMonth !== (this.props.reports.start && this.props.reports.start.reportMonth
                ? this.props.reports.start.reportMonth
                : "")
                ? this.props.reports.end.reportMonth
                : "")}&nbsp;
            </td>
            <td
              style={{
              borderTop: "1px solid #333",
              width: "120px"
            }}
              align="center">HTS Location<sup>1</sup>
            </td>
            <td
              style={{
              border: "1px solid #333",
              minWidth: "120px"
            }}
              align="center">{this.props.reports.location}&nbsp;
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
            <td
              style={{
              borderLeft: "1px solid #333",
              borderBottom: "1px solid #333"
            }}
              colSpan="5">Was any client served at this site/location during this month?<span style={{
        fontSize: "11px"
      }}>If no, still submit report</span>
            </td>
            <td style={{
              border: "1px solid #333"
            }}>&nbsp;
            </td>
          </tr>
          <tr>
            <td colSpan="7">
              <table
                width="100%"
                style={{
                borderCollapse: "collapse"
              }}
                cellPadding="8">
                <tbody>
                  <tr>
                    <td>
                      &nbsp;
                    </td>
                    <th
                      style={{
                      align: "left"
                    }}
                      colSpan="3"
                      className="bold">Sex/Pregnancy
                    </th>
                    <th
                      style={{
                      align: "left"
                    }}
                      colSpan="3"
                      className="bold">Last HIV Test
                    </th>
                    <th
                      style={{
                      align: "left",
                      minWidth: "300px"
                    }}
                      colSpan="2"
                      className="bold">Outcome Summary (HIV Test)
                    </th>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      1
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333",
                      borderLeft: "1px solid #333"
                    }}>Male
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="M">
                      {this.props.reports["Male"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      11
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333",
                      borderLeft: "1px solid #333"
                    }}>
                      Never Tested
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="LNEV">
                      {this.props.reports["Never Tested"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      17
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333",
                      borderLeft: "1px solid #333"
                    }}>
                      Single Negative
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="N">
                      {this.props.reports["Single Negative"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      2
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Female Non-Pregnant
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="FNP">
                      {this.props.reports["Female Non-Pregnant"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      12
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Prev Negative
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="LN">
                      {this.props.reports["Last Negative"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      18
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Single Positive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="P">
                      {this.props.reports["Single Positive"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>3
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>Female Pregnant
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="FP">
                      {this.props.reports["Female Pregnant"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      13
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Prev Positive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="LP">
                      {this.props.reports["Last Positive"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      19
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Test 1&2 negative
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="T12N">
                      {this.props.reports["Test 1 & 2 Negative"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontStyle: "italic"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="sex_pregnancy">
                      {(this.props.reports["Male"]
                        ? parseInt(this.props.reports["Male"], 10)
                        : 0) + (this.props.reports["Female Non-Pregnant"]
                        ? parseInt(this.props.reports["Female Non-Pregnant"], 10)
                        : 0) + (this.props.reports["Female Pregnant"]
                        ? parseInt(this.props.reports["Female Pregnant"], 10)
                        : 0)}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      14
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Prev Exposed infant
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="LEX">
                      {this.props.reports["Last Exposed infant"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      20
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Test 1&2 positive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="T12P">
                      {this.props.reports["Test 1 & 2 Positive"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>&nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "left",
                      fontWeight: "bold"
                    }}>Age Groups
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      15
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Prev Inconclusive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="LIN">
                      {this.props.reports["Last Inconclusive"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      21
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Test 1&2 discordant
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="T12D">
                      {this.props.reports["Test 1 & 2 Discordant"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      4
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333",
                      borderLeft: "1px solid #333"
                    }}>
                      A: 0-11 months
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="0_11M">
                      {this.props.reports["0-11 months"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      fontStyle: "italic",
                      textAlign: "right"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="last_hiv_test">
                      {(this.props.reports["Last Inconclusive"]
                        ? parseInt(this.props.reports["Last Inconclusive"], 10)
                        : 0) + (this.props.reports["Never Tested"]
                        ? parseInt(this.props.reports["Never Tested"], 10)
                        : 0) + (this.props.reports["Last Negative"]
                        ? parseInt(this.props.reports["Last Negative"], 10)
                        : 0) + (this.props.reports["Last Positive"]
                        ? parseInt(this.props.reports["Last Positive"], 10)
                        : 0) + (this.props.reports["Last Exposed infant"]
                        ? parseInt(this.props.reports["Last Exposed infant"], 10)
                        : 0)}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      fontStyle: "italic",
                      textAlign: "right",
                      minWidth: "200px"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="outcome_summary">
                      {(this.props.reports["Single Negative"]
                        ? parseInt(this.props.reports["Single Negative"], 10)
                        : 0) + (this.props.reports["Single Positive"]
                        ? parseInt(this.props.reports["Single Positive"], 10)
                        : 0) + (this.props.reports["Test 1 & 2 Negative"]
                        ? parseInt(this.props.reports["Test 1 & 2 Negative"], 10)
                        : 0) + (this.props.reports["Test 1 & 2 Positive"]
                        ? parseInt(this.props.reports["Test 1 & 2 Positive"], 10)
                        : 0) + (this.props.reports["Test 1 & 2 Discordant"]
                        ? parseInt(this.props.reports["Test 1 & 2 Discordant"], 10)
                        : 0)}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      5
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      B: 1-14 years
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="1_14Y">
                      {this.props.reports["1-14 years"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td style={{
                      fontWeight: "bold"
                    }}>
                      Partner Present
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      fontWeight: "bold"
                    }}
                      colSpan="3">
                      Result Given to Client
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      6
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      C: 15-24 years
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="15_24Y">
                      {this.props.reports["15-24 years"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      16
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderTop: "1px solid #333"
                    }}>
                      Partner Present
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="PPY">
                      {this.props.reports["Partner Present"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      22
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderTop: "1px solid #333",
                      width: "80px"
                    }}>
                      New negative
                    </td>
                    <td
                      style={{
                      width: "80px",
                      border: "1px solid #333",
                      textAlign: "right"
                    }}
                      id="RGTCNN">
                      {this.props.reports["New negative"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      7
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      D: 25+ years
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="25P">
                      {this.props.reports["25+ years"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Partner not present
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="PPN">
                      {this.props.reports["Partner not present"]}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      23
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      width: "80px"
                    }}>
                      New positive
                    </td>
                    <td
                      style={{
                      width: "80px",
                      border: "1px solid #333",
                      textAlign: "right"
                    }}
                      id="RGTCNP">
                      {this.props.reports["New positive"]}&nbsp;
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      width: "80px"
                    }}>
                      New positive (Male)
                    </td>
                    <td
                      style={{
                      width: "80px",
                      border: "1px solid #333",
                      textAlign: "right"
                    }}
                      id="RGTCNT">
                      {this.props.reports["New positive (Male)"]}&nbsp;
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      width: "80px"
                    }}>
                      New positive (Female)
                    </td>
                    <td
                      style={{
                      width: "80px",
                      border: "1px solid #333",
                      textAlign: "right"
                    }}
                      id="RGTCNV">
                      {this.props.reports["New positive (Female)"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontStyle: "italic"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="age_group">
                      {(this.props.reports["0-11 months"]
                        ? parseInt(this.props.reports["0-11 months"], 10)
                        : 0) + (this.props.reports["1-14 years"]
                        ? parseInt(this.props.reports["1-14 years"], 10)
                        : 0) + (this.props.reports["15-24 years"]
                        ? parseInt(this.props.reports["15-24 years"], 10)
                        : 0) + (this.props.reports["25+ years"]
                        ? parseInt(this.props.reports["25+ years"], 10)
                        : 0)}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontStyle: "italic"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="partner_present">
                      {(this.props.reports["Partner Present"]
                        ? parseInt(this.props.reports["Partner Present"], 10)
                        : 0) + (this.props.reports["Partner not present"]
                        ? parseInt(this.props.reports["Partner not present"], 10)
                        : 0)}&nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      24
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      width: "80px"
                    }}>
                      New exposed infant
                    </td>
                    <td
                      style={{
                      width: "80px",
                      border: "1px solid #333",
                      textAlign: "right"
                    }}
                      id="RGTCNEX">
                      {this.props.reports["New exposed infant"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontWeight: "bold"
                    }}>
                      HTS Access Type
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      25
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      New inconclusive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="RGTCNI">
                      {this.props.reports["New inconclusive"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      8
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333",
                      borderLeft: "1px solid #333"
                    }}>
                      PITC
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="PITC">
                      {this.props.reports["Routine HTS (PITC) within Health Service"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      26
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Confirmatory positive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="RGTCCP">
                      {this.props.reports["Confirmatory positive"]}&nbsp;
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Confirmatory positive (Male)
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="RGTCCX">
                      {this.props.reports["Confirmatory positive (Male)"]}&nbsp;
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      Confirmatory positive (Female)
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="RGTCCY">
                      {this.props.reports["Confirmatory positive (Female)"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      9
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333"
                    }}>
                      FRS
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="FRS">
                      {this.props.reports["Comes with HTS Family Referral Slip"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      textAlign: "right"
                    }}>
                      27
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Confirmatory Inconclusive
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="RGTCIN">
                      {this.props.reports["Confirmatory Inconclusive"]}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      10
                    </td>
                    <td
                      style={{
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Other (VCT, etc.)
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="VCT">
                      {this.props.reports["Other (VCT, etc.)"]}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontStyle: "italic"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="result_given_to_client">
                      {(this.props.reports["New negative"]
                        ? parseInt(this.props.reports["New negative"], 10)
                        : 0) + (this.props.reports["New positive"]
                        ? parseInt(this.props.reports["New positive"], 10)
                        : 0) + (this.props.reports["New exposed infant"]
                        ? parseInt(this.props.reports["New exposed infant"], 10)
                        : 0) + (this.props.reports["New inconclusive"]
                        ? parseInt(this.props.reports["New inconclusive"], 10)
                        : 0) + (this.props.reports["Confirmatory positive"]
                        ? parseInt(this.props.reports["Confirmatory positive"], 10)
                        : 0) + (this.props.reports["Confirmatory Inconclusive"]
                        ? parseInt(this.props.reports["Confirmatory Inconclusive"], 10)
                        : 0)}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      textAlign: "right",
                      fontStyle: "italic"
                    }}>
                      Tot. clients (check)
                    </td>
                    <td
                      style={{
                      border: "2px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="htc_access_type">
                      {(this.props.reports["Routine HTS (PITC) within Health Service"]
                        ? parseInt(this.props.reports["Routine HTS (PITC) within Health Service"], 10)
                        : 0) + (this.props.reports["Comes with HTS Family Referral Slip"]
                        ? parseInt(this.props.reports["Comes with HTS Family Referral Slip"], 10)
                        : 0) + (this.props.reports["Other (VCT, etc.)"]
                        ? parseInt(this.props.reports["Other (VCT, etc.)"], 10)
                        : 0)}&nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td style={{
                      align: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      fontWeight: "bold"
                    }}
                      colSpan="2">
                      Partner HTS Slips Given
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                      width: "30px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td align="right">
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td align="right">
                      28
                    </td>
                    <td
                      style={{
                      border: "1px solid #333"
                    }}>
                      Sum of all slips
                    </td>
                    <td
                      style={{
                      border: "1px solid #333",
                      width: "80px",
                      textAlign: "right"
                    }}
                      id="PHSG">
                      {this.props.reports["Sum of all slips"]}&nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan="7">
              <table
                style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
                cellPadding="8">
                <tbody>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <th
                      style={{
                      align: "left"
                    }}
                      colSpan="2"
                      className="bold">
                      Test Kit Use Summary
                    </th>
                    <td style={{
                      width: "10px"
                    }}></td>
                    <th
                      style={{
                      width: "150px"
                    }}
                      className="bold">
                      Test 1
                    </th>
                    <td style={{
                      width: "10px"
                    }}></td>
                    <th
                      style={{
                      width: "150px"
                    }}
                      className="bold">
                      Test 2
                    </th>
                    <td style={{
                      width: "150px"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333",
                      borderTop: "1px solid #333"
                    }}>
                      Add from
                      <i>DAILY ACTIVITY REGISTER</i>, separate for each
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333"
                    }}>
                      Kit Name
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      fontWeight: "normal"
                    }}
                      id="test_1_kit_name">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      fontWeight: "normal"
                    }}
                      id="test_2_kit_name">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Total tests in testing rooms at start of 1<sup>st</sup>
                      day of reporting month
                    </td>
                    <td>
                      Opening
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_opening">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_opening">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Total tests received at this location during this month
                    </td>
                    <td>
                      Receipts
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_receipts">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_receipts">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Total tests used for testing clients
                    </td>
                    <td>
                      Used for Clients
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_used_for_clients">
                      {this.props.reports["Test 1 Used for Clients"]}&nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_used_for_clients">
                      {this.props.reports["Test 2 Used for Clients"]}&nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Total tests used for other purposes (QC, PT, training)
                    </td>
                    <td>
                      Used for Other
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      -
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_for_other">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      -
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_for_other">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Total tests expired / disposed, etc.
                    </td>
                    <td>
                      Losses
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      -
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_disposals">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      -
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_disposals">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Expected Remaining Balance
                    </td>
                    <td>
                      Balance
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      =
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_balance">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      =
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_balance">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333"
                    }}>
                      Physical tests in testing rooms at end of last day of month
                    </td>
                    <td>
                      Closing
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      =
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_in_rooms">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      -
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_in_rooms">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      Excess tests / tests unaccounted for (write + or -)
                    </td>
                    <td
                      style={{
                      borderBottom: "1px solid #333"
                    }}>
                      Difference
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      =
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_1_difference">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}>
                      =
                    </td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}
                      id="test_2_difference">
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333",
                      borderTop: "1px solid #333"
                    }}>
                      From
                      <i>STOCK CARD</i>
                      in pharmacy / drug store
                    </td>
                    <td
                      style={{
                      borderTop: "1px solid #333"
                    }}>
                      Opening
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "left",
                      borderLeft: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      borderBottom: "1px solid #333"
                    }}>
                      Closing
                    </td>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "10px",
                      border: "1px solid #333",
                      borderRight: "none"
                    }}></td>
                    <th
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderBottom: "1px solid #333",
                      borderLeft: "none",
                      paddingRight: "15px",
                      textAlign: "right"
                    }}>
                      &nbsp;
                    </th>
                    <td
                      style={{
                      width: "150px",
                      border: "1px solid #333",
                      borderBottom: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td colSpan="7">
              <table
                width="100%"
                style={{
                borderCollapse: "collapse"
              }}
                cellPadding="8">
                <tbody>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <th
                      style={{
                      align: "left",
                      width: "40px"
                    }}>
                      &nbsp;
                    </th>
                    <td style={{
                      align: "center"
                    }}>
                      Date
                    </td>
                    <td style={{
                      align: "center"
                    }}>
                      Name
                    </td>
                    <td
                      style={{
                      align: "center"
                    }}
                      colSpan="2">
                      Phone
                    </td>
                    <td
                      style={{
                      align: "center"
                    }}
                      colSpan="2">
                      Notes
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <th
                      style={{
                      align: "left",
                      width: "40px",
                      className: "bold"
                    }}>
                      Filled
                    </th>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333",
                      borderBottom: "none"
                    }}
                      colSpan="2">
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333",
                      borderBottom: "none"
                    }}
                      colSpan="2">
                      &nbsp;
                    </td>
                  </tr>

                  <tr>
                    <td style={{
                      width: "30px"
                    }}>
                      &nbsp;
                    </td>
                    <th
                      style={{
                      align: "left",
                      width: "40px",
                      className: "bold"
                    }}>
                      Recvd
                    </th>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333"
                    }}>
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333",
                      borderTop: "none"
                    }}
                      colSpan="2">
                      &nbsp;
                    </td>
                    <td
                      style={{
                      align: "center",
                      border: "1px solid #333",
                      borderTop: "none"
                    }}
                      colSpan="2">
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan="8">
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>

    )

  }

}

export default MonthlyReport;