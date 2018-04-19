import React, {Component} from 'react';
import './visitCard.css';
import icoClose from '../images/close';
import icoExpand from '../images/expand';
import icoShrink from '../images/shrink';
import icoPencil from '../images/pencil';

class VisitCard extends Component {

  render() {

    return (

      <div className="visitCardContainer">
        {Object
          .keys(this.props.details)
          .map((item) => {
            return <div
              id={item}
              key={item}
              className={this
              .props
              .expanded
              .indexOf(item) >= 0
              ? "expandedVisitCard"
              : "visitCard"}>
              <table
                style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #619d30",
                backgroundColor: "#d3f4d3"
              }}
                border="0"
                cellPadding="0">
                <tbody>
                  <tr
                    style={{
                    backgroundColor: "#619d30"
                  }}>
                    <th style={{
                      padding: "0px"
                    }}>
                      <div className="visitCardHeader">
                        {item}
                      </div>
                    </th>
                    <td
                      style={{
                      width: "40px",
                      cursor: "pointer",
                      borderLeft: "5px solid #619d30"
                    }}
                      onMouseDown={() => {
                      if (this.props.app.dual) 
                        return;
                      this
                        .props
                        .transcribe(item)
                    }}>
                      {this.props.app.dual
                        ? <span>&nbsp;</span>
                        : <img
                          src={icoPencil}
                          height="25"
                          alt=""
                          draggable="false"
                          style={{
                          userSelect: "none"
                        }}/>}
                    </td>
                    <td
                      style={{
                      width: "40px",
                      cursor: "pointer",
                      borderRight: "5px solid #619d30"
                    }}
                      onMouseDown={() => {
                      this
                        .props
                        .handleExpansion(item)
                    }}>
                      <img
                        src={this
                        .props
                        .expanded
                        .indexOf(item) >= 0
                        ? icoShrink
                        : icoExpand}
                        height="25"
                        alt=""
                        draggable="false"
                        style={{
                        userSelect: "none"
                      }}/>
                    </td>
                    <td
                      style={{
                      width: "40px",
                      cursor: "pointer",
                      borderLeft: "5px solid #619d30"
                    }}
                      onMouseDown={() => {
                      this
                        .props
                        .handleVoidEncounter(item, this.props.details[item]["HTS Visit"].encounterId)
                    }}>
                      <img
                        src={icoClose}
                        height="30"
                        alt=""
                        draggable="false"
                        style={{
                        userSelect: "none"
                      }}/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <div
                        className={this
                        .props
                        .expanded
                        .indexOf(item) >= 0
                        ? "expandedVisitCardContent"
                        : "visitCardContent"}>
                        <table>
                          <tbody>
                            {Object
                              .keys(this.props.details[item])
                              .map((encounter) => {
                                return Object
                                  .keys(this.props.details[item][encounter])
                                  .filter((e) => {
                                    return Array("encounterId").concat(this.props.app && this.props.app.data && this.props.app.module && this.props.app.data[this.props.app.module] && this.props.app.data[this.props.app.module][(this.props.app.module === "HTS" ? "HTS Visit" : item)] && this.props.app.data[this.props.app.module][(this.props.app.module === "HTS" ? "HTS Visit" : item)] && this.props.app.data[this.props.app.module][(this.props.app.module === "HTS" ? "HTS Visit" : item)].ignores
                                      ? this.props.app.data[this.props.app.module][(this.props.app.module === "HTS" ? "HTS Visit" : item)].ignores
                                      : []).indexOf(e) < 0
                                  })
                                  .map((itemKey) => {
                                    return <tr key={itemKey}>
                                      <th
                                        align="right"
                                        style={{
                                        fontSize: "12px",
                                        verticalAlign: "top"
                                      }}>
                                        {itemKey}
                                      </th>
                                      <td
                                        style={{
                                        verticalAlign: "top"
                                      }}>:</td>
                                      <td
                                        align="left"
                                        style={{
                                        fontSize: "14px",
                                        verticalAlign: "top"
                                      }}>
                                        {this.props.details[item][encounter][itemKey]}
                                      </td>
                                    </tr>
                                  })
                              })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          })}
      </div>

    )

  }

}

export default VisitCard;