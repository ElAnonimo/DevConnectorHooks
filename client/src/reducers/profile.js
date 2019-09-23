import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  GET_PROFILE_ERRORED,
  CLEAR_PROFILE,
  EDIT_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

const profile = (state = initialState, action) => {
  switch(action.type) {
    case GET_PROFILE:
    case EDIT_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case GET_PROFILE_ERRORED:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default profile;
