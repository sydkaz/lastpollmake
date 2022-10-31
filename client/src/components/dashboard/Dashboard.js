import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

class Dashboard extends Component {
  componentDidMount() {
  }

  onDeleteClick(e) {
  }

  render() {
    const { user } = this.props.auth;

    let dashboardContent;
      dashboardContent = (
          <div>
              <p className="lead text-muted">
                  Welcome {user.name}
              </p>
              <div style={{ marginBottom: '60px' }} />
              <button
                  onClick={this.onDeleteClick.bind(this)}
                  className="btn btn-danger"
              >
                  Delete My Account
              </button>
          </div>
      );

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps)(
  Dashboard
);
