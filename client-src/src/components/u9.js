import React, {Component} from 'react';
import './u9.css';

class U9 extends Component {

    loadPrograms(programs = []) {

        return (programs).map(program => {

            return <li
                id={"li-" + program.name}
                key={"li-" + program.name}
                className={(this.props.selectedModule === program.name
                ? "selected"
                : "selectItem")}>
                <table
                    cellPadding="5"
                    width="100%"
                    border="0"
                    style={{
                    borderCollapse: "collapse"
                }}
                    onMouseDown={this
                    .props
                    .handleSwitchProgram
                    .bind(this, program.name)}>
                    <tbody>
                        <tr>
                            <td
                                style={{
                                width: "80px",
                                textAlign: "center"
                            }}>
                                <img src={program.icon} height="45" alt="N/A"/>
                            </td>
                            <td>
                                {program.name}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
        })

    };

    render() {

        return (

            <div className="u9">
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
                                Programs
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="u9TabContent">
                                    <ul
                                        style={{
                                        listStyle: "none",
                                        width: "100%",
                                        padding: "0px",
                                        margin: "0px"
                                    }}>
                                        {this.loadPrograms(this.props.programs)}
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

export default U9;