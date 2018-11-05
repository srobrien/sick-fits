import OrdersPage from '../components/OrdersPage';
import Authenticated from '../components/Authenticated';

const Orders = props => (
  <>
    <Authenticated>
      <OrdersPage />
    </Authenticated>
  </>
);

export default Orders;
