// Using Production APIs vs localhost APIs

export const API_URL = 'https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/';
// export const API_URL = 'http://localhost:2000/api/v2/';

// Names for default Options for venue selections

export const noCategory = '_noCategory';
export const noVenue = '_noVenue';
export const noLocation = '_noLoc';

export const needVenue = '_needVenue';

// Use for empty Business Hours

export const noBusinessHours = {
    'Su': ['',''],
    'M': ['',''],
    'T': ['',''],
    'W': ['',''],
    'Th': ['',''],
    'F': ['',''],
    'S': ['',''],
}

// Values for filter select

export const allStatus = '_allStatus';
export const waitingStatus = '_waitingStatus';
export const inStoreStatus = '_inStoreStatus';
export const exitedStatus = '_exitedStatus'