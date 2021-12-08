import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";

const Instructor = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor dashboard</h1>
    </InstructorRoute>
  );
};

export default Instructor;
