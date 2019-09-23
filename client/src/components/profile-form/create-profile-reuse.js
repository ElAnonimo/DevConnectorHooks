import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProfileForm from '../common/ProfileForm';
import { createProfile } from '../../actions/profile';

const CreateProfileReuse = ({ history, createProfile }) => {
  return (
    <ProfileForm
      history={history}
      createProfile={createProfile}
    />
  );
};

CreateProfileReuse.propTypes = {
  history: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(withRouter(CreateProfileReuse));
