export default function alertReducers(state = {}, action) {

    let newState;

    switch (action.type) {

        case "SHOW_MSG":

            newState = Object.assign({}, state, action.payload);

            return newState;

        case "SHOW_ALERT_MSG":

            newState = Object.assign({}, state, action.payload);

            return newState;

        case "SHOW_CONFIRM_MSG":

            newState = Object.assign({}, state, action.payload);

            return newState;

        case "CLOSE_MSG":

            newState = {};

            return newState;

        default:

            return state;

    }

}