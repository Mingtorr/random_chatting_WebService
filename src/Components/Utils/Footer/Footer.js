import React, { Component } from "react";
import "./Footer.css";
import HomeIcon from "@material-ui/icons/Home";

export default class Footer extends Component {
  home = (e) => {
    window.location.replace("/main");
  };
  render() {
    return (
      <div onClick={this.home}>
        <HomeIcon className="Home_footer" style={{ fontSize: 50 }} />
      </div>
    );
  }
}
