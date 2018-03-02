import React, {Component} from 'react';
import './appCard.css';

class AppCard extends Component {

    render() {

        return (

            <table
                cellPadding="5"
                border="0"
                style={{
                margin: "auto",
                borderCollapse: "collapse"
            }}>
                <tbody>
                    <tr>
                        <td
                            style={{
                            width: "40px",
                            textAlign: "right"
                        }}>
                            <img
                                src={this.props.icon}
                                height={this.props.selectedTask === "Backdata Entry"
                                ? "70"
                                : "110"}
                                alt={""}/>
                        </td>
                        <td
                            style={{
                            fontSize: "30px",
                            color: "#345db5"
                        }}>
                            {this.props.module}
                        </td>
                    </tr>
                </tbody>
            </table>

        )

    }

}

export default AppCard;