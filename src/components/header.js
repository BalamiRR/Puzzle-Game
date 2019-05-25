import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import SharedStyle from '../util/SharedStyle'

const Header = props => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}> Puzzle  </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    marginBottom: SharedStyle.header.marginBottom,
    height: SharedStyle.header.height,
    backgroundColor: SharedStyle.color.secondaryBlack,
    marginTop: StatusBar.currentHeight
  },
  headerText: {
    fontSize:30,
    color: SharedStyle.color.white,
    textAlign: 'center'
  },
  // letterSize: {
  //   fontSize:20,
  //   color: SharedStyle.color.white,
  // }
});

export default Header;