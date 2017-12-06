import React, {Component} from 'react';
import {render} from 'react-dom';

export default class AppContainer extends Component {

    constructor(props){
        super(props);
    }

    render(){
        <div id={'app-container'}>
            <CardboxContainer ></CardboxContainer>
            <MapContainerView ></MapContainerView>
            <FooterContainer ></FooterContainer>
        </div>
    }

} 