import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

function SubFacility() {
  const [facilities, setFacilities] = useState([]);
  const [types, setTypes] = useState([]);
  const [dataForm, setDataForm] = useState({
    facility: null,
    type: null,
    name: "",
  });
  const inputRef = useRef();
  console.log(dataForm);
  // Gọi API khi component mount
  useEffect(() => {
    fetch("http://localhost:8080/sportsfacilities")
      .then((response) => response.json())
      .then((data) => {
        // Lọc dữ liệu lấy id và name
        const formattedFacilities = data.map((item) => ({
          sportsFacilityId: item.sportsFacilityId,
          name: item.name,
        }));
        setFacilities(formattedFacilities);
      })
      .catch((error) => console.error("Error:", error));
    fetch("http://localhost:8080/facilitytypes")
      .then((response) => response.json())
      .then((data) => {
        // Lọc dữ liệu lấy id và name
        const formattedTypes = data.map((item) => ({
          facilityTypeId: item.facilityTypeId,
          name: item.name,
        }));
        setTypes(formattedTypes);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  const handleSubmit = async () => {
    const postData = {
      name: dataForm.name,
      sportsFacility: {
        sportsFacilityId: parseInt(dataForm.facility.sportsFacilityId),
      },
      facilityType: { facilityTypeId: parseInt(dataForm.type.facilityTypeId) },
    };
    console.log(postData);
    try {
      const response = await axios.post(
        "http://localhost:8080/subfacilities/save",
        postData
      );
      alert("Tạo thành công!");
      console.log(response.data);
      setDataForm({ ...dataForm, name: "" });
      inputRef.current.focus();
    } catch (error) {
      console.error("Error:", error);
      alert("Tạo thất bại!");
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          SubFacility Form
        </Typography>
        <Autocomplete
          fullWidth
          disablePortal
          options={facilities}
          onChange={(event, newValue) =>
            setDataForm({ ...dataForm, facility: newValue })
          }
          style={{ marginTop: "20px" }}
          getOptionLabel={(option) => option.name} // Hiển thị tên của facility
          renderInput={(params) => <TextField {...params} label="Facility" />}
        />
        <TextField
          fullWidth
          name="name"
          margin="normal"
          label="Name"
          onChange={(event) =>
            setDataForm({ ...dataForm, name: event.target.value })
          }
          inputRef={inputRef}
          value={dataForm.name}
          variant="outlined"
        />
        <Autocomplete
          fullWidth
          disablePortal
          options={types}
          style={{ marginTop: "20px" }}
          getOptionLabel={(option) => option.name} // Hiển thị tên của facility
          onChange={(event, newValue) =>
            setDataForm({ ...dataForm, type: newValue })
          }
          renderInput={(params) => <TextField {...params} label="Type" />}
        />
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default SubFacility;
