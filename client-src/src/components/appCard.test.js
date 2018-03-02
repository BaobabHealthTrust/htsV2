import React from 'react';
import ReactDOM from 'react-dom';
import AppCard from './appCard';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: AppCard', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <AppCard />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})