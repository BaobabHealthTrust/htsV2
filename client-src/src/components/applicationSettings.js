import React, { Component } from 'react';
import './applicationSettings.css';
import { connect } from "react-redux";
import Button from "./button";
import { fetchSettings } from '../actions/appAction';
import uuid from 'uuid';
import { isArray } from 'util';

const mapStateToProps = state => {
    return {
        app: state.app
    };
};


const mapDispatchToProps = dispatch => {
    return {
        fetchSettings: () => {
            return new Promise(resolve => {
                dispatch(fetchSettings());
                resolve();
            });
        }
    }
}

class ApplicationSettings extends Component {

    state = {
        data: {}
    }

    buildExpression(index) {

        alert(index);

    }

    $(id) {

        return document.getElementById(id);

    }

    async updateField(e) {

        const index = e.target.getAttribute('tag');

        const field = String(this.$(`field${index}`).innerHTML).trim();

        const value = String(this.$(`value${index}`).value).trim();

        let data = Object.assign({}, this.state.data);

        data[field] = value;

        await this.setState({ data });

        this.$(`value${index}`).focus();

        this.$(`value${index}`).selectionStart = this.$(`value${index}`).selectionEnd = this.$(`value${index}`).value.length;

    }

    loadSettings() {

        const districts = ["Kasungu", "Nkhotakota", "Ntchisi", "Dowa ", "Salima", "Lilongwe", "Mchinji", "Dedza", "Ntcheu", "Lilongwe City", "Chitipa", "Karonga", "Nkhata-bay", "Rumphi", "Mzimba", "Likoma", "Mzuzu City", "Mangochi", "Machinga", "Zomba", "Zomba City", "Chiradzulu", "Blantyre", "Mwanza", "Thyolo", "Mulanje", "Phalombe", "Chikwawa", "Nsanje ", "Balaka,Neno", "Blantyre City"];

        const types = {
            "facility": "text",
            "location": districts,
            "htc location": districts,
            "reset month": ["January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"],
            "facility_code": "text",
            "entry_code_max_digits": "number",
            "redirect_to_portal": ["true", "false"],
            "portal_url": "text",
            "screen_timeout_minutes": "number"
        };

        const data = (this.props.app.settings || {});

        let i = 0;

        return Object.keys(data).map(key => {
            i++;
            return <tr key={uuid.v1()}>
                <td>
                    <span style={{ marginLeft: "5%" }} id={`field${i}`}>{key}</span>
                </td>
                <td>
                    {
                        types[key] ?
                            isArray(types[key]) ?
                                <select id={`value${i}`} type="text" name={`value${i}`} value={Object.keys(this.state.data).indexOf(key) >= 0 ? this.state.data[key] : data[key]} className='appSelect' onChange={(e) => { this.updateField(e) }} tag={i}>
                                    {(types[key] || []).map(option => {
                                        return <option>{option}</option>
                                    })}
                                </select>
                                : <input id={`value${i}`} type="text" name={`value${i}`} className="appText" value={Object.keys(this.state.data).indexOf(key) >= 0 ? this.state.data[key] : data[key]} onChange={(e) => { this.updateField(e) }} tag={i} />
                            :
                            <input id={`value${i}`} type="text" name={`value${i}`} className="appText" value={Object.keys(this.state.data).indexOf(key) >= 0 ? this.state.data[key] : data[key]} onChange={(e) => { this.updateField(e) }} tag={i} />
                    }
                </td>
                <td>
                    <Button label="Save" id={`btnSave${i}`} tag={i} handleMouseDown={(e) => { this.buildExpression(e.target.getAttribute('tag')) }} />
                </td>
            </tr>
        })

    }

    async componentDidMount() {

        await this.props.fetchSettings();

    }

    render() {

        return (

            <div>
                <table
                    width="100%"
                    style={{
                        borderCollapse: "collapse",
                        fontSize: "18px"
                    }}
                    cellPadding="10">
                    <tbody>
                        <tr>
                            <th style={{ verticalAlign: "middle" }}>
                                Application Settings
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ height: "calc(100vh - 400px)", width: "100%", border: "1px solid #eee", overflow: "auto" }}>
                                    <table style={{ width: "100%" }}>
                                        <tbody>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                                <th>&nbsp;</th>
                                            </tr>
                                            {this.loadSettings()}
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <Button label="Backup Database" handleMouseDown={this.props.backupDatabase} id="btnBackup" />
                                <Button label="Restore Database" handleMouseDown={this.props.restoreDatabase} id="btnRestore" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        )

    }

}

// export default ApplicationSettings;

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationSettings);
