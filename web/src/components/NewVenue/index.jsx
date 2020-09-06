import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectNewCategory, selectNewVenue, createNewVenue } from '../../reducers/actions/newVenueActions';
import { noCategory, noVenue, needVenue } from '../../constants';

import { Button, Grid, InputAdornment, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import styles from './newVenue.module.css';

class NewVenue extends React.Component {

    getCategories = () => {
        let categories = this.props.venues.map((currentValue) => {
            return currentValue.category;
        })  
        let distinctCategories = categories.filter((elt, index) => {
            return categories.indexOf(elt) === index;
        })
        return distinctCategories;
    }

    getVenues = () => {
        let filteredCategories = this.props.venues.filter((elt) => {
            return elt.category === this.props.category;
        })
        let venues = filteredCategories.map((currentValue) => {
            return currentValue.venue_name;
        })
        let distinctVenues = venues.filter((elt, index) => {
            return venues.indexOf(elt) === index;
        })
        return distinctVenues;
    }

    render() {
        let categories = this.getCategories();
        let venues = this.getVenues();
        return (
            <div className={styles.root}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4"> New Venue </Typography>
                    </Grid>
                    <Grid item xs={12} className={styles.entry}>
                        <Typography variant="h6"> Name </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.entry}>
                        <Typography variant="body1"> Category: &nbsp;
                            <Select
                                value={this.props.category}
                                onChange={(event) => {  
                                    this.props.selectNewCategory(event.target.value);
                                }}
                            >
                                <MenuItem value={noCategory}> Select a Category </MenuItem>
                                {
                                    categories.map(category => (
                                        <MenuItem value={category} key={category}> {category} </MenuItem>
                                    ))
                                }
                            </Select>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} className={styles.entry}>
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"> Name:
                                &nbsp;
                                    <Select
                                        disabled={this.props.category === noCategory}
                                        value={this.props.selectedVenueName}
                                        onChange={(event) => {
                                            this.props.selectNewVenue(event.target.value);
                                        }}
                                    >
                                        <MenuItem value={noVenue}> Select a Venue </MenuItem>
                                        {
                                            venues.map(venue => (
                                                <MenuItem value={venue} key={venue}> {venue} </MenuItem>
                                            ))
                                        }
                                        <MenuItem value={needVenue}> Venue not in list </MenuItem>
                                    </Select>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={this.props.category === noCategory || this.props.selectedVenueName !== needVenue}
                                    value={this.props.newVenueName}
                                    onChange={(event) => {
                                        this.props.createNewVenue(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6"> Location </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.entry}>
                        <Typography variant="body1"> Address:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.entry}>
                        <Typography variant="body1"> City:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.entry}>
                        <Typography variant="body1"> State:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}   className={styles.entry}>
                        <Typography variant="body1"> Zip:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6"> Contact </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.entry}>
                        <Typography variant="body1"> Phone:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}   className={styles.entry}>
                        <Typography variant="body1"> Email:
                        &nbsp;
                        <TextField />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={styles.entryTable}>
                        <Typography variant="h6"> Business Hours </Typography>
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
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // Su 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // Su 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Monday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // M 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // M 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Tuesday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // T 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // T 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Wednesday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // W 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // W 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Thursday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // Th 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // Th 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Friday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // F 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // F 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> Saturday </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // S 0
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type='time'
                                                InputProps={{
                                                    inputProps: { 
                                                        step: 1,
                                                    }
                                                }}
                                                // S 1
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6"> Miscellaneous Information </Typography>
                </Grid>
                <Grid item xs={12} md={4}   className={styles.entry}>
                    <Typography variant="body1"> Max Capacity:
                    &nbsp;
                    <TextField
                        type='number'
                        InputProps={{
                            inputProps: {   
                                min: 0,
                            }
                        }}
                    />
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8}   className={styles.entry}>
                    <Typography variant="body1"> Default Time Spent:
                    &nbsp;
                        <TextField
                            type='number'
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>Hours</InputAdornment>,
                                inputProps: { 
                                    max: 23, min: 0 
                                }
                            }}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <TextField
                            type='number'
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>Minutes</InputAdornment>,
                                inputProps: { 
                                    max: 59, min: 0 
                                }
                            }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}   className={styles.entry}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </div>
        )
    }
};

NewVenue.propTypes = {
    selectNewCategory: PropTypes.func.isRequired,
    selectNewVenue: PropTypes.func.isRequired,
    venues: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    venues: state.venueData.venues,
    category: state.newVenue.category,
    selectedVenueName: state.newVenue.venue.selection,
    newVenueName: state.newVenue.venue.newVenue,
})

export default connect(mapStateToProps, { selectNewCategory, selectNewVenue, createNewVenue })(NewVenue);