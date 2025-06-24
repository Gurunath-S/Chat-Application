import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import { db } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import { BiHash } from "react-icons/bi";
import CreateRoom from "./CreateRoom";
import Fade from "@material-ui/core/Fade";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  iconDesign: {
    fontSize: "1.5em",
    color: "#cb43fc",
  },
  primary: {
    color: "#cb43fc",
  },
}));

function Rooms() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [channelList, setChannelList] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const history = useHistory();
  const [alert, setAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

    // ✅ 1. Get user from localStorage on mount
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("userDetails"));
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    }, []);

    // ✅ 2. Load channel list from Firestore
    useEffect(() => {
      const unsubscribe = db
        .collection("channels")
        .orderBy("channelName", "asc")
        .onSnapshot((snapshot) => {
          setChannelList(
            snapshot.docs.map((channel) => ({
              channelName: channel.data().channelName,
              id: channel.id,
              createdBy: channel.data().createdBy,
            }))
          );
        });

      return () => unsubscribe();
    }, []);


  const handleClick = () => {
    setOpen(!open);
  };

  const goToChannel = (id) => {
    history.push(`/channel/${id}`);
  };

  const manageCreateRoomModal = () => {
    setShowCreateRoom(!showCreateRoom);
  };

  const handleAlert = () => {
    setAlert(!alert);
  };

  const addChannel = (cName) => {
    if (cName) {
      cName = cName.toLowerCase().trim();
      if (cName === "") {
        handleAlert();
        return;
      }

      for (var i = 0; i < channelList.length; i++) {
        if (cName === channelList[i].channelName) {
          handleAlert();
          return;
        }
      }

      const userData = JSON.parse(localStorage.getItem("userDetails"));
        db.collection("channels")
          .add({
            channelName: cName.toLowerCase(),
            createdBy: userData?.uid,
          })
        .then(() => {
          console.log("✅ Channel added:", cName);
        })
        .catch((err) => {
          console.error("❌ Failed to add channel:", err);
        });

    }
  };
  const handleDeleteRoom = (roomId) => {
  if (window.confirm("Are you sure you want to delete this channel?")) {
    db.collection("channels")
      .doc(roomId)
      .delete()
      .then(() => {
        console.log("Channel deleted!");
      })
      .catch((err) => console.error("Error deleting channel:", err));
  }
};
if (!currentUser) return null;

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Room Name Already Exits!!"
        key={Fade}
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />

      {showCreateRoom ? (
        <CreateRoom create={addChannel} manage={manageCreateRoomModal} />
      ) : null}
      <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItemText primary="Create New Channel" />
        <IconButton edge="end" aria-label="add" onClick={manageCreateRoomModal}>
          <AddIcon className={classes.primary} />
        </IconButton>
      </ListItem>
      <Divider />

      <List component="nav" aria-labelledby="nested-list-subheader">
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <IoMdChatboxes className={classes.iconDesign} />
          </ListItemIcon>
          <ListItemText primary="CHANNELS" style={{ color: "#8e9297" }} />
          {open ? (
            <ExpandLess className={classes.primary} />
          ) : (
            <ExpandMore className={classes.primary} />
          )}
        </ListItem>

        <Collapse in={open} timeout="auto">
          <List component="div" disablePadding>
            {channelList.map((channel) => {
                  
                  const isOwner = currentUser?.uid === channel.createdBy;

                  return (
                    <ListItem key={channel.id} className={classes.nested}>
                      <ListItemIcon style={{ minWidth: "30px" }}>
                        <BiHash
                          className={classes.iconDesign}
                          style={{ color: "#b9bbbe" }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          channel.channelName === channel.channelName.substr(0, 12)
                            ? channel.channelName
                            : `${channel.channelName.substr(0, 12)}...`
                        }
                        style={{ color: "#dcddde", cursor: "pointer" }}
                        onClick={() => goToChannel(channel.id)}
                      />

                      {isOwner && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteRoom(channel.id)}
                          style={{
                            color: "#ff4f4f",
                            transition: "color 0.2s ease",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = "#ff0000")}
                          onMouseOut={(e) => (e.currentTarget.style.color = "#ff4f4f")}
                          title="Delete this room"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                  })}
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default Rooms;
