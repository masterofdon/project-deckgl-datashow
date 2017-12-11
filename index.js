/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapTypeController from './components/MapTypeController';
import MapContainer from './components/MapContainer';

export default class IONMapExtension extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maptype : "heatmap",
      onClickHandler : this.props.onClick
    };    
  }

  componentDidMount() {
  }

  changeMapType(maptype){
    this.setState({
      maptype: maptype
    });
  }
  
  render() {
    return (
      <div className={'row'}>
        <MapContainer maptype={this.state.maptype} mapstyle={"mapbox://styles/aerdemekin/cjaksz2udc14a2rqo9lshmsdc"}/>
        <MapTypeController onChange={this.changeMapType.bind(this)}/>
      </div>
    );
  }
  
}
