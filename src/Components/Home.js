import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  "@keyframes fadeInUp": {
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  root: {
    paddingTop: "50px",
    paddingBottom: "25px",
    color: "#f0f0f0",
    animation: `$fadeInUp 0.8s ease`,
  },
  heading: {
    fontSize: "2.2em",
    fontWeight: "700",
    animation: `$fadeInUp 0.8s ease`,
  },
  subHeading: {
    fontSize: "1.6em",
    animation: `$fadeInUp 1s ease`,
  },
channelDiv: {
  padding: "15px",
  opacity: 0,
  transform: "translateY(20px)",
  animation: `$fadeInUp 0.6s ease forwards`,
  animationDelay: "var(--delay)", // We'll inject this dynamically
},

  channelContent: {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  padding: "25px",
  alignItems: "center",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
},
  square: {
  height: "80px",
  width: "80px",
  fontSize: "2rem",
  fontWeight: 600,
  background: "linear-gradient(135deg, #6a9ec0, #a8c0ff)",
  color: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "10px",
  transition: "all 0.3s ease",
},
  rootChannel: {
    height: "calc(100vh - 185px)",
    position: "relative",
    padding: "15px",
    overflowY: "scroll",
  },
 channelText: {
  paddingTop: "10px",
  fontSize: "1.2rem",
  fontWeight: "500",
  color: "#f0f0f0",
},

  channelCard: {
  background: "rgba(30, 36, 57, 0.6)", // glass-like
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  color: "rgb(220, 221, 222)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
},
}));


function Home() {
  const classes = useStyles();
  const [channels, setChannels] = useState([]);
  const history = useHistory();

  useEffect(() => {
    db.collection("channels")
      .orderBy("channelName", "asc")
      .onSnapshot((snapshot) => {
        setChannels(
          snapshot.docs.map((channel) => ({
            channelName: channel.data().channelName,
            id: channel.id,
          }))
        );
      });
  }, []);

  const goToChannel = (id) => {
    history.push(`/channel/${id}`);
  };

  return (
    <div style={{ backgroundColor: "rgb(34 39 59)" }}>
      <Grid container className={classes.root}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography component="h1" className={classes.heading}>
            Welcome to Group Chat
          </Typography>
          <Typography component="h1" className={classes.subHeading}>
            Effortless live chat to hangout with friends!
          </Typography>
        </Grid>
      </Grid>

      <Grid container className={classes.rootChannel}>
      {channels.map((channel, index) => (
        <Grid
          item
          xs={6}
          md={3}
          className={classes.channelDiv}
          key={channel.id}
          style={{ "--delay": `${index * 0.1}s` }}
        >
            <Card className={classes.channelCard}>
              <CardActionArea
                style={{ display: "flex" }}
                onClick={() => goToChannel(channel.id)}
              >
                <CardContent className={classes.channelContent}>
                  <Avatar
                    variant="square"
                    className={classes.square}
                    style={{ backgroundColor: "#6a9ec066" }}
                  >
                    {channel.channelName.substr(0, 1).toUpperCase()}
                  </Avatar>
                  <Typography className={classes.channelText}>
                    {channel.channelName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
