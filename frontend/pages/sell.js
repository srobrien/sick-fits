import CreateItem from '../components/CreateItem';
import Authenticated from '../components/Authenticated';

const Sell = props => (
  <>
    <Authenticated>
      <CreateItem />
    </Authenticated>
  </>
);

export default Sell;
