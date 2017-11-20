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
            onClickHandler : this.props.onclick
        }
    }

    onClickHandler(item){        
        var maptype = item.currentTarget.getAttribute('data-maptype');
        this.state.onClickHandler(maptype);
        console.log("GOT: " + maptype);
    }

    render(){
        var {selected, maptype} = this.props;
        if(selected){
            return(            
                <button className='maptype-radiobutton selected' data-maptype={maptype} onClick={this.onClickHandler.bind(this)}>
                    <img src={'assets/img/hexagon.png'} className={'maptype-radiobutton-icon'}/>
                    <span>{maptype}</span>
                </button>
            );
        }
        return(            
            <button className='maptype-radiobutton' data-maptype={maptype} onClick={this.onClickHandler.bind(this)}>
                <img src={'assets/img/hexagon.png'} className={'maptype-radiobutton-icon'}/>
                <span>{maptype}</span>
            </button>
        );
        
    }

}