import React, {Component} from 'react';
import './myAccount.css';
import icoPassword from '../images/password';

class MyAccount extends Component {

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
            .changePassword(this.props.app.activeUser)
        }}>
          <img
            src={icoPassword}
            height="80"
            alt=""
            style={{
            margin: "8px"
          }}/>
          <br/>
          Change Password
        </div>
      </div>

    )

  }

}

export default MyAccount;