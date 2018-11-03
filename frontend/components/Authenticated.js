import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from '../components/Signin';

const Authenticated = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me)
        return (
          <div>
            <p>Please Sign in to continue!</p>
            <Signin />
          </div>
        );
      return props.children;
    }}
  </Query>
);

export default Authenticated;
