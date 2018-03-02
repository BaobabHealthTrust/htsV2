export default function (state = [], action) {

    switch (action.type) {

        case "FETCH_DATA_FULFILLED":

            let newState = Object.assign([], state);

            if (Array.isArray(action.payload.data)) {

                newState = action.payload.data;

            } else {

                newState.push(action.payload.data);

            }

            return newState;

        case "CLEAR_DATA":

            const newDefaultState = [];

            return newDefaultState;

        default:

            return state;

    }

}