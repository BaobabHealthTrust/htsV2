import React, { Component } from 'react';
import './home.css';
import U3 from './u3';
import U4 from './u4';
import U5 from './u5';

class Home extends Component {

  render() {

    return (

      <table
        width="100%"
        style={{
          borderCollapse: "collapse"
        }}
        border="0">
        <tbody>
          <tr>
            <td style={{
              width: "250px"
            }}>
              <U3
                programs={this.props.programs}
                handleSwitchProgram={this.props.handleSwitchProgram}
                selectedModule={this.props.selectedModule} />
            </td>
            <td style={{
              verticalAlign: "top"
            }}>
              <U4
                handleVisitUrl={this.props.handleVisitUrl}
                visits={this.props.programs && this.props.programs[this.props.selectedModule]
                  ? this.props.programs[this.props.selectedModule].visits
                  : []}
                selectedVisit={this.props.selectedVisit}
                selectedModule={this.props.selectedModule}
                icon={this.props.icon}
                currentTab={this.props.currentTab}
                updateApp={this.props.updateApp}
                switchTab={this.props.switchTab}
                addRegister={this.props.addRegister}
                closeRegister={this.props.closeRegister}
                app={this.props.app}
                fetchRegisterStats={this.props.fetchRegisterStats}
                fetchVisitSummaries={this.props.fetchVisitSummaries}
                reports={this.props.reports}
                handleSwitchProgram={this.props.handleSwitchProgram}
                changePassword={this.props.changePassword}
                printLabel={this.props.printLabel}
                addLocation={this.props.addLocation}
                addVillages={this.props.addVillages}
                showUserStats={this.props.showUserStats} />
            </td>
            <td style={{
              width: "200px"
            }}>
              <U5
                tasks={this.props.tasks}
                handleNavigateToUrl={this.props.handleNavigateToUrl}
                selectedTask={this.props.app.selectedTask}
                activeSection={this.props.activeSection}
                order={this.props.order}
                switchTab={this.props.switchTab}
                updateApp={this.props.updateApp} />
            </td>
          </tr>
        </tbody>
      </table>

    )

  }

}

export default Home;