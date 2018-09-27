import React, { Component } from 'react';
import './ReferralOutcome.css';
import uuid from 'uuid';
import Button from './button';
import Keyboard from './keyboard';

class ReferralOutcome extends Component {

    state = {
        page: 1,
        fieldType: "",
        label: null,
        currentString: ""
    }

    $(id) {
        return document.getElementById(id);
    }

    ignore = false;

    hideKeyboard() {

        let newState = this.state;

        newState.fieldType = "";

        this.setState(newState);

    }

    onChangeHandler(text) {

        let newState = Object.assign({}, this.state);

        newState.currentString = text;

        if (Object.keys(newState).indexOf('edited') < 0)
            newState.edited = {};

        if (!newState.edited[this.state.currentEncounterId])
            newState.edited[this.state.currentEncounterId] = { encounter_id: this.state.currentEncounterId };

        newState.edited[this.state.currentEncounterId][this.state.label] = text;

        this.setState(newState);

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
            .fetchARTReferral(month1, year1, date1, month2, year2, date2, 1);

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

    async navBack() {

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

        if (this.props.app.referrals && this.props.app.referrals.page && this.props.app.referrals.page > 1) {

            let page = Number(this.props.app.referrals.page) - 1;

            await this
                .props
                .fetchARTReferral(month1, year1, date1, month2, year2, date2, page);

        }

    }

    async navNext() {

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

        if (this.props.app.referrals && this.props.app.referrals.page && this.props.app.referrals.totalPages && this.props.app.referrals.page < this.props.app.referrals.totalPages) {

            let page = Number(this.props.app.referrals.page) + 1;

            await this
                .props
                .fetchARTReferral(month1, year1, date1, month2, year2, date2, page);

        }

    }

    async navFirst() {

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

        let page = 1;

        await this
            .props
            .fetchARTReferral(month1, year1, date1, month2, year2, date2, page);

    }

    async navLast() {

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

        let page = -1;

        await this
            .props
            .fetchARTReferral(month1, year1, date1, month2, year2, date2, page);

    }

    async handleUpdateField(field, encounterId) {

        let newState = Object.assign({}, this.state);

        newState.currentString = '';

        newState.label = field;

        newState.currentEncounterId = encounterId;

        switch (field) {

            case 'Outcome Date':

                newState.fieldType = "date";

                break;

            default:

                newState.fieldType = "text";

                break;

        }

        newState.configs = {
            'ART Registration Number': {
                textCase: 'upper'
            },
            'Outcome Date': {
                maxDate: (new Date()).format('YYYY-mm-dd')
            }
        };

        await this.setState(newState);

    }

    async handleUpdateOutcome(id, field, encounter_id, value) {

        if (['Referral Outcome'].indexOf(field) >= 0) {

            this.ignore = true;

            await this.setState({ currentEncounterId: null, currentString: '', label: null })

        }

        let data = (this.state.edited ? this.state.edited : {});

        if (!data[encounter_id])
            data[encounter_id] = { encounter_id };

        data[encounter_id][field] = value;

        await this.setState({ edited: data });

    }

    async handleSaveRow(id, pos) {

        let data = (this.state.edited ? this.state.edited : {});

        let payload = Object.assign({ pos, user: this.props.app.activeUser }, data[id]);

        await this.props.saveReferralOutcome(payload);

        delete data[id];

        await this.setState({ edited: data });

    }

    loadClients() {

        let i = 0;

        return ((this.props.app.referrals && this.props.app.referrals.data ? this.props.app.referrals.data : []) || []).map(row => {

            i++;

            const id = uuid.v1();

            return <tr key={uuid.v1()} style={{ fontSize: '14px', backgroundColor: (i % 2 > 0 ? '#ccc' : '') }}>
                <td style={{ borderRight: '1px solid #333' }}>
                    {row.given_name} {row.family_name}
                </td>
                <td align='center' style={{ borderRight: '1px solid #333' }}>
                    {row.ec_code}
                </td>
                <td align='center' className='refValue' onClick={this.handleUpdateOutcome.bind(this, id, 'Referral Outcome', row.encounter_id, 'Started ART')}>
                    <div className={this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Referral Outcome'] ? (this.state.edited[row.encounter_id]['Referral Outcome'] === 'Started ART' ? 'refCircled' : 'refNormal') : row.outcome ? (row.outcome === 'Started ART' ? 'refCircled' : 'refNormal') : 'refNormal'}>ART</div>
                </td>
                <td align='center' className='refValue' onClick={this.handleUpdateOutcome.bind(this, id, 'Referral Outcome', row.encounter_id, 'Refused / not ready')}>
                    <div className={this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Referral Outcome'] ? (this.state.edited[row.encounter_id]['Referral Outcome'] === 'Refused / not ready' ? 'refCircled' : 'refNormal') : row.outcome ? (row.outcome === 'Refused / not ready' ? 'refCircled' : 'refNormal') : 'refNormal'}>REF</div>
                </td>
                <td align='center' className='refValue' onClick={this.handleUpdateOutcome.bind(this, id, 'Referral Outcome', row.encounter_id, 'Died')}>
                    <div className={this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Referral Outcome'] ? (this.state.edited[row.encounter_id]['Referral Outcome'] === 'Died' ? 'refCircled' : 'refNormal') : row.outcome ? (row.outcome === 'Died' ? 'refCircled' : 'refNormal') : 'refNormal'}>D</div>
                </td>
                <td align='center' className='refValue' style={{ borderRight: '1px solid #333' }} onClick={this.handleUpdateOutcome.bind(this, id, 'Referral Outcome', row.encounter_id, 'Unknown')}>
                    <div className={this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Referral Outcome'] ? (this.state.edited[row.encounter_id]['Referral Outcome'] === 'Unknown' ? 'refCircled' : 'refNormal') : row.outcome ? (row.outcome === 'Unknown' ? 'refCircled' : 'refNormal') : 'refNormal'}>UNK</div>
                </td>
                <td style={{ borderRight: '1px solid #333', padding: '0px' }} align='center'>
                    <div id={id + '-outcome-date'} key={uuid.v1()} className='refText' onMouseDown={this.handleUpdateField.bind(this, 'Outcome Date', row.encounter_id)} style={{ border: (this.state.label === 'Outcome Date' && this.state.currentEncounterId === row.encounter_id ? '2px solid #c50000' : '2px inset #888') }} >{this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Outcome Date'] ? this.state.edited[row.encounter_id]['Outcome Date'] : row.outcome_date ? (new Date(row.outcome_date).format("d mmm YYYY")) : <span>&nbsp;</span>}</div>
                </td>
                <td style={{ borderRight: '1px solid #333' }} align='left'>
                    <div id={id + '-actual-art-site'} key={uuid.v1()} className='refText' onMouseDown={this.handleUpdateField.bind(this, 'Actual ART Site', row.encounter_id)} style={{ border: (this.state.label === 'Actual ART Site' && this.state.currentEncounterId === row.encounter_id ? '2px solid #c50000' : '2px inset #888') }} >{this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['Actual ART Site'] ? this.state.edited[row.encounter_id]['Actual ART Site'] : row.art_site ? row.art_site : <span>&nbsp;</span>}</div>
                </td>
                <td align='center' style={{ borderRight: '1px solid #333' }}>
                    <div id={id + '-art-registration-number'} key={uuid.v1()} className='refText' onMouseDown={this.handleUpdateField.bind(this, 'ART Registration Number', row.encounter_id)} style={{ border: (this.state.label === 'ART Registration Number' && this.state.currentEncounterId === row.encounter_id ? '2px solid #c50000' : '2px inset #888') }} >{this.state.edited && this.state.edited[row.encounter_id] && this.state.edited[row.encounter_id]['ART Registration Number'] ? this.state.edited[row.encounter_id]['ART Registration Number'] : row.art_reg_no ? row.art_reg_no : <span>&nbsp;</span>}</div>
                </td>
                <td style={{ padding: '0px' }} align='center'>
                    <Button id={id} buttonClass={this.state.edited && this.state.edited[row.encounter_id] ? 'blue' : 'gray'} label='Save' handleMouseDown={this.handleSaveRow.bind(this, row.encounter_id, (i - 1))} />
                </td>
            </tr>

        })

    }

    render() {

        return (
            <div>
                <div style={{ border: '1px inset #888', overflow: 'auto', width: 'calc(100vw - 20px)', height: 'calc(100vh - 320px)', margin: '1px' }}>
                    <table width='100%' style={{ borderCollapse: 'collapse' }} cellPadding='10' border='0'>
                        <tbody>
                            <tr className='refHeader'>
                                <th colSpan='2' style={{ borderRight: '1px solid #333' }}>
                                    Patient
                        </th>
                                <th colSpan='7' style={{ borderRight: '1px solid #333' }}>
                                    Referral Outcome
                        </th>
                            </tr>
                            <tr>
                                <td align='center' style={{ borderRight: '1px solid #333', verticalAlign: 'bottom' }}>
                                    Name
                            </td>
                                <td align='center' style={{ borderRight: '1px solid #333', verticalAlign: 'bottom' }}>
                                    Visit Entry Code
                            </td>
                                <td className='vertHeader'>
                                    Started ART
                            </td>
                                <td className='vertHeader'>
                                    Refused/not<br /> ready
                            </td>
                                <td className='vertHeader'>
                                    Died<span style={{ color: 'white' }}>_______</span>
                                </td>
                                <td className='vertHeader' style={{ borderRight: '1px solid #333' }}>
                                    Unknown<span style={{ color: 'white' }}>__</span>
                                </td>
                                <td align='center' style={{ borderRight: '1px solid #333', verticalAlign: 'bottom' }}>
                                    Outcome Date
                            </td>
                                <td align='center' style={{ borderRight: '1px solid #333', verticalAlign: 'bottom' }}>
                                    Actual ART Site
                            </td>
                                <td align='center' style={{ borderRight: '1px solid #333', verticalAlign: 'bottom' }}>
                                    ART Reg No
                            </td>
                                <td>
                                    &nbsp;
                            </td>
                            </tr>
                        </tbody>
                        <tbody>
                            {this.loadClients()}
                        </tbody>
                        <tbody>
                            <tr>
                                <th colSpan='9'>

                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ position: 'absolute', bottom: '90px', width: '100%', textAlign: 'center' }}>
                        <Button id='btnNavFirst' buttonClass='blue' label='|<' handleMouseDown={this.navFirst.bind(this)} extraStyles={{ display: 'inline' }} />
                        <Button id='btnNavPrev' buttonClass='blue' label={<span>&lt;</span>} handleMouseDown={this.navBack.bind(this)} extraStyles={{ display: 'inline' }} />
                        <div style={{ border: '1px inset #999', borderRadius: '5px', textAlign: 'center', width: '380px', display: 'inline', padding: '15px', fontSize: '20px', marginLeft: '10px', marginRight: '10px' }}>{(this.props.app.referrals && this.props.app.referrals.page && this.props.app.referrals.totalPages ? this.props.app.referrals.page + ' of ' + this.props.app.referrals.totalPages : '- of -')}</div>
                        <Button id='btnNavNext' buttonClass='blue' label={<span>&gt;</span>} handleMouseDown={this.navNext.bind(this)} extraStyles={{ display: 'inline' }} />
                        <Button id='btnNavLast' buttonClass='blue' label='>|' handleMouseDown={this.navLast.bind(this)} extraStyles={{ display: 'inline' }} />
                    </div>
                </div>
                <div style={{
                    position: "absolute",
                    zIndex: "100",
                    textAlign: "center",
                    bottom: "10px",
                    width: "100%"
                }} onClick={(e) => { if (this.ignore) { this.ignore = false; return } else { this.hideKeyboard() } }}>
                    <div
                        style={{
                            display: "inline-block",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: "5px",
                            border: "1px solid #cccccc"
                        }} id="dvBoard" onClick={() => { this.ignore = true; }}>
                        <Keyboard
                            onChangeHandler={this
                                .onChangeHandler
                                .bind(this)}
                            currentString={this.state.currentString}
                            configs={this.state.configs}
                            options={this.props.options}
                            label={this.state.label}
                            responses={this.props.responses}
                            fieldType={this.state.fieldType}
                            smallButtons={true} /></div>
                </div>
            </div>

        )
    }

}

export default ReferralOutcome;