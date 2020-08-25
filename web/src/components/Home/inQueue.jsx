import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Paper, Typography } from "@material-ui/core";

import styles from './home.module.css';

class InQueue extends React.Component {
    render() {
        return (
            <div className={styles.venueInfo}>
                <Typography variant='h6'> In Queue </Typography>
                <Paper className={styles.venueInfoButton}>
                    <Typography variant='body1'> {isNaN(this.props.inQueue) ? '' : this.props.inQueue} </Typography>
                </Paper>
            </div>
        );
    }
};

InQueue.propTypes = {
    inQueue: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    inQueue: state.venueData.inQueue,
})

export default connect(mapStateToProps, { })(InQueue);