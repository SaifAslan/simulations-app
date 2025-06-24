import React from "react";
import Game from "../components/Game";
import "antd/dist/reset.css"; // Import Ant Design CSS

export default function Home() {
  return (
    <React.StrictMode>
      <Game />
    </React.StrictMode>
  );
}
