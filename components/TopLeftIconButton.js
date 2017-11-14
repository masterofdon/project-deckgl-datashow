import React, {Component} from 'react';

export default class TopLeftIconButton extends Component{

    constructor(){
        this.state = {icon: ""};
    }

    render() {
        const {icon} = this.props;
        return(
            <div>
                <img className="rounded-circle" src={icon} />
                <button >Click Here</button>
            </div>
        )
    }
}