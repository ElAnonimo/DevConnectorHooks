import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_PROFILES,
  GET_PROFILE_ERRORED,
  EDIT_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS
} from './types';

// get current user's profile
export const getProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// get all profiles
export const getAllProfiles = () => async dispatch => {
  // when visit an individual user profile it goes to the state
  // so we need to clear it from the state to prevent flashing the past user's profile on the page
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// get profile by id
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// get GitHub repos
export const getGithubRepos = githubUsername=> async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${githubUsername}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// create or edit profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch(err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(err => dispatch(setAlert(
        err.message,
        'danger'
      )));
    }

    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: EDIT_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added'));

    history.push('/dashboard');
  } catch(err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(err => dispatch(setAlert(
        err.message,
        'danger'
      )));
    }
  }
};

// add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: EDIT_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added'));

    history.push('/dashboard');
  } catch(err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(err => dispatch(setAlert(
        err.message,
        'danger'
      )));
    }
  }
};

// delete experience by id
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: EDIT_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experienced Removed'));
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// delete education by id
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: EDIT_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed'));
  } catch(err) {
    dispatch({
      type: GET_PROFILE_ERRORED,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// delete user account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can not be reverted')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch(err) {
      dispatch({
        type: GET_PROFILE_ERRORED,
        payload: {
          message: err.response.statusText,
          status: err.response.status
        }
      });
    }
  }
};
