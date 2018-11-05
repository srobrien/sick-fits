import Authenticated from '../components/Authenticated';
import OrderPage from '../components/OrderPage.js';

const Order = props => (
  <>
    <Authenticated>
      <OrderPage id={props.query.id} />
    </Authenticated>
  </>
);

export default Order;
