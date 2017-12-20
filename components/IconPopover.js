import React , {Component} from 'react';

export default class IconPopover extends Component{
    
    constructor(props){
        super(props);
    }

    render(){

        return(
            <div>
                <IconPopoverHeader />
                <IconPopoverContent />
            </div>
        )

    }
}