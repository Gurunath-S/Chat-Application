import React, { useState, useEffect } from "react";
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  Grid,
  Menu,
  MenuItem,
  Snackbar,
  Fade,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  AccountCircle,
  Close as CloseIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { deepPurple } from "@material-ui/core/colors";
import { GoSignOut } from "react-icons/go";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

import Rooms from "./Rooms";
import EditProfile from "./EditProfile";
import { auth, db } from "../Firebase/Firebase";

const drawerWidth = 240;

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#1a1d2e",
  },
  avatarGrid: {
    padding: theme.spacing(3),
    color: "#dcddde",
    background: "#1f2338",
    borderRadius: "10px",
    margin: theme.spacing(2),
  },
  avatarIcon: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1.5),
  },
  avatarName: {
    fontSize: "0.9em",
    paddingLeft: theme.spacing(1),
    wordBreak: "break-word",
    color: "#aaa",
  },
  avatarDisplayName: {
    fontWeight: "bold",
    paddingLeft: theme.spacing(2),
    color: "#fff",
  },
  purple: {
    backgroundColor: deepPurple[500],
    color: theme.palette.getContrastText(deepPurple[500]),
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "#22273b",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#171c2e",
    color: "#fff",
    borderRight: "1px solid #2a2f45",
  },
  sideToolBar: {
    backgroundColor: "#20263d",
    color: "#fff",
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sideToolBarText: {
    letterSpacing: "0.2em",
    fontWeight: "900",
    color: "#78a9ff",
  },
  title: {
    flexGrow: 1,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: theme.spacing(1.5, 2),
    fontWeight: 500,
  },
}));

function Application({ window, uid }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [alert, setAlert] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (uid) {
      const unsubscribe = db
        .collection("users")
        .doc(uid)
        .onSnapshot((doc) => {
          setUserDetails(doc.data());
          localStorage.setItem("userDetails", JSON.stringify(doc.data()));
        });

      return () => unsubscribe();
    }
  }, [uid]);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleEditProfile = () => {
    setEditProfileModal((prev) => !prev);
    setAnchorEl(null);
  };
  const handleAlert = () => setAlert((prev) => !prev);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Signed out successfully");
        localStorage.clear();
      })
      .catch((err) => console.error(err));
  };

  const drawer = userDetails && (
    <div>
      <Toolbar className={classes.sideToolBar}>
        <Typography variant="h6" className={classes.sideToolBarText}>
          CHATIFY
        </Typography>
      </Toolbar>
      <Divider />
      <Grid className={classes.avatarGrid}>
        <div className={classes.avatarIcon}>
          <StyledBadge
            overlap="circle"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt={userDetails.name}
              src={userDetails.photoURL}
              className={classes.purple}
            />
          </StyledBadge>
          <Typography variant="h6" className={classes.avatarDisplayName}>
            {userDetails.displayName}
          </Typography>
        </div>
        <Typography className={classes.avatarName}>
          {userDetails.name}
        </Typography>
        <Typography className={classes.avatarName}>
          {userDetails.email}
        </Typography>
      </Grid>
      <Divider />
      <Rooms />
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Display Name Updated Successfully"
        action={
          <IconButton color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />

      {editProfileModal && (
        <EditProfile toggler={toggleEditProfile} alert={handleAlert} />
      )}

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ minHeight: "50px" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: "none", color: "#dcddde" }}>
              Home
            </Link>
          </Typography>

          <IconButton onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={toggleEditProfile} className={classes.menuItem}>
              <FaUserEdit /> Edit Profile
            </MenuItem>
            <MenuItem onClick={signOut} className={classes.menuItem}>
              <GoSignOut /> Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="chat rooms">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Application;
