import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  editMaxCapacityStatus,
  editMaxCapacity,
  submitMaxCapacity,
} from "../../reducers/actions/venueActions";

import { Grid, Button, Paper, TextField, Typography } from "@material-ui/core";

import styles from "./home.module.css";

class MaxCapacity extends React.Component {
  editMaxCapacity = () => {
    if (!isNaN(this.props.maxCapacity)) {
      if (this.props.editingMaxCapacity) {
        return (
          <Grid container>
            <Grid item xs={12} className={styles.venueInfoEditing}>
              <TextField
                type='number'
                value={this.props.newMaxCapacity}
                onChange={(e) => {
                  this.props.editMaxCapacity(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles.venueInfoEditing}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.submitMaxCapacity(
                    this.props.venue_uid,
                    this.props.newMaxCapacity
                  );
                }}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} md={6} className={styles.venueInfoEditing}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => this.props.editMaxCapacityStatus(false)}
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
              onClick={() => this.props.editMaxCapacityStatus(true)}
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
            Max Capacity{" "}
          </Typography>
          <Typography variant='body1'>
            {" "}
            {isNaN(this.props.maxCapacity) ? "" : this.props.maxCapacity}{" "}
          </Typography>
          {this.editMaxCapacity()}
        </Paper>
      </div>
    );
  }
}

MaxCapacity.propTypes = {
  editMaxCapacityStatus: PropTypes.func.isRequired,
  editMaxCapacity: PropTypes.func.isRequired,
  submitMaxCapacity: PropTypes.func.isRequired,
  maxCapacity: PropTypes.number.isRequired,
  editingMaxCapacity: PropTypes.bool.isRequired,
  newMaxCapacity: PropTypes.string.isRequired,
  venue_uid: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  maxCapacity: state.venueData.maxCapacity,
  editingMaxCapacity: state.venueData.editingMaxCapacity,
  newMaxCapacity: state.venueData.newMaxCapacity,
  venue_uid: state.venueData.venue_uid,
});

export default connect(mapStateToProps, {
  editMaxCapacityStatus,
  editMaxCapacity,
  submitMaxCapacity,
})(MaxCapacity);
