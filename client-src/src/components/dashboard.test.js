import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: Dashboard', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <Dashboard />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})