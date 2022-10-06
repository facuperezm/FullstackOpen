import React from "react";
import { connect } from "react-redux";

const Notification = (props) => {
  const notification = props.notification;
  const style = {
    border: "solid",
    padding: 12,
    borderWidth: 2,
  };
  return (
    <>{notification !== null && <div style={style}>{notification}</div>}</>
  );
};

const stateToProps = (state) => {
  return {
    notification: state.notification,
  };
};

export default connect(stateToProps)(Notification);
