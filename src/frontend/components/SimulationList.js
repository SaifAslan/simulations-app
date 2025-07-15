// components/SimulationList.js
import { List, Card } from "antd";
import Image from "next/image";
import React from "react";

const SimulationList = ({ simulations }) => {
  console.log(simulations);
  
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={simulations}
      renderItem={(simulation) => (
        <List.Item>
          <Card
            cover={
              <Image
                alt="example"
                src={
                  "https://www.skillshare.com/blog/wp-content/uploads/2021/03/Screenshot2021-03-15at18.03.402-1.jpg"
                }
                width={300}
                height={300}
              />
            }
            title={simulation.simulation?.title}
          >
            {simulation.simulation?.description.substring(0, 50)}...
          </Card>
        </List.Item>
      )}
    />
  );
};

export default SimulationList;
