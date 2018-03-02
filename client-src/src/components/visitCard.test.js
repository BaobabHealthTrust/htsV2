import React from 'react';
import ReactDOM from 'react-dom';
import VisitCard from './visitCard';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
    adapter: new Adapter()
});

describe('Component: VisitCard', () => {

    it('should match its empty snapshot', () => {
        const tree = renderer.create( 
            <VisitCard />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

})