import React , {Component} from 'react';
import InfoBoxHeader from './InfoBoxHeader';
import InfoBoxDivider from './InfoBoxDivider';

export default class IconComponentDetailsInfoBox extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {device} = this.props; 
        return(
            <div className={"infobox-container dark-p1-bg"}>
                <InfoBoxHeader displaytext={device.properties.id}/>
                <InfoBoxDivider />
            </div>
        );
    }
}