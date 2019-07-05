import React, {Component} from 'react';
import './overview.css';
import Axios from 'axios';

class Issue extends Component {

  constructor(props) {
    super(props)
    this.state = {
      encounters: []
    }
  }

  fetchInvalidEncounters () {
    return Axios.get('/programs/invalid_encounters')
  }

  async componentWillMount () {
    const payload = (await this.fetchInvalidEncounters()).data
    payload.length && this.setState({ encounters: payload })
  }

  render() {

    return (

      <div style={{ padding: "5px" }}>
        { this.state.encounters.length === 0 && (<h3 style={{ textAlign: 'center' }}>No issues at the moment.</h3>)}
        { this.state.encounters.length > 0 && (<table style={{ borderCollapse: "collapse", width: "100%", borderColor: "#cccccc", textAlign: 'left' }} cellPadding="10" border="1">
          <tbody>
            <tr
              style={{
              backgroundColor: "#cccccc",
              color: "#333333",
              border: "1px solid #eeeeee"
            }}>
              <th>
                Entry Code
              </th>
              <th>
                Date
              </th>
            </tr>
            { this.state.encounters.map(encounter => (<tr><td>{ encounter.entryCode }</td><td>{ encounter.createdAt }</td></tr>))}
          </tbody>
        </table>) }
      </div>

    )

  }

}

export default Issue;