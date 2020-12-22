import React from "react";
import {
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { theme as myTheme} from "../themes/theme";

const formColumnStyles = makeStyles((theme) => ({
  text: {
    padding: ".5rem 5% .5rem 5%",
  },
}));

export const FormColumn = (props) => {
  const classes = formColumnStyles();
  const { children, ...otherProps } = props;

  return (
    <Grid className={classes.text} item xs={12} sm container {...otherProps}>
      <Grid item xs container direction="column" spacing={0}>
        <Grid item xs>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

const changePageBoxStyles = makeStyles((theme) => ({
  account: {
    paddingTop: "0.5rem",
  },
  button: {
    borderRadius: 3,
    margin: "0rem 0rem 2rem 1rem",
    padding: ".5rem 1.5rem .5rem 1.5rem",
    minWidth: "7.8rem",
    boxShadow: "0px 0px 5px grey",
    textTransform: "none",
    fontWeight: 900,
    color: myTheme.color.primaryBlue,
  },
}));

export const ChangePageBox = ({ question, signIn, buttonText }) => {
  const classes = changePageBoxStyles();

  return (
    <Box display="flex" justifyContent="flex-end" m={1} p={1}>
      <a className={classes.account}>{question}</a>
      <Button
        className={classes.button}
        onClick={signIn}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

const textTitleStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: "1.5rem",
  },
}));

export const TextTitle = ({ textTitle }) => {
  const classes = textTitleStyles();

  return (
    <Typography className={classes.title} variant="h3">
      {textTitle}
    </Typography>
  );
};

const formInputStyles = makeStyles((theme) => ({
  question: {
    color: myTheme.color.myGrey,
  },
  input: {
    margin: ".5rem 0rem 1rem 0rem",
  },
  textfieldFontWeight: {
    fontWeight: 900,
  },
}));

export const FormInput = ({ text, type, value, onChange, placeholder }) => {
  const classes = formInputStyles();

  return (
    <>
      <Typography className={classes.question} color="secondary">{text}</Typography>
      <TextField
        className={classes.input}
        fullWidth
        placeholder={placeholder}
        type={type}
        variant="standard"
        InputProps={{
          classes: { input: classes.textfieldFontWeight }
        }}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

const myButtonStyles = makeStyles((theme) => ({
  continue: {
    borderRadius: 3,
    margin: "1rem 0rem 0rem 0rem",
    padding: ".5rem 1.5rem .5rem 1.5rem",
    minWidth: "8.2rem",
    textTransform: "none",
    fontWeight: 900,
    backgroundColor: myTheme.color.primaryBlue,
    color: myTheme.color.primaryWhite,
  },
}));

export const MyButton = ({ onClick, text }) => {
  const classes = myButtonStyles();

  return (
    <Button
      variant="contained"
      className={classes.continue}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const AlertSnackbar = ({ open, onClose, severity, usernameMessage, emailMessage, passwordMessage, successMessage, message }) => {

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity}>
        <div>{usernameMessage}</div>
        <div>{emailMessage}</div>
        <div>{passwordMessage}</div>
        <div>{successMessage}</div>
        <div>{message}</div>
      </Alert>
    </Snackbar>
  );
};