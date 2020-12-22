import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", "Roboto"',
    fontSize: 12,
    h1: {
      // could customize the h1 variant as well
    }
  },
  palette: {
    primary: { main: "#44B700" },
    secondary: { main: "#AAAAAA" },
  },
  color: {
    myWhite: "#F0F0FF",
    myGreen: "#44B700",
    primaryWhite: "#FFFFFF",
    myCyan: "#CCEEFF",
    myBlue: "#2266FF",
    primaryBlue: "#3A8DFF",
    myGrey: "#888888",
    myBrown: "#888877",    
  }
});
