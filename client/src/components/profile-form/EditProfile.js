import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProfileForm from '../common/ProfileForm';
import { getProfile, createProfile } from '../../actions/profile';

const EditProfile = ({
  profile: {profile, loading},
  getProfile,
  createProfile,
  history
}) => {
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <ProfileForm
      edit
      loading={loading}
      profile={profile}
      history={history}
      createProfile={createProfile}
    />
  );
};

EditProfile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile, createProfile })(withRouter(EditProfile));
