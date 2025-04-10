import { createTheme } from "@mui/material/styles";

// Dark theme giống trang chủ MUI
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Màu xanh nhẹ cho nút hoặc tiêu đề
    },
    background: {
      default: "#0A1929", // Màu nền ngoài cùng giống trang chủ MUI
      paper: "#132F4C", // Màu nền cho card hoặc khu vực chứa nội dung
    },
    text: {
      primary: "#ffffff",
      secondary: "#90caf9",
    },
  },
});
