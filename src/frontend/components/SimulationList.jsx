import { List, Card } from "antd";
import Image from "next/image";
import React from "react";
import Link from "next/link";  // Added import for navigation

const SimulationList = ({ simulations }) => {  
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={simulations}
      renderItem={(simulation) => (
        <List.Item>
          <Link href={`/simulations/${simulation.simulation?.route || '#'}`}>
            <Card
              hoverable  // Added hoverable for better UX
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
              title={simulation.simulation?.name || 'Untitled Simulation'}  // Handle missing title
            >
                            {/* Handle missing description */}
              {(simulation.simulation?.description?.substring(0, 50) || 'No description available')}...  
            </Card>
          </Link>
        </List.Item>
      )}
    />
  );
};

export default SimulationList;