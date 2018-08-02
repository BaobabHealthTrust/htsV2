import React, { Component } from 'react';
import './admin.css';
import icoRegisters from '../images/registers';
import icoUsers from '../images/users';
import icoPrint from '../images/print';
import icoLocations from '../images/locations';
import icoTAs from '../images/sites';
import icoStats from '../images/stats';

class Admin extends Component {

  render() {

    return (

      <div style={{
        textAlign: "center",
        padding: "10px"
      }}>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .switchTab("manage registers", "Administration")
          }} id="btnManageRegisters">
          <img
            src={icoRegisters}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          Manage Registers
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .updateApp({ userManagementActive: true })
          }} id="btnManageUsers">
          <img
            src={icoUsers}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          Manage Users
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .showUserStats()
          }} id="btnUserStats">
          <img
            src={icoStats}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          User Stats
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .addLocation()
          }} id="btnAddLocation">
          <img
            src={icoLocations}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          Add Location
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .addVillages()
          }} id="btnAddVillages">
          <img
            src={icoTAs}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          Add Villages
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
            this
              .props
              .printLabel()
          }} id="btnPrintLabel">
          <img
            src={icoPrint}
            height="80"
            alt=""
            style={{
              margin: "8px"
            }} />
          <br />
          Print Label
        </div>
      </div>

    )

  }

}

export default Admin;