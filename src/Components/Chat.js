import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Messages from "./Messages";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import firebase from "firebase/app";
import ScrollableFeed from "react-scrollable-feed";
import { BiHash } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { Picker } from "emoji-mart";
import { RiImageAddLine } from "react-icons/ri";
import FileUpload from "./FileUpload";
import "emoji-mart/css/emoji-mart.css";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#1e1f2f",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  chat: {
    position: "relative",
    height: "calc(100vh - 200px)",
    paddingLeft: "10px",
    paddingBottom: "5px",
    paddingTop: "5px",
    overflowY: "auto",
  },
  footer: {
    paddingRight: "15px",
    paddingLeft: "15px",
    paddingTop: "10px",
    paddingBottom: "20px",
  },
  message: {
    width: "100%",
    color: "white",
    backgroundColor: "#2f334d",
    borderRadius: "8px",
  },
  roomName: {
    borderBottom: "1px solid #444",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    color: "#e5e5e5",
    backgroundColor: "#272a40",
  },
  roomNameText: {
    marginBlockEnd: 0,
    marginBlockStart: 0,
    paddingLeft: "8px",
    fontWeight: 600,
    fontSize: "1.2rem",
  },
  iconDesign: {
    fontSize: "1.5em",
    color: "#e5e5e5",
  },
  footerContent: {
    display: "flex",
    backgroundColor: "#303753",
    borderRadius: "10px",
    alignItems: "center",
    padding: "10px",
  },
  inputFile: {
    display: "none",
  },
  emojiWrapper: {
    position: "absolute",
    bottom: "70px",
    zIndex: 10,
  },
}));

function Chat() {
  const classes = useStyles();
  const params = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [file, setFileName] = useState(null);

  useEffect(() => {
    if (params.id) {
      db.collection("channels")
        .doc(params.id)
        .onSnapshot((snapshot) => {
          setChannelName(snapshot.data()?.channelName);
        });

      db.collection("channels")
        .doc(params.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setAllMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  }, [params]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (userNewMsg && params.id) {
      const userData = JSON.parse(localStorage.getItem("userDetails"));

      if (userData) {
        const obj = {
          text: userNewMsg,
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
          postImg: null,
        };

        db.collection("channels")
          .doc(params.id)
          .collection("messages")
          .add(obj)
          .then(() => console.log("message sent"))
          .catch((err) => console.log(err));
      }

      setUserNewMsg("");
      setEmojiBtn(false);
    }
  };

  const addEmoji = (e) => {
    setUserNewMsg(userNewMsg + e.native);
  };

  const openModal = () => {
    setModalState(!modalState);
  };

  const handelFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFileName(e.target.files[0]);
      openModal();
    }
    e.target.value = null;
  };

  return (
    <div className={classes.root}>
      {modalState && <FileUpload setState={openModal} file={file} />}
      <Grid item xs={12} className={classes.roomName}>
        <BiHash className={classes.iconDesign} />
        <h3 className={classes.roomNameText}>{channelName}</h3>
      </Grid>

      <Grid item xs={12} className={classes.chat}>
        <ScrollableFeed>
          {allMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Messages values={message.data} msgId={message.id} />
            </motion.div>
          ))}
        </ScrollableFeed>
      </Grid>

      <div className={classes.footer}>
        <Grid item xs={12} className={classes.footerContent}>
          <input
            accept="image/*"
            className={classes.inputFile}
            id="icon-button-file"
            type="file"
            onChange={handelFileUpload}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" component="span">
              <RiImageAddLine style={{ color: "#b9bbbe" }} />
            </IconButton>
          </label>

          <IconButton color="primary" onClick={() => setEmojiBtn(!emojiBtn)}>
            <GrEmoji style={{ color: "#b9bbbe" }} />
          </IconButton>

          {emojiBtn && (
            <motion.div
              className={classes.emojiWrapper}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Picker onSelect={addEmoji} theme="dark" />
            </motion.div>
          )}

          <form
            autoComplete="off"
            style={{ width: "100%", display: "flex", gap: "10px" }}
            onSubmit={sendMsg}
          >
            <TextField
              className={classes.message}
              required
              label="Enter Message"
              variant="outlined"
              multiline
              rows={1}
              value={userNewMsg}
              onChange={(e) => setUserNewMsg(e.target.value)}
            />
            <IconButton type="submit">
              <FiSend style={{ color: "#b9bbbe" }} />
            </IconButton>
          </form>
        </Grid>
      </div>
    </div>
  );
}

export default Chat;
