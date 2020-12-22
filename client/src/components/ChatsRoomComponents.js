import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Collapse,
  Typography,
  Grid,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { theme as myTheme } from "../themes/theme";
import InputEmoji from "react-input-emoji";
import { MdContentCopy } from 'react-icons/md';
import { AiOutlinePicture } from 'react-icons/ai';

const Compress = require('compress.js')
const compress = new Compress()
const imageCheckText = "A@P#I$C%T^U&R*E(";

const roomStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")]: {
      width: "350px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "350px",
    },
    [theme.breakpoints.up("md")]: {
      width: "550px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "750px",
    },
    [theme.breakpoints.up("xl")]: {
      width: "950px",
    },
    height: "90vh",
    margin: "0.5rem 0.5rem 0.5rem 0.5rem",
  },
}));

export const Room = ({ friend, userId, messages, lastMessageIndex, friendReadAll, badgeColor, setNewMessage }) => {
  const classes = roomStyles();
  const [searchMessageWord, setSearchMessageWord] = useState("");
  const [text, setText] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const wordOnChange = (e) => {
    setSearchMessageWord(e.target.value);
  };

  return (
    <Grid className={classes.root} >
      <RoomHeader
        friend={friend}
        badgeColor={badgeColor}
        searchMessageWord={searchMessageWord}
        wordOnChange={wordOnChange}
      />
      <RoomContent
        friend={friend}
        userId={userId}
        messages={messages}
        lastMessageIndex={lastMessageIndex}
        friendReadAll={friendReadAll}
        searchMessageWord={searchMessageWord}
      />
      <RoomInput 
        setShowAlert={setShowAlert}
        text={text}
        setText={setText}
        setNewMessage={setNewMessage}
      />
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => { setShowAlert(false); }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => { setShowAlert(false); }} severity="error">
          <Typography>Not an image file!</Typography>
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
}

const roomHeaderStyles = makeStyles((theme) => ({
  card: {
    margin: "0rem 0rem 0.5rem 0rem",
  },
  label: {
    fontWeight: 900,
  },
  row: {
    direction: "row",
    display: 'flex',
  },
  text: {
    padding: "0.5rem 0rem 0rem 0rem",
  },
  input: {
    fontWeight: 900,
    outlineWidth: 0,
    border: 0,
    width: "80%",
    backgroundColor: myTheme.color.myCyan,
    color: myTheme.color.myBlue,
    padding: "0rem 1.5rem 0rem 1.5rem",
  },
  searchRow: {
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
}));

export const RoomHeader = ({ friend, badgeColor, searchMessageWord, wordOnChange }) => {
  const classes = roomHeaderStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card elevation={4} className={classes.card}>
      <CardHeader
        avatar={
          <Typography className={classes.label} variant="h5">{friend.username}</Typography>
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon onClick={handleExpandClick} />
          </IconButton>
        }
        title={
          <Grid className={classes.row}>
            <FiberManualRecordIcon fontSize="small" color={badgeColor} />
            <Typography>Online</Typography>
          </Grid>
        }
        titleTypographyProps={{ className: classes.text }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid className={classes.searchRow}>
          <SearchIcon className={classes.icon} />
          <input
            type="text"
            className={classes.input}
            placeholder="Search"
            value={searchMessageWord}
            onChange={wordOnChange}
          />
        </Grid>
      </Collapse>
    </Card>
  );
}

const roomContentStyles = makeStyles((theme) => ({
  content: {
    height: "70vh",
    overflowY: "scroll",
  },
}));

export const RoomContent = ({ friend, userId, messages, lastMessageIndex, friendReadAll, searchMessageWord }) => {
  const classes = roomContentStyles();

  return (
    <Grid className={classes.content}>
      {
        messages.map((message, index) => {
          if (message.userId == userId
            && message.messageString.includes(searchMessageWord)) {
            return <SelfMessage
              friend={friend}
              message={message}
              index={index}
              lastMessageIndex={lastMessageIndex}
              friendReadAll={friendReadAll}
            />
          } else {
            return message.messageString.includes(searchMessageWord) && <FriendMessage
              friend={friend}
              message={message}
            />
          }
        })
      }
    </Grid>
  );
}

const roomInputStyles = makeStyles((theme) => ({
  typeInput: {
    direction: "row",
    height: "60px",
    borderRadius: 6,
    backgroundColor: myTheme.color.myCyan,
    display: 'flex',
    alignItems: 'center',
  },
  copy: {
    padding: "0rem 0.7rem 0rem 0.5rem",
    color: myTheme.color.myBrown,
  },
}));

export const RoomInput = ({ setShowAlert, text, setText, setNewMessage }) => {
  const classes = roomInputStyles();

  function handleOnEnter(text) {
    setNewMessage(text);
  }

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

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
      const imageText = imageCheckText + data[0].data
      setNewMessage(imageText);
    }).catch((err) => {
      setShowAlert(true);
    })
  };

  return (
    <Grid className={classes.typeInput}>
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Type something..."
      />
      <MdContentCopy className={classes.copy} size="27px" onClick={copyToClipboard(text)} />
      <AiOutlinePicture className={classes.copy} size="27px" onClick={handleClick} />
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleSelectFile}
        style={{ display: 'none' }} />
    </Grid>
  );
}

