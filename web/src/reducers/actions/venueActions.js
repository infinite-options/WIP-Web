import axios from "axios";

import {
  FETCH_VENUES,
  SELECT_CATEGORY,
  SELECT_VENUE,
  SELECT_LOCATION,
  FETCH_CURRENT_QUEUE,
  CHANGE_FILTER_QUEUE,
  FETCH_QUEUE_INFO,
  FETCH_BUSINESS_HOURS,
  CHANGE_STATUS_BUSINESS_HOURS,
  CHANGE_BUSINESS_HOURS,
  SUBMIT_BUSINESS_HOURS,
  CHANGE_STATUS_DEFAULT_WAIT_TIME,
  CHANGE_DEFAULT_WAIT_TIME,
  SUBMIT_DEFAULT_WAIT_TIME,
  CHANGE_STATUS_MAX_CAP,
  CHANGE_MAX_CAP,
  SUBMIT_MAX_CAP
} from "./venueTypes";

import {
  API_URL,
  noLocation,
  noBusinessHours,
  allStatus,
  waitingStatus,
  inStoreStatus,
  exitedStatus
} from "../../constants";

export const selectADate = (venue_uid, selectedDate) => dispatch => {
 
    // console.log("Got an update");
      if (venue_uid !== noLocation) {
        // console.log(API_URL + "venue_info_admin" + "/" + venue_uid + "/" + selectedDate);
        axios
          .get(
            API_URL +
              "venue_info_admin/" +
              venue_uid.toString() +
              "/" +
              selectedDate
          )
          .then(function(res) {
            let data = res.data.result;
            data.sort((eltA, eltB) => {
              if (eltA.status === "In-store") {
                return eltB.status === "In-store" ? 0 : -1;
              } else if (eltA.status === "waiting") {
                switch (eltB.status) {
                  case "In-store":
                    return 1;
                  case "waiting":
                    return 0;
                  case "processed":
                    return -1;
                  //Should not happen, only for error prevention
                  default:
                    return 0;
                }
              } else if (eltA.status === "processed") {
                return eltB.status === "processed" ? 0 : 1;
              } else {
                // Should not happen, only for error prevention
                return 0;
              }
            });
            dispatch({
              type: FETCH_CURRENT_QUEUE,
              payload: data
            });
          })
          .catch(function(error) {
            console.log(error);
          });
        axios
          .get(API_URL + "business_hours_admin/" + venue_uid.toString())
          .then(function(res) {
            let objectString = res.data.result;
            let object = JSON.parse(objectString);
            // var strFirstFive = object.substring(0,5);
            dispatch({
              type: FETCH_BUSINESS_HOURS,
              payload: object
            });
          })
          .catch(function(error) {
            console.log(error);
          });
        axios
          .get(API_URL + "queue_admin/" + venue_uid.toString())
          .then(function(res) {
            dispatch({
              type: FETCH_QUEUE_INFO,
              payload: res.data.result,
              defaultWaitTime: res.data.result[0]["default_time_spent"],
              maxCapacity: res.data.result[0]["max_cap"],
              inVenue: res.data.result[1]["cur_in_store"],
              inQueue: res.data.result[2]["In_queue"]
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        dispatch({
          type: FETCH_CURRENT_QUEUE,
          payload: [],
         
        });
        dispatch({
          type: FETCH_BUSINESS_HOURS,
          payload: noBusinessHours
        });
        dispatch({
          type: FETCH_QUEUE_INFO,
          payload: [
            { default_time_spent: "", max_cap: "" },
            { cur_in_store: "" },
            { In_queue: "" }
          ],
          defaultWaitTime: "",
          maxCapacity: NaN,
          inVenue: NaN,
          inQueue: NaN
        });
      }
    };

export const fetchVenues = () => dispatch => {
  axios
    .get(API_URL + "all_venues")
    .then(function(res) {
      dispatch({
        type: FETCH_VENUES,
        payload: res.data.result
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};

export const selectCategory = category => dispatch => {
  dispatch({
    type: SELECT_CATEGORY,
    payload: category
  });
};

export const selectVenue = venue => dispatch => {
  dispatch({
    type: SELECT_VENUE,
    payload: venue
  });
};

export const selectLocation = venue_uid => dispatch => {
  dispatch({
    type: SELECT_LOCATION,
    payload: venue_uid.toString()
  });
  //   if (venue_uid !== noLocation) {
  //     axios
  //       .get(API_URL + "venue_info_admin/" + venue_uid.toString())
  //       .then(function(res) {
  //         let data = res.data.result;
  //         data.sort((eltA, eltB) => {
  //           if (eltA.status === "In-store") {
  //             return eltB.status === "In-store" ? 0 : -1;
  //           } else if (eltA.status === "waiting") {
  //             switch (eltB.status) {
  //               case "In-store":
  //                 return 1;
  //               case "waiting":
  //                 return 0;
  //               case "processed":
  //                 return -1;
  //               //Should not happen, only for error prevention
  //               default:
  //                 return 0;
  //             }
  //           } else if (eltA.status === "processed") {
  //             return eltB.status === "processed" ? 0 : 1;
  //           } else {
  //             // Should not happen, only for error prevention
  //             return 0;
  //           }
  //         });
  //         dispatch({
  //           type: FETCH_CURRENT_QUEUE,
  //           payload: data
  //         });
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       });
  //     axios
  //       .get(API_URL + "business_hours_admin/" + venue_uid.toString())
  //       .then(function(res) {
  //         let objectString = res.data.result;
  //         let object = JSON.parse(objectString);
  //         dispatch({
  //           type: FETCH_BUSINESS_HOURS,
  //           payload: object
  //         });
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       });
  //     axios
  //       .get(API_URL + "queue_admin/" + venue_uid.toString())
  //       .then(function(res) {
  //         dispatch({
  //           type: FETCH_QUEUE_INFO,
  //           payload: res.data.result,
  //           defaultWaitTime: res.data.result[0]["default_time_spent"],
  //           maxCapacity: res.data.result[0]["max_cap"],
  //           inVenue: res.data.result[1]["cur_in_store"],
  //           inQueue: res.data.result[2]["In_queue"]
  //         });
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       });
  //   } else {
  //     dispatch({
  //       type: FETCH_CURRENT_QUEUE,
  //       payload: []
  //     });
  //     dispatch({
  //       type: FETCH_BUSINESS_HOURS,
  //       payload: noBusinessHours
  //     });
  //     dispatch({
  //       type: FETCH_QUEUE_INFO,
  //       payload: [
  //         { default_time_spent: "", max_cap: "" },
  //         { cur_in_store: "" },
  //         { In_queue: "" }
  //       ],
  //       defaultWaitTime: "",
  //       maxCapacity: NaN,
  //       inVenue: NaN,
  //       inQueue: NaN
  //     });
  //   }
};

export const selectFilterQueue = (newFilter, originalQueue) => dispatch => {
  let filteredQueue = originalQueue.filter(elt => {
    switch (newFilter) {
      case allStatus:
        return true;
      case waitingStatus:
        return elt.status === "waiting";
      case inStoreStatus:
        return elt.status === "In-store";
      case exitedStatus:
        return elt.status === "processed";
      default:
        return false;
    }
  });
  dispatch({
    type: CHANGE_FILTER_QUEUE,
    payload: {
      filter: newFilter,
      queue: filteredQueue
    },
    filter: newFilter,
    queue: filteredQueue
  });
};

export const editDefaultWaitTimeStatus = newStatus => dispatch => {
  dispatch({
    type: CHANGE_STATUS_DEFAULT_WAIT_TIME,
    payload: newStatus
  });
};

export const editDefaultWaitTime = (newHour, newMinute) => dispatch => {
  dispatch({
    type: CHANGE_DEFAULT_WAIT_TIME,
    hour: newHour,
    minute: newMinute
  });
};

export const submitDefaultWaitTime = (
  venue_uid,
  newHour,
  newMinute
) => dispatch => {
  if (newHour.length === 1) {
    newHour = "0" + newHour;
  } else if (newHour.length === 0) {
    newHour = "00";
  }
  if (newMinute.length === 1) {
    newMinute = "0" + newMinute;
  } else if (newMinute.length === 0) {
    newMinute = "00";
  }
  let newTime = newHour + ":" + newMinute + ":00";
  axios
    .put(API_URL + "venue_def_time_update", {
      venue_uid: venue_uid,
      default_time: newTime
    })
    .then(function(res) {
      dispatch({
        type: SUBMIT_DEFAULT_WAIT_TIME,
        payload: newTime
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};

export const editMaxCapacityStatus = newStatus => dispatch => {
  dispatch({
    type: CHANGE_STATUS_MAX_CAP,
    payload: newStatus
  });
};

export const editMaxCapacity = newValue => dispatch => {
  dispatch({
    type: CHANGE_MAX_CAP,
    payload: newValue
  });
};

export const submitMaxCapacity = (venue_uid, newMaxCap) => dispatch => {
  axios
    .put(API_URL + "venue_max_cap_admin", {
      venue_uid: venue_uid,
      max_cap: newMaxCap
    })
    .then(function(res) {
      dispatch({
        type: SUBMIT_MAX_CAP,
        payload: Number(newMaxCap)
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};

export const editBusinessHoursStatus = newStatus => dispatch => {
  dispatch({
    type: CHANGE_STATUS_BUSINESS_HOURS,
    payload: newStatus
  });
};

export const editBusinessHours = (
  businessHours,
  newDate,
  index,
  newTime
) => dispatch => {
  let newBusinessHours = businessHours;
  newBusinessHours[newDate][index] = newTime;
  dispatch({
    type: CHANGE_BUSINESS_HOURS,
    payload: newBusinessHours
  });
};

export const submitBusinessHours = (businessHours, venue_uid) => dispatch => {
  console.log("submitBusinessHours called");
  console.log(businessHours, venue_uid);
  axios
    .put(API_URL + "business_hours_update", {
      venue_uid: venue_uid,
      new_business_hours: JSON.stringify(businessHours)
    })
    .then(function(res) {
      dispatch({
        type: SUBMIT_BUSINESS_HOURS,
        payload: businessHours
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};
