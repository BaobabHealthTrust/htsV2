const getPath = (obj, path) => {

    var parts = path.split('.');

    while (parts.length > 1 && obj) {
        (obj = obj[parts.shift()])
    };

    return obj;

}

const addNode = (newState, response) => {

    const root = getPath(newState.tree, newState.history.map((row) => {
        return row.id
    }).join("."));

    const leaf = (newState.history.length > 0 ?
        newState.history[newState.history.length - 1] :
        null);

    let nextNode;

    if (leaf && root[leaf.id] && root[leaf.id].flow) {

        if (Object.keys(root[leaf.id].flow).length > 1) {

            nextNode = Object
                .keys(root[leaf.id].flow)
                .filter((id) => {
                    return root[leaf.id].flow[id].label === response
                })
                .map((id) => {
                    return root[leaf.id].flow[id]
                });

            if (nextNode.length === 1) {

                nextNode = nextNode[0];

                newState
                    .history
                    .push({
                        id: "flow",
                        type: "link"
                    });

                newState
                    .history
                    .push({
                        label: nextNode.label,
                        id: nextNode.id,
                        type: nextNode.type
                    });

                nextNode = Object
                    .keys(nextNode.flow)
                    .map((id) => {
                        return nextNode.flow[id];
                    })

                if (nextNode.length === 1) {

                    nextNode = nextNode[0];

                } else {

                    nextNode = null;

                }

            } else {

                nextNode = null;

            }

        } else {

            nextNode = Object
                .keys(root[leaf.id].flow)
                .map((id) => {
                    return root[leaf.id].flow[id]
                });

            if (nextNode.length === 1) {

                nextNode = nextNode[0];

            } else {

                nextNode = null;

            }

        }

        if (nextNode) {

            const link = {
                id: "flow",
                type: "link"
            }

            newState
                .history
                .push(link);

            let entry = {
                label: nextNode.label,
                id: nextNode.id,
                type: nextNode.type
            }

            if (Object.keys(nextNode.flow).length > 1) {

                const options = Object
                    .keys(nextNode.flow)
                    .map((key) => {
                        return nextNode.flow[key].label
                    })

                entry.options = Object.assign([], options);

            }

            newState
                .history
                .push(entry);

            nextNode = Object.assign({}, entry);

        }

    } else if (leaf && root.flow[leaf.id] && root.flow[leaf.id].flow) {

        if (Object.keys(root.flow[leaf.id].flow).length > 1) {

            nextNode = Object
                .keys(root.flow[leaf.id].flow)
                .filter((id) => {
                    return root.flow[leaf.id].flow[id].label === response
                })
                .map((id) => {
                    return root.flow[leaf.id].flow[id]
                });

            if (nextNode.length === 1) {

                nextNode = nextNode[0];

                newState
                    .history
                    .push({
                        id: "flow",
                        type: "link"
                    });

                newState
                    .history
                    .push({
                        label: nextNode.label,
                        id: nextNode.id,
                        type: nextNode.type
                    });

                nextNode = Object
                    .keys(nextNode.flow)
                    .map((id) => {
                        return nextNode.flow[id];
                    })

                if (nextNode.length === 1) {

                    nextNode = nextNode[0];

                } else {

                    nextNode = null;

                }

            } else {

                nextNode = null;

            }

        } else {

            nextNode = Object
                .keys(root.flow[leaf.id].flow)
                .map((id) => {
                    return root.flow[leaf.id].flow[id]
                });

            if (nextNode.length === 1) {

                nextNode = nextNode[0];

            } else {

                nextNode = null;

            }

        }

        if (nextNode) {

            const link = {
                id: "flow",
                type: "link"
            }

            newState
                .history
                .push(link);

            let entry = {
                label: nextNode.label,
                id: nextNode.id,
                type: nextNode.type
            }

            if (Object.keys(nextNode.flow).length > 1) {

                const options = Object
                    .keys(nextNode.flow)
                    .map((key) => {
                        return nextNode.flow[key].label
                    })

                entry.options = Object.assign([], options);

            }

            newState
                .history
                .push(entry);

            nextNode = Object.assign({}, entry);

        }

    } else {

        nextNode = Object
            .keys(newState.tree)
            .filter((id) => {
                return newState.tree[id].label === response
            })
            .map((id) => {
                return newState.tree[id]
            });

        if (nextNode.length === 1) {

            nextNode = nextNode[0];

        } else {

            nextNode = null;

        }

        if (nextNode) {

            let entry = {
                label: nextNode.label,
                id: nextNode.id,
                type: nextNode.type
            }

            if (Object.keys(nextNode.flow).length > 1) {

                const options = Object
                    .keys(nextNode.flow)
                    .map((key) => {
                        return nextNode.flow[key].label
                    })

                entry.options = Object.assign([], options);

            }

            newState
                .history
                .push(entry);

            nextNode = Object.assign({}, entry);

        }

    }

    return nextNode;

}

const reverseNode = (newState, group) => {

    if (newState[group].history.length > 3) {

        let node;

        node = newState[group]
            .history
            .pop();

        if (node.label && newState.responses[group] && newState.responses[group][node.label])
            delete newState.responses[group][node.label];

        node = newState[group]
            .history
            .pop();

        if (node.label && newState.responses[group] && newState.responses[group][node.label])
            delete newState.responses[group][node.label];

        while (newState[group].history.length > 3 && ["option", "process", "decision", "alert"].indexOf(newState[group].history[newState[group].history.length - 1].type) >= 0) {

            node = newState[group]
                .history
                .pop();

            if (node.label && newState.responses[group] && newState.responses[group][node.label])
                delete newState.responses[group][node.label];

            node = newState[group]
                .history
                .pop();

            if (node.label && newState.responses[group] && newState.responses[group][node.label])
                delete newState.responses[group][node.label];

        }

    }

    let nextNode = (newState[group].history.length > 0 ?
        newState[group].history[newState[group].history.length - 1] :
        null)

    return nextNode;

}

export default function (state = {
    default: {
        tree: {},
        history: [],
        currentNode: null
    },
    processing: false,
    responses: {}
}, action) {

    let newState;

    switch (action.type) {

        case "LOAD_WORKFLOW":

            newState = Object.assign({}, state, {
                [action.payload.group]: {
                    tree: action.payload.tree,
                    history: (action.payload.history || [])
                }
            });

            addNode(newState[action.payload.group], "Start");

            newState[action.payload.group].currentNode = addNode(newState[action.payload.group], "");

            newState.processing = false;

            return newState;

        case "CLEAR_WORKFLOW":

            newState = Object.assign({}, state);

            if (newState[action.payload.group])
                newState[action.payload.group].currentNode = null;

            newState.processing = false;

            if (newState.responses[action.payload.group])
                newState.responses[action.payload.group] = {};

            if (newState[action.payload.group])
                delete newState[action.payload.group];

            return newState;

        case "GO_FORWARD":

            newState = Object.assign({}, state);

            const response = {
                [action.payload.group]: action.payload.response
            };

            newState[action.payload.group].currentNode = addNode(newState[action.payload.group], response[action.payload.group]);

            return newState;

        case "GO_BACKWARD":

            newState = Object.assign({}, state);

            newState[action.payload.group].currentNode = reverseNode(newState, action.payload.group);

            return newState;

        case "UPDATE_FIELD":

            newState = Object.assign({}, state);

            const entry = {};

            entry[action.payload.field] = action.payload.result;

            newState.responses[action.payload.group] = Object.assign({}, newState.responses[action.payload.group], entry);

            return newState;

        default:

            return state;

    }

}