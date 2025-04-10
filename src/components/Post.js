import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

function Post() {
  const [facilities, setFacilities] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    summary: "",
    content: "",
    facility: null,
    images: [],
  });

  const inputRef = useRef();

  useEffect(() => {
    fetch("http://localhost:8080/sportsfacilities")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          sportsFacilityId: item.sportsFacilityId,
          name: item.name,
        }));
        setFacilities(formatted);
      })
      .catch((err) => console.error("Facility error:", err));
  }, []);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
    setPostData((prev) => ({
      ...prev,
      images: filesWithPreview,
    }));
  };

  const handleSubmit = async () => {
    if (
      !postData.title ||
      !postData.summary ||
      !postData.content ||
      !postData.facility ||
      postData.images.length === 0 // Kiểm tra có ít nhất 1 ảnh
    ) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 ảnh!");
      return;
    }

    try {
      // Gửi dữ liệu Post trước (chưa có ảnh)
      const postPayload = {
        title: postData.title,
        summary: postData.summary,
        content: postData.content,
        sportsFacility: {
          sportsFacilityId: postData.facility.sportsFacilityId,
        },
      };

      const postRes = await axios.post("http://localhost:8080/post/save", postPayload);
      const savedPost = postRes.data;

      console.log("Post created:", savedPost);

      // Gửi ảnh nếu có
      if (postData.images.length > 0 && savedPost.idPost) {
        const imgForm = new FormData();
        postData.images.forEach((file) => imgForm.append("files", file));
        imgForm.append("postId", savedPost.idPost);

        const uploadRes = await axios.post(
          "http://localhost:8080/images/post/upload",
          imgForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", uploadRes.data);
      }

      alert("Tạo bài viết thành công!");
      setPostData({
        title: "",
        summary: "",
        content: "",
        facility: null,
        images: [],
      });
      inputRef.current.focus();
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Tạo Bài Viết Mới
        </Typography>

        <Autocomplete
          fullWidth
          disablePortal
          options={facilities}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) =>
            setPostData({ ...postData, facility: value })
          }
          sx={{ mt: 2 }}
          renderInput={(params) => <TextField {...params} label="Khu thể thao" />}
        />

        <TextField
          fullWidth
          label="Tiêu đề"
          name="title"
          value={postData.title}
          onChange={handleChange}
          inputRef={inputRef}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Tóm tắt"
          name="summary"
          value={postData.summary}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Nội dung"
          name="content"
          value={postData.content}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Ảnh bài viết
        </Typography>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 2,
            justifyContent: "center",
          }}
        >
          {postData.images.map((file, index) => (
            <img
              key={index}
              src={file.preview}
              alt={`preview-${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>
            Gửi
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Post;
