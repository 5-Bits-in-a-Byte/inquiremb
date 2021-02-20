import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, onClickAway, closeCallback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickAway();
        if (closeCallback) {
          closeCallback();
        }
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickAway, closeCallback]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function ClickAway({
  onClickAway,
  closeCallback,
  contents,
  ...rest
}) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onClickAway, closeCallback);

  return (
    <div ref={wrapperRef} {...rest}>
      {contents}
    </div>
  );
}
