import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectFilterQueue, selectADate } from '../../reducers/actions/venueActions';
import { noLocation, allStatus, waitingStatus, inStoreStatus, exitedStatus } from '../../constants';

import TextField from '@material-ui/core/TextField';

import { Typography, Table, TableHead, TableRow, TableCell, Select, MenuItem, Grid } from "@material-ui/core";
import MaterialTable from "material-table";

import styles from './home.module.css';

class QueueTable extends React.Component {
    render() {
        return (
        <div className={styles.currentQueue}>
            <MaterialTable
            style = {{
                backgroundColor: '#e9f3fe'             
            }}
            options={{
                paging:true,
                pageSize:7,       // make initial page size
                emptyRowsWhenPaging: true,   //to make page size fix in case of less data rows
                pageSizeOptions:[7,14,21],    // rows selection options
            }}
            //title = "CURRENT QUEUE TABLE"
            
                title={
                <Grid container direction="row" >
                <Grid item xs={12} md={6}>
                    <Typography variant='h6' align='left'>
                        CURRENT QUEUE TABLE 
                    
                    </Typography>
                <TextField
                    id= 'queueTableDate'
                    type="date"

                    onChange = {(event) => {
                        console.log(typeof event.target.value);
                        // console.log(event.target.value);
                        this.props.selectADate(this.props.venue_uid, event.target.value);
                    }}
                />
                </Grid>
                </Grid>
                }

                columns={
                    [
                    { title:'Token #', field: 'token_number',width:'6rem' },
                    { title:'Name', field: 'name'},
                    { title: 'Created at', field: 'ticket_created_at'},
                    {   title: 'Status',
                        align: 'center',
                        field: 'status',
                        render: row => {
                            switch(row.status) {
                                case 'waiting':
                                    return row.entry_time;
                                case 'processed':
                                    return 'exited';
                                default:
                                    return row.status;
                            }
                        }
                    },
                    {title: 'Commute Time', field: 'commute_time'},
                    {title: 'Wait Time', field: 'wait_time' },
                    {title: 'Customer Phone #', field: 'customer_number', width:'12.5rem'}
                ]}
                data={this.props.queueData}
                components={{
                    
                    Toolbar: props => (
                        <div style={{
                            padding: '5px 0 0 10px',
                        }}>
                            <Typography variant="h6" align='left'>
                                {props.title}
                            </Typography>
                        </div>
                    ),
                    Header: props => (
                        <TableHead item className={styles.cell}>
                            <TableRow style={{backgroundColor:'#e9f3fe'}}>
                                <TableCell> {props.columns[0].title} </TableCell>
                                <TableCell> {props.columns[1].title} </TableCell>
                                <TableCell> {props.columns[2].title} </TableCell>
                                <TableCell>
                                    {props.columns[3].title}:&nbsp;
                                    <Select
                                        value={this.props.filter}
                                        onChange={(e) => this.props.selectFilterQueue(e.target.value,this.props.originalData)}
                                        disabled={this.props.venue_uid === noLocation}
                                    >
                                        <MenuItem value={allStatus}> All </MenuItem>
                                        <MenuItem value={waitingStatus}> Waiting </MenuItem>
                                        <MenuItem value={inStoreStatus}> In Store </MenuItem>
                                        <MenuItem value={exitedStatus}> Exited </MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell> {props.columns[4].title} </TableCell>
                                <TableCell> {props.columns[5].title} </TableCell>
                                <TableCell> {props.columns[6].title} </TableCell>
                            </TableRow>
                        </TableHead>
                    )
                }}
            />
        </div>
        )
    }

};

QueueTable.propTypes = {
    selectADate: PropTypes.func.isRequired,
    selectFilterQueue: PropTypes.func.isRequired,
    originalData: PropTypes.array.isRequired,
    queueData: PropTypes.array.isRequired,
    filter: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    venue_uid: state.venueData.venue_uid,
    filter: state.venueData.queueFilter,
    originalData: state.venueData.currentQueue,
    queueData: state.venueData.filteredQueue,
})

export default connect(mapStateToProps, { selectFilterQueue, selectADate })(QueueTable); 
 