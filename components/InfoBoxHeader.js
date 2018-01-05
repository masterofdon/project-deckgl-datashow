import React, {Component} from 'react';
import { Badge } from 'antd';

export default class InfoBoxHeader extends Component {

    constructor(props){
        super(props);
        this.state = {
            displaytext : this.props.displaytext
        }
        this.onHeaderChange = this.props.onHeaderChange;        
    }

    render() {
        var textStyle = {
            textAlign : "center"
        }
        return (
            <div className={"infobox-header-container"}>
                <Badge status="error" className={"infobox-header-text"} text={this.props.displaytext}/>
            </div>
        );
    }

}

