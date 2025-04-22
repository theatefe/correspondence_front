import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Authmiddleware = (props) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }else if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      return (
        <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
      );
    }
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default Authmiddleware;
