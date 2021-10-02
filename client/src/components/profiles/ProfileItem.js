import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import uuid from 'uuid';

const Profiles = ({ profile: {
  user: { _id, name, userpic },
  status,
  company,
  location,
  skills
} }) => {
  return (
    <div className='profile bg-light'>
      <img src={userpic} className='round-img' alt='userpic' />
      <div>
        <h2>{name}</h2>
        <p>{status} {company && <span> at {company}</span>}</p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>View Profile</Link>
      </div>
      <ul>
        {skills && skills.slice(0, 4).map(skill => (
          <li key={uuid.v4()} className='text-primary'>
            <i className='fas fa-check' /> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Profiles;
