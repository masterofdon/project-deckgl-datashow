import React , {Component} from 'react';
import IconPopoverHeader from './IconPopoverHeader';
import IconPopoverContentList from './IconPopoverContentList';

export default class IconPopover extends Component{
    
    constructor(props){
        super(props);
    }

    render(){
        const {header , devices, onItemSelected} = this.props;
        return(
            <div className='iconpopover-container'>
                <IconPopoverHeader header={header}/>
                <IconPopoverContentList onItemSelected={onItemSelected} devices={devices}/>
            </div>
        )

    }
}