const friendMessageStyles = makeStyles((theme) => ({
  row: {
    direction: "row",
    display: 'flex',
    margin: "2rem 2rem 2rem 0rem",
  },
  avatar: {
    width: 32,
    height: 32,
    margin: "0rem 1rem 1rem 1rem",
  },
  message: {
    backgroundColor: myTheme.color.myBlue,
    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    color: myTheme.color.myWhite,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    fontSize: 16,
  },
  messageImage: {
    borderRadius: 8,
    borderTopLeftRadius: 0,
  },
}));

export const FriendMessage = ({ friend, message }) => {
  const classes = friendMessageStyles();
  const src = "data:image/png;base64,".concat(friend.picture);
  const time = message.updatedAt.match(/\d\d:\d\d/);
  var messageSrc = "";
  var isImage = false;
  if (message.messageString.includes(imageCheckText)) {
    messageSrc = "data:image/png;base64,".concat(message.messageString.split("@P#I$C%T^U&R*E(")[1]);
    isImage = true;
  }

  return (
    <Grid className={classes.row} >
      <Avatar className={classes.avatar} alt={friend.username} src={src} />
      <Grid>
        <Typography>{friend.username} {time}</Typography>
        {
          isImage ?
            <img className={classes.messageImage} alt="picture" src={messageSrc} />
            :
            <Typography className={classes.message}>{message.messageString}</Typography>
        }
      </Grid>
    </Grid>
  );
}

const selfMessageStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  time: {
    margin: "0.5rem 0rem 0rem 0rem",
  },
  avatar: {
    width: 20,
    height: 20,
    margin: "0.3rem 0rem 0rem 0rem",
  },
  message: {
    backgroundColor: myTheme.color.myCyan,
    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    borderRadius: 8,
    borderBottomRightRadius: 0,
    fontSize: 16,
  },
  messageImage: {
    borderRadius: 8,
    borderBottomRightRadius: 0,
  },
}));

export const SelfMessage = ({ friend, message, index, lastMessageIndex, friendReadAll }) => {
  const classes = selfMessageStyles();
  const src = friendReadAll ? "data:image/png;base64,".concat(friend.picture) : "";
  const time = message.updatedAt.match(/\d\d:\d\d/);
  var messageSrc = "";
  var isImage = false;
  if (message.messageString.includes(imageCheckText)) {
    messageSrc = "data:image/png;base64,".concat(message.messageString.split("@P#I$C%T^U&R*E(")[1]);
    isImage = true;
  }

  return (
    <Grid>
      <Grid className={classes.row}>
        <Typography className={classes.time} >{time}</Typography>
      </Grid>
      <Grid className={classes.row}>
        {
          isImage ?
            <img className={classes.messageImage} alt="picture" src={messageSrc} />
            :
            <Typography className={classes.message}>{message.messageString}</Typography>
        }
      </Grid>
      {
        lastMessageIndex == index && <Grid className={classes.row}>
          <Avatar className={classes.avatar} alt={friend.username} src={src} />
        </Grid>
      }
    </Grid>
  );
}