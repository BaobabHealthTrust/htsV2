import React, { Component } from 'react';
import './button.css';

class Button extends Component {

    render() {

        return (

            <button id={this.props.id}
                className={this.props.buttonClass} style={this.props.extraStyles}
                onMouseDown={this.props.buttonClass !== "gray" ? this.props.handleMouseDown : () => {}}>
                {this.props.label}
            </button>

        )

    }

}

export default Button;