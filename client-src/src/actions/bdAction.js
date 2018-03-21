import axios from "axios";

export function fetchLastBDRow(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY, { timeout: 3000 });

  return { type: 'FETCH_LAST_BD_ROW', payload: request }

}

export function saveBDRow(url, payload) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'SAVE_BD_ROW', payload: request }

}

export function fetchEditRow(url) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.get(END_POINT + API_KEY, { timeout: 3000 });

  return { type: 'FETCH_EDIT_ROW', payload: request }

}

export function saveEditRow(url, payload) {

  const API_KEY = "";
  const END_POINT = url;
  const request = axios.post(END_POINT + API_KEY, payload);

  return { type: 'SAVE_EDIT_ROW', payload: request }

}

export function resetErrorMessage() {

  return { type: 'RESET_ERROR_MESSAGE' }

}