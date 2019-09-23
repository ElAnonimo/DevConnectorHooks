import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    'field of study': '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const [toDateDisabled, toggleDateDisabled] = useState(false);

  const {
    school,
    degree,
    'field of study': fieldOfStudy,
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
    addEducation(formData, history)
  };

  const toggleCurrent = () => {
    setFormData({ ...formData, current: !current });
    toggleDateDisabled(!toDateDisabled)
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch' /> Add any school or bootcamp that you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={evt => onSubmit(evt)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            value={school}
            required
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            value={degree}
            required
            onChange={evt => onChange(evt)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field of Study'
            name='field of study'
            value={fieldOfStudy}
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
            /> Current School
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
            placeholder='Program Description'
            onChange={evt => onChange(evt)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>Go Back</Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
