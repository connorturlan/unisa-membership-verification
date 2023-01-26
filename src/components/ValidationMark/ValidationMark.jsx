import styles from "./ValidationMark.module.scss";
import { useEffect, useState } from "react";

function ValidationMark({ mark, colour }) {
	const [colourIndex, setColourIndex] = useState(0);

	const colourList = [
		"green",
		"yellow",
		"orange",
		"red",
		"purple",
		"blue",
		"lightblue",
	];

	const style = { backgroundColor: colour || colourList[colourIndex] };

	const changeColour = () => {
		setColourIndex((colourIndex + 1) % colourList.length);
	};

	return (
		<div
			style={style}
			className={styles.ValidationMark}
			onClick={changeColour}
		>
			<h1>{mark}</h1>
		</div>
	);
}

export default ValidationMark;
