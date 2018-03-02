import React from 'react';
import ReactDOM from 'react-dom';
import U7 from './u7';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: U7', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <U7 />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})