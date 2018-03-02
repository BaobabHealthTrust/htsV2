import React, {Component} from 'react';
import './u2.css';
import AppCard from './appCard';

class U2 extends Component {

    render() {

        return (

            <div
                className={this.props.selectedTask === "Backdata Entry"
                ? "bdHeadTab"
                : "headTab"}
                id="modApp"
                style={{
                textAlign: "center",
                cursor: "pointer"
            }}
                onMouseDown={() => {}}>
                <AppCard
                    icon={this.props.icon}
                    module={this.props.module}
                    selectedTask={this.props.selectedTask}/>
            </div>

        )

    }

}

export default U2;