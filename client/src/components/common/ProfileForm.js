import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileForm = ({
  profile,
  edit,
  loading,
  history,
  createProfile
}) => {
  const [profileData, setProfileData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubUsername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    setProfileData({
      company: !loading ? profile.company : '',
      website: !loading ? profile.website : '',
      location: !loading ? profile.location : '',
      status: !loading ? profile.status : '',
      skills: !loading ? profile.skills.join() : '',
      githubUsername: !loading ? profile.githubUsername : '',
      bio: !loading ? profile.bio : '',
      twitter: !loading ? profile && profile.social && profile.social.twitter : '',
      facebook: !loading ? profile && profile.social && profile.social.facebook : '',
      linkedin: !loading ? profile && profile.social && profile.social.linkedin : '',
      youtube: !loading ? profile && profile.social && profile.social.youtube : '',
      instagram: !loading ? profile && profile.social && profile.social.instagram : ''
    });
  }, [loading, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubUsername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = profileData;

  const onChange = evt => setProfileData({
    ...profileData,
    [evt.target.name]: evt.target.value
  });

  const onSubmit = evt => {
    evt.preventDefault();
    createProfile(profileData, history, edit);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>{edit ? 'Update Your Profile' : 'Create Your Profile'}</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Let's get some information to make your profile stand out
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={evt => onSubmit(evt)}>
        <div className='form-group'>
          <select name='status' value={status} onChange={evt => onChange(evt)}>
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Instructor'>Instructor or Teacher</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>Give us an idea of where you are at in your career</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Company'
            name='company'
            value={company}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>Could be your own company or one you work for</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            value={website}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>Could be your own or a company website</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>Please use comma separated values (e.g.
            HTML, CSS, JavaScript, PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubUsername'
            value={githubUsername}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={evt => onChange(evt)}
          />
          <small className='form-text'>Tell us a little about yourself</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs &&
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={evt => onChange(evt)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={evt => onChange(evt)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x' />
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={evt => onChange(evt)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x' />
              <input
                type='text'
                placeholder='LinkedIn URL'
                name='linkedin'
                value={linkedin}
                onChange={evt => onChange(evt)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={evt => onChange(evt)}
              />
            </div>
          </Fragment>
        }

        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>Go Back</Link>
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  profile: PropTypes.object,
  loading: PropTypes.bool,
  createProfile: PropTypes.func,
  history: PropTypes.object,
  edit: PropTypes.bool
};

export default ProfileForm;
