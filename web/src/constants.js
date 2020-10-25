// Using Production APIs vs localhost APIs

export const API_URL =
  "https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/";
// export const API_URL = 'http://localhost:2000/api/v2/';

export const BING_LCOATION_API_URL =
  "https://dev.virtualearth.net/REST/v1/Locations/";

// Names for default Options for venue selections

export const noCategory =
  localStorage.getItem("categoryValueInLocalStorage") || "_noCategory";
export const noVenue =
  localStorage.getItem("venueValueInLocalStorage") || "_noVenue";
export const noLocation =
  localStorage.getItem("locationValueInLocalStorage") || "_noLoc";

export const needVenue = "_needVenue";

export const noInQueue =
  localStorage.getItem("inQueueValueInLocalStorage") || "";
export const noInVenue =
  localStorage.getItem("inVenueValueInLocalStorage") || "";
export const noMaxCap = localStorage.getItem("maxCapValueInLocalStorage") || "";
export const noDefaultWaitTime =
  localStorage.getItem("defaultWaitTimeValueInLocalStorage") || "";

// Use for empty Business Hours

export const noBusinessHours = {
  Su: ["", ""],
  M: ["", ""],
  T: ["", ""],
  W: ["", ""],
  Th: ["", ""],
  F: ["", ""],
  S: ["", ""]
};

// Values for filter select

export const allStatus = "_allStatus";
export const waitingStatus = "_waitingStatus";
export const inStoreStatus = "_inStoreStatus";
export const exitedStatus = "_exitedStatus";
