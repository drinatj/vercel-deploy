import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    buttonLogin: {
      borderRadius: 15,
      backgroundColor: "#dabdbe",
      padding: "10px 25px",
      fontSize: "12px",
      color: "#1B2021",
      outline: "none",
      boxShadow: "0 5px #999",
      '&:hover' : {
        backgroundColor: "#dfa7a9"
      },
      '&:active' : {
        backgroundColor: "#dfa7a9",
        boxShadow: "0 5px #999",
        transform: "translateY(4px)",
      }
    },
    root: {
      padding: '2px 2px',
      display: 'flex',
      alignItems: 'center',
      width: 200,
      height: 30,
      border: "3px solid #dabdbe"
    },
    input: {
      marginLeft: "10px",
      flex: 1,
    },
    iconButton: {
      padding: 5,
    },
    divider: {
      height: 20,
      margin: 4,
    },
})