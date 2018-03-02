import React, {Component} from 'react';
import './moduleLogo.css';

class ModuleLogo extends Component {

    render() {

        return (

            <table
                cellPadding="5"
                border="0"
                style={{
                margin: "auto",
                marginTop: "10vh",
                borderCollapse: "collapse"
            }}>
                <tbody>
                    <tr>
                        <td
                            style={{
                            width: "40px",
                            textAlign: "center"
                        }}>
                            <img
                                src={this.props.icon}
                                style={{
                                height: "35vh"
                            }}
                                alt={""}/>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                            fontSize: "5vh",
                            color: "#345db5"
                        }}
                            align="center">
                            {this.props.module
                                ? this.props.module + " Statistics"
                                : ""}
                        </td>
                    </tr>
                </tbody>
            </table>

        )

    }

}

export default ModuleLogo;