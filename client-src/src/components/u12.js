import React, {Component} from 'react';
import './u12.css';
import VisitCard from './visitCard';
import uuid from 'uuid';
import ModuleLogo from './moduleLogo';

class U12 extends Component {

  constructor(props) {

    super(props);

    this.state = {
      expanded: []
    };

  }

  handleExpansion(card) {

    if (this.state.expanded.indexOf(card) >= 0) {

      this.setState({expanded: []})

    } else {

      this.setState({expanded: [card]})

    }

  }

  loadVisitDetails(visitDate) {

    return (
      <div>
        {(this.props.visits
          ? this.props.visits.map((visit) => {

            return (Object.keys(visit)[0] === visitDate && Object.keys(visit[Object.keys(visit)[0]]).length > 0
              ? <VisitCard
                  details={visit[visitDate]}
                  handleVoidEncounter={this.props.handleVoidEncounter}
                  expanded={this.state.expanded}
                  handleExpansion={this
                  .handleExpansion
                  .bind(this)}
                  key={uuid.v4()}
                  app={this.props.app}
                  transcribe={this.props.transcribe}/>
              : "")

          })
          : "")}
      </div>
    )

  }

  render() {

    return (

      <div
        className="u12"
        style={{
        cssFloat: "left",
        width: (this.props.mini
          ? "calc(50vw - 10px - 2px)"
          : "100%"),
        backgroundColor: (this.props.backgroundColor && this.props.mini
          ? this.props.backgroundColor
          : "#ffffff"),
        borderLeft: "2px solid " + (this.props.borderLeft && this.props.mini
          ? this.props.borderLeft
          : "#ffffff"),
        borderBottom: "2px solid " + (this.props.borderBottom && this.props.mini
          ? this.props.borderBottom
          : "#ffffff"),
        borderRight: "2px solid " + (this.props.borderRight && this.props.mini
          ? this.props.borderRight
          : "#ffffff")
      }}
        onMouseDown={(this.props.mini
        ? () => {
          this
            .props
            .switchWorkflow(this.props.targetWorkflow)
        }
        : () => {})}>
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
                Visit Details for {(this.props.visitDate
                  ? this.props.visitDate
                  : "Selected Date")}
              </td>
            </tr>
            <tr>
              <td style={{
                padding: 0
              }}>
                <div className="u12TabContent">
                  {this.props.visits && this.props.visits.length > 0
                    ? this.loadVisitDetails(this.props.visitDate)
                    : <ModuleLogo icon={this.props.icon} module={this.props.module}/>}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    )

  }

}

export default U12;