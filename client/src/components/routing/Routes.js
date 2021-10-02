import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-form/CreateProfile';
import EditProfile from '../profile-form/EditProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';

const Routes = () => (
  <div className='container'>
    <Alert />
    <Switch>
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
      <Route path='/profiles' component={Profiles} />
      <Route path='/profile/:id' component={Profile} />
      <PrivateRoute path='/dashboard' component={Dashboard} />
      <PrivateRoute path='/create-profile' component={CreateProfile} />
      <PrivateRoute path='/edit-profile' component={EditProfile} />
      <PrivateRoute path='/add-experience' component={AddExperience} />
      <PrivateRoute path='/add-education' component={AddEducation} />
      <PrivateRoute exact path='/posts' component={Posts} />
      <PrivateRoute path='/posts/:id' component={Post} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
