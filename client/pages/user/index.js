import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";

const User = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">User dashboard</h1>
    </UserRoute>
  );
};

export default User;
