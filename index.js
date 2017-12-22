/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapTypeController from './components/MapTypeController';
import MapContainer from './components/MapContainer';
import LoadingScreenContainer from './components/LoadingScreenContainer';

export default class IONMapExtension extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maptype : "heatmap",
      loadstatus : 'passive',
      onClickHandler : this.props.onClick
    }; 
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll(event){
    console.log("Handle Scroll");
    event.preventDefault();
    event.stopPropagation();
  }
  componentDidMount() {
  }

  changeMapType(maptype){
    this.setState({
      maptype: maptype
    });
  }

  activateLoadStatus(){
    this.setState({loadstatus : 'active'})
  }

  deActivateLoadStatus(){
    this.setState({loadstatus : 'passive'})
  }

  _onMapStateChange(status){
    this.setState({loadstatus : status});
  }
  
  render() {
    const {loadstatus} = this.state;
    return (
      <div className={'row'} onWheel={this.handleScroll}>
        <MapContainer onMapStateChange={this._onMapStateChange.bind(this)} maptype={this.state.maptype} mapstyle={"mapbox://styles/aerdemekin/cjaksz2udc14a2rqo9lshmsdc"}/>
        <MapTypeController onChange={this.changeMapType.bind(this)}/>
        <LoadingScreenContainer status={loadstatus}/>
      </div>
    );
  }
  
}
