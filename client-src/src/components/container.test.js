import React from 'react';
import ReactDOM from 'react-dom';
import Container from './container';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: Container', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <Container />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})