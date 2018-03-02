import React, {Component} from 'react';
import './reportsViewer.css';
import DailyActivityRegister from './dailyActivityRegister';
import MonthlyReport from './monthlyReport';
import Pepfar from './pepfar';
import RawData from './rawData';
import Keyboard from './keyboard';
import U14 from './u14';

class ReportsViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      count: 0,
      fieldType: "",
      configs: {},
      label: null,
      currentString: ""
    }

  }

  scrollTop = 0;

  startPos = 0;
  endPos = 20;

  onChangeHandler(text) {

    const newState = this.state;

    newState.currentString = text;

    newState.data[this.props.label] = text;

    this.setState(newState);

    this
      .props
      .handleDirectInputChange(this.props.label, text, this.props.group);

  }

  componentDidMount() {

    switch (this.props.activeReport) {

      case "monthly report":

        break;

      case "pepfar report":

        this
          .props
          .setDataHeaders([
            "Site",
            "Month",
            "Year",
            "Service Delivery Point",
            "HTS Access Type",
            "Age Group",
            "Sex",
            "Result Given",
            "Count"
          ]);

        break;

      case "daily register":

        this
          .props
          .setDataHeaders(["KitName", "Location", "Date", "Kits"]);

        break;

      default:

        this
          .props
          .setDataHeaders([
            "Visit Date",
            "Entry Code",
            "HTS Provider ID",
            "Service Delivery Point",
            "Sex/Pregnancy",
            "Date of Birth",
            "Age Group",
            "HTS Access Type",
            "Last HIV Test Result",
            "Time Since Last Test",
            "Partner Present",
            "First Pass Test 1 Result",
            "First Pass Test 2 Result",
            "Immediate Repeat Test 1 Result",
            "Immediate Repeat Test 2 Result",
            "Outcome Summary",
            "Result Given to Client",
            "Partner HIV Status",
            "Client Risk Category",
            "Referral for Re-Testing",
            "HTS Family Ref Slips"
          ]);

        break;

    }

  }

  render() {

    let CustomComponent;

    if (this.props.app.selectedTask === "Report Filter") {

      CustomComponent = U14;

    } else {

      switch (this.props.activeReport) {

        case "monthly report":

          CustomComponent = MonthlyReport;

          break;

        case "pepfar report":

          CustomComponent = Pepfar;

          break;

        case "daily register":

          CustomComponent = DailyActivityRegister;

          break;

        default:

          CustomComponent = RawData;

          break;

      }

    }

    return (

      <div
        style={{
        overflow: "auto",
        padding: "20px",
        height: "calc(100vh - 122px)"
      }}
        id="reportScroller"
        onScroll={() => {
        if (this.props.app.processing) 
          return;
        if (this.props.activeReport !== "pepfar report") 
          return;
        if ((document.getElementById('reportScroller').scrollHeight - (document.getElementById('reportScroller').scrollTop + document.getElementById('reportScroller').offsetHeight)) < 100) {
          this.scrollTop = document
            .getElementById('reportScroller')
            .scrollTop;
          this.startPos += 20;
          this.endPos += 20;
          this
            .props
            .scrollPepfarData(this.startPos, this.endPos);
        }
      }}>
        <CustomComponent
          reports={this.props.reports}
          setDataHeaders={this.props.setDataHeaders}
          app={this.props.app}
          dialog={this.props.dialog}
          responses={this.props.responses}
          configs={this.props.configs}
          label={this.props.label}
          selectedTask={this.props.selectedTask}
          sectionHeader={this.props.sectionHeader}
          handleDirectInputChange={this.props.handleDirectInputChange}
          queryOptions={this.props.queryOptions}
          group={this.props.group}
          navNext={this.props.navNext}
          data={this.props.data}/>

        <div
          style={{
          position: "absolute",
          bottom: "90px",
          textAlign: "center",
          width: "calc(100% - 10px)",
          left: "5px"
        }}>
          <Keyboard
            onChangeHandler={this
            .onChangeHandler
            .bind(this)}
            currentString={(this.props.responses[this.props.group] && this.props.responses[this.props.group][this.props.label]
            ? this.props.responses[this.props.group][this.props.label]
            : "")}
            configs={this.props.configs}
            options={this.props.options}
            label={this.props.label}
            responses={this.props.responses[this.props.group]}
            fieldType={this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].fieldType !== undefined
            ? this.props.configs[this.props.label].fieldType
            : ""}/>
        </div>

      </div>

    )

  }

}

export default ReportsViewer;