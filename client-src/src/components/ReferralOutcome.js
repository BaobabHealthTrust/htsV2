import React, { Component } from 'react';
import './ReferralOutcome.css';
import uuid from 'uuid';
import Button from './button';

class ReferralOutcome extends Component {

    state = {
        page: 1
    }

    $(id) {
        return document.getElementById(id);
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
            .fetchARTReferral(month1, year1, date1, month2, year2, date2);

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

        if (this.state.page > 1) {

            let page = this.state.page - 1;

            await this.setState({ page });

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

        if (this.props.app.referrals && this.props.app.referrals.length > 0) {

            let page = this.state.page + 1;

            await this.setState({ page });

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

        await this.setState({ page });

        await this
            .props
            .fetchARTReferral(month1, year1, date1, month2, year2, date2, page);

    }

    loadClients() {

        return (this.props.app.referrals || []).map(row => {

            return <tr>

                <td>
                    {row.given_name} {row.family_name}
                </td>
                <td align='center'>
                    {row.ec_code}
                </td>
                <td align='center'>
                    ART
                </td>
                <td align='center'>
                    REF
                </td>
                <td align='center'>
                    D
                </td>
                <td align='center'>
                    UNK
                </td>
                <td>
                    <input type='text' key={uuid.v1()} />
                </td>
                <td>
                    <input type='text' key={uuid.v1()} />
                </td>
                <td>
                    <input type='text' key={uuid.v1()} />
                </td>

            </tr>

        })

    }

    render() {

        return (
            <div>
                <table width='100%' style={{ borderCollapse: 'collapse' }} cellPadding='10' border='0'>
                    <tbody>
                        <tr className='refHeader'>
                            <th colSpan='2'>
                                Patient
                        </th>
                            <th colSpan='7'>
                                Referral Outcome
                        </th>
                        </tr>
                        <tr>
                            <td align='center'>
                                Name
                            </td>
                            <td align='center'>
                                Visit Entry Code
                            </td>
                            <td align='center'>
                                Started ART
                            </td>
                            <td align='center'>
                                Refused/not ready
                            </td>
                            <td align='center'>
                                Died
                            </td>
                            <td align='center'>
                                Unknown
                            </td>
                            <td align='center'>
                                Outcome Date
                            </td>
                            <td align='center'>
                                Actual ART Site
                            </td>
                            <td align='center'>
                                ART Reg No
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        {this.loadClients()}
                    </tbody>
                    <tbody>
                        <tr>
                            <th colSpan='9'>
                                <Button id='btnNavFirst' className='blue' label='|<' handleMouseDown={this.navFirst.bind(this)} />
                                <Button id='btnNavPrev' className='blue' label={<span>&lt;</span>} handleMouseDown={this.navBack.bind(this)} />
                                <Button id='btnNavNext' className='blue' label={<span>&gt;</span>} handleMouseDown={this.navNext.bind(this)} />
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>

        )
    }

}

export default ReferralOutcome;