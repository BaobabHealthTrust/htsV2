import axios from "axios";

export function fetchData(url) {

    const API_KEY = "";
    const END_POINT = url;
    const request = axios.get(END_POINT + API_KEY);

    return { type: 'FETCH_DATA', payload: request }

}

export function clearCache() {

    return { type: "CLEAR_DATA", payload: {} }

}

export function setData(data) {

    return { type: "SET_DATA", payload: data };

}