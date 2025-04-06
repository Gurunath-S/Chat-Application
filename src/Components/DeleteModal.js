import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

// Custom styles
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: 16,
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: "8px",
  },
}));

function DeleteModal({ msgId, text, deleteMsg, handleModal, postImg }) {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    handleModal();
  };

  const handleDelete = () => {
    deleteMsg(msgId);
    handleModal();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.paper }} // Applying custom class
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete the message?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "white", fontSize: "1.2rem" }}
          >
            {text}
          </DialogContentText>
          {postImg && (
            <motion.img
              src={postImg}
              alt="img"
              style={{
                height: "200px",
                width: "250px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
            variant="contained"
            style={{ borderRadius: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}

export default DeleteModal;
