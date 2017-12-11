import React, {Component} from 'react';

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
            <div className={"row infobox-header-container"}>
                <h1  style={textStyle} className={"infobox-header-text"}>{this.props.displaytext}</h1>
            </div>
        );
    }

}

