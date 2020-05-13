import React, { Component } from "react";
import { Animated, View } from "react-native";

class Animations extends Component {
  constructor(props) {
    super(props);
    this.value = {
      styles: {
        slideY: {
          style: { transform: [{ translateY: props.from }] },
        },
        fade: {
          style: { opacity: props.from },
        },
        slideX: {
          style: { transform: [{ translateX: props.from }] },
        },
        scale: {
          style: { transform: [{ scale: props.from }] },
        },
        scaleX: {
          style: { transform: [{ scaleX: props.from }] },
        },
        scaleY: {
          style: { transform: [{ scaleY: props.from }] },
        },
      },
      methods: {
        timing: {
          start: () =>
            Animated.timing(props.from, {
              toValue: props.to,
              duration: props.duration,
              useNativeDriver: true,
              ...props.config,
            }).start(() => (props.callBack ? props.callBack(this) : null)),
        },
      },
    };
    this.name = props.name;
    this.method = props.method;
  }
  componentDidMount() {
    this.value.methods[this.method].start();
  }
  render() {
    return (
      <Animated.View
        style={{ ...this.props.style, ...this.value.styles[this.name].style }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default Animations;
