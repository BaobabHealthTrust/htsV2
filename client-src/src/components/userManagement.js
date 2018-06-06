import React, { Component } from 'react';
import './userManagement.css';
import uuid from 'uuid';
import Button from './button';

class UserManagement extends Component {

  blockUser(e, username) {

    this
      .props
      .showConfirmMsg("Confirmation", "Do you really want to block user " + username, "Block", () => {

        this
          .props
          .blockUser(username);

      })

  }

  editUser(e, username, firstName, lastName, gender, role) {

    this
      .props
      .editUser(username, firstName, lastName, gender, role);

  }

  activateUser(e, username) {

    this
      .props
      .activateUser(username);

  }

  loadUserList() {

    return (
      <tbody>
        {(this.props.app.usersList ? this.props.app.usersList : []).map((e) => {
          return <tr id={uuid.v4()} key={uuid.v4()}>
            <td>
              {e.pos}
            </td>
            <td align="left">
              {e.givenName + " " + e.familyName}
            </td>
            <td align="left">
              {e.username}
            </td>
            <td>
              {e.gender}
            </td>
            <td align="left">
              {e.role}
            </td>
            <td>
              <Button
                label="Edit"
                handleMouseDown={() => {
                  this.editUser(this, e.username, e.givenName, e.familyName, e.gender, e.role)
                }} />
            </td>
            <td>
              {this.props.app.activeUser === e.username
                ? <span>&nbsp;</span>
                : <Button
                  label="Block"
                  buttonClass={String(e.retired) !== "0"
                    ? "gray"
                    : "red"}
                  handleMouseDown={() => {
                    this.blockUser(this, e.username)
                  }} />}
            </td>
            <td>
              {this.props.app.activeUser === e.username
                ? <span>&nbsp;</span>
                : <Button
                  label="Activate"
                  buttonClass={String(e.retired) === "0"
                    ? "gray"
                    : "blue"}
                  handleMouseDown={() => {
                    this.activateUser(this, e.username)
                  }} />}
            </td>
          </tr>
        })}
      </tbody>
    )

  }

  componentDidMount() {

    this
      .props
      .fetchUsers();

  }

  fetchUsers(page) {

    this
      .props
      .fetchUsers(page);

  }

  render() {

    return (

      <div>
        <div id="content">
          <table
            width="100%"
            cellSpacing="0"
            style={{
              margin: "0px"
            }}>
            <tbody>
              <tr>
                <td
                  style={{
                    fontSize: "2.3em",
                    backgroundColor: "rgb(98, 129, 167)",
                    color: "rgb(238, 238, 238)",
                    padding: "15px",
                    textAlign: "center"
                  }}>
                  User Management
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "5px solid rgb(204, 204, 204)",
                    padding: "0px"
                  }}></td>
              </tr>
            </tbody>
          </table>
          <div
            id="user.content"
            style={{
              height: "calc(100% - 175px)",
              backgroundColor: "rgb(255, 255, 255)",
              overflow: "auto",
              padding: "1px",
              textAlign: "center"
            }}>
            <table
              border="1"
              width="100%"
              cellPadding="8"
              style={{
                borderCollapse: "collapse",
                borderColor: "rgb(238, 238, 238)"
              }}>
              <tbody>
                <tr
                  style={{
                    backgroundColor: "rgb(153, 153, 153)",
                    color: "rgb(238, 238, 238)"
                  }}>
                  <th style={{
                    width: "30px"
                  }}>#</th>
                  <th
                    style={{
                      width: "200px"
                    }}
                    align="left">Name</th>
                  <th style={{
                    width: "100px"
                  }}>Username</th>
                  <th style={{
                    width: "80px"
                  }}>Gender</th>
                  <th align="left">Role</th>
                  <th style={{
                    width: "60px"
                  }}>Edit</th>
                  <th style={{
                    width: "60px"
                  }}>Block</th>
                  <th style={{
                    width: "60px"
                  }}>Activate</th>
                </tr>
              </tbody>
              {this.loadUserList()}
              <tbody>
                <tr>
                  <td colSpan="8" align="right">
                    <div style={{ position: "absolute", right: "227px", bottom: "7px", zIndex: "1000" }}>
                      <Button label="|<"
                        buttonClass={!isNaN(this.props.app.page) && this.props.app.page <= 1
                          ? "gray"
                          : "blue"}
                        handleMouseDown={() => { this.fetchUsers(1) }} />
                      <Button label="<"
                        buttonClass={!isNaN(this.props.app.page) && this.props.app.page <= 1
                          ? "gray"
                          : "blue"}
                        handleMouseDown={() => { this.fetchUsers(this.props.app.page - 1) }} />
                      <Button label=">"
                        buttonClass={!isNaN(this.props.app.page) && !isNaN(this.props.app.pages) && this.props.app.page === this.props.app.pages
                          ? "gray"
                          : "blue"}
                        handleMouseDown={() => { this.fetchUsers(this.props.app.page + 1) }} />
                      <Button label=">|"
                        buttonClass={!isNaN(this.props.app.page) && !isNaN(this.props.app.pages) && this.props.app.page === this.props.app.pages
                          ? "gray"
                          : "blue"}
                        handleMouseDown={() => { this.fetchUsers(this.props.app.pages) }} />
                      <Button label="Find by Username"
                        buttonClass={"blue"}
                        handleMouseDown={() => { }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    )

  }

}

export default UserManagement;