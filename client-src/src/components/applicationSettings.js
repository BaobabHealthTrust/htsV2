import React, { Component } from 'react';
import './applicationSettings.css';
import { connect } from "react-redux";
import Button from "./button";
import { fetchSettings, saveSetting, uploadDocumentRequest, updateApp } from '../actions/appAction';
import { showInfoMsg } from "../actions/alertActions";
import uuid from 'uuid';
import { isArray } from 'util';
import Axios from 'axios';
import FileDownload from 'react-file-download';

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
        },
        saveSetting: json => {
            return new Promise(resolve => {
                dispatch(saveSetting(json));
                resolve();
            })
        },
        showInfoMsg: (msg, topic, deletePrompt, deleteLabel, deleteAction) => {
            return new Promise(resolve => {
                dispatch(showInfoMsg(msg, topic, deletePrompt, deleteLabel, deleteAction));
                resolve();
            });
        },
        uploadDocumentRequest: (json) => {
            return new Promise(resolve => {
                dispatch(uploadDocumentRequest(json));
                resolve();
            });
        },
        updateApp: payload => {
            return new Promise(resolve => {
                dispatch(updateApp(payload));
                resolve();
            });
        }
    }
}

class ApplicationSettings extends Component {

    state = {
        data: {}
    }

    async  saveRow(e) {

        const index = e.target.getAttribute('tag');

        const field = String(this.$(`field${index}`).innerHTML).trim();

        const value = String(this.$(`value${index}`).value).trim();

        const json = { [field]: value };

        await this.props.saveSetting(json);

        await this.props.showInfoMsg('Info', 'Attribute saved');

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
                                        return <option key={uuid.v1()}>{option}</option>
                                    })}
                                </select>
                                : <input id={`value${i}`} type="text" name={`value${i}`} className="appText" value={Object.keys(this.state.data).indexOf(key) >= 0 ? this.state.data[key] : data[key]} onChange={(e) => { this.updateField(e) }} tag={i} />
                            :
                            <input id={`value${i}`} type="text" name={`value${i}`} className="appText" value={Object.keys(this.state.data).indexOf(key) >= 0 ? this.state.data[key] : data[key]} onChange={(e) => { this.updateField(e) }} tag={i} />
                    }
                </td>
                <td>
                    <Button label="Save" id={`btnSave${i}`} tag={i} handleMouseDown={(e) => { this.saveRow(e) }} />
                </td>
            </tr>
        })

    }

    handleFileUpload(e) {

        const file = e.target.files[0];

        this.props.uploadDocumentRequest({
            file,
            name: 'file'
        });

    }

    async componentDidMount() {

        await this.props.fetchSettings();

    }

    async componentDidUpdate() {

        if (!this.state.busy && [null, undefined, ""].indexOf(this.props.app.infoMessage) < 0) {

            await this.setState({ busy: true });

            let msg = String(this.props.app.infoMessage);

            await this.props.showInfoMsg('Info', msg);

            await this.props.updateApp({ infoMessage: null });

            await this.setState({ busy: false });

        }

    }

    restoreDatabase(e) {

        e.preventDefault();

        const fileInput = document.createElement('input');
        fileInput.addEventListener("change", (e) => { this.handleFileUpload(e) }, false);
        fileInput.type = 'file';
        fileInput.accept = '.sql';
        fileInput.click();

    }

    backupDatabase(e) {

        Axios
            .get("/backup")
            .then(response => {
                FileDownload(response.data, 'backup-latest.sql');
            });

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
                                <Button label="Backup Database" handleMouseDown={(e) => { this.backupDatabase(e) }} id="btnBackup" />
                                <Button label="Restore Database" handleMouseDown={(e) => { this.restoreDatabase(e) }} id="btnRestore" />
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
