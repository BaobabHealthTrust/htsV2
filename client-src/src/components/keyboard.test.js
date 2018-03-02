import React from 'react';
import ReactDOM from 'react-dom';
import Keyboard from './keyboard';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: Keyboard', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <Keyboard />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})