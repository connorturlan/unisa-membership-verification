import ValidationMark from "../ValidationMark/ValidationMark.jsx";
import styles from "./Rejected.module.scss";

function Rejected(props) {
  return (
    <>
      <ValidationMark mark="✖" colour={"red"} />
      <div className={styles.shopitems}>
        <a
          href="https://www.unisasport.edu.au/Clubs/Volleyball/Groups"
          target="_blank"
        >
          Purchase Membership Here
        </a>
      </div>
    </>
  );
}

export default Rejected;
