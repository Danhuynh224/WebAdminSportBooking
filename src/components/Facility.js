import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function Facility() {
  const [facility, setFacility] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    img: null,
  });

  useEffect(() => {
    //cleanup function
    return () => {
      if (facility.img) {
        URL.revokeObjectURL(facility.img.preview);
      }
    };
  }, [facility.img]);
  const inputRef = useRef();
  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacility((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setFacility((prev) => ({
      ...prev,
      img: file,
    }));
  };

  // Hàm gửi dữ liệu lên server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu hợp lệ trước khi gửi
    if (
      !facility.name ||
      !facility.address ||
      !facility.latitude ||
      !facility.longitude ||
      !facility.img
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", facility.name);
    formData.append("address", facility.address);
    formData.append("latitude", facility.latitude);
    formData.append("longitude", facility.longitude);
    formData.append("img", facility.img.name);

    try {
      const facilityResponse = await axios.post(
        "http://localhost:8080/sportsfacilities/save",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      //Gửi ảnh lên server
      const imgForm = new FormData();
      imgForm.append("name", facility.name);
      imgForm.append("file", facility.img);

      const imgResponse = await axios.post(
        "http://localhost:8080/images/upload",
        imgForm
      );

      console.log("Facility Response:", facilityResponse.data);
      console.log("Image Response:", imgResponse.data);
      alert("Dữ liệu đã gửi thành công!");

      setFacility({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        img: null,
      });
      inputRef.current.focus();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Gửi dữ liệu thất bại");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sport Facility Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            margin="normal"
            label="Name"
            value={facility.name}
            variant="outlined"
            onChange={handleChange}
            inputRef={inputRef}
          />
          <TextField
            fullWidth
            name="address"
            margin="normal"
            label="Address"
            value={facility.address}
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="latitude"
            margin="normal"
            label="Latitude"
            value={facility.latitude}
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="longitude"
            margin="normal"
            label="Longitude"
            value={facility.longitude}
            variant="outlined"
            onChange={handleChange}
          />

          <Typography variant="h6" style={{ padding: "5px", display: "block" }}>
            Sports Facility Image:
          </Typography>
          <input
            type="file"
            name="img"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
          >
            {facility.img && <img src={facility.img.preview} width="80%" />}
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "5px" }}
          >
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
export default Facility;
