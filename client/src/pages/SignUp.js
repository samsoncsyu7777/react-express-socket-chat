import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import pic1 from "../assets/chat.png";
import {
  RootDiv,
  ImageColumn,
} from "../components/SignupPictureComponents";
import {
  FormColumn,
  ChangePageBox,
  TextTitle,
  FormInput,
  MyButton,
  AlertSnackbar,
} from "../components/SignupFormComponents";
import { loginValidation, signup } from "../methods/AuthMethods";

function SignUp(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [usernameMessage, setUsernameMessage] = useState(
    "Username requires at least 3 characters!"
  );
  const [emailMessage, setEmailMessage] = useState("Invalid email!");
  const [passwordMessage, setPasswordMessage] = useState(
    "Password needs 6 characters or more!"
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const pathname = props.location.pathname;

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
  }, [props.location.pathname]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const signIn = () => {
    props.history.push({
      pathname: props.location.pathname === "/signup" ? "/login" : "/signup",
      state: props.location.state,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (buttonEnabled) {
      setButtonEnabled(false);
      pathname === "/signup" ? signupValidation() : loginValidation(props, username, password, setSeverity, setMessage, setButtonEnabled);
      setOpenSnack(true);
    }
  };

  async function signupValidation() {
    setUsernameMessage(
      username.length < 3 ? "First name requires at least 3 characters!" : ""
    );
    setEmailMessage(/^\S+@\S+\.\S+$/.test(email) ? "" : "Invalid email!");

    setPasswordMessage(
      password.length > 5 ? "" : "Password needs 6 characters or more!"
    );

    var success = false;
    if (
      username.length >= 3 && /^\S+@\S+\.\S+$/.test(email) && password.length > 5
    ) {
      success = true;
    } else {
      success = false;
    }
    setSeverity(success ? "success" : "error");
    setMessage(success ? "Sign up successfully!" : "");
    setButtonEnabled(success ? false : true);

    if (success === true) {
      signup(props, username, email, password, setSeverity, setMessage);
    }
    setButtonEnabled(true);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const question =
    pathname === "/signup"
      ? "Already have an account?"
      : "Don't have an account?";
  const buttonText = pathname === "/signup" ? "Login" : "Sign up";
  const textTitle = pathname === "/signup" ? "Create an account." : "Login an account.";

  return (
    <RootDiv>
      <ImageColumn pic1={pic1} />
      <FormColumn>
        <ChangePageBox question={question} signIn={signIn} buttonText={buttonText} />
        <TextTitle textTitle={textTitle} />
        {pathname === "/signup" ? (
          <Grid item xs={12} sm={12} md={12} lg={10} xl={9}>
            <FormInput 
            text="Username" 
            type="username" 
            value={username} 
            onChange={onChangeUsername} 
            placeholder="john"
            />
            <FormInput 
            text="E-mail address" 
            type="email" 
            value={email} 
            onChange={onChangeEmail} 
            placeholder="john@com.ca"
            />
            <FormInput 
            text="Password" 
            type="password" 
            value={password} 
            onChange={onChangePassword} 
            placeholder="abc123"
            />
            <MyButton onClick={handleClick} text="Create" />
            <AlertSnackbar
              open={openSnack}
              onClose={handleClose}
              severity={severity}
              usernameMessage={usernameMessage}
              emailMessage={emailMessage}
              passwordMessage={passwordMessage}
              successMessage={successMessage}
            />
          </Grid>
        ) : (
            <Grid item xs={12} sm={12} md={12} lg={10} xl={9}>
              <FormInput 
              text="Username" 
              type="username" 
              value={username} 
              onChange={onChangeUsername} 
              placeholder="john"
              />
              <FormInput 
              text="Password" 
              type="password" 
              value={password} 
              onChange={onChangePassword} 
              placeholder="abc123"
              />
              <MyButton onClick={handleClick} text="Login" />
              <AlertSnackbar
                open={openSnack}
                onClose={handleClose}
                severity={severity}
                message={message}
              />
            </Grid>
          )}
      </FormColumn>
    </RootDiv>
  );
}

export default SignUp;
