export function wSetupTree(tree) {

    return {
        type: "SETUP_TREE",
        payload: {
            tree: tree
        }
    }

}

export function wNavNext(result) {

    return {
        type: "FORWARD",
        payload: {
            result: (["Yes", "No"].indexOf(result) >= 0 ?
                result :
                true),
            message: null
        }
    };

}

export function wNavBack() {

    return {
        type: "REVERSE",
        payload: {}
    };

}

export function wHandleInputChange(field, value) {

    return {
        type: "UPDATE_FIELD",
        payload: {
            field: field,
            result: value
        }
    };

}

export function wClearTree() {

    return {
        type: "CLEAR_TREE",
        payload: {}
    };

}