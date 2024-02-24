import styles from "./MemberRow.module.scss";

function MemberRow({ email, date, status }) {
  let statusClass;
  switch (status) {
    case 201:
      statusClass = styles.Accepted;
      break;
    case 409:
      statusClass = styles.Duplicate;
      break;
    default:
      statusClass = styles.Error;
      break;
  }
  return (
    <div className={styles.MemberRow}>
      <p>{email}</p>
      <p>{date}</p>
      <p className={statusClass}>{status}</p>
    </div>
  );
}

export default MemberRow;
