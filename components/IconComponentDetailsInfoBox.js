import React , {Component} from 'react';
import InfoBoxHeader from './InfoBoxHeader';
import InfoBoxDivider from './InfoBoxDivider';
import ApiStringBuilder from './ApiStringBuilder';
import {request as Request} from 'd3-request';
import InfoBoxWidget from './InfoBoxWidget';

const AUTH_TOKEN = '427cfe2f-7036-4e30-8938-7f8631d6a019';
const PARAMS_GEOJSON = {};

export default class IconComponentDetailsInfoBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            progress : null,
            device : this.props.devicedetails
        }        
        this.handleScroll = this.handleScroll.bind(this);
    }

    _requestDeviceDetails(device){
        var {apistrbuilder} = this;
        var queryStr = apistrbuilder
            .api('1.0')
            .devices(device.properties.id)
            .details()
            .parameters({
                access_token : AUTH_TOKEN
            })
            .toString();
        Request(queryStr)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), this._responseHandler.bind(this));   
    }
    
    _responseHandler(error, response){
        var data = JSON.parse(response.response);
        this.setState({
            deviceDetails : data
        });
    }

    handleScroll(event) {
        var target = event.currentTarget;
        target.scrollBy(0,event.deltaY / 3);
        return;
    }

    render(){
        const {devicedetails} = this.props;
        return(
            <div className={"infobox-container dark-p1-bg"} onWheel={this.handleScroll}>
                <InfoBoxHeader displaytext={devicedetails.device_id || devicedetails.device.name}/>
                <InfoBoxDivider />
                <InfoBoxWidget deviceprops={devicedetails}/>
            </div>
        );
    }
}