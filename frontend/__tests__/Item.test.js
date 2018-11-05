import ItemComponent from '../components/Item';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

const TestItem = {
  id: 'ABC123',
  title: 'A test Item',
  price: 5000,
  description: 'This is a test item',
  image: 'test.jpeg',
  largeImage: 'largeTest.jpeg'
};

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={TestItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
