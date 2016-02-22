import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';
import template from '../utils/profile.js';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = { edited: false, saving: false, user: props.user };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.user.id !== this.props.user) {
      this.setState({user: nextProps.user});
    }
  }

  saveSuccessCallback(){
    this.setState({ saving: false, edited: false });
  }

  checkForEmptyString(user){
    const cleanUser = Object.assign({}, user);
    for (let prop in cleanUser) {
      if (cleanUser.hasOwnProperty(prop)) {
        if (cleanUser[prop] === ''){
          cleanUser[prop] = null;
        }
      }
    }
    return cleanUser;
  }

  handleSubmit(){
    const { editUser } = this.props;
    const { user } = this.state;
    const cleanUser = this.checkForEmptyString(user);
    this.setState({ saving: true });
    editUser(cleanUser, this.saveSuccessCallback.bind(this));
  }

  getInput(key, content){
    const { user } = this.state;
    // Plain text inputs
    if (content === 'input'){
      return (
        <div key={key}>
          <div className="input-group">
            <span className="input-group-addon">{key.substr(0, 1).toUpperCase() + key.substr(1, key.length)}</span>
            <input type="text" className="form-control" value={user[key]} ref={key} onChange={this.handleInputChange.bind(this, key)}/>
          </div>
          <br/>
        </div>
        );
    }

    // Array into checkboxes panel
    const categoriesInputs = content.map(category =>
        <div key={category}>
          <div className="input-group">
            <span className="input-group-addon">
              <input name={category} checked={ (user[key] && user[key].indexOf(category) !== -1) ? true : false } type="checkbox" aria-label="..." onChange={this.handleInputChange.bind(this, key)}/>
            </span>
            <p className="form-control" aria-label="...">{category}</p>
          </div>
          <br/>
        </div>
        );

    return (
      <div key={key} className="panel panel-default">
        <div className="panel-heading">{key.substr(0, 1).toUpperCase() + key.substr(1, key.length)}</div>
        <div className="panel-body">
          { categoriesInputs }
        </div>
      </div>
    );
  }

  handleInputChange(key, e){
    const { user } = this.state;
    let newUser = Object.assign({}, user);
    // Plain text inputs
    if ( typeof user[key] === 'string'){
      newUser = Object.assign({}, user, { [key]: e.target.value });
    //Checkboxes inputs
    } else {
      const categories = user[key] ? [].concat(user[key]) : [];
      let newCategories = [];
      if (categories.indexOf(e.target.name) === -1) {
        newCategories = categories.concat(e.target.name);
      }else {
        newCategories = categories.filter(category => category !== e.target.name);
      }
      newUser = Object.assign({}, user, { [key]: newCategories });
    }

    this.setState({ user: newUser, edited: true });
  }

  getContents(){
    const inputsNames = Object.keys(template);
    const inputs = inputsNames.map(name => this.getInput(name, template[name]));
    return inputs;
  }

  render() {
    const { edited, saving } = this.state;
    const button = saving ?
      <button className="btn btn-success" disabled><Spinner /></button> :
      <button className="btn btn-success" onClick={this.handleSubmit.bind(this)} disabled={ edited ? false : true } >Save</button>;

    const contents = this.getContents.bind(this)();
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">Settings</h3>
        </div>
        <div className="panel-body">
          { contents }
        </div>
        <div className="panel-footer">
          { button }
        </div>
      </div>
    );
  }
}


Settings.propTypes = {
  user: PropTypes.object.isRequired,
  editUser: PropTypes.func.isRequired
};
