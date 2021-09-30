// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
import { useState, useEffect, useRef } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowDimensions]);

  return windowDimensions;
}

export function useOnClickAway(handler, debugMessage) {
  const node = useRef();

  const handleClick = (event) => {
    if (node.current.contains(event.target)) return;

    debugMessage && console.log(debugMessage);

    handler(event);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return node;
}
