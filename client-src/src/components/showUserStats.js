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
                    <td align="center" width="200px">{row.Date}</td>
                    <td align="center" width="200px">{row.User}</td>
                    <td align="center" width="200px">{row.Total}</td>
                    <td>{row.Location}</td>
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

        if (this.$("btnClear")) {

            this.$("btnClear").style.display = "none";

        }

        if (this.$("btnNext")) {

            this.$("btnNext").innerHTML = "Finish";

        }

    }

    componentWillUnmount() {

        if (this.$("btnClear")) {

            this.$("btnClear").style.display = "block";

        }

        if (this.$("btnNext")) {

            this.$("btnNext").innerHTML = "Next";

        }

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
                            <th width="200px">Date</th>
                            <th width="200px">User</th>
                            <th width="200px">Total</th>
                            <th align="left">Location</th>
                        </tr>
                    </tbody>
                </table>
                <div
                    style={{
                        overflow: "auto",
                        height: "calc(100vh - 305px)"
                    }} >
                    <table
                        style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            borderColor: "#cccccc"
                        }}
                        cellPadding="10"
                        border="1">
                        <tbody>
                            {this.loadVisits()}
                        </tbody>
                    </table>
                </div>
            </div>

        )
    }

}

export default ShowUserStats;