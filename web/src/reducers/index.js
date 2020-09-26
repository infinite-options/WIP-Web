import { combineReducers}  from 'redux';
import venueReducer from './venueReducer';
import newVenueReducer from './newVenueReducer'

export default combineReducers({
    venueData: venueReducer,
    newVenue: newVenueReducer,
});