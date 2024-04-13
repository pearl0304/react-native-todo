import {StyleSheet} from "react-native";
import {theme} from "./colors";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      paddingHorizontal: 20
    },
    header: {
      flexDirection: "row",
      marginTop: 100,
      justifyContent: "space-between"
    },
    btnText: {
      fontSize: 44,
      fontWeight: "bold",
    },
    input: {
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 30,
      marginVertical: 20,
      fontSize: 14
    },
    toDo: {
      flex:1,
      backgroundColor: theme.toDoBg,
      marginBottom: 10,
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 15,
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-between"
    },
    toDoText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500"
    },
  }
);

export {styles}