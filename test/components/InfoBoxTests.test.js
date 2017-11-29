import React from 'react';
import InfoBoxChart from '../../components/InfoBoxChart';
import renderer from 'react-test-renderer';


test('Link changes the class when hovered', () => {

    const component = renderer.create(
        <InfoBoxChart ></InfoBoxChart>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    

});