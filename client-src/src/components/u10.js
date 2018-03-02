import React, {Component} from 'react';
import './u10.css';

class U10 extends Component {

    render() {

        return (

            <div className="u10">
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
                                fontSize: "12px"
                            }}>
                                Relationships
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="u10TabContent"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        )

    }

}

export default U10;