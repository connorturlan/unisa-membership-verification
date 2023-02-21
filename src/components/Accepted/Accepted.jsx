import ValidationMark from "../ValidationMark/ValidationMark.jsx";
import styles from "./Accepted.module.scss";

function Accepted(props) {
	return <ValidationMark mark="✔" enabled={true} />;
}

export default Accepted;
