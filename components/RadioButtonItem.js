import React, {Component} from 'react';

const STR_MAPTYPE = [
    'SO2 Levels',
    'Noise Pol.',
    'Road Quality',
    'Air Quality'
]
export default class RadioButtonItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            onClickHandler : this.props.onclick,
            mapTypeStr : this.props.mapTypeStr
        }
    }

    onClickHandler(item){        
        var maptype = item.currentTarget.getAttribute('data-maptype');
        this.state.onClickHandler(maptype);
    }

    render(){
        var {selected, maptype} = this.props;
        var {mapTypeStr} = this.state;
        // if(maptype === 'geojson'){
        //     mapTypeStr = "SO2 Level";
        // }else if(maptype === 'hexagon'){
        //     mapTypeStr = "Road Quality";
        // }else if(maptype === 'screengrid'){
        //     mapTypeStr = "Air Quality"
        // }else if(maptype === 'heatmap'){
        //     mapTypeStr = "Noise Pol."
        // }
        if(selected){
            return(            
                <button className='maptype-radiobutton selected' data-maptype={maptype} onClick={this.onClickHandler.bind(this)}>
                    <img src={'assets/img/hexagon.png'} className={'maptype-radiobutton-icon'}/>
                    <span>{mapTypeStr}</span>
                </button>
            );
        }
        return(            
            <button className='maptype-radiobutton' data-maptype={maptype} onClick={this.onClickHandler.bind(this)}>
                <img src={'assets/img/hexagon.png'} className={'maptype-radiobutton-icon'}/>
                <span>{mapTypeStr}</span>
            </button>
        );
        
    }

}