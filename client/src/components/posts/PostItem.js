import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  post,
  auth,
  post: {
    _id,
    text,
    name,
    userpic,
    user,
    likes,
    comments,
    date
  },
  showActions,
  addLike,
  removeLike,
  deletePost
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={userpic} alt='userpic' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>
        {showActions && (
          <Fragment>
            <button type='button' className='btn btn-light' onClick={() => addLike(_id)}>
              <i className='fas fa-thumbs-up' />{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button type='button' className='btn btn-light' onClick={() => removeLike(_id)}>
              <i className='fas fa-thumbs-down' />
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion {comments.length > 0 && <span className='comment-count'>{comments.length}</span>}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button type='button' className='btn btn-danger' onClick={() => deletePost(_id)}>
                <i className='fas fa-times' />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  showActions: PropTypes.bool.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
