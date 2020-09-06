import React from 'react';

import { Link } from "react-router-dom";
import { AppBar, Button, Toolbar } from "@material-ui/core";

import styles from './navBar.module.css';

class NavBar extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                <AppBar>
                    <Toolbar>
                        <Link to="/"> <Button> <div className={styles.navElt}> Home </div> </Button> </Link>
                        <Link to="/new-venue"> <Button> <div className={styles.navElt}> New Venue </div> </Button>  </Link>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default NavBar;