import {
    SELECT_CATEGORY, SELECT_VENUE, NEW_VENUE_NAME, CHANGE_LOCATION,
    CHANGE_PHONE, CHANGE_EMAIL, CHANGE_BUSINESS_HOURS,
    CHANGE_MAX_CAPACITY, CHANGE_DEFAULT_WAIT_TIME, SUBMIT_NEW_VENUE
} from './actions/newVenueTypes'

import { noCategory, noVenue, noBusinessHours} from '../constants';

const initialState = {
    category: noCategory,
    venue: {
        selection: noVenue,
        newVenue: '',
    },
    address: {
        address: '',
        city: '',
        state: '',
        zip: '',
    },
    phone: '',
    email: '',
    businessHours: noBusinessHours,
    maxCapacity: '',
    defaultWaitTime: {
        'hr': '',
        'min': '',
    }
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SELECT_CATEGORY:
            return {
                ...state,
                category: action.payload,
                venue: {
                    selection: noVenue,
                    newVenue: '',
                }
            }
        
        case SELECT_VENUE:
            return {
                ...state,
                venue: {
                    ...state.venue,
                    selection: action.payload,
                }
            }

        case NEW_VENUE_NAME:
            return {
                ...state,
                venue: {
                    ...state.venue,
                    newVenue: action.payload,
                }
            }

        case CHANGE_LOCATION:
            return {
                ...state,
                address: action.payload,
            }

        case CHANGE_PHONE:
            return {
                ...state,
                phone: action.payload,
            }

        case CHANGE_EMAIL:
            return {
                ...state,
                email: action.payload,
            }

        case CHANGE_BUSINESS_HOURS:
            return {
                ...state,
                businessHours: action.payload,
            }

        case CHANGE_MAX_CAPACITY:
            return {
                ...state,
                maxCapacity: action.payload,
            }

        case CHANGE_DEFAULT_WAIT_TIME:
            return {
                ...state,
                defaultWaitTime: action.payload,
            }

        case SUBMIT_NEW_VENUE:
            return initialState

        default:
            return state
    }
}