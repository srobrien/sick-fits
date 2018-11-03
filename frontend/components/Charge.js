import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, { CURRENT_USER_QUERY } from './User';

const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

class Charge extends Component {
  onToken = res => {
    console.log(res);
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick Fits!"
            description={`Order of ${totalItems(me.cart)}`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_L3Jvbvd9BbwqTlFQLPuKebN4"
            currency="GBP"
            email={me.email}
            token={res => this.onToken(res)}
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default Charge;
