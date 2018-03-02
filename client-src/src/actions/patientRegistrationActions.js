export function navNext(result) {

    return {
        type: "FORWARD",
        payload: {
            result: (["Yes", "No"].indexOf(result) >= 0
                ? result
                : true),
            message: null
        }
    };

}

export function navBack() {

    return {type: "REVERSE", payload: {}};

}

export function handleInputChanges(field, value) {

    return {
        type: "UPDATE_FIELD",
        payload: {
            field: field,
            result: value
        }
    };

}

export function clearTree() {

    return {type: "CLEAR_TREE", payload: {}};

}
