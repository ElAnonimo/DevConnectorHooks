import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
   education: {
     school,
     degree,
     'field of study': fieldOfStudy,
     current,
     to,
     from,
     description
   }
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> - {to
        ? <Moment format='YYYY/MM/DD'>{to}</Moment>
        : 'Now'
      }
      </p>
      <p><strong>Degree: </strong></p>{degree}
      <p><strong>Field of Study: </strong></p>{fieldOfStudy}
      <p><strong>Description: </strong></p>{description}
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired
};

export default ProfileEducation;
