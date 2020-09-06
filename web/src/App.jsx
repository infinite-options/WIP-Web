import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchVenues } from './reducers/actions/venueActions';

import { BrowserRouter as Router, Switch, } from "react-router-dom";
import AppliedRoute from './AppliedRoute'

import NavBar from './components/NavBar';
import Home from './components/Home';
import NewVenue from './components/NewVenue';
import NotFound from './components/NotFound';

import './App.css';

function App(props) {
  useEffect(() => {
    props.fetchVenues();
  })
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <AppliedRoute
            exact path="/"
            component={Home}
          />
          <AppliedRoute
            exact path="/new-venue"
            component={NewVenue}
          />
          <AppliedRoute
            path="*"
            component={NotFound}
          />
        </Switch>
      </Router>
    </div>
  );
}

App.propTypes = {
  fetchVenues: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { fetchVenues })(App);
