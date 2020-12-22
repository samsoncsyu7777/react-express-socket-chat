import React, { useState, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardActionArea,
  IconButton,
  Collapse,
  Typography,
  Grid,
} from "@material-ui/core";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import { theme as myTheme } from "../themes/theme";

const Compress = require('compress.js')
const compress = new Compress()

const iconFileStyles = makeStyles((theme) => ({
  button: {
    fontWeight: 900,
    fontSize: 14,
    height: "2.5rem",
    borderRadius: 10,
    backgroundColor: myTheme.color.primaryBlue,
    color: myTheme.color.primaryWhite,
    border: 0,
    margin: "0rem 0.5rem 0rem 0.5rem",
  },
  inputFile: {
    margin: "0.5rem 0rem 0rem 0rem",
  },
  text: {
    fontWeight: 900,
    color: myTheme.color.primaryBlue,
    margin: "0.5rem 0.5rem 0.5rem 0.5rem",
  },
  inputText: {
    width: "73%",
    height: "2rem",
  },
}));

export const InputFile = ({ user, setUser, welcome, setWelcome, postFile, postWelcome, expanded, setExpanded }) => {
  const classes = iconFileStyles();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const hiddenFileInput = useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleSelectFile = event => {
    const filesUploaded = [...event.target.files];
    compress.compress(filesUploaded, {
      size: 0.03,
      quality: .75,
      maxWidth: 240,
      maxHeight: 240,
      resize: true,
    }).then((data) => {
      setSelectedImage(data[0].data);
      const editedUser = user;
      editedUser.picture = data[0].data;
      setUser(editedUser);
    }).catch((err) => {
      setShowAlert(true);
    })
  };

  const handleUploadClick = () => {
    setExpanded(!expanded);
    postFile();
  };

  const handleSubmit = () => {
    setExpanded(!expanded);
    postWelcome();
  };

  const handleChange = (e) => {
    setWelcome(e.target.value);
  };

  return (
    <Card >
      <Grid container justify="flex-end">
        <Button className={classes.button} onClick={handleClick}>
          Select an image
        </Button>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleSelectFile}
          style={{ display: 'none' }} />
        <Button className={classes.button} onClick={handleUploadClick}>UPLOAD</Button>
      </Grid>
      { showAlert && <a>Not an image file!</a>}
      <br />
      <Typography className={classes.text}>WELCOME MESSAGE:</Typography>
      <Grid container justify="flex-end">
        <input className={classes.inputText} type="text" value={welcome} onChange={handleChange} />
        <Button className={classes.button} onClick={handleSubmit}>SUBMIT</Button>
      </Grid>
    </Card>
  );
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    color: myTheme.color.myGreen,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

export const AvatarWithBadge = ({ avatar, username, badgeColor }) => {
  const src = "data:image/png;base64,".concat(avatar);

  return (
    <StyledBadge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      color={badgeColor}
      variant="dot"
    >
      <Avatar alt={username} src={src} />
    </StyledBadge>
  );
}

const cardsStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    minWidth: 200,
    margin: "0.5rem 0.5rem 0.5rem 0.5rem",
  },
  cardActionArea: {
  },
  label: {
    fontWeight: 900,
  },
  row: {
    direction: "row",
    height: "60px",
    borderRadius: 4,
    backgroundColor: myTheme.color.myCyan,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    padding: "0rem 0.7rem 0rem 0.7rem",
    color: myTheme.color.myBlue,
  },
  input: {
    fontWeight: 900,
    outlineWidth: 0,
    border: 0,
    width: "80%",
    backgroundColor: myTheme.color.myCyan,
    color: myTheme.color.myBlue,
  },
  textfieldFontWeight: {
    fontWeight: 900,
    fontSize: 16,
  },
  unread: {
    borderRadius: 30,
    fontWeight: 900,
    padding: "0.3rem 0.3rem 0.3rem 0.3rem",
    minWidth: "1.8rem",
    color: myTheme.color.primaryWhite,
    backgroundColor: myTheme.color.myBlue,
  },
}));

export const MyCard = ({ user, setUser, welcome, setWelcome, badgeColor, postFile, postWelcome, value, onChange }) => {
  const classes = cardsStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root} >
      <CardHeader
        avatar={
          <AvatarWithBadge badgeColor={badgeColor} avatar={user.picture} username={user.username} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon onClick={handleExpandClick} />
          </IconButton>
        }
        title={user.username}
        titleTypographyProps={{ className: classes.textfieldFontWeight }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <InputFile
          user={user}
          setUser={setUser}
          welcome={welcome}
          setWelcome={setWelcome}
          postFile={postFile}
          postWelcome={postWelcome}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </Collapse>
      <Typography className={classes.label} variant="h5">
        Chats
      </Typography>
      <Grid className={classes.row}>
        <SearchIcon className={classes.icon} />
        <input
          type="text"
          className={classes.input}
          placeholder="Search"
          value={value}
          onChange={onChange}
        />
      </Grid>
    </Card>
  );
}

export const UserCard = ({ user, badgeColor, selectUser, index, unreadsList }) => {
  const classes = cardsStyles();
  var unreadValue = 0;
  if (unreadsList) {
    var i;
    for (i = 0; i < unreadsList.length; i++) {
      if (unreadsList[i].friendId == user.id) {
        unreadValue = unreadsList[i].value;
      }
    }
  }

  return (
    <Card className={classes.root} >
      <CardActionArea
        className={classes.cardActionArea}
        onClick={e => { selectUser(e, index, badgeColor) }}
      >
        <CardHeader
          avatar={
            <AvatarWithBadge badgeColor={badgeColor} avatar={user.picture} username={user.username} />
          }
          action={unreadValue > 0 && <Grid><Button className={classes.unread}>{unreadValue}</Button></Grid>}
          title={user.username}
          titleTypographyProps={{ className: classes.textfieldFontWeight }}
          subheader={user.welcome}
        />
      </CardActionArea>
    </Card>
  );
}