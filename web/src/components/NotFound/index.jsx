import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Typography } from "@material-ui/core";

import styles from './notFound.module.css';

class NotFound extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                <Typography variant="h4"> Page Not Found </Typography>
            </div>
        )
    }
};

NotFound.propTypes = {
    // venues: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { })(NotFound);