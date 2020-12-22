export async function signup(props, username, email, password, setSeverity, setMessage) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if ("message" in responseJson) {
        props.history.push("/login");
      } else if ("error" in responseJson) {
        setMessage(responseJson.error);
        setSeverity("error");
      }
    })
    .catch((error) => {
      setMessage(error);
      setSeverity("error");
    });
}

export async function loginValidation(props, username, password, setSeverity, setMessage, setButtonEnabled) {
  const res = await fetch("/api/auth/signin", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if ("message" in responseJson) {
        if (props.location.state) {
          let destination = props.location.state.destinationPath;
          window.location.href = destination;
        } else props.history.push({ pathname: "/chats", state: { user: responseJson.user } });
      } else if ("error" in responseJson) {
        setSeverity("error");
        setMessage(responseJson.error);
        setButtonEnabled(true);
      }
    })
    .catch((error) => {
      setSeverity("error");
      setMessage(error);
      setButtonEnabled(true);
    });
}

