import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { noMaxCap } from "../../constants";
import {
  editMaxCapacityStatus,
  editMaxCapacity,
  submitMaxCapacity
} from "../../reducers/actions/venueActions";

import { Grid, Button, Paper, TextField, Typography } from "@material-ui/core";

import styles from "./home.module.css";

class MaxCapacity extends React.Component {
  editMaxCapacity = () => {
    if (!isNaN(this.props.maxCapacity)) {
      if (this.props.editingMaxCapacity) {
        return (
          <div>
            <Grid item>
              <TextField
                type="number"
                value={this.props.newMaxCapacity}
                className={styles.capacityField}
                onChange={e => {
                  this.props.editMaxCapacity(e.target.value);
                }}
              />
            </Grid>

            <div style={{ marginLeft: "-2.5rem", paddingTop: "0.5rem" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  this.props.submitMaxCapacity(
                    this.props.venue_uid,
                    this.props.newMaxCapacity
                  );
                }}
              >
                Save
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => this.props.editMaxCapacityStatus(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.venueInfoEditing1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
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
          <Typography variant="h6"> Max Capacity </Typography>
          <Typography variant="body1" direction="column">
            <Grid container direction="row" className={styles.waitButton}>
              {localStorage.setItem(
                "maxCapValueInLocalStorage",
                this.props.maxCapacity
              )}
              {isNaN(this.props.maxCapacity) ? "" : this.props.maxCapacity}
              &nbsp;&nbsp;
              {this.editMaxCapacity()}
            </Grid>
          </Typography>
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
  venue_uid: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  maxCapacity: state.venueData.maxCapacity,
  editingMaxCapacity: state.venueData.editingMaxCapacity,
  newMaxCapacity: state.venueData.newMaxCapacity,
  venue_uid: state.venueData.venue_uid
});

export default connect(
  mapStateToProps,
  {
    editMaxCapacityStatus,
    editMaxCapacity,
    submitMaxCapacity
  }
)(MaxCapacity);
