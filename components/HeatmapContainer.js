import React , {Component} from 'react';
import MapBox from 'mapbox-gl';
import MapGL from 'react-map-gl';
import { setTimeout } from 'timers';
import SO2LevelOverlay from '../so2-levels-overlay.js'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line

export default class HeatmapContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            //map : createHeatmap(),
            viewport: {
                ...SO2LevelOverlay.defaultViewport,
                width: window.innerWidth,
                height : window.innerHeight * 0.90
            },
            map : null,
            data: null,
        }
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight * 0.90
        });
    }

    render(){     
        const containerStyle = {
            marginTop : "20px",
            marginLeft: "10px"
        };
        const { viewport, data} = this.state;
        return(
            // <Map
            //     style="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
            //     containerStyle={{
            //     height: "100vh",
            //     width: "100vw"
            //     }}>
            //     <Layer
            //         type="heatmap"
            //         id="heatmap"
            //         >
            //     </Layer>
            // </Map>
            < div className={"row"} style={containerStyle} >
                <MapGL
                    {...viewport}
                    mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
                    onViewportChange={this._onViewportChange.bind(this)}
                    ref={(nodeElement) => nodeElement && !this.state.map && this.loadMapData(nodeElement)}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                >
                
                </MapGL>
            </div >
            //<div className={'row'}  style={containerStyle} ref={(nodeElement) => nodeElement && nodeElement.appendChild(this.state.map)}/>
        ); 
    }
    loadMapData(nodeElement){
        this.state.map = nodeElement.getMap();
        this.state.map.on('load',function(e){
            //Add a geojson point source.
            //Heatmap layers also work with a vector tile source.
            this.addSource('earthquakes', {
                "type": "geojson",
                "data": "earthquakes_output.geojson"
            });
        
            this.addLayer({
                "id": "earthquakes-heat",
                "type": "heatmap",
                "source": "earthquakes",
                "maxzoom": 15,
                "paint": {
                    //Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": {
                        "property": "mag",
                        "type": "exponential",
                        "stops": [
                            [0, 0],
                            [100, 1]
                        ]
                    },
                    //Increase the heatmap color weight weight by zoom level
                    //heatmap-ntensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": {
                        "stops": [
                            [0, 1],
                            [15, 3]
                        ]
                    },
                    //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    //Begin color ramp at 0-stop with a 0-transparancy color
                    //to create a blur-like effect.
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0, "rgba(33,102,172,0)",
                        0.2, "rgb(103,169,207)",
                        0.4, "rgb(209,229,240)",
                        0.6, "rgb(253,219,199)",
                        0.8, "rgb(239,138,98)",
                        1, "rgb(178,24,43)"
                    ],
                    //Adjust the heatmap radius by zoom level
                    "heatmap-radius": {
                        "stops": [
                            [0, 5],
                            [15, 20]
                        ]
                    },
                    //Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": {
                        "default": 1,
                        "stops": [
                            [10, 1],
                            [20, 0]
                        ]
                    },
                }
            }, 'waterway-label');
        
            // map.addLayer({
            //     "id": "earthquakes-point",
            //     "type": "circle",
            //     "source": "earthquakes",
            //     "minzoom": 7,
            //     "paint": {
            //         //Size circle raidus by earthquake magnitude and zoom level
            //         "circle-radius": {
            //             "property": "mag",
            //             "type": "exponential",
            //             "stops": [
            //                 [{ zoom: 7, value: 1 }, 1],
            //                 [{ zoom: 7, value: 6 }, 4],
            //                 [{ zoom: 16, value: 1 }, 5],
            //                 [{ zoom: 16, value: 6 }, 50],
            //             ]
            //         },
            //         //Color circle by earthquake magnitude
            //         "circle-color": {
            //             "property": "mag",
            //             "type": "exponential",
            //             "stops": [
            //                 [1, "rgba(33,102,172,0)"],
            //                 [2, "rgb(103,169,207)"],
            //                 [3, "rgb(209,229,240)"],
            //                 [4, "rgb(253,219,199)"],
            //                 [5, "rgb(239,138,98)"],
            //                 [6, "rgb(178,24,43)"]
            //             ]
            //         },
            //         "circle-stroke-color": "white",
            //         "circle-stroke-width": 1,
            //         //Transition from heatmap to circle layer by zoom level
            //         "circle-opacity": {
            //             "stops": [
            //                 [7, 0],
            //                 [8, 1]
            //             ]
            //         }
            //     }
            // }, 'waterway-label');
        }.bind(this.state.map));
    }
} 
function createHeatmap(){
    var div = document.createElement('div');
    div.setAttribute('id','map');
    MapBox.accessToken = MAPBOX_TOKEN;    
    var map = new MapBox.Map({
        container: div,
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [29.1,  41.015],
        zoom: 10.2,
        bearing : 14.3,
        maxZoom: 20,
        minZoom: 10,
        doubleClickZoom : false,
        width : window.innerWidth,
        dragRotate : false

    });
    setTimeout(function(e){
        map.resize();
    },100);
    map.on('load', function() {
        //Add a geojson point source.
        //Heatmap layers also work with a vector tile source.
        map.addSource('earthquakes', {
            "type": "geojson",
            "data": "earthquakes_output.geojson"
        });
    
        map.addLayer({
            "id": "earthquakes-heat",
            "type": "heatmap",
            "source": "earthquakes",
            "maxzoom": 15,
            "paint": {
                //Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": {
                    "property": "mag",
                    "type": "exponential",
                    "stops": [
                        [0, 0],
                        [100, 1]
                    ]
                },
                //Increase the heatmap color weight weight by zoom level
                //heatmap-ntensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": {
                    "stops": [
                        [0, 1],
                        [15, 3]
                    ]
                },
                //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                //Begin color ramp at 0-stop with a 0-transparancy color
                //to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(33,102,172,0)",
                    0.2, "rgb(103,169,207)",
                    0.4, "rgb(209,229,240)",
                    0.6, "rgb(253,219,199)",
                    0.8, "rgb(239,138,98)",
                    1, "rgb(178,24,43)"
                ],
                //Adjust the heatmap radius by zoom level
                "heatmap-radius": {
                    "stops": [
                        [0, 5],
                        [15, 20]
                    ]
                },
                //Transition from heatmap to circle layer by zoom level
                "heatmap-opacity": {
                    "default": 1,
                    "stops": [
                        [10, 1],
                        [15, 0]
                    ]
                },
            }
        }, 'waterway-label');
    
        // map.addLayer({
        //     "id": "earthquakes-point",
        //     "type": "circle",
        //     "source": "earthquakes",
        //     "minzoom": 7,
        //     "paint": {
        //         //Size circle raidus by earthquake magnitude and zoom level
        //         "circle-radius": {
        //             "property": "mag",
        //             "type": "exponential",
        //             "stops": [
        //                 [{ zoom: 7, value: 1 }, 1],
        //                 [{ zoom: 7, value: 6 }, 4],
        //                 [{ zoom: 16, value: 1 }, 5],
        //                 [{ zoom: 16, value: 6 }, 50],
        //             ]
        //         },
        //         //Color circle by earthquake magnitude
        //         "circle-color": {
        //             "property": "mag",
        //             "type": "exponential",
        //             "stops": [
        //                 [1, "rgba(33,102,172,0)"],
        //                 [2, "rgb(103,169,207)"],
        //                 [3, "rgb(209,229,240)"],
        //                 [4, "rgb(253,219,199)"],
        //                 [5, "rgb(239,138,98)"],
        //                 [6, "rgb(178,24,43)"]
        //             ]
        //         },
        //         "circle-stroke-color": "white",
        //         "circle-stroke-width": 1,
        //         //Transition from heatmap to circle layer by zoom level
        //         "circle-opacity": {
        //             "stops": [
        //                 [7, 0],
        //                 [8, 1]
        //             ]
        //         }
        //     }
        // }, 'waterway-label');
    });
    return div;
}

