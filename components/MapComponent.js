import React,{Component} from 'react';
import {request as Request} from 'd3-request';

const isNotNull = r => r != null && r != 'undefined';
const isNull = r => r == null || r === 'undefined'

export default class MapComponent extends Component {
    static get OPERATIONS(){
        return [
            'loaddata'
        ]
    }
    constructor(props){
        super(props);
        this.onMapStateChange = this.props.onMapStateChange;
        this.loaddataurl = null;
        this.currentOperation = "nop";
        this.lastOperation = null;
        this.loadDataCallback = null;
    }

    startOperation(operation,delay){        
        if(operation === 'loaddata'){
            if(isNotNull(this.loaddataurl)){
                this.onOperationProgress('loaddata');
                loadData.bind(this)(delay);
                return;
            }
            throw new Error("Data URL Not Set. RefNo:#");           
        }
    }

    onOperationProgress(operation){
        if(operation === 'loaddata'){
            this.currentOperation = 'loaddata';
            this.onMapStateChange('active');
        }
    }

    onOperationDone(operation){
        if(operation === 'loaddata'){
            this.onMapStateChange('passive');
        }
    }
}

function loadData(delay){
    setTimeout(function(){
        const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';
        var PARAMS_GEOJSON = {};
        Request(this.loaddataurl)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), function(e,d){
            //callback(e,d);
            if(isNotNull(this.loadDataCallback)){
                this.loadDataCallback(e,d);
            }
            this.onOperationDone('loaddata');
        }.bind(this));
    }.bind(this),delay);
}