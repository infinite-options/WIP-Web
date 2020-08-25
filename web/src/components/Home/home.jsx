import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchVenues } from '../../reducers/actions/venueActions';

import { Grid } from "@material-ui/core";

import SelectVenue from './selectVenue';
import QueueTable from './queueTable';
import BusinessHours from './businessHours';
import DefaultWaitTime from './defaultWaitTime';
import MaxCapacity from './maxCapacity';
import InVenue from './inVenue';
import InQueue from './inQueue';

import styles from './home.module.css';

class Home extends React.Component{

    componentDidMount() {
        this.props.fetchVenues();
    }

    render() {
        return (
            <div className={styles.home}>
                <SelectVenue/>
                <Grid container className={styles.mainSection}>
                <Grid item xs={12} md={8}>
                    <Grid container>
                        <Grid item xs={12}>
                            <QueueTable />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <DefaultWaitTime />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <MaxCapacity />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <InVenue />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <InQueue />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <BusinessHours />
                </Grid>
                </Grid>
            </div>
        )
    }
};

Home.propTypes = {
    fetchVenues: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { fetchVenues })(Home);