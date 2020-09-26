import React from 'react';

import { Link } from "react-router-dom";
// import { AppBar, Button, Toolbar } from "@material-ui/core";

import styles from './navBar.module.css';

class NavBar extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                <div className={styles.container1}>
                    <h1 className={styles.heading}>WIP</h1>
                </div>
                <div className={styles.container2}>
                    &nbsp;&nbsp;
                        Admin
                    &nbsp;&nbsp;|
                    &nbsp;&nbsp;
                    <Link to="/">
                        Current Queue Table
                    </Link>
                    &nbsp;&nbsp;|
                    &nbsp;&nbsp;
                    <Link to="/new-venue">
                        Add Venue
                    </Link>
                    &nbsp;&nbsp;|
                </div>
            </div>
        )
    }
}

export default NavBar;