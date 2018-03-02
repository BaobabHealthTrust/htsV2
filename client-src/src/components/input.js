import React, {Component} from 'react';
import './input.css';

class Input extends Component {

  render() {

    return ((this.props.fieldType === "textarea"
      ? <textarea
          className={this.props.className}
          value={this.props.value}
          id={this.props.id}
          onChange={() => {
          if (!this.props.onChangeHandler) 
            return;
          this
            .props
            .onChangeHandler(document.getElementById(this.props.id).value)
        }}
          style={{
          height: "230px"
        }}/>
      : <input
        placeholder={this.props.placeholder}
        className={this.props.className}
        value={this.props.value}
        id={this.props.id}
        onChange={() => {
        if (!this.props.onChangeHandler) 
          return;
        this
          .props
          .onChangeHandler(document.getElementById(this.props.id).value)
      }}
        onKeyDown={(((this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].options) || []).length <= 0 && (this.props.options || []).length <= 0)
        ? (e) => {
          if (e.keyCode === 13 && this.props.navNext) 
            this.props.navNext(e, this.props.value);
          }
        : () => {}}
        readOnly={this.props.readOnly === true
        ? true
        : (this.props.configs && this.props.configs[this.props.label] && this.props.configs[this.props.label].readOnly === true
          ? true
          : false)}
        onMouseDown={this.props.onMouseDown
        ? () => {
          this
            .props
            .onMouseDown()
        }
        : () => {}}
        type={this.props.fieldType === "password"
        ? "password"
        : "text"}/>))

  }

}

export default Input;