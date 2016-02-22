import { connect } from 'react-redux';

import Settings from '../components/Settings';
import * as settingActions from '../actions/settings/';

export default connect(
  state => ({user: state.user, auth: state.auth}),
  settingActions
)(Settings);
