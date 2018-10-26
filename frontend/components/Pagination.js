import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationsStyles from '../components/styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      const totalItems = data.itemsConnection.aggregate.count;
      const page = props.page;
      const pages = Math.ceil(totalItems / perPage);
      return (
        <PaginationsStyles>
          <Head>
            <title>
              Sick Fits! - Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page - 1 }
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{totalItems} Items Total</p>

          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page + 1 }
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationsStyles>
      );
    }}
  </Query>
);

export default Pagination;
