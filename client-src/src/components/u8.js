import React, { Component } from 'react';
import './u8.css';

class U8 extends Component {

    render() {

        return (

            <div className="headTab" id="tableDiv2" >
                <table width="100%" style={{fontSize: "12px"}} cellPadding="1" >
                    <tbody>
                        <tr>
                            <td style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    width: "70px"
                                }} className="blueText" >
                                    BP
                            </td>
                            <td style={{
                                textAlign: "center", 
                                width: "3px"
                            }} >
                                :
                            </td>
                            <td id="bp" align="left" >
                                {this.props.bp}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                    textAlign: "right",
                                    fontWeight: "bold"
                                }} className="blueText" >
                                    Temperature
                            </td>
                            <td style={{
                                textAlign: "center", 
                                width: "3px"
                            }} >
                                :
                            </td>
                            <td id="temperature" align="left" >
                                {this.props.temperature}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                    textAlign: "right",
                                    fontWeight: "bold"
                                }} className="blueText" >
                                    BMI
                            </td>
                            <td style={{
                                textAlign: "center", 
                                width: "3px"
                            }} >
                                :
                            </td>
                            <td id="bmi" align="left" >
                                {this.props.bmi}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                    textAlign: "right",
                                    fontWeight: "bold"
                                }} className="blueText" >
                                    Weight
                            </td>
                            <td style={{
                                textAlign: "center", 
                                width: "3px"
                            }} >
                                :
                            </td>
                            <td id="weight" align="left" >
                                {this.props.weight}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                    textAlign: "right",
                                    fontWeight: "bold"
                                }} className="blueText" >
                                    Allergies
                            </td>
                            <td style={{
                                textAlign: "center", 
                                width: "3px"
                            }} >
                                :
                            </td>
                            <td id="allergies" align="left" >
                                {this.props.allergies}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        )

    }

}

export default U8;