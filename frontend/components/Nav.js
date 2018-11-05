import Link from 'next/link';
import { Mutation } from 'react-apollo';
import NavStyles from '../components/styles/NavStyles';
import CloseButton from './styles/CloseButton';
import User from './User';
import Signout from './Signout';
import CartCounter from './CartCounter';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>

        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>

            <Link href={`/orders`}>
              <a>Orders</a>
            </Link>

            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>
                  Cart 🛒
                  <CartCounter
                    count={me.cart.reduce(
                      (tally, cartItem) => tally + cartItem.quantity,
                      0
                    )}
                  />
                </button>
              )}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
