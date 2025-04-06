import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";
import { db } from "../Firebase/Firebase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: 16,
    background: "rgba(30, 30, 47, 0.8)",
    backdropFilter: "blur(10px)",
    color: "white",
    padding: "10px",
  },
  textField: {
    backgroundColor: "rgba(45, 45, 73, 0.6)",
    borderRadius: "6px",
    "& input": {
      color: "#fff",
    },
    "& label": {
      color: "#a6a6a6",
    },
  },
}));

function EditProfile({ toggler }) {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  const handleClose = () => {
    setOpen(false);
    toggler();
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await db.collection("users").doc(uid).update({ displayName });

      setSnackOpen(true); // ✅ First, show the Snackbar

      // ✅ Delay closing dialog so Snackbar has time to show
      setTimeout(() => {
        setOpen(false);
        toggler();
      }, 1000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (userData) {
      setUserName(userData.name);
      setDisplayName(userData.displayName);
      setEmail(userData.email);
      setUid(userData.uid);
    }
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{ className: classes.paper }}
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          Edit User Profile
        </DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
              value={userName}
              className={classes.textField}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
              value={email}
              className={classes.textField}
            />
            <TextField
              label="Display Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={classes.textField}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={updateProfile}
            color="primary"
            variant="contained"
            style={{ borderRadius: "8px" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message="Profile updated successfully!"
      />
    </div>
  );
}

export default EditProfile;
