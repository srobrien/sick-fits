import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';
import Authenticated from '../components/Authenticated';
import { CURRENT_USER_QUERY } from '../components/User';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

describe('<Authenticated />', () => {
  it('renders the signin component for logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Authenticated />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Please Sign in to continue!');
    expect(wrapper.find('Signin').exists()).toBe(true);
  });

  it('renders the child when user is logged in', async () => {
    const Child = () => {
      return <p>Hello I am the child</p>;
    };
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Authenticated>
          <Child />
        </Authenticated>
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
    await wait();
    wrapper.update();
    expect(wrapper.find('Child').exists()).toBe(true);
    expect(wrapper.contains(<Child />));
  });
});
