import React, { Component } from "react";
import { View, Text, StyleSheet, 
  ActivityIndicator,Alert,TouchableOpacity, Dimensions } from "react-native";
import SharedStyle from "./src/util/SharedStyle";
import { hoverDropZone,selectDropZone, didGameOver, 
  didIwin, refreshBoard, refreshBalls,updateOrientation } from "./src/util";
import { Header, Hole, Ball } from "./src/components";
import { ScreenOrientation } from "expo";

ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN);

const initObj = {
  x: 0,
  y: 0,
  hovering: false,
  filled: false,
  color: SharedStyle.color.white,
  value: null,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holes: [],
      mainx: null,
      mainy: null,
      balls: [
        { id: 1, keyItem : 1, img:require('./image/tom_01.png'), selected: false },
        { id: 2, keyItem : 2, img:require('./image/tom_02.png'), selected: false },
        { id: 3, keyItem : 3, img:require('./image/tom_03.png'), selected: false },
        { id: 4, keyItem : 4, img:require('./image/tom_04.png'), selected: false },
        { id: 5, keyItem : 5, img:require('./image/tom_05.png'), selected: false },
        { id: 6, keyItem : 6, img:require('./image/tom_06.png'), selected: false },
        { id: 7, keyItem : 7, img:require('./image/tom_07.png'), selected: false },
        { id: 8, keyItem : 8, img:require('./image/tom_08.png'), selected: false },
        { id: 9, keyItem : 9, img:require('./image/tom_09.png'), selected: false },
        { id: 10, keyItem : 10, img:require('./image/tom_10.png'), selected: false },
        { id: 11, keyItem : 11, img:require('./image/tom_11.png'), selected: false },
        { id: 12, keyItem : 12, img:require('./image/tom_12.png'), selected: false },
      ]
    };
  }

  componentDidMount() {
    this.digHole();
  }

  digHole = () => {
    let _holes = [];
    for (let i = 0; i < 12; i++) {
      _holes.push(initObj);
    }
    this.setState({ holes: _holes });
  };

  handleLayout = e => {
    const { x, y } = e.nativeEvent.layout;
    this.setState({ mainx: x, mainy: y });
  };

  holeLayout = (x, y, i) => {
    var _holes = this.state.holes;
    _holes[i] = { ..._holes[i], x, y };
    this.setState({ holes: _holes });
  };

  handlePositionChanging = (itemX, itemY) => {
    let _holes = this.state.holes;

    _holes = hoverDropZone(
      _holes,
      itemX,
      itemY,
      SharedStyle.hole.width,
      SharedStyle.hole.height,
      SharedStyle.header.height
    );
    this.setState({ holes: _holes });
  };

  handleDrop = (ball, itemX, itemY) => {
    let _holes = this.state.holes;
    let _balls = this.state.balls;

    const result = selectDropZone(
      _holes,
      itemX,
      itemY,
      SharedStyle.hole.width,
      SharedStyle.hole.height,
      _balls,
      ball,
      SharedStyle.header.height
    );
    _holes = result.holes;
    _balls = result.balls;

    if (didGameOver(_holes)) {
      this.setState({ gameOver: true });
      if (didIwin(_holes)) {
        Alert.alert("GAME OVER", "You Win", [{ text: "OK" }], {
          cancelable: false
        });
      } else {
        Alert.alert("GAME OVER", "You Lose", [{ text: "OK" }], {
          cancelable: false
        });
      }
    }

    this.setState({ holes: _holes, balls: _balls });
  };

  handleRefreshGame = () => {
    let holes = refreshBoard(this.state.holes);
    let balls = refreshBalls(this.state.balls);
    this.setState({ holes: holes, balls: balls });
  };

  render() {
    const { holes, mainx, mainy, balls } = this.state;
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.gameContainer}>
          <View style={styles.boardContainer} onLayout={this.handleLayout}>
            {mainx !== null && mainy !== null
                ? holes.map((hole, i) => {
                  return (
                    <Hole
                      key={i}
                      mainx={mainx}
                      mainy={mainy}
                      index={i}
                      hole={hole}
                      onHoleLayout={this.holeLayout}
                    />
                  );
                })
              : <ActivityIndicator />}
          </View>

          <View style={    
            {width: SharedStyle.hole.width * 3 + SharedStyle.hole.borderWidth * 3,
            height: SharedStyle.hole.height * 3 + SharedStyle.hole.borderWidth * 3,
            flexWrap: "wrap",
            dimension: Dimensions.get("window").height < Dimensions.get("window").width/2
            }} >
            {mainx !== null && mainy !== null 
              ?  balls.map((item, i) => {
                return (
                  <Ball
                    key={i}
                    ball={item}
                    onPositionChanging={this.handlePositionChanging}
                    onDrop={this.handleDrop}
                  />
                );
              })
              : <ActivityIndicator />}
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => this.handleRefreshGame()}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center"
  },
  gameContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  boardContainer: {
    width: SharedStyle.hole.width * 3 + SharedStyle.hole.borderWidth * 3,
    height: SharedStyle.hole.height * 3 + SharedStyle.hole.borderWidth * 3,
    flexWrap: "wrap"
  },
  refreshButton: {
    width: "100%",
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    backgroundColor: SharedStyle.color.secondaryBlack
  },
  refreshButtonText: {
    fontSize: SharedStyle.text.regular,
    color: SharedStyle.color.white
  }
});

//make this component available to the app
export default App;