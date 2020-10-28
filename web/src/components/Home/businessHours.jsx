import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  editBusinessHoursStatus,
  editBusinessHours,
  submitBusinessHours,
} from "../../reducers/actions/venueActions";
import { noLocation } from "../../constants";

import { Button, Paper, TextField, Typography, ThemeProvider, InputBase } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import styles from "./home.module.css";
let editButton = null;


class BusinessHours extends React.Component {
  showBusinessHours = () => {
    if (this.props.venue_uid !== noLocation) {
      editButton = (
        <div className={styles.businessHoursButtonSection}>
          <div className={styles.businessHoursButtonItem}>
            <div className={styles.businessHoursButton}>
              <Button
                variant='contained'
                color='primary'
                size = 'small'
                onClick={() => this.props.editBusinessHoursStatus(true)}
              >
                Edit
              </Button>
            </div>
          </div>
          <div className={styles.businessHoursButtonItem}>
            <div className={styles.businessHoursButton}>&nbsp;</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <TableContainer component={Paper}>
        {/* <ThemeProvider theme={theme}> */}
          <Table
          size="small" aria-label="a dense table"
            style={{
                backgroundColor: 'white',
              }}
            // className={styles.businessTableColor}
            >
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
                <TableCell> {this.props.businessHours["Su"][0]} </TableCell>
                <TableCell> {this.props.businessHours["Su"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Monday </TableCell>
                <TableCell> {this.props.businessHours["M"][0]} </TableCell>
                <TableCell> {this.props.businessHours["M"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Tuesday </TableCell>
                <TableCell> {this.props.businessHours["T"][0]} </TableCell>
                <TableCell> {this.props.businessHours["T"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Wednesday </TableCell>
                <TableCell> {this.props.businessHours["W"][0]} </TableCell>
                <TableCell> {this.props.businessHours["W"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Thursday </TableCell>
                <TableCell> {this.props.businessHours["Th"][0]} </TableCell>
                <TableCell> {this.props.businessHours["Th"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Friday </TableCell>
                <TableCell> {this.props.businessHours["F"][0]} </TableCell>
                <TableCell> {this.props.businessHours["F"][1]} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Saturday </TableCell>
                <TableCell> {this.props.businessHours["S"][0]} </TableCell>
                <TableCell> {this.props.businessHours["S"][1]} </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        {/* </ThemeProvider> */}
        </TableContainer>
        
      </div>
    );
  };

  editingBusinessHours = () => {
    let businessHours = JSON.parse(JSON.stringify(this.props.newBusinessHours));
    return (
      <div>
        <TableContainer component={Paper}>
        {/* <ThemeProvider theme={theme}> */}
          <Table
          size="small" aria-label="a dense table"
          >
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
                        step: 0,
                      },
                    }}
                    value={businessHours["Su"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "Su",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["Su"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["Su"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "Su",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["Su"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Monday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["M"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "M",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["M"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["M"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "M",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["M"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Tuesday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["T"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "T",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["T"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["T"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "T",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["T"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Wednesday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["W"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "W",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["W"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["W"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "W",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["W"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Thursday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["Th"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "Th",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["Th"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["Th"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "Th",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["Th"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Friday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["F"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "F",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["F"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["F"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "F",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["F"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Saturday </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["S"][0]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "S",
                        0,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["S"][0]}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type='time'
                    InputProps={{
                      inputProps: {
                        step: 0,
                      },
                    }}
                    value={businessHours["S"][1]}
                    onChange={(e) => {
                      this.props.editBusinessHours(
                        businessHours,
                        "S",
                        1,
                        e.target.value
                      );
                    }}
                  >
                    {businessHours["S"][1]}
                  </TextField>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        {/* </ThemeProvider> */}
        </TableContainer>
        <div className={styles.businessHoursButtonSection}>
          <div className={styles.businessHoursButtonItem}>
            <div className={styles.businessHoursButtonBottom}>
              <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={() =>
                  this.props.submitBusinessHours(
                    businessHours,
                    this.props.venue_uid
                  )
                }
              >
                Save
              </Button>
            </div>
          </div>
          <div className={styles.businessHoursButtonItem}>
            <div className={styles.businessHoursButtonBottom}>
              <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={() => this.props.editBusinessHoursStatus(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    let mainElement = null;
    const theme = createMuiTheme({
      overrides: {
          MuiTableCell: {
              root: {  //This can be referred from Material UI API documentation. 
                  //padding: '4px 8px',
                  //maxHeight: '25px',
                  backgroundColor: "white",
                  height: '0.1rem'
              },
          }
      },
    });
    if (!this.props.editingBusinessHours) {
      mainElement = this.showBusinessHours();
    } else {
      mainElement = this.editingBusinessHours();
    }
    return (
      <div className={styles.businessHoursSection}>
        
        <Typography variant='h6' className={styles.businessTitle} >
          Business Hours{"  "}
          {editButton != null ? editButton : ''}
        </Typography>
        {mainElement}
      </div>
    );
  }
}

BusinessHours.propTypes = {
  editBusinessHoursStatus: PropTypes.func.isRequired,
  editBusinessHours: PropTypes.func.isRequired,
  venue_uid: PropTypes.string.isRequired,
  businessHours: PropTypes.object.isRequired,
  editingBusinessHours: PropTypes.bool.isRequired,
  newBusinessHours: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  venue_uid: state.venueData.venue_uid,
  businessHours: state.venueData.businessHours,
  editingBusinessHours: state.venueData.editingBusinessHours,
  newBusinessHours: state.venueData.newBusinessHours,
});

export default connect(mapStateToProps, {
  editBusinessHoursStatus,
  editBusinessHours,
  submitBusinessHours,
})(BusinessHours);
