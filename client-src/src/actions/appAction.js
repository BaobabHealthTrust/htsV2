import axios from "axios";
import oboe from "oboe";

export function initApp(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY, { timeout: 10000 });

  return { type: 'INIT_APP', payload: request }

}

export function updateApp(payload) {

  return { type: 'UPDATE_APP', payload: payload }

}

export function submitForm(url, payload) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'SUBMIT_FORM', payload: request }

}

export function fetchJSON(url, path, group, subGroup) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, {
    path: path,
    group: group,
    subGroup: subGroup
  });

  return { type: 'FETCH_JSON', payload: request }

}

export function fetchPatientData(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'FETCH_PATIENT_DATA', payload: request }

}

export function voidEncounter(url, payload) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'VOID_ENCOUNTER', payload: request }

}

export function specialSubmitForm(url, payload) {

  return (dispatch) => {
    dispatch({ type: "SUBMIT" });
    axios
      .post(url, payload)
      .then((res) => {
        dispatch({ type: "SUBMIT_SUCCESS", payload: res });
      })
      .catch((error) => {
        dispatch({ type: "SUBMIT_FAILURE", payload: error });
      })
  }

}

export function fetchVisits(id, flashId) {

  return async (dispatch) => {

    await dispatch({ type: "FETCHING_VISITS", payload: id });

    oboe('/programs/fetch_visits/' + id).on('node', '_source', function (row) {

      dispatch({ type: "FETCHED_VISIT", payload: row })

    }).done(() => {

      dispatch({
        type: "FETCH_VISITS_DONE",
        payload: {
          id,
          flashId
        }
      });

    })

  }

}

export function voidMultipleEncounters(url, payload) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'VOID_MULTIPLE_ENCOUNTERS', payload: request }

}

export function fetchRegisterStats(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'FETCH_REGISTER_STATS', payload: request };

}

export function logout(token) {

  const API_KEY = "";
  const END_POINT = "/logout/" + token;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'LOGOUT', payload: request };

}

export function login(payload) {

  const url = '/login';
  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'LOGIN', payload: request };

}

export function setLocation(location, token) {

  const API_KEY = "";
  const END_POINT = "/set_location/" + location + "/" + token;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'SET_LOCATION', payload: request };

}

export function sessionValid(token) {

  const API_KEY = "";
  const END_POINT = "/active/" + token;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'SESSION_VALID', payload: request };

}

export function fetchUsers(page = 1, pageSize = 10) {

  const API_KEY = "";
  const END_POINT = '/users/list?page=' + page + "&pageSize=" + pageSize;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'FETCH_USERS', payload: request };

}

export function blockUser(username) {

  const API_KEY = "";
  const END_POINT = '/user/block_user/' + username;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'BLOCK_USER', payload: request };

}

export function activateUser(username) {

  const API_KEY = "";
  const END_POINT = '/user/activate_user/' + username;
  const request = axios.get(END_POINT + API_KEY);

  return { type: 'ACTIVATE_USER', payload: request };

}

export function loadData(group, subGroup, configs, ignores, data) {

  return {
    type: 'LOAD_DATA', payload: {
      data: {
        group,
        subGroup,
        data,
        configs,
        ignores
      }
    }
  }

}


export function flagRegisterFilled(clientId, module, visitDate, entryCode) {

  return {
    type: 'FLAG_REGISTER_FILLED', payload: {
      data: {
        clientId,
        module,
        visitDate,
        entryCode
      }
    }
  }

}