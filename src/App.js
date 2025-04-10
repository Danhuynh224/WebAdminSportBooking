import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Facility from "./components/Facility";
import SubFacility from "./components/SubFacility";

function App() {
  const [alignment, setAlignment] = useState("web");
  const [content, setContent] = useState(null);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton
            onClick={() =>
              setContent(content !== "Facility" ? "Facility" : null)
            }
            value="Facility"
          >
            Facility
          </ToggleButton>
          <ToggleButton
            onClick={() =>
              setContent(content !== "SubFacility" ? "SubFacility" : null)
            }
            value="SubFacility"
          >
            SubFacility
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>{content === "Facility" && <Facility />}</div>
      <div>{content === "SubFacility" && <SubFacility />}</div>
    </div>
  );
}

export default App;
