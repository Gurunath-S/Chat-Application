import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { FcGoogle } from "react-icons/fc";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import loginImg from "../Assets/login.png";
import { auth, provider } from "../Firebase/Firebase";

const useStyles = makeStyles((theme) => ({
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes slideUp": {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  root: {
    animation: "$fadeIn 1s ease-in-out",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    background: "linear-gradient(145deg, #0f0f0f, #1e1e2f)",
    borderRadius: "16px",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: "white",
  },
  paper: {
    animation: "$slideUp 1s ease-in-out",
    animationDelay: "0.2s",
    animationFillMode: "forwards",
    opacity: 0,
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    paddingTop: "40px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  mainImg: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
    transform: "scale(1)",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#ffffff",
    borderColor: "#00BFFF",
    fontWeight: "bold",
    padding: "10px 18px",
    fontSize: "16px",
    borderRadius: "30px",
    background: "linear-gradient(to right, #00BFFF, #BB86FC)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.08)",
      boxShadow: "0 0 18px #00BFFF",
      background: "linear-gradient(to right, #1ECBE1, #D178F0)",
    },
  },
  title: {
    animation: "$slideUp 1s ease-in-out",
    animationDelay: "0.4s",
    animationFillMode: "forwards",
    opacity: 0,
    marginBottom: "12px",
    fontWeight: 700,
    fontSize: "1.8rem",
    background: "linear-gradient(to right, #00BFFF, #BB86FC)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  subtitle: {
    animation: "$slideUp 1s ease-in-out",
    animationDelay: "0.6s",
    animationFillMode: "forwards",
    opacity: 0,
    color: "#c4c4c4",
    marginBottom: "20px",
    fontSize: "0.95rem",
    textAlign: "center",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: "16px",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonProgress: {
    color: "#ffffff",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));


function SignUp() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = () => {
    setIsLoading(true);
    setError(null);
    
    auth
      .signInWithPopup(provider)
      .then(() => {
        console.log("Sign-in successful");
      })
      .catch((err) => {
        console.error("Sign-in error:", err);
        setError("Failed to sign in. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container component="div" maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <img src={loginImg} className={classes.mainImg} alt="Welcome to Chatify" />
        
        <Typography variant="h4" className={classes.title}>
          Sign In To Chatify
        </Typography>
        
        <Typography variant="body2" className={classes.subtitle}>
          Connect with friends and join conversations
        </Typography>

        {error && (
          <Typography variant="body2" className={classes.error}>
            {error}
          </Typography>
        )}

        <div className={classes.buttonWrapper}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.submit}
            startIcon={<FcGoogle />}
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In With Google"}
          </Button>
          {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </div>
    </Container>
  );
}

export default SignUp;