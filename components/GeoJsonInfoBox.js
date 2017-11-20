import React, {Component} from 'react';

import InfoBoxHeader from './InfoBoxHeader';
import InfoBoxDivider from './InfoBoxDivider';
import InfoBoxCirclePercentage from './InfoBoxCirclePercentage';
import InfoBoxChart from './InfoBoxChart';
export default class GeoJsonInfoBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            name : this.props.name,
            locale : 'tr',
            object : this.props.selectedItem
        }
    }

    render(){
        var nameUpper = this.props.name.toUpperCase();
        var divider = {
            marginLeft : "10%",
            marginRight : "10%",
            backgroundColor: "#ffffff",
            height: "1px"
        }
        return(
            <div className={"infobox-container dark-p1-bg"}>
                <InfoBoxHeader displaytext={nameUpper}/>
                <InfoBoxDivider loadingState={this.props.loadingState}/>
                <InfoBoxCirclePercentage percentage={this.props.percentage}/>
                <InfoBoxChart />
            </div>
        );
    };

}