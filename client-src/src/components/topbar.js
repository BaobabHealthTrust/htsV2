import React, {Component} from 'react';
import './topbar.css';
import U1 from './u1';
import U2 from './u2';
import U6 from './u6';
import U7 from './u7';
import U8 from './u8';

class Topbar extends Component {

  temperature = (deg) => (
    <span>{deg}
      <sup>o</sup>C</span>
  );

  loadPatientDashboardHeader() {

    return (
      <tr>
        <td
          style={{
          width: "25vw",
          padding: (this.props.app.dual === true
            ? "2px"
            : "5px"),
          paddingLeft: (this.props.app.dual === true
            ? "5.2px"
            : "5px")
        }}>
          {(this.props.app.dual && Object.keys(this.props.client).length > 0
            ? <U6
                patientName={this.props.client.patientName}
                primary_id_label="National Health ID"
                primary_id={this.props.client.npid}
                other_id_label={this.props.client.otherIdType}
                other_id={this.props.client.otherId}
                borderTop={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                borderLeft={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                borderRight={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                backgroundColor={(this.props.activeWorkflow === "secondary"
                ? ""
                : "#eeeeee")}/>
            : (this.props.app.dual
              ? <U6
                  patientName=""
                  primary_id_label="National Health ID"
                  primary_id=""
                  other_id_label=""
                  other_id=""
                  borderTop={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  borderLeft={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  borderRight={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  backgroundColor={(this.props.activeWorkflow === "secondary"
                  ? ""
                  : "#eeeeee")}/>
              : <U6
                patientName={this.props.client.patientName}
                primary_id_label="National Health ID"
                primary_id={this.props.client.npid}
                other_id_label={this.props.client.otherIdType}
                other_id={this.props.client.otherId}/>))}
        </td>
        <td
          style={{
          width: (this.props.app.dual === true
            ? "calc(25vw)"
            : "25vw"),
          padding: (this.props.app.dual === true
            ? "2px"
            : "5px")
        }}>
          {(this.props.app.dual && Object.keys(this.props.client).length > 0
            ? <U7
                age={this.props.client.age}
                gender={this.props.client.gender}
                addressl1={this.props.client.currentVillage}
                addressl2={this.props.client.currentTA}
                addressl3={this.props.client.currentDistrict}
                phone={this.props.client.cellPhoneNumber}
                activeWorkflow={this.props.activeWorkflow}
                borderTop={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                borderLeft={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                borderRight={(this.props.activeWorkflow === "secondary"
                ? "red"
                : "#eeeeee")}
                backgroundColor={(this.props.activeWorkflow === "secondary"
                ? ""
                : "#eeeeee")}/>
            : (this.props.app.dual
              ? <U7
                  age=""
                  gender=""
                  addressl1=""
                  addressl2=""
                  addressl3=""
                  phone=""
                  activeWorkflow=""
                  borderTop={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  borderLeft={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  borderRight={(this.props.activeWorkflow === "secondary"
                  ? "red"
                  : "#eeeeee")}
                  backgroundColor={(this.props.activeWorkflow === "secondary"
                  ? ""
                  : "#eeeeee")}/>
              : <U7
                age={this.props.client.age}
                gender={this.props.client.gender}
                addressl1={this.props.client.currentVillage}
                addressl2={this.props.client.currentTA}
                addressl3={this.props.client.currentDistrict}
                phone={this.props.client.cellPhoneNumber}/>))}
        </td>
        <td
          style={{
          width: (this.props.app.dual === true
            ? "calc(25vw)"
            : "25vw"),
          padding: (this.props.app.dual === true
            ? "2px"
            : "5px"),
          paddingLeft: (this.props.app.dual === true
            ? "0px"
            : "10px")
        }}>
          {(this.props.app.dual === true
            ? <U6
                patientName={this.props.partner.patientName}
                primary_id_label="National Health ID"
                primary_id={this.props.partner.npid}
                other_id_label={this.props.partner.otherIdType}
                other_id={this.props.partner.otherId}
                activeWorkflow={this.props.activeWorkflow}
                borderTop={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                borderLeft={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                borderRight={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                backgroundColor={(this.props.activeWorkflow === "primary"
                ? ""
                : "#eeeeee")}/>
            : <U8
              bp={this.props.bp}
              bmi={this.props.bmi}
              weight={this.props.weight}
              temperature={this.temperature(this.props.temperature)}
              allergies={this.props.allergies}/>)}
        </td>
        <td
          style={{
          width: "25vw",
          padding: (this.props.app.dual === true
            ? "2px"
            : "5px"),
          paddingRight: (this.props.app.dual === true
            ? "8px"
            : "10px")
        }}>
          {(this.props.app.dual === true
            ? <U7
                age={this.props.partner.age}
                gender={this.props.partner.gender}
                addressl1={this.props.partner.currentVillage}
                addressl2={this.props.partner.currentTA}
                addressl3={this.props.partner.currentDistrict}
                phone={this.props.partner.cellPhoneNumber}
                activeWorkflow={this.props.activeWorkflow}
                borderTop={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                borderLeft={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                borderRight={(this.props.activeWorkflow === "primary"
                ? "red"
                : "#eeeeee")}
                backgroundColor={(this.props.activeWorkflow === "primary"
                ? ""
                : "#eeeeee")}/>
            : <U2 module={this.props.module} icon={this.props.icon}/>)}
        </td>
      </tr>
    )

  }

  loadIndexHeader() {

    return (
      <tr>
        <td
          style={{
          padding: "5px",
          paddingLeft: "5px"
        }}
          colSpan="3">
          <U1
            handleCheckBarcode={this.props.handleCheckBarcode}
            today={this.props.today}
            facility={this.props.facility}
            user={this.props.user}
            location={this.props.location}
            title={this.props.title}
            selectedTask={this.props.selectedTask}
            app={this.props.app}
            wf={this.props.wf}/>
        </td>
        <td
          style={{
          width: "25%",
          padding: "5px",
          paddingRight: "10px"
        }}>
          <U2
            module={this.props.module}
            icon={this.props.icon}
            switchWorkflow={this.props.switchWorkflow}
            selectedTask={this.props.selectedTask}/>
        </td>
      </tr>
    )

  }

  render() {

    return (

      <div>
        <table
          width="100%"
          border="0"
          style={{
          font: "14px \"Lucida Grande\", Helvetica, Arial, sans-serif",
          MozUserSelect: "none",
          borderCollapse: "collapse"
        }}>
          <tbody>
            {this.props.patientActivated
              ? (this.loadPatientDashboardHeader())
              : (this.loadIndexHeader())}
          </tbody>
        </table>
      </div>

    )

  }

}

export default Topbar;