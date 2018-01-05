
const DEVICE_DETAILS = 'https://10.254.157.165:30000/api/1.0/devices/59eda7e1315eba001e35d173/details?access_token=df3600c0-1faa-4fb3-b270-f5e2a0b2e61e';

const isNull = (r) => r == null || r == 'undefined';

export default class ApiStringBuilder {
    constructor(protocol,host,port){
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.queryString = '';
    }

    api(param){
        if(isNull(param)){
            this.queryString += '/api' + param;
            return this;
        }
        this.queryString += '/api/' + param; 
        return this;
    }

    devices(param){
        if(param == null || param === 'undefined'){
            this.queryString += '/devices'; 
            return this;
        }
        this.queryString += '/devices/' + param; 
        return this;
    }

    details(param){
        if(param == null || param === 'undefined'){
            this.queryString += '/details';
            return this;
        }
        this.queryString += '/details/' + param;
        return this;
    }

    search(param){
        if(param == null || param === 'undefined'){
            this.queryString += '/search';
            return this;
        }
        this.queryString += '/search/' + param;
        return this;
    }

    auth(param){
        if(param == null || param === 'undefined'){
            this.queryString += '/auth';
            return this;
        }
        this.queryString += '/auth/' + param;
        return this;
    }

    token(param){
        if(param == null || param === 'undefined'){
            this.queryString += '/token';
            return this;
        }
        this.queryString += '/token/' + param;
        return this;
    }

    parameters(params){
        this.queryString += '?';
        for(var key in params){
            this.queryString += key + '=' + params[key] + '&';
        }
        this.queryString = this.queryString.slice(0,- 1);
        return this;
    }
    
    toString(){
        var returnString = '';
        if(!isNull(this.protocol)){
            returnString += this.protocol + '://'
        }
        if(!isNull(this.host)){
            returnString += this.host
        }
        if(!isNull(this.port)){
            returnString += ':' + this.port;
        }
        return returnString + this.queryString;
    }
    
} 