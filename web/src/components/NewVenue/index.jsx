import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectNewCategory, selectNewVenue, createNewVenue, changeAddress,
    changePhone, changeEmail, changeBusinessHours, changeMaxCapacity, changeDefaultWaitTime,
    submitVenue,changeOpenModalStatus
} from '../../reducers/actions/newVenueActions';
import { noCategory, noVenue, needVenue } from '../../constants';

import { Button, Grid, InputAdornment, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import {Form, Row} from 'react-bootstrap';
import styles from './newVenue.module.css';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

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

    businessHours = () => {
        let businessHours = JSON.parse(JSON.stringify(this.props.businessHours));
        return (
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
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // Su 0
                                    value={businessHours['Su'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'Su',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // Su 1
                                    value={businessHours['Su'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'Su',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Monday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // M 0
                                    value={businessHours['M'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'M',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // M 1
                                    value={businessHours['M'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'M',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Tuesday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // T 0
                                    value={businessHours['T'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'T',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // T 1
                                    value={businessHours['T'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'T',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Wednesday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // W 0
                                    value={businessHours['W'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'W',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // W 1
                                    value={businessHours['W'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'W',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Thursday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // Th 0
                                    value={businessHours['Th'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'Th',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // Th 1
                                    value={businessHours['Th'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'Th',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Friday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // F 0
                                    value={businessHours['F'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'F',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // F 1
                                    value={businessHours['F'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'F',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> Saturday </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // S 0
                                    value={businessHours['S'][0]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'S',0,e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type='time'
                                    // InputProps={{
                                    //     inputProps: {
                                    //         step: 1,
                                    //     }
                                    // }}
                                    // S 1
                                    value={businessHours['S'][1]}
                                    onChange={(e) => {
                                        this.props.changeBusinessHours(businessHours,'S',1,e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    render() {
        let categories = this.getCategories();
        let venues = this.getVenues();
        return (
            <Grid item className={styles.modalColor} >                 
                <Grid >
                    <Grid item className={styles.entry2}>
                        <Typography variant="h6"> NEW VENUE </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sm={3} className={styles.entry1}>
                        <Typography variant="body1"> Category </Typography>
                    </Grid>

                    <Grid item className={styles.entry1}>
                        <Select  
                            style={{ width: '10rem',
                            textAlign: 'left'}}
                            value={this.props.category}
                                onChange={(event) => {
                                    this.props.selectNewCategory(event.target.value);
                                }}
                            >
                                <MenuItem value= {noCategory} > Select a Category </MenuItem>
                                {
                                    categories.map(category => (
                                        <MenuItem value={category} key={category}> {category} </MenuItem>
                                    ))
                                }
                        </Select>
                    </Grid>

                    <Grid item className={styles.entry1}>
                        <Typography variant="body1"> Name Of Store </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sm={3}className={styles.entry1}>
                                <Select
                                    style={{ width: '10rem',
                                    textAlign: 'left'}}
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
                    </Grid>
                    <Grid item className ={styles.form}>
                    <Form>
                        <Form.Group controlId="formGridEmail">
                            <Form.Row>
                                <Form.Label >Email</Form.Label>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control
                                className = {styles.formControl}
                                type="email"
                                placeholder="xxxxx.xxxx@safeway.com"
                                value={this.props.email}
                                onChange={(e) => {
                                    this.props.changeEmail(e.target.value);
                                }} />
                            </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formGridPhoneNumber">
                            <Form.Row>
                                <Form.Label>Phone Number</Form.Label>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control className = {styles.formControl}
                                type="phone number" placeholder="0000000000"
                                value={this.props.phone}
                                onChange={(e) => {
                                this.props.changePhone(e.target.value)}}
                                />
                            </Form.Row>
                        </Form.Group>
                    </Form>
                    </Grid>

                    <Grid item className ={styles.form}>
                        <Form.Group>
                            <Form.Row>
                            <Form.Label>Address</Form.Label>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control className = {styles.formControl}
                                    placeholder="Apartment, studio, or floor"
                                    value={this.props.address['address']}
                                    onChange={(e) => {
                                    this.props.changeAddress(this.props.address, 'address', e.target.value);
                                    }}
                                />
                            </Form.Row>
                        </Form.Group>
                        <Grid container direction="row" >
                            <Grid item className={styles.formControlGridSpacing} >
                               <Form.Control  placeholder="City" className = {styles.formControlAddress}
                                    value={this.props.address['city']}
                                    onChange={(e) => {
                                    this.props.changeAddress(this.props.address, 'city', e.target.value);
                                    }}
                               />
                            </Grid>
                            <Grid item className={styles.formControlGridSpacing}>
                                <Form.Control placeholder="State" className = {styles.formControlAddress}
                                    value={this.props.address['state']}
                                    onChange={(e) => {
                                    this.props.changeAddress(this.props.address, 'state', e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item className={styles.formControlGridSpacing}>
                                <Form.Control placeholder="Zip" className = {styles.formControlAddress}
                                    value={this.props.address['zip']}
                                    onChange={(e) => {
                                    this.props.changeAddress(this.props.address, 'zip', e.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" >
                     <Grid item className ={styles.form}>
                        <Form.Group>
                            <Form.Row>
                            <Form.Label>Max Capacity</Form.Label>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control className = {styles.formControlAddress}
                                    placeholder="42"
                                    type='number'
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                        }
                                    }}
                                    value={this.props.maxCapacity}
                                    onChange={(e) => {
                                        this.props.changeMaxCapacity(e.target.value);
                                    }}
                                />
                            </Form.Row>
                        </Form.Group>
                    </Grid>
                    <Grid item className ={styles.form}>
                        <Form.Group>
                            <Form.Row>
                            <Form.Label>Default Wait Time</Form.Label>
                            </Form.Row>
                            <Grid container direction="row" >
                                <Grid item className={styles.formControlGridSpacing} >
                                <Form.Control className = {styles.formControlAddress}
                                   placeholder="Hr"
                                   type='number'
                                   InputProps={{

                                    //   endAdornment: <InputAdornment position='end'>Hours</InputAdornment>,
                                       inputProps: {
                                           max: 23, min: 0
                                       }
                                   }}
                                   value={this.props.defaultWaitTime.hr}
                                   onChange={(e) => {
                                       this.props.changeDefaultWaitTime(this.props.defaultWaitTime,'hr',e.target.value  );
                                   }}
                                />
                                </Grid>
                                <Grid item className={styles.formControlGridSpacing} >
                                <Form.Control className = {styles.formControlAddress}
                                   placeholder="Min"
                                   type='number'
                                   InputProps={{
                                    //    endAdornment: <InputAdornment position='end'>Minutes</InputAdornment>,
                                       inputProps: {
                                           max: 59, min: 0
                                       }
                                   }}
                                   value={this.props.defaultWaitTime.min}
                                   onChange={(e) => {
                                       this.props.changeDefaultWaitTime(this.props.defaultWaitTime,'min',e.target.value);
                                   }}
                                />

                                </Grid>
                            </Grid>

                        </Form.Group>
                    </Grid>
                    </Grid>
                </Grid>

                    <Grid item className={styles.entryTable}>
                        <Typography variant="h6"> BUSINESS HOURS </Typography>
                        <Grid className={styles.businessHoursSection}>
                            {this.businessHours()}
                        </Grid>
                    </Grid>
                    <Grid className={styles.btnEntry}>
                        <Button
                            variant="contained"
                            color="primary"
                            position=""
                            size="small"
                            onClick={() => {
                                this.props.submitVenue(this.props.venues, this.props.category, this.props.selectedVenueName,
                                    this.props.newVenueName, this.props.address, this.props.phone, this.props.email,
                                    this.props.businessHours, this.props.maxCapacity, this.props.defaultWaitTime);
                            }}
                        >
                            Add Venue
                            
                        </Button>
                        
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        
                        <Button
                            variant="contained"
                            color="primary"
                            position=""
                            size="small"
                            onClick={() => {
                              history.push('/');
                              window.location.reload();
                            }}
                        >
                            Close
                        </Button> 
                    </Grid>
           
            </Grid>

        )
    }
};

NewVenue.propTypes = {
    selectNewCategory: PropTypes.func.isRequired,
    selectNewVenue: PropTypes.func.isRequired,
    createNewVenue: PropTypes.func.isRequired,
    changePhone: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changeBusinessHours: PropTypes.func.isRequired,
    changeMaxCapacity: PropTypes.func.isRequired,
    changeDefaultWaitTime: PropTypes.func.isRequired,
    submitVenue: PropTypes.func.isRequired,
    venues: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    selectedVenueName: PropTypes.string.isRequired,
    newVenueName: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    maxCapacity: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
    venues: state.venueData.venues,
    category: state.newVenue.category,
    selectedVenueName: state.newVenue.venue.selection,
    newVenueName: state.newVenue.venue.newVenue,
    address: state.newVenue.address,
    phone: state.newVenue.phone,
    email: state.newVenue.email,
    businessHours: state.newVenue.businessHours,
    maxCapacity: state.newVenue.maxCapacity,
    defaultWaitTime: state.newVenue.defaultWaitTime,
})

const functionList = {
    selectNewCategory,
    selectNewVenue,
    createNewVenue,
    changeAddress,
    changePhone,
    changeEmail,
    changeBusinessHours,
    changeMaxCapacity,
    changeDefaultWaitTime,
    submitVenue,
}

export default connect(mapStateToProps, functionList )(NewVenue);