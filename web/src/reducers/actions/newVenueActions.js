// import axios from 'axios';

import { SELECT_CATEGORY, SELECT_VENUE, NEW_VENUE_NAME } from './newVenueTypes'

// import { API_URL, } from '../../constants';

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