import React, { Component } from 'react';
import IconPopoverContentListItem from './IconPopoverContentListItem';
import NativeListener from 'react-native-listener';

export default class IconPopoverContentList extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll(event) {
        var target = event.currentTarget;
        target.scrollBy(0,event.deltaY / 3);
        return;
    }

    paneDidMount(node){
        
    }

    render() {
        const { devices, onItemSelected } = this.props;
        const listItems = devices.map((device) =>
            <IconPopoverContentListItem key={device.id} onItemSelected={onItemSelected} deviceid={device.id} />
        );
        return (
            <ul ref={this.paneDidMount} onWheel={this.handleScroll} className={'popover-list'}>
                {listItems}
            </ul>
        );
    }
}