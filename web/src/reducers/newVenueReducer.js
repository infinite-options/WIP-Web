import { SELECT_CATEGORY, SELECT_VENUE, NEW_VENUE_NAME } from './actions/newVenueTypes'
import { noCategory, noVenue, } from '../constants';

const initialState = {
    category: noCategory,
    venue: {
        selection: noVenue,
        newVenue: '',
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

        default:
            return state
    }
}