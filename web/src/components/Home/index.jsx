import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";
import SelectVenue from "./selectVenue";
import QueueTable from "./queueTable";
import BusinessHours from "./businessHours";
import DefaultWaitTime from "./defaultWaitTime";
import MaxCapacity from "./maxCapacity";
import InVenue from "./inVenue";
import InQueue from "./inQueue";
import styles from "./home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <Grid container className={styles.mainSection}>
        <Grid className={styles.leftPanel} item xs={12} md={4}>
          <SelectVenue />
          <Grid className={styles.venue} item xs={12} md={12}>
            <Grid item xs={6} md={6}>
              <InVenue />
            </Grid>
            <Grid item xs={6} md={6}>
              <InQueue />
            </Grid>
            <Grid item xs={6} md={6}>
              <MaxCapacity />
            </Grid>
            <Grid item xs={6} md={6}>
              <DefaultWaitTime />
            </Grid>
          </Grid>
          <BusinessHours />
        </Grid>
        <Grid className={styles.queueBlock} item xs={12} md={8}>
          <QueueTable />
        </Grid>
      </Grid>
    </div>
  );
}

Home.propTypes = {
  fetchVenues: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Home);
