import React, {Component} from 'react';
import './dashboard.css';
import U9 from './u9';
import U11 from './u11';
import U12 from './u12';
import U5 from './u5';
import U10 from './u10';

class Dashboard extends Component {

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
              <U9
                programs={this.props.programs}
                handleSwitchProgram={this.props.handleSwitchProgram}
                selectedModule={this.props.selectedModule}/>
            </td>
            <td
              rowSpan="2"
              style={{
              width: "160px",
              verticalAlign: "top"
            }}>
              <U11
                handleVisitUrl={this.props.handleVisitUrl}
                visits={this.props.visits}
                selectedVisit={this.props.selectedVisit}/>
            </td>
            <td
              rowSpan="2"
              style={{
              minWidth: "250px",
              verticalAlign: "top"
            }}>
              <U12
                visitDate={this.props.selectedVisit}
                visits={this.props.visits}
                handleVoidEncounter={this.props.handleVoidEncounter}
                module={this.props.selectedModule}
                icon={this.props.icon}
                app={this.props.app}
                transcribe={this.props.transcribe}/>
            </td>
            <td
              rowSpan="2"
              style={{
              width: "200px",
              verticalAlign: "top"
            }}>
              <U5
                tasks={this.props.tasks}
                handleNavigateToUrl={this.props.handleNavigateToUrl}
                selectedTask={this.props.selectedTask}
                activeSection={this.props.activeSection}
                order={this.props.order}/>
            </td>
          </tr>
          <tr>
            <td>
              <U10/>
            </td>
          </tr>
        </tbody>
      </table>

    )

  }

}

export default Dashboard;