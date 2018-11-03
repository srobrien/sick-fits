import CreateItem from '../components/CreateItem';
import Authenticated from '../components/Authenticated';
import Permissions from '../components/Permissions';

const permissions = props => (
  <>
    <Authenticated>
      <Permissions />
    </Authenticated>
  </>
);

export default permissions;
