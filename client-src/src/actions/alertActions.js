export function showInfoMsg(title, msg) {

    return {
        type: "SHOW_MSG",
        payload: {
            title,
            msg,
            info: true
        }
    }

}

export function showErrorMsg(title, msg) {

    return {
        type: "SHOW_ALERT_MSG",
        payload: {
            title,
            msg,
            info: false
        }
    }

}

export function showConfirmMsg(title, msg, label, action, cancelAction) {

    return {
        type: "SHOW_CONFIRM_MSG",
        payload: {
            title,
            msg,
            label,
            action,
            info: true,
            cancelAction
        }
    }

}

export function closeMsg() {

    return {
        type: "CLOSE_MSG"
    }

}

export function updateAlertKey(key, value) {

    return {
        type: "UPDATE_ALERT_KEY",
        payload: {
            [key]: value
        }
    }

}
