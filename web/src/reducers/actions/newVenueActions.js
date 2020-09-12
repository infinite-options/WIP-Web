import axios from 'axios';

import {
    SELECT_CATEGORY, SELECT_VENUE, NEW_VENUE_NAME, CHANGE_LOCATION,
    CHANGE_PHONE, CHANGE_EMAIL, CHANGE_BUSINESS_HOURS,
    CHANGE_MAX_CAPACITY, CHANGE_DEFAULT_WAIT_TIME,
    SUBMIT_NEW_VENUE,
} from './newVenueTypes'

import { API_URL, BING_LCOATION_API_URL, noCategory, noVenue, needVenue } from '../../constants';
import { BING_LOCATION_API_KEY } from '../../API_keys';

export const selectNewCategory = (category) => dispatch => {
    dispatch({
        type: SELECT_CATEGORY,
        payload: category,
    })
}

export const selectNewVenue = (venue) => dispatch => {
    dispatch({
        type: SELECT_VENUE,
        payload: venue,
    })
}

export const createNewVenue = (venue) => dispatch => {
    dispatch({
        type: NEW_VENUE_NAME,
        payload: venue,
    })
}

export const changeAddress = (oldAddress, field, newValue) => dispatch => {
    let newAddress = {
        ...oldAddress,
        [field]: newValue,
    }
    dispatch({
        type: CHANGE_LOCATION,
        payload: newAddress,
    })
}

export const changePhone = (newPhone) => dispatch => {
    dispatch({
        type: CHANGE_PHONE,
        payload: newPhone,
    })
}

export const changeEmail = (newEmail) => dispatch => {
    dispatch({
        type: CHANGE_EMAIL,
        payload: newEmail,
    })
}

export const changeBusinessHours = (oldBusinessHours, day, start, newTime) => dispatch => {
    let newBusinessHours = oldBusinessHours;
    newBusinessHours[day][start] = newTime;
    dispatch({
        type: CHANGE_BUSINESS_HOURS,
        payload: newBusinessHours,
    })
}

export const changeMaxCapacity = (newMaxCapacity) => dispatch => {
    dispatch({
        type: CHANGE_MAX_CAPACITY,
        payload: newMaxCapacity,
    })
}

export const changeDefaultWaitTime = (oldDefaultWaitTime, timeUnit, newValue) => dispatch => {
    let newDefaultWaitTime = {
        ...oldDefaultWaitTime,
        [timeUnit]: newValue,
    }
    dispatch({
        type: CHANGE_DEFAULT_WAIT_TIME,
        payload: newDefaultWaitTime,
    })
}

export const submitVenue = (venues, category, selectedVenueName, newVenueName,
    address, phone, email, businessHours, maxCapacity, defaultWaitTime) => dispatch => {
    if(category === noCategory || selectedVenueName === noVenue) {
        // Necessary fields not filled
        return;
    }
    axios
        .get(BING_LCOATION_API_URL,{
            params: {
                CountryRegion: 'US',
                adminDistrict: address.state,
                locality: address.city,
                postalCode: address.zip,
                addressLine: address.address,
                key: BING_LOCATION_API_KEY,
            }
        })
        .then((res) => {
            let locationApiResult = res.data;
            // console.log(locationApiResult);
            if(locationApiResult.statusCode === 200) {
                let locations = locationApiResult.resourceSets[0].resources;
                /* Possible improvement: choose better location in case first one not desired
                */
                let location = locations[0];
                let lat = location.geocodePoints[0].coordinates[0];
                let long = location.geocodePoints[0].coordinates[1];
                if(location.geocodePoints.length === 2) {
                    lat = location.geocodePoints[1].coordinates[0];
                    long = location.geocodePoints[1].coordinates[1];
                }
                let formattedHour = defaultWaitTime.hr;
                let formattedMin = defaultWaitTime.min;
                if(formattedHour.length === 1) {
                    formattedHour = '0' + formattedHour;
                } else if(formattedHour.length === 0) {
                    formattedHour = '00';
                }
                if(formattedMin.length === 1) {
                    formattedMin = '0' + formattedMin;
                } else if(formattedMin.length === 0) {
                    formattedMin = '00';
                }
                let formattedTime = formattedHour + ':' + formattedMin + ':00';
                if(selectedVenueName !== needVenue) {
                    // Manipulate venues to get venue id
                    let filteredVenues = venues.filter((elt) => {
                        return elt.venue_name === selectedVenueName;
                    })
                    let venue_id = filteredVenues[0].venue_id;
                    let object = {
                        v_name: selectedVenueName,
                        v_id: venue_id,
                        v_category: category,
                        v_max_cap:40,
                        v_current_cap:0,
                        v_queue_head:0,
                        v_business_hours: JSON.stringify(businessHours),
                        a_street: address.address,
                        a_city: address.city,
                        a_state: address.state,
                        a_zip: address.zip,
                        a_phone: phone,
                        v_email: email,
                        a_lattitude: lat,
                        a_longitude: long,
                        v_default_time_spent: formattedTime,
                    };
                    console.log(object)
                    axios
                        .post(API_URL+'add_venue',object)
                        .then((res) => {
                            console.log(res);
                            dispatch({
                                type: SUBMIT_NEW_VENUE
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        })                                   
                } else {
                    let object = {
                        v_name: newVenueName,
                        v_id: null,
                        v_category: category,
                        v_max_cap:40,
                        v_current_cap:0,
                        v_queue_head:0,
                        v_business_hours: JSON.stringify(businessHours),
                        a_street: address.address,
                        a_city: address.city,
                        a_state: address.state,
                        a_zip: address.zip,
                        a_phone: phone,
                        v_email: email,
                        a_lattitude: lat,
                        a_longitude: long,
                        v_default_time_spent: formattedTime,
                    };
                    console.log(object)
                    axios
                        .post(API_URL+'add_venue',object)
                        .then((res) => {
                            console.log(res);
                            dispatch({
                                type: SUBMIT_NEW_VENUE
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
}
