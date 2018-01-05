import {ScreenGridDataAdapter, RoadQualityDataAdapter, GeoJsonDataAdapter , RequestDeviceDetails} from '../core/network/DataAdapter';
import {getTokenByUserPass} from '../core/network/DataAdapter';
import ApiStringBuilder from '../components/ApiStringBuilder';
import AuthModule from '../components/AuthModule';

const isNotNull = (r) => r != null && r !== 'undefined';
const AUTH_TOKEN = 'd9d2a4da-086e-4393-ae32-b02a140f00cb';

const TESTCONFIG = {
    API : {
        DEVICE : '5a1ff813889d0e001da1b4ea'
    },
    AUTH : {
        USERNAME : 'itest',
        PASSWORD : '1234'
    }
};
test("ApiStringBuilder inserts single resource correctly" , () => {

    var x = new ApiStringBuilder();
    var str = x.api("1.0").toString();
    expect(str).toBe('/api/1.0');    
});

test("ApiStringBuilder inserts multiple resources correctly" , () => {
    var x = new ApiStringBuilder();
    var str = x.api('1.0').devices(TESTCONFIG.API.DEVICE).toString();
    expect(str).toBe('/api/1.0/devices/' + TESTCONFIG.API.DEVICE);
});

test("ApiStringBuilder inserts null resource path correctly" , () => {
    var x = new ApiStringBuilder();
    var str = x.api('1.0').devices(TESTCONFIG.API.DEVICE).details().toString();
    expect(str).toBe('/api/1.0/devices/' + TESTCONFIG.API.DEVICE + '/details');
});

test('ApiStringBuilder inserts multiple resources with parameters correctly', () =>{
    var x = new ApiStringBuilder();
    var str = x.api('1.0').devices(TESTCONFIG.API.DEVICE).details().parameters({
        access_token : AUTH_TOKEN
    }).toString();
    expect(str).toBe('/api/1.0/devices/' + TESTCONFIG.API.DEVICE + '/details?access_token=' + AUTH_TOKEN);
});

// test('Request Device Details and receive no error' , done => {
//     AuthModule.getInstance().authenticateWithUserPass(TESTCONFIG.AUTH.USERNAME,TESTCONFIG.AUTH.PASSWORD,function(e){
//         RequestDeviceDetails(TESTCONFIG.API.DEVICE,e.access_token,function(error, response){
//             expect(error).toBeNull();
//             done();
//         });
//     });
    
// });

// test('Request Device Details and response has Capability field' , done =>{
//     AuthModule.getInstance().authenticateWithUserPass(TESTCONFIG.AUTH.USERNAME,TESTCONFIG.AUTH.PASSWORD,function(e){
//         RequestDeviceDetails(TESTCONFIG.API.DEVICE,e.access_token,function(error, response){            
//             var json = JSON.parse(response.response);
//             var device = json.device;
//             expect(device.capability).not.toBeNull();
//             done();
//         });
//     }.bind(this));
// });

test('Successfully retrieve token from OAuth Service' , done =>{
    getTokenByUserPass(TESTCONFIG.AUTH.USERNAME,TESTCONFIG.AUTH.PASSWORD,function(error,response){
        expect(error).toBeNull();
        done();
    });
});