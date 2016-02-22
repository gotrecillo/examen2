import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NotificationsContainer from './NotificationsContainer';
import MenuItem from '../components/MenuItem';
import * as authActions from '../actions/auth';
import * as menuActions from '../actions/menu';


class Menu extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const { registerListeners, auth } = this.props;
    if (auth.authenticated){
      registerListeners(auth.id);
    }
  }

  componentWillReceiveProps(nextProps){
    const { registerListeners, unregisterListeners, auth } = this.props;
    if (nextProps.auth.id !== auth.id){
      unregisterListeners(auth.id);
      registerListeners(nextProps.auth.id);
    }
  }

  handleSignOutClick() {
    this.props.signOut();
  }

  render() {
    const { auth, user } = this.props;
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">Polls App</Link>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <MenuItem href="/vote" { ...this.props }>Vote</MenuItem>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <NotificationsContainer { ...this.props } />
              {
                auth.authenticated ?
                <li className="navbar-btn dropdown">
                  <button style={{ borderRadius: '15px' }} type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img style={{width: '25px', height: '25px'}} src={ user.picture ? user.picture : 'img/user.png' } alt=""/>
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <MenuItem href="/poll" { ...this.props }>My Polls</MenuItem>
                    <MenuItem href="/settings" { ...this.props }>Settings</MenuItem>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={ (e) =>{e.preventDefault(); this.handleSignOutClick(); }  }>Sign Out</a></li>
                  </ul>
                </li>
                 :
                <MenuItem href="/sign-in" { ...this.props }>Sign In</MenuItem>
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Menu.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  registerListeners: PropTypes.func,
  unregisterListeners: PropTypes.func,
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    active: state.menu.active,
    auth: state.auth,
    user: state.user
  };
}

export default connect(
  mapStateToProps, Object.assign({}, authActions, menuActions)
)(Menu);
