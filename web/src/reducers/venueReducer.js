import { FETCH_VENUES, SELECT_CATEGORY, SELECT_VENUE, SELECT_LOCATION,
    FETCH_CURRENT_QUEUE, CHANGE_FILTER_QUEUE, FETCH_QUEUE_INFO, FETCH_BUSINESS_HOURS,
    CHANGE_STATUS_BUSINESS_HOURS, CHANGE_BUSINESS_HOURS, SUBMIT_BUSINESS_HOURS,
    CHANGE_STATUS_DEFAULT_WAIT_TIME, CHANGE_DEFAULT_WAIT_TIME, SUBMIT_DEFAULT_WAIT_TIME,
    CHANGE_STATUS_MAX_CAP, CHANGE_MAX_CAP, SUBMIT_MAX_CAP, } from './actions/venueTypes';

import { noCategory, noVenue, noLocation,
    noBusinessHours,
    allStatus } from '../constants';

const initialState = {
    venues: [],
    category: noCategory,
    venue: noVenue,
    venue_uid: noLocation,
    currentQueue: [],
    filteredQueue: [],
    queueFilter: allStatus,
    businessHours: noBusinessHours,
    editingBusinessHours: false,
    newBusinessHours: noBusinessHours,
    defaultWaitTime: '',
    maxCapacity: NaN,
    inVenue: NaN,
    inQueue: NaN,
    editingDefaultWaitTime: false,
    newDefaultWaitTimeHour: '',
    newDefaultWaitTimeMinute: '',
    editingMaxCapacity: false,
    newMaxCapacity: '',    
}

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_VENUES:
            return {
                ...state,
                venues: action.payload,
            }

        case SELECT_CATEGORY:
            return {
                ...state,
                category: action.payload,
                venue: noVenue,
                venue_uid: noLocation,
                currentQueue: [],
                filteredQueue: [],
                queueFilter: allStatus,
                businessHours: noBusinessHours,
                editingBusinessHours: false,
                newBusinessHours: noBusinessHours,
                defaultWaitTime: '',
                maxCapacity: NaN,
                inVenue: NaN,
                inQueue: NaN,
                editingDefaultWaitTime: false,
                newDefaultWaitTimeHour: '',
                newDefaultWaitTimeMinute: '',
                editingMaxCapacity: false,
                newMaxCapacity: '',
            }

        case SELECT_VENUE:
            return {
                ...state,
                venue: action.payload,
                venue_uid: noLocation,
                currentQueue: [],
                filteredQueue: [],
                queueFilter: allStatus,
                businessHours: noBusinessHours,
                editingBusinessHours: false,
                newBusinessHours: noBusinessHours,
                defaultWaitTime: '',
                maxCapacity: NaN,
                inVenue: NaN,
                inQueue: NaN,
                editingDefaultWaitTime: false,
                newDefaultWaitTimeHour: '',
                newDefaultWaitTimeMinute: '',
                editingMaxCapacity: false,
                newMaxCapacity: '',
            }

        case SELECT_LOCATION:
            return {
                ...state,
                venue_uid: action.payload,
                currentQueue: [],
                filteredQueue: [],
                queueFilter: allStatus,
                businessHours: noBusinessHours,
                editingBusinessHours: false,
                newBusinessHours: noBusinessHours,
                defaultWaitTime: '',
                maxCapacity: NaN,
                inVenue: NaN,
                inQueue: NaN,
                editingDefaultWaitTime: false,
                newDefaultWaitTimeHour: '',
                newDefaultWaitTimeMinute: '',
                editingMaxCapacity: false,
                newMaxCapacity: '',
            }

        case FETCH_CURRENT_QUEUE:
            return {
                ...state,
                currentQueue: action.payload,
                filteredQueue: action.payload,
            }

        case CHANGE_FILTER_QUEUE:
            return {
                ...state,
                queueFilter: action.filter,
                filteredQueue: action.queue,
            }

        case FETCH_QUEUE_INFO:
            return {
                ...state,
                defaultWaitTime: action.defaultWaitTime,
                maxCapacity: action.maxCapacity,
                inVenue: action.inVenue,
                inQueue: action.inQueue,
            }

        case FETCH_BUSINESS_HOURS:
            return {
                ...state,
                businessHours: action.payload,
                newBusinessHours: action.payload,
            }

        case CHANGE_STATUS_BUSINESS_HOURS:
            return {
                ...state,
                editingBusinessHours: action.payload,
            }

        case CHANGE_BUSINESS_HOURS:
            return {
                ...state,
                newBusinessHours: action.payload,
            }
        
        case SUBMIT_BUSINESS_HOURS:
            return {
                ...state,
                editingBusinessHours: false,
                businessHours: action.payload,
            }

        case CHANGE_STATUS_DEFAULT_WAIT_TIME:
            return {
                ...state,
                editingDefaultWaitTime: action.payload,
            }

        case CHANGE_DEFAULT_WAIT_TIME:
            return {
                ...state,
                newDefaultWaitTimeHour: action.hour,
                newDefaultWaitTimeMinute: action.minute,
            }

        case SUBMIT_DEFAULT_WAIT_TIME:
            return {
                ...state,
                defaultWaitTime: action.payload,
                editingDefaultWaitTime: false,
                newDefaultWaitTimeHour: '',
                newDefaultWaitTimeMinute: '',
            }

        case CHANGE_STATUS_MAX_CAP:
            return {
                ...state,
                editingMaxCapacity: action.payload,
            }

        case CHANGE_MAX_CAP:
            return {
                ...state,
                newMaxCapacity: action.payload,
            }

        case SUBMIT_MAX_CAP:
            return {
                ...state,
                maxCapacity: action.payload,
                editingMaxCapacity: false,
                newMaxCapacity: '',
            }

        default:
            return state;
    }
};