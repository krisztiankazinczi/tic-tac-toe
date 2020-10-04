const mainBackgroundColor = "rgb(23,34,44)";
const primaryMainColor = "#d500f9";
const mainTextColor = "#9BA8B5";

const theme = {
  palette: {
    primary: {
      light: "#dd33fa",
      main: "#d500f9",
      dark: "#9500ae",
      contrastText: "#fff",
    },
    secondary: {
      light: "#70d9e7",
      main: "#4dd0e1",
      dark: "#35919d",
      contrastText: "#fff",
    },
  },
  styles: {
    colors: {
      mainBackgroundColor: "rgb(23,34,44)",
      secondaryBackgroundColor: "#30445C",
      secondaryBackgroundColorHovered: "#3c5573",
      mainTextColor: "#9BA8B5",
      orangeColor: "#4dd0e1",
    },
    button: {
      backgroundColor: "#30445C",
      color: "#ff5733",
      cursor: "pointer",
      padding: '10px',
      "&:hover": {
        background: "#3c5573",
        transition: "100ms transform ease-in",
        transform: "scale(1.08)",
      },
    },
    centerToMiddle: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: mainBackgroundColor,
    },
    halfWidth: {
      width: '50%'  
    }
  },
};

export default theme;
