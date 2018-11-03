import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import CartStyles from './styles/CartStyles';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import User from './User';
import CartItem from './CartItem';
import Charge from './Charge';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Compose = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = props => {
  return (
    <Compose>
      {({ user, localState, toggleCart }) => {
        const me = user.data.me;
        if (!me) return null;

        return (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => (
              <Query query={LOCAL_STATE_QUERY}>
                {({ data }) => (
                  <CartStyles open={localState.data.cartOpen}>
                    <header>
                      <CloseButton title="close" onClick={toggleCart}>
                        &times;
                      </CloseButton>
                      <Supreme>
                        {me.name}
                        's Cart
                      </Supreme>
                      <p>
                        You have {me.cart.length} item
                        {me.cart.length === 1 ? '' : 's'} in your cart.
                      </p>
                    </header>
                    <ul>
                      {me.cart.map(item => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </ul>
                    <footer>
                      <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                      <Charge>
                        <SickButton>Checkout</SickButton>
                      </Charge>
                    </footer>
                  </CartStyles>
                )}
              </Query>
            )}
          </Mutation>
        );
      }}
    </Compose>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
