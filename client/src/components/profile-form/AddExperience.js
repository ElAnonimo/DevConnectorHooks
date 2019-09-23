import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const [toDateDisabled, toggleDateDisabled] = useState(false);

  const {
    company,
    title,
    location,
    from,
    to,
    current,
    description
  } = formData;

  const onChange = evt => setFormData({
    ...formData,
    [evt.target.name]: evt.target.value
  });

  const onSubmit = evt => {
    evt.preventDefault();
    addExperience(formData, history)
  };

  const toggleCurrent = () => {
    setFormData({ ...formData, current: !current });
    toggleDateDisabled(!toDateDisabled)
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch' /> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={evt => onSubmit(evt)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Job Title'
            name='title'
            value={title}
            required
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Company'
            name='company'
            value={company}
            required
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={toggleCurrent}
            /> Current Job
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            disabled={toDateDisabled ? 'disabled' : ''}
            value={to}
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            value={description}
            cols='30'
            rows='5'
            placeholder='Job Description'
            onChange={evt => onChange(evt)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>Go Back</Link>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(withRouter(AddExperience));
