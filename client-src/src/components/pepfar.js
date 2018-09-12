import React, {Component} from 'react';
import './pepfar.css';
import uuid from 'uuid';
import locations from '../config/pepfarLocations';
import facility from '../config/site';

class Pepfar extends Component {

  fields = [
    "District",
    "Site",
    "Month",
    "Year",
    "HTS Setting",
    "HTS Modality",
    "HTS Access Type",
    "Age Group",
    "Sex",
    "Result Given",
    "Count"
  ]

  ageGroups = [
    "<1",
    "1-4",
    "5-9",
    "10-14",
    "15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50+"
  ]

  site = facility.facility;

  district = facility.location;

  years = {
    2017: [
      "October", "November", "December"
    ],
    2018: ["January", "February"]
  };

  htsAccessTypes = ["PITC", "FRS/Index", "VCT/Other"];

  genders = ["Male", "Female"];

  resultGivens = ["Negative", "Positive"];

  loadGrid() {

    let k = 1;

    return Object
      .keys(this.years)
      .map((year) => {

        return this
          .years[year]
          .map((month) => {

            return locations.map((location) => {

              return this
                .htsAccessTypes
                .map((htsAccessType) => {

                  return this
                    .ageGroups
                    .map((ageGroup) => {

                      return this
                        .genders
                        .map((gender) => {

                          return this
                            .resultGivens
                            .map((resultGiven) => {

                              const id = k;

                              return <tr>
                                <th>
                                  {k++}
                                </th>
                                <td>
                                  {this.district}
                                </td>
                                <td>
                                  {this.site}
                                </td>
                                <td>
                                  {month}
                                </td>
                                <td>
                                  {year}
                                </td>
                                <td>
                                  {location}
                                </td>
                                <td>
                                  {htsAccessType}
                                </td>
                                <td align="center">
                                  {ageGroup}
                                </td>
                                <td>
                                  {gender}
                                </td>
                                <td>
                                  {resultGiven}
                                </td>
                                <td align="center">
                                  {id}
                                </td>
                              </tr>

                            })

                        })

                    })

                })

            })

          })

      })

  }

  loadReport(startPos = 0, endPos = 50) {

    let k = 1;

    return (this.props.reports.pepfarData || [])
      // .slice(startPos, endPos)
      .map((row) => {

        return <tr key={uuid.v4()}>
          {Array(
            <th
              key={uuid.v4()}
              style={{
              fontSize: "12px",
              verticalAlign: "top"
            }}>{k++}</th>
          ).concat(Array(this.fields.length).fill().map((_, j) => {
            return <td
              key={uuid.v4()}
              style={{
              fontSize: "12px",
              verticalAlign: "top"
            }}>{String(row[this.fields[j]]).trim().length > 0
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
        borderColor: "#cccccc",
        width: "calc(100vw - 40px)"
      }}>
        <tbody>
          <tr>
            <th
              style={{
              fontSize: "22px"
            }}
              colSpan={this.fields.length + 2}>
              Disaggregated Report Data
            </th>
          </tr>
          <tr
            style={{
            backgroundColor: "#cccccc",
            color: "#333333",
            borderColor: "#eeeeee"
          }}>
            {Array(
              <th key={uuid.v4()}>#</th>
            ).concat(this.fields.map((field) => {
              return <th key={uuid.v4()}>{field}</th >
            }))}
          </tr>
          {this.loadReport()}
          {/*this.loadGrid()*/}
        </tbody>
      </table>

    )

  }

}

export default Pepfar;