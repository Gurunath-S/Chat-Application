import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { db } from "../Firebase/Firebase";
import firebase from "firebase/app";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(() => ({
  displayImage: {
    height: "105px",
    width: "180px",
  },
  imageName: {
    paddingLeft: "15px",
    fontSize: "1.3em",
  },
  imageDiv: {
    marginLeft: "16px",
    marginRight: "16px",
    marginTop: "-33px",
  },
}));

function FileUpload({ setState, file }) {
  const classes = useStyles();
  const params = useParams();
  const [open, setOpen] = useState(true);
  const [progressBar, setProgressBar] = useState({ display: "none" });
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [preview] = useState(URL.createObjectURL(file));

  const handleClose = () => {
    setOpen(false);
    setState();
  };

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Check file size before processing
    if (file.size > 1048576) { // ~750KB to be safe
      alert("File too large. Please select an image smaller than 1MB.");
      reject(new Error("File too large"));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

  const sendMsg = async (base64Image) => {
    if (params.id) {
      const userData = JSON.parse(localStorage.getItem("userDetails"));

      if (userData) {
        const obj = {
          text: message,
          timestamp: firebase.firestore.Timestamp.now(),
          userImg: userData.photoURL,
          userName: userData.displayName,
          uid: userData.uid,
          likeCount: 0,
          likes: {},
          fireCount: 0,
          fire: {},
          heartCount: 0,
          heart: {},
          postImg: base64Image, // directly store Base64 image
        };

        await db.collection("channels")
          .doc(params.id)
          .collection("messages")
          .add(obj)
          .then(() => {
            console.log("message sent with base64 image");
          })
          .catch((err) => console.log(err));
      }

      setMessage("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setProgressBar({ display: "block" });

    try {
      const base64 = await convertToBase64(file);
      setProgress(100);
      await sendMsg(base64);
      handleClose();
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.imageDiv}>
          <img src={preview} alt={file.name} className={classes.displayImage} />
          <Typography className={classes.imageName}>{file.name}</Typography>
        </div>

        <DialogTitle>Upload Image</DialogTitle>

        <DialogContent>
          <form autoComplete="off" onSubmit={handleUpload}>
            <TextField
              label="Add A Message"
              fullWidth
              margin="normal"
              variant="outlined"
              style={{ backgroundColor: "rgb(45, 45, 73)", borderRadius: "5px" }}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>

          <div style={progressBar}>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2">{Math.round(progress)}%</Typography>
              </Box>
            </Box>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} style={{ color: "white" }}>
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" autoFocus variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FileUpload;
