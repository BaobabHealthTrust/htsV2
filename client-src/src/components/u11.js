import React, {Component} from 'react';
import './u11.css';

class U11 extends Component {

    loadVisits(visits = []) {

        return visits.sort((a, b) => {
            return Object.keys(a)[0] > Object.keys(b)[0]
        }).map((visit) => {

            const visitDate = Object.keys(visit)[0];

            return <li
                id={"visit-" + visitDate}
                key={"visit-" + visitDate}
                className={"selectLabel " + (visit[visitDate].disabled
                ? "disabled"
                : (this.props.selectedVisit === visitDate
                    ? " selected "
                    : " selectItem "))}
                onMouseDown={!visit[visitDate].disabled
                ? this
                    .props
                    .handleVisitUrl
                    .bind(this, visitDate)
                : () => {}}
                style={{
                textAlign: "center"
            }}>
                {visitDate}
            </li>

        })

    }

    render() {

        return (

            <div className="u11">
                <table
                    style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #345db5"
                }}
                    border="1"
                    cellPadding="5"
                    cellSpacing="0">
                    <tbody>
                        <tr
                            style={{
                            backgroundColor: "#345db5"
                        }}>
                            <td
                                style={{
                                color: "#fff",
                                fontWeight: "bold",
                                paddingLeft: "10px",
                                fontSize: "12px",
                                textAlign: "center"
                            }}>
                                Visits
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{
                                padding: 0
                            }}>
                                <div className="u11TabContent">
                                    <ul
                                        style={{
                                        listStyle: "none",
                                        width: "calc(100% - 10px)",
                                        padding: "0px",
                                        margin: "5px"
                                    }}>
                                        {this.loadVisits(this.props.visits)}
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        )

    }

}

export default U11;