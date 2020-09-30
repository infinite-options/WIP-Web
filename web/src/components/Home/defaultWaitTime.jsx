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
          <Grid container>
            <Grid item xs={12} className={styles.venueInfoEditing}>
              <TextField
                type='number'
                value={this.props.newDefaultWaitTimeHour}
                onChange={(e) => {
                  this.props.editDefaultWaitTime(
                    e.target.value,
                    this.props.newDefaultWaitTimeMinute
                  );
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>Hours</InputAdornment>
                  ),
                  inputProps: {
                    max: 23,
                    min: 0,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.venueInfoEditing}>
              <TextField
                type='number'
                value={this.props.newDefaultWaitTimeMinute}
                onChange={(e) => {
                  this.props.editDefaultWaitTime(
                    this.props.newDefaultWaitTimeHour,
                    e.target.value
                  );
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>Minutes</InputAdornment>
                  ),
                  inputProps: {
                    max: 59,
                    min: 0,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles.venueInfoEditing}>
              <Button
                variant='contained'
                color='primary'
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
            </Grid>
            <Grid item xs={12} md={6} className={styles.venueInfoEditing}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => this.props.editDefaultWaitTimeStatus(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        );
      } else {
        return (
          <div className={styles.venueInfoEditing}>
            <Button
              variant='contained'
              color='primary'
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
          <Typography variant='h6' className={styles.sectionTitle}>
            {" "}
            Default Wait Time{" "}
          </Typography>
          <Typography variant='body1'>
            {" "}
            {this.props.defaultWaitTime}{" "}
          </Typography>
          {this.editDefaultWaitTimeStatus()}
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
