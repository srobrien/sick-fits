import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Error from '../components/ErrorMessage';
import Table from '../components/styles/Table';
import SickButton from '../components/styles/SickButton';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      email
      name
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      email
      name
      permissions
    }
  }
`;

const PERMISSIONS = [
  'USER',
  'ADMIN',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

class Permissions extends Component {
  render() {
    return (
      <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
          <div>
            <Error error={error} />
            <div>
              <h2>Manage user permissions!</h2>
              <Table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    {PERMISSIONS.map(p => (
                      <th key={p}>{p}</th>
                    ))}
                    <th>⬇️</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <UserPermissions key={user.id} user={user} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Query>
    );
  }
}

export default Permissions;

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      email: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handleToggle = e => {
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        perm => perm !== checkbox.value
      );
    }
    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const { user } = this.props;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: user.id
        }}
        refetchQueries={[{ query: ALL_USERS_QUERY }]}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan="9">
                  <Error error={error} />{' '}
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {PERMISSIONS.map(p => (
                <td key={p}>
                  <label htmlFor={`${user.id}-permission-${p}`}>
                    <input
                      id={`${user.id}-permission-${p}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(p)}
                      onChange={this.handleToggle}
                      value={p}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat
                  {loading ? `ing` : `e`}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}
