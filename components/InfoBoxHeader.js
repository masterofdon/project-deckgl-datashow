import React, {Component} from 'react';

export default class InfoBoxHeader extends Component {

    constructor(props){
        super(props);
        this.state = {
            displaytext : this.props.displaytext
        }        
    }

    render() {
        return (
            <div class="col-lg-3 col-md-3 infobox-header-container">
                <h1 class="infobox-header-text">{this.state.displaytext}</h1>
            </div>
        );
    }

}

