import React from "react";
import {
  Typography,
  Grid,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BsChatDots } from 'react-icons/bs';

import { theme as myTheme} from "../themes/theme";

const rootDivStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  paper: {
    padding: theme.spacing(0),
    margin: "auto",
    width: "Full",
    height: "100%",
    border: 0,
  },
  frame: {
    [theme.breakpoints.down("xs")]: {
      direction: "column",
    },
  },
}));

export const RootDiv = (props) => {
  const classes = rootDivStyles();
  const { children, paperPadding, ...otherProps } = props;

  return (
    <div className={classes.root} {...otherProps}>
      <Paper className={classes.paper} elevation={0} style={{ padding: paperPadding }}>
        <Grid className={classes.frame} container spacing={0}>
          {children}
        </Grid>
      </Paper>
    </div>
  );
};

const imageColumnStyles = makeStyles((theme) => ({
  responsive: {
    margin: "auto",
    objectFit: "cover",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: "700px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "400px",
      height: "100vh",
    },
    [theme.breakpoints.up("md")]: {
      width: "500px",
      height: "100vh",
    },
    [theme.breakpoints.up("lg")]: {
      width: "600px",
      height: "100vh",
    },
    [theme.breakpoints.up("xl")]: {
      width: "700px",
      height: "100vh",
    },
  },
  blue: {
    top: "0px",
    backgroundImage: "linear-gradient(to top, #3A8DFF, #86B9FF)",
    opacity: "85%",
  },
  iconOnImage: {
    top: "150px",
    color: myTheme.color.myWhite,
    height: "130px",
  },
  textOnImage: {
    top: "300px",
    textAlign: "center",
  },
  absolute: {
    position: "absolute",
  },
}));

export const ImageColumn = ({ pic1 }) => {
  const classes = imageColumnStyles();

  return (
    <Grid item>
      <img className={classes.responsive} alt="complex" src={pic1} />
      <Grid className={`${classes.blue} ${classes.responsive} ${classes.absolute}`}>
        <BsChatDots className={`${classes.iconOnImage} ${classes.responsive} ${classes.absolute}`} />
        <Typography className={`${classes.textOnImage} ${classes.responsive} ${classes.absolute}`} variant="h4" style={{ color: "white" }}>
          Converse with anyone<br />with any language
      </Typography>
      </Grid>
    </Grid>
  );
};