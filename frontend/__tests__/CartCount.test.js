import CartCounter from '../components/CartCounter';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

describe('<CartCounter />', () => {
  it('renders', () => {
    shallow(<CartCounter count={10} />);
  });
  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCounter count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props snapshot', () => {
    const wrapper = shallow(<CartCounter count={50} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
