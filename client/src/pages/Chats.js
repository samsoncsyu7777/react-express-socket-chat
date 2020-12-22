import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  RootDiv,
} from "../components/SignupPictureComponents";
import {
  MyCard,
  UserCard,
} from "../components/ChatsUserCardsComponents";
import {
  Room,
} from "../components/ChatsRoomComponents";
import MySocket from "../socket/MySocket";

const chatsStyle = (theme) => ({
  column1: {
    width: "35%",
  },
});

function Chats(props) {
  const [user, setUser] = useState(props.location.state.user);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState(0);
  const [usersSearchWord, setUsersSearchWord] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersFullList, setUsersFullList] = useState([]);
  const [unreadsList, setUnreadsList] = useState([]);
  const [welcome, setWelcome] = useState("");
  const [onlineUsernamesList, setOnlineUsernamesList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserColor, setSelectedUserColor] = useState("primary");
  const [userIdArray, setUserIdArray] = useState([]);
  const [lastMessageIndex, setLastMessageIndex] = useState(0);
  const [connectSocketYet, setConnectSocketYet] = useState(false);
  const [friendReadAll, setFriendReadAll] = useState(false);
  const { connectSocket, sendMessage, disconnect } = MySocket();

  useEffect(() => {
    getAllMessages();
    setUnreadZero();
    if (connectSocketYet) {
      disconnect();
    }
    getOnlineUsers();
  }, [roomId]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setSelectedUser(usersFullList[0]);
    setSelectedUserColor("secondary");
  }, [usersFullList]);

  useEffect(() => {
    sendMessage(newMessage, user.id);
  }, [newMessage]);

  useEffect(() => {
    if (!selectedUser) {
      setSelectedUserColor("secondary");
      var i;
      for (i = usersFullList.length - 1; i >= 0; i--) {
        if (onlineUsernamesList.includes(usersFullList[i].username)) {
          setSelectedUser(usersFullList[i]);
          setSelectedUserColor("primary");
          i = -1;
        }
      }
      if (onlineUsernamesList.length < 1) {
        setSelectedUser(usersFullList[0]);
        setSelectedUserColor("secondary");
      }
    } else {
      if (onlineUsernamesList.includes(selectedUser.username)) {
        setSelectedUserColor("primary");
      } else {
        setSelectedUserColor("secondary");
      }
    }
  }, [onlineUsernamesList]);

  useEffect(() => {
    if (selectedUser) {
      if (selectedUser.id > user.id) {
        setUserIdArray([user.id, selectedUser.id]);
      } else {
        setUserIdArray([selectedUser.id, user.id]);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    if (userIdArray.length > 0) {
      getDialog();
    }
  }, [userIdArray]);

  useEffect(() => {
    var i;
    for (i = messages.length - 1; i >= 0; i--) {
      if (messages[i].userId == user.id) {
        setLastMessageIndex(i);
        i = -1;
      }
    }
    getFriendUnread();
  }, [messages]);

  const selectUser = (e, index, badgeColor) => {
    setSelectedUserColor(badgeColor);
    setSelectedUser(usersFullList[index]);
  };

  const onChangeUsersSearchWord = (e) => {
    setUsersSearchWord(e.target.value);
  };

  async function getDialog() {
    const res = await fetch("/api/user/getdialog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userIdArray: userIdArray
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setRoomId(responseJson.dialog.id);
        setMessages([]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function setUnreadZero() {
    var i;
    for (i = 0; i < unreadsList.length; i++) {
      if (unreadsList[i].friendId == selectedUser.id) {
        unreadsList[i].value = 0;
      }
    }
    const res = await fetch("/api/user/setunreadzero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dialogId: roomId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getFriendUnread() {
    const res = await fetch("/api/user/getfriendunread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dialogId: roomId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setFriendReadAll(responseJson.friendUnread == 0);
        console.log(responseJson.friendUnread);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function postFile() {
    const res = await fetch("/api/user/saveimage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        picture: user.picture,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function postWelcome() {
    const res = await fetch("/api/user/savewelcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        welcome: welcome,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getOnlineUsers() {
    const userId = user.id;
    const username = user.username
    setConnectSocketYet(true);
    connectSocket(roomId, userId, username, setMessages, messages, setUnreadZero, setOnlineUsernamesList);
  }

  async function getAllUsers() {
    const res = await fetch("/api/user/getallusers", {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var userlist = responseJson.users.rows;
        for (var i = 0; i < responseJson.users.rows.length; i++) {
          if (userlist[i].username == user.username) {
            userlist.splice(i, 1);
          }
        }
        setUnreadsList(responseJson.unreads.rows);
        setUsersFullList(userlist);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getAllMessages() {
    const res = await fetch("/api/user/getallmessages", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dialogId: roomId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setMessages(responseJson.messages.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const { classes } = props;

  return (
    <RootDiv paperPadding="40px">
      <Grid item className={classes.column1}>
        <MyCard
          badgeColor="primary"
          user={user}
          setUser={setUser}
          welcome={welcome}
          setWelcome={setWelcome}
          postFile={postFile}
          postWelcome={postWelcome}
          value={usersSearchWord}
          onChange={onChangeUsersSearchWord}
        />
        {
          selectedUser
          && selectedUser.username.includes(usersSearchWord)
          && <UserCard
            badgeColor={selectedUserColor}
            user={selectedUser}
            selectUser={() => { }}
          />
        }
        {
          usersFullList.map((item, index) => {
            return onlineUsernamesList.includes(item.username)
              && item.username.includes(usersSearchWord)
              && ((selectedUser && item.username != selectedUser.username) || !selectedUser)
              && <UserCard
                badgeColor="primary"
                user={item}
                selectUser={selectUser}
                index={index}
                unreadsList={unreadsList}
              />
          })
        }
        {
          usersFullList.map((item, index) => {
            return !onlineUsernamesList.includes(item.username)
              && item.username.includes(usersSearchWord)
              && ((selectedUser && item.username != selectedUser.username) || !selectedUser)
              && <UserCard
                badgeColor="secondary"
                user={item}
                selectUser={selectUser}
                index={index}
                unreadsList={unreadsList}
              />
          })
        }
      </Grid>
      <Grid item>
        {
          selectedUser && <Room
            badgeColor={selectedUserColor}
            friend={selectedUser}
            userId={user.id}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            lastMessageIndex={lastMessageIndex}
            friendReadAll={friendReadAll}
          />
        }
      </Grid>
    </RootDiv>
  );
}

export default withStyles(chatsStyle)(Chats);

