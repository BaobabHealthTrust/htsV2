import React, {Component} from 'react';
import './reports.css';
import icoDaily from '../images/daily-register';
import icoMonthly from '../images/monthly-report';
import icoPepfar from '../images/pepfar';
import icoData from '../images/data';

class Reports extends Component {

  async renderDailyRegister() {

    await this
      .props
      .updateApp({currentSection: "reports", activeReport: "daily register"})

  }

  async renderMonthlyReport() {

    await this
      .props
      .updateApp({currentSection: "reports", activeReport: "monthly report"})

  }

  async renderPepfarReport() {

    await this
      .props
      .updateApp({currentSection: "reports", activeReport: "pepfar report"})

  }

  async renderRawDataReport() {

    await this
      .props
      .updateApp({currentSection: "reports", activeReport: "raw data report"})

  }

  render() {

    return (

      <div style={{
        textAlign: "center",
        padding: "10px"
      }}>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this.renderDailyRegister()
        }}>
          <img
            src={icoDaily}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Daily Activity Register
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this.renderMonthlyReport()
        }}>
          <img
            src={icoMonthly}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Monthly Report
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this.renderPepfarReport()
        }}>
          <img
            src={icoPepfar}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Disaggregated Report
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this.renderRawDataReport()
        }}>
          <img
            src={icoData}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Raw Data
        </div>
      </div>

    )

  }

}

export default Reports;