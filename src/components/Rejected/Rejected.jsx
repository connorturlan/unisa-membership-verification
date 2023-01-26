import ValidationMark from "../ValidationMark/ValidationMark";
import styles from "./Rejected.module.scss";

function Rejected(props) {
	return <ValidationMark mark="✖" colour={"red"} />;
}

export default Rejected;
