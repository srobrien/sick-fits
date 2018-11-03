import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const DELETE_CART_ITEM_MUTATION = gql`
  mutation($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const DeleteCartButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class DeleteFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(item => item.id !== cartItemId);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={DELETE_CART_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, { loading }) => (
          <DeleteCartButton
            title="Delete Item"
            disabled={loading}
            onClick={() => {
              removeFromCart().catch(e => alert('Error: ' + e.message));
            }}
          >
            &times;
          </DeleteCartButton>
        )}
      </Mutation>
    );
  }
}

export default DeleteFromCart;
