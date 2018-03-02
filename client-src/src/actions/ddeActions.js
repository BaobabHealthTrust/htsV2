import axios from "axios";

export function searchByIdentifier(identifier) {

  const API_KEY = "";
  const END_POINT = "/dde/search_by_identifier/" + String(identifier)
    .trim()
    .replace(/\$$/g, "");
  const request = axios.get(END_POINT + API_KEY);

  return {type: 'SEARCH_BY_IDENTIFIER', payload: request}

}

export function searchByNameAndGender(payload) {

  const API_KEY = "";
  const END_POINT = "/dde/search_by_name_and_gender";
  const request = axios.post(END_POINT + API_KEY, payload);

  return {type: 'SEARCH_BY_NAME_AND_GENDER', payload: request}

}

export function advancedPatientSearch(payload) {

  const API_KEY = "";
  const END_POINT = "/dde/advanced_patient_search";
  const request = axios.post(END_POINT + API_KEY, payload);

  return {type: 'ADVANCED_PATIENT_SEARCH', payload: request}

}

export function voidPatient(identifier) {

  const API_KEY = "";
  const END_POINT = "/dde/void_patient/" + identifier;
  const request = axios.delete(END_POINT + API_KEY);

  return {type: 'VOID_PATIENT', payload: request}

}

export function addPatient(payload) {

  const API_KEY = "";
  const END_POINT = "/dde/add_patient";
  const request = axios.post(END_POINT + API_KEY, payload);

  return {type: 'ADD_PATIENT', payload: request}

}

export function updatePatient(payload) {

  const API_KEY = "";
  const END_POINT = "/dde/update_patient";
  const request = axios.post(END_POINT + API_KEY, payload);

  return {type: 'UPDATE_PATIENT', payload: request}

}

export function mergeRecords(payload) {

  const API_KEY = "";
  const END_POINT = "/dde/merge_records";
  const request = axios.post(END_POINT + API_KEY, payload);

  return {type: 'MERGE_RECORDS', payload: request}

}

export function clearDataStructs() {

  return {type: "CLEAR_DATA_STRUCTS"}

}

export function selectPatient(json) {

  return {type: "SELECT_PATIENT", payload: json}

}

export function setConfig(payload = {}) {

  return {type: "SET_CONFIG", payload};

}