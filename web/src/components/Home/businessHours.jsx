import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Paper, Typography } from "@material-ui/core";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import styles from './home.module.css';

class BusinessHours extends React.Component {

    render() {
        return (
            <div className={styles.businessHoursSection}>
                <Typography variant="h4" className={styles.sectionTitle}> Business Hours </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> Day </TableCell>
                                <TableCell> Open </TableCell>
                                <TableCell> Close </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell> Sunday </TableCell>
                                <TableCell> {this.props.businessHours['Su'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['Su'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Monday </TableCell>
                                <TableCell> {this.props.businessHours['M'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['M'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Tuesday </TableCell>
                                <TableCell> {this.props.businessHours['T'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['T'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Wednesday </TableCell>
                                <TableCell> {this.props.businessHours['W'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['W'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Thursday </TableCell>
                                <TableCell> {this.props.businessHours['Th'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['Th'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Friday </TableCell>
                                <TableCell> {this.props.businessHours['F'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['F'][1]} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Saturday </TableCell>
                                <TableCell> {this.props.businessHours['S'][0]} </TableCell>
                                <TableCell> {this.props.businessHours['S'][1]} </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
};

BusinessHours.propTypes = {
    businessHours: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    businessHours: state.venueData.businessHours,
})

export default connect(mapStateToProps, { })(BusinessHours);