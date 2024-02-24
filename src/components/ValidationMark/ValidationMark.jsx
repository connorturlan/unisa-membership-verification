import styles from "./ValidationMark.module.scss";
import { useEffect, useState } from "react";

function ValidationMark({ mark, colour, enabled }) {
  const [colourIndex, setColourIndex] = useState(0);

  const colourList = ["green", "blue", "white"];

  const style = {
    backgroundColor: colour || colourList[colourIndex],
  };

  const changeColour = () => {
    if (!enabled) return;

    setColourIndex((colourIndex + 1) % colourList.length);
  };

  return (
    <h1 style={style} className={styles.ValidationMark} onClick={changeColour}>
      {(colourIndex == colourList.length - 1 && (
        <img class={styles.image} src="unisa.png" />
      )) ||
        mark}
    </h1>
  );
}

export default ValidationMark;
