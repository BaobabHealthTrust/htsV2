import React, {Component} from 'react';
import './admin.css';
import icoRegisters from '../images/registers';
import icoUsers from '../images/users';
import icoPrint from '../images/print';

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
        }}>
          <img
            src={icoRegisters}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Manage Registers
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this
            .props
            .updateApp({userManagementActive: true})
        }}>
          <img
            src={icoUsers}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Manage Users
        </div>
        <div
          className="sectionButton"
          onMouseDown={() => {
          this
            .props
            .printLabel()
        }}>
          <img
            src={icoPrint}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Print Label
        </div>
      </div>

    )

  }

}

export default Admin;