import React, {Component} from 'react';
import './ddeSearch.css';

class DDESearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clientName: null,
      age: null,
      nhid: null,
      gender: null,
      residence: null,
      page: 1,
      pageSize: 6,
      pageCount: 0,
      selectedId: null,
      busy: false
    }

  }

  $ = (id) => {
    return document.getElementById(id);
  }

  fetchAge(json) {

    if (json.birthdate === undefined || json.birthdate === null) {

      if (json.age) {

        return json.age;

      }

      return "";

    }

    let age = ((new Date()).getFullYear() - (new Date(json.birthdate)).getFullYear());

    if (age < 1) {

      age = ((new Date()).getMonth() - (new Date(json.birthdate)).getMonth());

      if (age > 0) {

        age += " Month" + (age > 1
          ? "s"
          : "");

      }

    }

    if (age < 1) {

      age = ((new Date()).getDate() - (new Date(json.birthdate)).getDate());

      if (age > 6) {

        age = Math.floor(age / 7) + " Week" + (Math.floor(age / 7) > 1
          ? "s"
          : "");

      } else {

        age += " Day" + (age > 1
          ? "s"
          : "");

      }

    }

    json.age = age;

    return age;

  }

  loadPatientData(id) {

    const activeClient = (this.props.ddeResults || []).filter((e) => {
      return e._id === id || e.otherId === id
    })[0];

    const genders = {
      F: "Female",
      M: "Male"
    };

    if (activeClient) {

      this.setState({
        clientName: (activeClient.names
          ? activeClient.names.given_name + " " + activeClient.names.family_name
          : (activeClient.patientName
            ? activeClient.patientName
            : "Anonymous")),
        age: this.fetchAge(activeClient),
        nhid: (activeClient._id || activeClient.otherId),
        gender: (activeClient.gender && activeClient.gender.length > 1
          ? activeClient.gender
          : genders[activeClient.gender]),
        residence: (activeClient.addresses
          ? activeClient.addresses.current_village
          : ""),
        selectedId: id
      })

      this
        .props
        .selectPatient(activeClient);

      if (this.$("btnNext")) {

        this
          .$("btnNext")
          .className = "green";

      }

    }

  }

  loadDDEResults() {

    return ((this.props.ddeResults || []).map((row) => {

      return <li
        id={row._id || row.otherId}
        key={row._id || row.otherId}
        className={this.state.selectedId === (row._id || row.otherId)
        ? "selectedListLi"
        : "selectListLi"}
        style={{
        borderRadius: "10px"
      }}
        onMouseDown={() => {
        this.loadPatientData((row._id || row.otherId))
      }}>
        <table width="100%">
          <tbody>
            <tr>
              <td style={{
                width: "60%"
              }}>
                {(row.names
                  ? (row.names && row.names.given_name
                    ? row.names.given_name
                    : "-") + " " + (row.names && row.names.family_name
                    ? row.names.family_name
                    : "-")
                  : (row.patientName
                    ? row.patientName
                    : "Anonymous")) + " (" + this.fetchAge(row) + ")"}
              </td>
              <td style={{
                width: "40%"
              }}>{row._id}</td>
            </tr>
          </tbody>
        </table>
      </li>
    }))
  }

  async fetchForward() {

    const given_name = (this.props.responses && this.props.responses["First Name"]
      ? this.props.responses["First Name"]
      : "");

    const family_name = (this.props.responses && this.props.responses["Last Name"]
      ? this.props.responses["Last Name"]
      : "");

    const gender = (this.props.responses && this.props.responses["Gender"]
      ? this.props.responses["Gender"]
      : "");

    await this.setState({
      page: this.state.page + 1,
      clientName: null,
      age: null,
      nhid: null,
      gender: null,
      residence: null,
      selectedId: null
    })

    this
      .props
      .searchByNameAndGender({given_name, family_name, gender, page_size: this.state.pageSize, page: this.state.page});

  }

  async fetchBackward() {

    const given_name = (this.props.responses && this.props.responses["First Name"]
      ? this.props.responses["First Name"]
      : "");

    const family_name = (this.props.responses && this.props.responses["Last Name"]
      ? this.props.responses["Last Name"]
      : "");

    const gender = (this.props.responses && this.props.responses["Gender"]
      ? this.props.responses["Gender"]
      : "");

    if (this.state.page > 1) {

      await this.setState({
        page: this.state.page - 1,
        clientName: null,
        age: null,
        nhid: null,
        gender: null,
        residence: null,
        selectedId: null
      })

    }

    this
      .props
      .searchByNameAndGender({given_name, family_name, gender, page_size: 6, page: this.state.page});

  }

  componentDidMount() {

    if (this.$("btnClear")) {

      this
        .$("btnClear")
        .innerHTML = "New Client";

    }

    if (this.$("btnNext")) {

      this
        .$("btnNext")
        .innerHTML = "Select";

      this
        .$("btnNext")
        .style
        .minWidth = "100px";

      this
        .$("btnNext")
        .className = "gray";

    }

  }

  componentWillUnmount() {

    if (this.$("btnClear")) {

      this
        .$("btnClear")
        .innerHTML = "Clear";

    }

    if (this.$("btnNext")) {

      this
        .$("btnNext")
        .innerHTML = "Next";

      this
        .$("btnNext")
        .className = "green";

    }

  }

  async componentDidUpdate() {

    if (this.props.sectionHeader !== "Find Client By Name") {

      if (!this.state.busy && this.props.activeSection === "registration" && (this.props.ddeResults || []).length === 1) {

        await this.setState({busy: true});

        const activeClient = this.props.ddeResults[0];

        await this
          .props
          .selectPatient(activeClient);

        if (this.$("btnNext")) {

          this
            .$("btnNext")
            .className = "green";

        }

        await this
          .props
          .handleNextButtonClicks();

        await this.setState({busy: false});

      } else if (!this.state.busy && this.props.activeSection === "registration" && Object.keys(this.props.ddeCurrentPatient).length > 0) {

        await this.setState({busy: true});

        const activeClient = this.props.ddeCurrentPatient;

        await this
          .props
          .selectPatient(activeClient);

        if (this.$("btnNext")) {

          this
            .$("btnNext")
            .className = "green";

        }

        await this
          .props
          .handleNextButtonClicks();

        await this.setState({busy: false});

      } else if (!this.state.busy) {

        await this.setState({busy: true});

        await this
          .props
          .updateApp({sectionHeader: "Find Client By Name"})

        await this.setState({busy: false});

      }

    }

  }

  render() {
    return (

      <div>
        <table
          style={{
          borderCollapse: "collapse",
          width: "calc(100% - 8px)"
        }}
          border="0"
          cellPadding="0">
          <tbody>
            <tr>
              <td
                colSpan="3"
                style={{
                fontSize: "2em",
                padding: "10px"
              }}
                id="ddeHelpText">
                {this.props.label}
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style={{
                paddingLeft: "0px"
              }}
                rowSpan="2">
                <div
                  className={this.props.mini
                  ? "mini-panel"
                  : "panel"}>
                  {this.state.clientName != null
                    ? <table
                        width="100%"
                        cellPadding="10"
                        style={{
                        fontSize: "1.5em",
                        margin: "auto"
                      }}>
                        <tbody>
                          <tr>
                            <th
                              align="right"
                              style={{
                              borderRight: "1px dotted #333333",
                              width: "250px"
                            }}>
                              Client Name:
                            </th>
                            <td align="left">
                              {this.state.clientName}
                            </td>
                          </tr>
                          <tr>
                            <th
                              align="right"
                              style={{
                              borderRight: "1px dotted #333333",
                              width: "250px"
                            }}>
                              Age:
                            </th>
                            <td align="left">
                              {this.state.age}
                            </td>
                          </tr>
                          <tr>
                            <th
                              align="right"
                              style={{
                              borderRight: "1px dotted #333333",
                              width: "250px"
                            }}>
                              National Health ID:
                            </th>
                            <td align="left">
                              {this.state.nhid}
                            </td>
                          </tr>
                          <tr>
                            <th
                              align="right"
                              style={{
                              borderRight: "1px dotted #333333",
                              width: "250px"
                            }}>
                              Gender:
                            </th>
                            <td align="left">
                              {this.state.gender}
                            </td>
                          </tr>
                          <tr>
                            <th
                              align="right"
                              style={{
                              borderRight: "1px dotted #333333",
                              width: "250px"
                            }}>
                              Residence:
                            </th>
                            <td align="left">
                              {this.state.residence}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    : ""}
                </div>
              </td>
              <td align="center" rowSpan="2">
                <div
                  className={this.props.mini
                  ? "mini-panel"
                  : "panel"}>
                  <ul
                    className="selectUl"
                    style={{
                    listStyle: "none",
                    textAlign: "left",
                    padding: "0px"
                  }}>{this.loadDDEResults()}</ul>
                </div>
              </td>
              <td
                align="center"
                style={{
                width: "60px",
                backgroundColor: "#eeeeee",
                verticalAlign: "top"
              }}>
                <div
                  className={this.state.page > 1
                  ? "arrow-up"
                  : "arrow-up-disabled"}
                  onMouseDown={this.state.page > 1
                  ? () => {
                    this.fetchBackward()
                  }
                  : () => {}}/>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style={{
                width: "60px",
                backgroundColor: "#eeeeee",
                verticalAlign: "bottom"
              }}><div
                className={(this.props.ddeResults || []).length >= this.state.pageSize
        ? "arrow-down"
        : "arrow-down-disabled"}
                onMouseDown={(this.props.ddeResults || []).length >= this.state.pageSize
        ? () => {
          this.fetchForward()
        }
        : () => {}}/></td>
            </tr>
          </tbody>
        </table>
      </div>

    )
  }
}

export default DDESearch;