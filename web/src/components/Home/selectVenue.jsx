import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCategory, selectVenue, selectLocation } from '../../reducers/actions/venueActions';
import { noCategory, noLocation, noVenue } from '../../constants';

import { Grid, MenuItem, Select, Box, StylesProvider } from "@material-ui/core";

import styles from "./home.module.css";

class SelectVenue extends React.Component{

    getCategories = () => {
        let categories = this.props.venues.map((currentValue) => {
            return currentValue.category;
        })
        let distinctCategories = categories.filter((elt, index) => {
            return categories.indexOf(elt) === index;
        })
        return distinctCategories;
    }

    getVenues = () => {
        let filteredCategories = this.props.venues.filter((elt) => {
            return elt.category === this.props.category;
        })
        let venues = filteredCategories.map((currentValue) => {
            return currentValue.venue_name;
        })
        let distinctVenues = venues.filter((elt, index) => {
            return venues.indexOf(elt) === index;
        })
        return distinctVenues;
    }

    getLocations = () => {
        let filteredVenues = this.props.venues.filter((elt) => {
            return elt.category === this.props.category && elt.venue_name === this.props.venue;
        })
        return filteredVenues;
    }

    render() {
        let categories = this.getCategories();
        let venues = this.getVenues();
        let locations = this.getLocations();
        return (
            <Grid container className = {styles.venueLocation}>
                <Grid item xs={12} md={6}>
                    <Select
                        style={{ width: '10rem',
                        textAlign: 'left'}}
                        value={this.props.category}
                        onChange={(event) => {  
                            this.props.selectCategory(event.target.value);
                        }}
                    >
                        <MenuItem value={noCategory} > Select a Category </MenuItem>
                        {
                            categories.map(category => (
                                <MenuItem
                                 value={category} key={category}> {category} </MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Select
                        style={{ width: '10rem',
                        textAlign: 'left'}}
                        disabled={this.props.category === noCategory}
                        value={this.props.venue}
                        onChange={(event) => {
                            event.preventDefault();
                            this.props.selectVenue(event.target.value);

                        }}
                    >
                        <MenuItem value={noVenue}> Select a Venue </MenuItem>
                        {
                            venues.map(venue => (
                                <MenuItem value={venue} key={venue}> {venue} </MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
                <br/><br/>
                <Grid item xs={12} md={12}>
                    <Select
                        style={{ width: '25rem',
                        textAlign: 'left'}}
                        disabled={this.props.category === noCategory || this.props.venue === noVenue}
                        value={this.props.location}
                        onChange={(event) => {
                            event.preventDefault();
                            this.props.selectLocation(event.target.value);
                        }}
                    >
                        
                        <MenuItem value={noLocation}> Select a Location </MenuItem>
                        {
                            locations.map(venue => (
                                <MenuItem value={venue.venue_uid} key={venue.venue_uid}> {venue.street} {venue.city} </MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
            </Grid>
        );
    }
};

SelectVenue.propTypes = {
    selectCategory: PropTypes.func.isRequired,
    selectVenue: PropTypes.func.isRequired,
    venues: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
    venues: state.venueData.venues,
    category: state.venueData.category,
    venue: state.venueData.venue,
    location: state.venueData.venue_uid,
})

export default connect(mapStateToProps, { selectCategory, selectVenue, selectLocation })(SelectVenue);