import React, { Component } from 'react';
import './showUserStats.css';
import uuid from 'uuid';

class ShowUserStats extends Component {

    $(id) {
        return document.getElementById(id);
    }

    loadVisits() {

        return ((this.props.reports.filteredData || []).map((row) => {
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

    async componentDidMount() {

        const year1 = (this.props.responses && this.props.responses["Start Year"]
            ? this.props.responses["Start Year"] : "");

        const month1 = (this.props.responses && this.props.responses["Start Month"]
            ? this.props.responses["Start Month"] : "");

        const date1 = (this.props.responses && this.props.responses["Start Date"]
            ? this.props.responses["Start Date"] : "");

        const year2 = (this.props.responses && this.props.responses["End Year"]
            ? this.props.responses["End Year"] : "");

        const month2 = (this.props.responses && this.props.responses["End Month"]
            ? this.props.responses["End Month"] : "");

        const date2 = (this.props.responses && this.props.responses["End Date"]
            ? this.props.responses["End Date"] : "");

        await this
            .props
            .fetchFilteredVisitSummaries(month1, year1, date1, month2, year2, date2);

    }

    render() {

        return (
            <div style={{
                padding: "5px",
                overflow: "auto",
                height: "calc(100vh - 270px)"
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
                            <th>Date</th>
                            <th>User</th>
                            <th align="left">Location</th>
                            <th>Total</th>
                        </tr>
                    </tbody>
                    <tbody id="grid">
                        {this.loadVisits()}
                    </tbody>
                </table>
            </div>

        )
    }

}

export default ShowUserStats;