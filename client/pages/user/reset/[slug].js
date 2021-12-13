import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../../context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";

function forgotPassword() {
  const [data, setData] = useState("");

  // Context
  const {
    state: { user },
  } = useContext(Context);

  // Router
  const router = useRouter();
  const token = router.query.slug;

  console.log(token);

  const handleChangePassword = (e) => {
    setData(e.target.value);
  };

  const handleSubmit = () => {
    try {
      const resetPassword = async () => {
        const res = await axios.post("/api/reset-password", { password: data });
        toast(res.data.msg);
      };
      resetPassword();
    } catch (error) {
      error.response.data.msg && toast(error.response.data.msg);
    }
  };

  return (
    <div>
      <label>Enter new password</label>
      <input type="password" value={data} onChange={handleChangePassword} />
      <button onClick={handleSubmit}>OK</button>
    </div>
  );
}

export default forgotPassword;
