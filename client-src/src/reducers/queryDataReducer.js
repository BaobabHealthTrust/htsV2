export default function (state = [], action) {

    let newState;

    switch (action.type) {

        case "FETCH_DATA_FULFILLED":

            newState = Object.assign([], state);

            if (Array.isArray(action.payload.data)) {

                newState = action.payload.data;

            } else {

                newState.push(action.payload.data);

            }

            return newState;

        case "CLEAR_DATA":

            newState = [];

            return newState;

        case "SET_DATA":

            newState = Object.assign([], action.payload);

            return newState;

        default:

            return state;

    }

}