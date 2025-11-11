import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Chip, Avatar, Paper, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AuthenService from "../../services/api/AuthenService";
import { resetUserInfo } from "../../redux/slices/orebi.slice";
import { useDispatch } from "react-redux";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="#!">
        SDN Company
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#424242", // Màu xám đậm
  color: "#fff",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    backgroundColor: "#424242", // 🔹 Màu xám đậm giống AppBar
    color: "#ffffff", // Chữ trắng
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// Custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
});

export default function AdminDashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState("Admin Dashboard");
  const [open, setOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  const toggleDrawer = () => setOpen(!open);
  const currentPath = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";

    // Gọi song song hai API
    const fetchData = async () => {
      try {
        const [reportRes, profileRes] = await Promise.all([
          axios.get("http://localhost:9999/api/admin/report", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:9999/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Xử lý admin/report
        if (!reportRes.data.success) {
          console.warn("Không lấy được báo cáo admin");
        }

        // Xử lý profile
        if (profileRes.data.success && profileRes.data.data) {
          const profile = profileRes.data.data;
          setAdminInfo({
            avatarURL: profile.avatarURL,
            username: profile.username,
            fullname: profile.fullname,
            role: profile.role,
          });
        } else {
          setAdminInfo(null);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu admin:", error);
        setAdminInfo(null);
      }
    };

    fetchData();
  }, []);

  const [openAdminMgmt, setOpenAdminMgmt] = useState(
    currentPath.includes("/manage-users") || currentPath.includes("/manage-stores")
  );

  const handleToggleAdminMgmt = () => setOpenAdminMgmt((prev) => !prev);

  const handleSetDashboardTitle = (newDashboardTitle) =>
    setDashboardTitle(newDashboardTitle);

  const handleOnclickSignout = async () => {
    await AuthenService.logout();
    dispatch(resetUserInfo());
    navigate("/signin");
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h5" noWrap sx={{ flexGrow: 1, fontWeight: "bold" }}>
              {dashboardTitle}
            </Typography>

            {adminInfo && (
              <Tooltip title={adminInfo.fullname} arrow>
                <Chip
                  avatar={<Avatar src={adminInfo.avatarURL} alt={adminInfo.fullname} />}
                  label={adminInfo.username}
                  color="default"
                  sx={{
                    ml: 1,
                    fontWeight: 600,
                    fontSize: 16,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                />
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [1],
              backgroundColor: "#424242",
            }}
          >
            <Typography
              variant="h6"
              color="white"
              sx={{ ml: 1, display: open ? "block" : "none" }}
            >
              SHOPII Admin
            </Typography>
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

          <List component="nav">
            <ListItemButton onClick={() => navigate("/admin")} selected={currentPath === "/admin"}>
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard Overview" />
            </ListItemButton>

            <ListItemButton onClick={handleToggleAdminMgmt}>
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
              {openAdminMgmt ? (
                <ExpandLess sx={{ color: "primary.contrastText" }} />
              ) : (
                <ExpandMore sx={{ color: "primary.contrastText" }} />
              )}
            </ListItemButton>

            <Collapse in={openAdminMgmt} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/manage-users")}
                  selected={currentPath === "/admin/manage-users"}
                >
                  <ListItemIcon sx={{ color: "primary.contrastText" }}>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/manage-stores")}
                  selected={currentPath === "/admin/manage-stores"}
                >
                  <ListItemIcon sx={{ color: "primary.contrastText" }}>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Shops" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton
              onClick={() => navigate("/admin/manage-products")}
              selected={currentPath === "/admin/manage-products"}
            >
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Products" />
            </ListItemButton>

            <ListItemButton
              onClick={() => navigate("/admin/manage-vouchers")}
              selected={currentPath === "/admin/manage-vouchers"}
            >
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Vouchers" />
            </ListItemButton>

            <ListItemButton
              onClick={() => navigate("/admin/manage-orders")}
              selected={currentPath === "/admin/manage-orders"}
            >
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Order Management" />
            </ListItemButton>

            <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
            <ListItemButton onClick={handleOnclickSignout}>
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: "background.default",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                mb: 3,
              }}
            >
              <Outlet context={{ handleSetDashboardTitle }} />
            </Paper>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
