import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import DeleteFromCart from './DeleteFromCart';

const StyledItem = styled.li`
  padding: 1rem 0, border;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

class CartItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  };

  render() {
    const { item } = this.props;
    if (!item.item) {
      return null;
    }
    return (
      <StyledItem>
        <img width="100" src={item.item.image} alt={item.item.title} />
        <div className="cart-item-details">
          <h3>{item.item.title}</h3>
          <p>
            {formatMoney(item.item.price * item.quantity)}
            {' :Quantity - '}

            <em>
              {item.quantity}
              &times;
              {formatMoney(item.item.price)}
            </em>
          </p>
        </div>
        <DeleteFromCart id={item.id} />
      </StyledItem>
    );
  }
}

export default CartItem;
