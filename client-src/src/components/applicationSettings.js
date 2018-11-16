import React, { Component } from 'react';
import './applicationSettings.css';
import { connect } from "react-redux";
import Button from "./button";
import { fetchSettings } from '../actions/appAction';
import uuid from 'uuid';

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

    loadSettings() {

        const data = (this.props.app.settings || {});

        let i = 0;

        return Object.keys(data).map(key => {
            i++;
            return <tr key={uuid.v1()}>
                <td>
                    <input type="text" name={`field${i}`} className="appText" value={key} />
                </td>
                <td>
                    <input type="text" name={`value${i}`} className="appText" value={data[key]} />
                </td>
                <td>
                    <Button label="Save" handleMouseDown={this.props.saveField} id={`btnSave${i}`} />
                </td>
            </tr>
        })

    }

    componentDidMount() {

        this.props.fetchSettings();

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
                                            <tr>
                                                <td>
                                                    <input type="text" name="field" className="appText" />
                                                </td>
                                                <td>
                                                    <input type="text" name="value" className="appText" />
                                                </td>
                                                <td>
                                                    <Button label="Save" handleMouseDown={this.props.saveField} id="btnBackup" />
                                                </td>
                                            </tr>
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
