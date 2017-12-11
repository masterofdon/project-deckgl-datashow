import {ScreenGridDataAdapter, RoadQualityDataAdapter, GeoJsonDataAdapter} from '../core/network/DataAdapter';

test("Test if ScreenGridData loaded with no error",done => {

    ScreenGridDataAdapter(function(error,data){
        expect(error).toBeNull();
        done();
    });
});

test("Test if ScreenGridData has enough elements",done => {
    RoadQualityDataAdapter(function(error,data){
        expect(data.length).toBeGreaterThan(1000);
        done();
    });
});

test("Test if GeoJsonData loaded with no error",done => {
    GeoJsonDataAdapter(function(error,data){
        expect(error).toBeNull();
        done();
    });
});

test("Test if GeoJsonData has enough elements",done => {
    GeoJsonDataAdapter(function(error,data){
        // console.log(typeof data);
        var jsonParsed = JSON.parse(data.response);
        var resultset = jsonParsed._embedded || jsonParsed.features;
        expect(jsonParsed.features.length).toBeGreaterThan(10000);
        done();
    });
});
