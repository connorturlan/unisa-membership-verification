import styles from "./MemberRow.module.scss";

function MemberRow({ email, date, status }) {
  let statusClass, statusText;
  switch (status) {
    case -1:
      statusText = "wait";
      break;
    case 0:
      statusClass = styles.Accepted;
      statusText = "ok";
      break;
    case 2:
      statusClass = styles.Duplicate;
      statusText = "ok*";
      break;
    default:
      statusClass = styles.Error;
      statusText = "error";
      break;
  }

  if (typeof status === "string") {
    statusText = status;
  }

  return (
    <div className={styles.MemberRow}>
      <p>{email}</p>
      <p>{date}</p>
      <p className={statusClass}>{statusText}</p>
    </div>
  );
}

export default MemberRow;
