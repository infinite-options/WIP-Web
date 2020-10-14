import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { AppBar, Button, Toolbar } from "@material-ui/core";

import styles from "./navBar.module.css";
import NewVenue from "./../NewVenue";

const customStyles = {
  content:{
    top                   : '10%',
    left                  : '10%',
    right                 : '10%',
    bottom                : '10%',
    marginRight           : '20%',
    marginLeft            : '20%',
    border                 :'1px solid '
  }
}
class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen : false,
      setIsOpen : false
    }
  }
  toggleModal = (e) => {
    e.preventDefault();
    this.setState({
      setIsOpen : !this.state.isOpen,
      isOpen : !this.state.isOpen
    })
}
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.container1}>
          <h1 className={styles.heading}>WIP</h1>
        </div>
        <div className={styles.container2}>
          &nbsp;&nbsp; Admin &nbsp;&nbsp;| &nbsp;&nbsp;
          <Link to='/'>Current Queue Table</Link>
          &nbsp;&nbsp;| &nbsp;&nbsp;
          <Button variant="primary"  onClick={this.toggleModal.bind(this)}>Add Venue</Button>
          <Modal  
            isOpen={this.state.isOpen}
            style = {customStyles}
            onRequestClose={this.toggleModal.bind(this)}
            contentLabel="Add Venue"
          >
            <div> <NewVenue/></div>
          </Modal>
          &nbsp;&nbsp;|
        </div>
      </div>
    );
  }
}

export default NavBar;