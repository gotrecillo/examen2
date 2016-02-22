import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = { edited: false, saving: false, userName: props.user.name, userPicture: props.user.picture || '' };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.user.id !== this.props.user) {
      this.setState({userName: nextProps.user.name, userPicture: nextProps.user.picture || ''});
    }
  }

  handleNameChange(event) {
    this.setState({ edited: true, userName: event.target.value });
  }

  handlePictureChange(event) {
    this.setState({ edited: true, userPicture: event.target.value });
  }

  saveSuccessCallback(){
    this.setState({ saving: false, edited: false });
  }

  handleSubmit(){
    const { editUser } = this.props;
    const name = this.refs.name.value;
    const picture = this.refs.picture.value;
    this.setState({ saving: true });
    editUser(name, picture, this.saveSuccessCallback.bind(this));
  }

  render() {
    const { edited, userName, userPicture, saving } = this.state;
    const button = saving ?
      <button className="btn btn-success" disabled><Spinner /></button> :
      <button className="btn btn-success" onClick={this.handleSubmit.bind(this)} disabled={ edited ? false : true } >Save</button>;

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">Settings</h3>
        </div>
        <div className="panel-body">
          <div className="input-group">
            <span className="input-group-addon">Name</span>
            <input type="text" className="form-control" ref="name" value={ userName } onChange={this.handleNameChange.bind(this)}/>
          </div>
          <br/>
          <div className="input-group">
            <span className="input-group-addon">Picture</span>
            <input type="text" className="form-control" ref="picture" value={ userPicture } onChange={this.handlePictureChange.bind(this)}/>
          </div>
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
