import {criteriaBuilder} from '../components/CriteriaBuilder';

const isNotNull = (r) => r != null && r !== 'undefined';

describe('CriteriaBuilder tests' , () => {
    test("CriteriaBuilder builds EQUALS correctly" , () => {
        var result = criteriaBuilder([{op: 'equals', name: 'data.imei', value : '1214'}]);
        expect(result.query.bool.must[0].match['data.imei']).toBe('1214');
    });

    test("Criterionbuilder builds CONTAINS correctly" , () => {
        var result = criteriaBuilder([{op: 'contains', name: 'data.aqi', value : '38'}]);
        expect(result.query.bool.must[0].wildcard['data.aqi'].value).toBe('*38*'); 
    });

    test("Criterionbuilder builds NOT_CONTAINS correctly" , () => {
        var result = criteriaBuilder([{op: 'not_contains', name: 'data.aqi', value : '38'}]);
        expect(result.query.bool.must_not[0].wildcard['data.aqi'].value).toBe('*38*'); 
    });

    test("Criterionbuilder builds LESS THAN correctly" , () => {
        var result = criteriaBuilder([{op: 'lt', name: 'data.temperature', value : '10'}]);
        expect(result.query.bool.must[0].range['data.temperature']).not.toBeNull();
        expect(result.query.bool.must[0].range['data.temperature']['lt']).not.toBeNull();
        expect(result.query.bool.must[0].range['data.temperature']['lt']).toBe('10');  
    });

    test("Criterionbuilder builds GREATER THAN OR EQUAL correctly" , () => {
        var result = criteriaBuilder([{op: 'gte', name: 'data.temperature', value : '10'}]);
        expect(result.query.bool.must[0].range['data.temperature']).not.toBeNull();
        expect(result.query.bool.must[0].range['data.temperature']['gte']).not.toBeNull();
        expect(result.query.bool.must[0].range['data.temperature']['gte']).toBe('10'); 
    });

    test("Criterionbuilder builds multiple POSITIVE QUERIES correctly" , () => {
        var result = criteriaBuilder([{op: 'gte', name: 'data.temperature', value : '10'}, {op : 'contains' , name : 'data.id' , value : 'onur'}]);
        expect(result.query.bool.must.length).toBe(2);
        expect(result.query.bool.must[0].range['data.temperature']['gte']).toBe('10');
        expect(result.query.bool.must[1].wildcard['data.id'].value).toBe('*onur*'); 
    });

    test("Criterionbuilder builds multiple QUERIES correctly" , () => {
        var result = criteriaBuilder([{op: 'gte', name: 'data.temperature', value : '10'}, {op : 'not_contains' , name : 'data.id' , value : 'onur'}]);
        expect(result.query.bool.must.length).toBe(1);
        expect(result.query.bool.must_not.length).toBe(1);
        expect(result.query.bool.must[0].range['data.temperature']['gte']).toBe('10');
        expect(result.query.bool.must_not[0].wildcard['data.id'].value).toBe('*onur*'); 
    });
});