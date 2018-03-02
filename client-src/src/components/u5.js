import React, {Component} from 'react';
import './u5.css';

class U5 extends Component {

  loadTasks(tasks = [], order = []) {

    return order.map((label) => {

      const task = tasks.filter((item) => {
        return item.label === label
      })[0];

      return <li
        id={"task-" + task.label}
        key={"task-" + task.label}
        className={"selectLabel " + (task.done && false
        ? "disabled"
        : (this.props.selectedTask === task.label
          ? " selected "
          : " selectItem "))}
        onMouseDown={!task.done || true
        ? (task.label === "Reports"
          ? () => {
            this
              .props
              .switchTab("reports", "Reports")
          }
          : task.label === "Overview"
            ? () => {
              this
                .props
                .switchTab("overview", "Overview")
            }
            : task.label === "My Account"
              ? () => {
                this
                  .props
                  .switchTab("my account", "My Account")
              }
              : task.label === "Administration"
                ? () => {
                  this
                    .props
                    .switchTab("admin", "Administration")
                }
                : this.props.handleNavigateToUrl.bind(this, task.label, task.url, "primary"))
        : () => {}}>
        {task.label}
      </li>

    })

  }

  render() {

    return (

      <div className="u5">
        <table
          style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #345db5"
        }}
          border="1"
          cellPadding="5"
          cellSpacing="0">
          <tbody>
            <tr style={{
              backgroundColor: "#345db5"
            }}>
              <td
                style={{
                color: "#fff",
                fontWeight: "bold",
                paddingLeft: "10px",
                fontSize: "12px"
              }}>
                {(this.props.activeSection === "patient"
                  ? "Tasks"
                  : "Menu")}
              </td>
            </tr>
            <tr>
              <td style={{
                padding: 0
              }}>
                <div className="u5TabContent">
                  <ul
                    style={{
                    listStyle: "none",
                    width: "100%",
                    padding: "0px",
                    margin: "0px",
                    marginTop: "4px"
                  }}>
                    {this.loadTasks(this.props.tasks, this.props.order)}
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default U5;