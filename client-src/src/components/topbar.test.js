import React from 'react';
import ReactDOM from 'react-dom';
import Topbar from './topbar';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: Topbar', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <Topbar />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})