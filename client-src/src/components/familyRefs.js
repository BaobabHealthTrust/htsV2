import React, { Component } from 'react';
import './familyRefs.css';
import uuid from 'uuid';

class FamilyRefs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: []
    }

  }

  async setCountToZero() {

    await this.setState({ checked: ['None'] });

    await this
      .props
      .handleDirectInputChange(this.props.label, 0, this.props.activeWorkflow);

    this
      .props
      .handleDirectInputChange("HTS Referral Slips Recipients", "", this.props.activeWorkflow);

  }

  async uncheckRow(title) {

    if (this.state.checked.indexOf('None') >= 0) {

      await this.setState({ checked: [] });

      this
        .props
        .handleDirectInputChange("HTS Referral Slips Recipients", "", this.props.activeWorkflow);

    } else {

      let json = Object.assign({}, this.state);

      let typeCount = this
        .state
        .checked
        .filter((e) => {
          return e.match(title.replace(/\d+/, "").trim())
        })
        .length;

      let index = json
        .checked
        .indexOf(title.replace(/\d+/, typeCount));

      json
        .checked
        .splice(index, 1);

      await this.setState({ checked: json.checked });

      let count = Object
        .keys(this.state.checked)
        .length;

      await this
        .props
        .handleDirectInputChange(this.props.label, count, this.props.activeWorkflow);

      this
        .props
        .handleDirectInputChange("HTS Referral Slips Recipients", this.state.checked.join(","), this.props.activeWorkflow);

    }

  }

  async checkRow(title) {

    if (this.state.checked.indexOf('None') >= 0) {

      await this.setState({ checked: [] });

    }

    let json = [
      ...this.state.checked,
      title + (!title.match(/\d+/)
        ? " 1"
        : "")
    ];

    await this.setState({ checked: json });

    let count = Object
      .keys(this.state.checked)
      .length;

    await this
      .props
      .handleDirectInputChange(this.props.label, count, this.props.activeWorkflow);

    this
      .props
      .handleDirectInputChange("HTS Referral Slips Recipients", this.state.checked.join(","), this.props.activeWorkflow);

  }

  addRow(title, setAction, unsetAction, id) {

    return (
      <div
        style={{
          display: "inline-block",
          width: "300px"
        }}
        key={uuid.v4()} id={uuid.v4()}>
        <table
          style={{
            fontSize: "2em",
            cursor: "pointer"
          }}
          id={id ? id : uuid.v4()}
          onMouseDown={() => {
            this
              .state
              .checked
              .indexOf(title) >= 0
              ? unsetAction(title)
              : setAction(title)
          }}>
          <tbody>
            <tr>
              <td>
                <div style={{
                  width: "60px"
                }}>
                  {this
                    .state
                    .checked
                    .indexOf(title) >= 0
                    ? <span
                      style={{
                        fontSize: "2.1em"
                      }}>&#9745;</span>
                    : <span style={{
                      fontSize: "2.1em"
                    }}>&#9744;</span>}
                </div>
              </td>
              <td>{title}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )

  }

  addGroup(group) {

    let spousesCount = this
      .state
      .checked
      .filter((e) => {
        return e.match(group)
      })
      .length;

    return Array(spousesCount + 1)
      .fill()
      .map((_, i) => {

        return this.addRow(group + (spousesCount > 0
          ? " " + (i + 1)
          : ""), this.checkRow.bind(this), this.uncheckRow.bind(this));

      });

  }

  render() {

    return (
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}>
        <tbody>
          <tr>
            <td
              style={{
                fontSize: "2em",
                padding: "10px"
              }}>
              {this.props.label}
            </td>
          </tr>
          <tr>
            <td style={{
              borderTop: "1px solid #cccccc"
            }}>
              <div
                style={{
                  width: "100%",
                  height: "calc(100vh - 390px)",
                  overflow: "auto"
                }}>
                <div
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #cccccc"
                  }}>
                  {this.addGroup("Spouse")}
                </div>
                <div
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #cccccc"
                  }}>
                  {this.addGroup("Child")}
                </div>
                <div
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #cccccc"
                  }}>
                  {this.addGroup("Other")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style={{
              borderTop: "1px solid #cccccc"
            }}>
              {this.addRow("None", this.setCountToZero.bind(this), this.uncheckRow.bind(this), "chkNone")}
            </td>
          </tr>
        </tbody>
      </table>
    )

  }

}

export default FamilyRefs;