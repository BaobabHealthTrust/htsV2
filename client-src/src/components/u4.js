import React, {Component} from 'react';
import './u4.css';
import ModuleLogo from './moduleLogo';
import Overview from './overview';
import MyAccount from './myAccount';
import Reports from './reports';
import Admin from './admin';
import ManageRegisters from './manageRegisters';
import ManageUsers from './manageUsers';
import ManageKits from './manageKits';

class U4 extends Component {

  render() {

    return (

      <div className="u4">
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
                fontSize: "12px",
                textAlign: "center"
              }}>
                {(this.props.selectedModule
                  ? this.props.selectedModule + " Statistics"
                  : "...")}
              </td>
            </tr>
            <tr>
              <td style={{
                padding: 0
              }}>
                <div className="u4TabContent">
                  {this.props.currentTab === "overview"
                    ? <Overview
                        fetchVisitSummaries={this.props.fetchVisitSummaries}
                        reports={this.props.reports}/>
                    : this.props.currentTab === "my account"
                      ? <MyAccount app={this.props.app} changePassword={this.props.changePassword}/>
                      : this.props.currentTab === "reports"
                        ? <Reports updateApp={this.props.updateApp}/>
                        : this.props.currentTab === "admin"
                          ? <Admin
                              updateApp={this.props.updateApp}
                              switchTab={this.props.switchTab}
                              printLabel={this.props.printLabel}/>
                          : this.props.currentTab === "manage registers"
                            ? <ManageRegisters
                                updateApp={this.props.updateApp}
                                switchTab={this.props.switchTab}
                                addRegister={this.props.addRegister}
                                closeRegister={this.props.closeRegister}
                                app={this.props.app}
                                fetchRegisterStats={this.props.fetchRegisterStats}/>
                            : this.props.currentTab === "manage kits"
                              ? <ManageKits updateApp={this.props.updateApp} switchTab={this.props.switchTab}/>
                              : this.props.currentTab === "manage users"
                                ? <ManageUsers updateApp={this.props.updateApp} switchTab={this.props.switchTab}/>
                                : <ModuleLogo icon={this.props.icon} module={this.props.selectedModule}/>}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default U4;