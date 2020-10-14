import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  editDefaultWaitTimeStatus,
  editDefaultWaitTime,
  submitDefaultWaitTime,
} from "../../reducers/actions/venueActions";

import {
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import styles from "./home.module.css";

class DefaultWaitTime extends React.Component {
  editDefaultWaitTimeStatus = () => {
    if (this.props.defaultWaitTime) {
      if (this.props.editingDefaultWaitTime) {
        return (
          
          <div>
              <TextField
                type='number'
                placeholder='Hr'
                value={this.props.newDefaultWaitTimeHour}
                className = {styles.capacityField}
                onChange={(e) => {
                  this.props.editDefaultWaitTime(
                    e.target.value,
                    this.props.newDefaultWaitTimeMinute
                  );
                }}
                InputProps={{
                  // endAdornment: (
                  //   <InputAdornment position='end'>Hrs</InputAdornment>
                  // ),
                  inputProps: {
                    max: 23,
                    min: 0,
                  },
                }}
              />
              &nbsp;&nbsp;
          
              <TextField
                type='number'
                placeholder='Min'
                value={this.props.newDefaultWaitTimeMinute}
                className = {styles.capacityField}
                onChange={(e) => {
                  this.props.editDefaultWaitTime(
                    this.props.newDefaultWaitTimeHour,
                    e.target.value
                  );
                }}
                InputProps={{
                  // endAdornment: (
                  //   <InputAdornment position='end'>Min</InputAdornment>
                  // ),
                  inputProps: {
                    max: 59,
                    min: 0,
                  },
                }}
              />
         
            <div style={{marginLeft:'-5rem', paddingTop:'0.5rem'}}>
              <Button
                variant='contained'
                color='primary'
                size='small'
                className = {styles.capacityButton}
                onClick={() =>
                  this.props.submitDefaultWaitTime(
                    this.props.venue_uid,
                    this.props.newDefaultWaitTimeHour,
                    this.props.newDefaultWaitTimeMinute
                  )
                }
              >
                Save
              </Button>
              &nbsp;&nbsp;
              <Button
                variant='contained'
                color='primary'
                size='small'
                className = {styles.capacityButton}
                onClick={() => this.props.editDefaultWaitTimeStatus(false)}
              >
                Cancel
              </Button>
           </div>
         
          </div>
        );
      } else {
        return (
          <div className={styles.venueInfoEditing}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={() => this.props.editDefaultWaitTimeStatus(true)}
            >
              Edit
            </Button>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className={styles.venueInfo}>
        <Paper className={styles.venueInfoButton}>
          <Typography variant='h6'>
            {" "}
            Default Wait Time{" "}
          </Typography>
          
          <Typography variant='body1' container direction="column">
          <Grid container className = {styles.defaultTimeWaitButton}> 
            {this.props.defaultWaitTime}
            &nbsp;&nbsp;
            {this.editDefaultWaitTimeStatus()}
            </Grid>
            </Typography>
            
        </Paper>
      </div>
    );
  }
}

DefaultWaitTime.propTypes = {
  editDefaultWaitTimeStatus: PropTypes.func.isRequired,
  editDefaultWaitTime: PropTypes.func.isRequired,
  submitDefaultWaitTime: PropTypes.func.isRequired,
  venue_uid: PropTypes.string.isRequired,
  defaultWaitTime: PropTypes.string.isRequired,
  editingDefaultWaitTime: PropTypes.bool.isRequired,
  newDefaultWaitTimeHour: PropTypes.string.isRequired,
  newDefaultWaitTimeMinute: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  venue_uid: state.venueData.venue_uid,
  defaultWaitTime: state.venueData.defaultWaitTime,
  editingDefaultWaitTime: state.venueData.editingDefaultWaitTime,
  newDefaultWaitTimeHour: state.venueData.newDefaultWaitTimeHour,
  newDefaultWaitTimeMinute: state.venueData.newDefaultWaitTimeMinute,
});

export default connect(mapStateToProps, {
  editDefaultWaitTimeStatus,
  editDefaultWaitTime,
  submitDefaultWaitTime,
})(DefaultWaitTime);
