import React from "react";

interface GradientProps {
  min: number;
  max: number;
  number: number;
  organ: string;
}



const ProiorityGraph: React.FC<GradientProps> = ({ min, max, number, organ }) => {

  const percentage = (number / (max - min)) * 100;

  function getColor() {
    if (percentage < 25) {
      return "green"
    } else if (25 < percentage ||  percentage < 65) {
      return "yellow"
    } else if (65 < percentage) {
      return "red"
    }
  }

  const gradientStyle: React.CSSProperties = {
    width: `300px`,
    height: `50px`,
    background: getColor(),
    position: "relative",
    margin: "40px auto"
  };

  const pointerStyle: React.CSSProperties = {
    width: "15px",
    height: "15px",
    position: "absolute",
    content: "",
    transform: "translateX(-50%)",
    bottom: "-10px",
    left: `${percentage}%`,
    textAlign: "center"
  };

  const arrowStyle: React.CSSProperties = {
    width: "15px",
    height: "15px",
    background: "black",
    content: "",
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    top: "-20px",
    width: "100%"
  };

  return (
    <div>
      <h4>{organ}</h4>
      <div style={gradientStyle}>
        {/* <div style={headerStyle}>
          <span>Low: ({min})</span>
          <span>Medium</span>
          <span>High: ({max})</span>
        </div> */}
        <div style={pointerStyle}>
          <div style={arrowStyle}></div>
          <span>{number}</span>
        </div>
      </div>
    </div>
  );
};

export default ProiorityGraph;
