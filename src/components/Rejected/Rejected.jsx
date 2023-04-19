import ValidationMark from "../ValidationMark/ValidationMark.jsx";
import styles from "./Rejected.module.scss";

function Rejected(props) {
	return <><ValidationMark mark="✖" colour={"red"} /><div className="shop-items"><a href="https://www.unisasport.edu.au/Clubs/Volleyball/Products/1581">Students</a><a href="https://www.unisasport.edu.au/Clubs/Volleyball/Products/1582">Non-Students</a></div></>;
}

export default Rejected;
