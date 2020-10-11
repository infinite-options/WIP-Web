import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectFilterQueue } from '../../reducers/actions/venueActions';
import { noLocation, allStatus, waitingStatus, inStoreStatus, exitedStatus } from '../../constants';

import { Typography, TableHead, TableRow, TableCell, Select, MenuItem } from "@material-ui/core";
import MaterialTable from "material-table";

import styles from './home.module.css';
import { blue } from '@material-ui/core/colors';

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
                title="Current Queue Table"
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
                    {title: 'Customer Phone #', field: 'customer_number', width:'12.5rem'}
                ]}
                data={this.props.queueData}
                components={{
                    
                    Toolbar: props => (
                        <div style={{
                            padding: '10px 0 0 10px'
                        }}>
                            <Typography variant="h4" className={styles.sectionTitle}>
                                {props.title}
                            </Typography>
                        </div>
                    ),
                    Header: props => (
                        <TableHead item className={styles.cell}>
                            <TableRow >
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

export default connect(mapStateToProps, { selectFilterQueue })(QueueTable); 