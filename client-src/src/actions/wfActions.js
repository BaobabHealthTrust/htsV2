export function loadWorkflow(group, payload) {

    return {
        type: 'LOAD_WORKFLOW',
        payload: {
            group,
            tree: payload
        }
    }

}

export function goForward(group, response) {

    return {
        type: "GO_FORWARD",
        payload: {
            response,
            group
        }
    };

}

export function goBackward(group) {

    return {
        type: "GO_BACKWARD",
        payload: {
            group
        }
    };

}

export function clearWorkflow(group) {

    return {
        type: "CLEAR_WORKFLOW",
        payload: {
            group
        }
    }

}

export function handleInputChange(field, value, group) {

    return {
        type: "UPDATE_FIELD",
        payload: {
            field: field,
            result: value,
            group
        }
    };

}

export function clearField(field, group) {

    return {
        type: "CLEAR_FIELD",
        payload: {
            field,
            group
        }
    };

}