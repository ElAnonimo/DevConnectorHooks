import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: {
    company,
    title,
    location,
    current,
    to,
    from,
    description
  }
}) => {
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> - {to
          ? <Moment format='YYYY/MM/DD'>{to}</Moment>
          : 'Now'
        }
      </p>
      <p><strong>Position: </strong></p>{title}
      <p><strong>Description: </strong></p>{description}
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired
};

export default ProfileExperience;