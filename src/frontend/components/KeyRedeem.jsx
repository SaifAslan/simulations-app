// components/KeyRedeem.js
import { Input, Button } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchSimulations } from "../store/slices/simulationSlice";

const KeyRedeem = () => {
  const userData = useSelector(state => state.user)
  const [keyCode, setKeyCode] = useState("");
  const dispatch = useDispatch();

  const handleRedeem = async () => {
    if (keyCode) {
      try {
        const response = await axios.put(
          `http://localhost:3030/keys/${keyCode}/activate`,
          { simulationId: "6771e152415d875eb2356db6" },
          {
            headers: {
              Authorization: `Bearer ${userData.userInfo.token}`,
            },
          }
        );
        console.log("Key redeemed", response.data);
        dispatch(fetchSimulations());
    } catch (error) {
        console.error("Error redeeming key", error);
      }
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Input
        value={keyCode}
        onChange={(e) => setKeyCode(e.target.value)}
        placeholder="Enter key code"
        style={{ width: "200px", marginRight: "10px" }}
      />
      <Button onClick={handleRedeem}>Redeem</Button>
    </div>
  );
};

export default KeyRedeem;
