import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  makeStyles,
  Typography,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

// Custom Snackbar Alert Component with clean dark theme
function Alert(props) {
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...props}
      style={{
        backgroundColor: "#2d2f3b", // clean dark solid bg
        color: "#ffffff",
        fontWeight: 500,
      }}
    />
  );
}

// Custom styles
const useStyles = makeStyles(() => ({
  dialogPaper: {
    backgroundColor: "#1e2337",
    color: "#dcddde",
    borderRadius: "10px",
  },
  dialogTitle: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: "1.3rem",
  },
  textField: {
    backgroundColor: "#2d2d49",
    borderRadius: 5,
    "& label": {
      color: "#a0a0b2",
    },
    "& label.Mui-focused": {
      color: "#b3b3ff",
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": {
        borderColor: "#444a6d",
      },
      "&:hover fieldset": {
        borderColor: "#6573c3",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6573c3",
      },
    },
  },
  button: {
    color: "#fff",
    borderRadius: 20,
    padding: "6px 20px",
    fontWeight: 500,
  },
  cancelButton: {
    backgroundColor: "#444a6d",
    "&:hover": {
      backgroundColor: "#3b4064",
    },
  },
  createButton: {
    backgroundColor: "#6573c3",
    "&:hover": {
      backgroundColor: "#5c6bc0",
    },
  },
}));

function CreateRoom({ create, manage }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    manage();
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const handleNewRoom = (e) => {
    e.preventDefault();
    if (roomName) {
      create(roomName);
      setSnackOpen(true); // show snackbar

      // Delay closing the dialog & running external manage
      setTimeout(() => {
        setOpen(false);
        manage();
      }, 1600); // just after snackbar duration
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle disableTypography>
          <Typography className={classes.dialogTitle}>
            Create a New Channel
          </Typography>
        </DialogTitle>

        <DialogContent>
          <form autoComplete="off" onSubmit={handleNewRoom}>
            <TextField
              className={classes.textField}
              label="Enter Channel Name"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            className={`${classes.button} ${classes.cancelButton}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNewRoom}
            className={`${classes.button} ${classes.createButton}`}
            type="submit"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clean Snackbar popup */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={1500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          style: {
            backdropFilter: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
            zIndex: 1500,
          },
        }}
      >
        <Alert onClose={handleSnackClose} severity="success">
          Channel "{roomName}" created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateRoom;
