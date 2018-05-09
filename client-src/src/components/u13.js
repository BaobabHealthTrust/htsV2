import React, { Component } from 'react';
import './u13.css';
import Button from './button';

class U13 extends Component {

    loadButtons(buttons = []) {

        return buttons.map((button) => {

            return (!button.disabled
                ? (button.inactive
                    ? <Button
                        id={button.id}
                        key={button.id}
                        label={button.label}
                        buttonClass="gray nav-buttons"
                        handleMouseDown={() => { }}
                        extraStyles={button.extraStyles} />
                    : <Button
                        id={button.id}
                        key={button.id}
                        label={button.label}
                        buttonClass={button.buttonClass}
                        handleMouseDown={button.onMouseDown}
                        extraStyles={button.extraStyles} />)
                : "")

        })
    }

    render() {

        return (

            <div className="nav">
                {this.loadButtons(this.props.buttons)}
                <div style={{ color: "#eee", fontSize: "22px", position: "absolute", left: "125px", bottom: "25px", fontStyle: "italic" }}>v{this.props.version}</div>
            </div>

        )

    }

}

export default U13;