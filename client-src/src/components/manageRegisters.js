import React, {Component} from 'react';
import './manageRegisters.css';
import Button from "./button";

class ManageRegisters extends Component {

  componentDidMount() {

    this
      .props
      .fetchRegisterStats();

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
          cellPadding="20">
          <tbody>
            <tr>
              <th colSpan="2" style={{
                fontSize: "24px"
              }}>
                Registers Management
              </th>
            </tr>
            <tr>
              <td align="right" style={{
                width: "50%"
              }}>
                Registers in Use :
              </td>
              <td>
                {this.props.app.activeRegisters
                  ? this.props.app.activeRegisters
                  : 0}
              </td>
            </tr>
            <tr>
              <td align="right">
                Closed Registers :
              </td>
              <td>
                {this.props.app.closedRegisters
                  ? this.props.app.closedRegisters
                  : 0}
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="center">
                <Button label="Add Register" handleMouseDown={this.props.addRegister}/>
                <Button label="Close Register" handleMouseDown={this.props.closeRegister}/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default ManageRegisters;