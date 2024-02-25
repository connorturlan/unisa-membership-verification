import * as XLSX from "xlsx";
import styles from "./Manager.module.scss";
import { useState } from "react";
import MemberRow from "../../components/MemberRow/MemberRow";
import { registerMembers } from "../../utils/database";
import { sha256 } from "../../utils/utils";
import { CircleLoader } from "react-spinners";

const extractMemberData = (raw) => {
  const allrows = raw.split("\n");
  const titles = allrows[0].split(",");
  const rows = allrows.slice(1);

  const data = rows.map((rowdata) =>
    titles.reduce((row, title, index) => {
      row[title] = rowdata.split(",")[index];
      return row;
    }, {})
  );

  return data;
};

function Manager(props) {
  const [members, setMembers] = useState([]);
  const [showSingleSubmit, setSingleSubmit] = useState(true);
  const [showBulkSubmit, setBulkSubmit] = useState(true);

  const onFileUpload = (event) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      const mdata = extractMemberData(data).map((row) => {
        row["Status"] = -1;
        return row;
      });
      setMembers(mdata);
    };
    reader.readAsBinaryString(event.target.files[0]);
  };

  const postNewUser = async (e) => {
    e.preventDefault();
    // setSingleSubmit(false);

    const email = e.target.email.value;
    const prehash = email.toLowerCase().replace(/\s/g, "");
    const datetime = new Date();
    datetime.setDate(datetime.getDate() + 1);
    const hash = await sha256(prehash);
    const date = datetime.toISOString();
    const member = { hash, date };
    // console.log(member);

    await registerMembers([member]);

    setSingleSubmit(true);
  };

  const postNewUsers = async () => {
    setBulkSubmit(false);

    const memberPromises = members.map(async (row) => {
      let email = row["Email"];
      let date = row["Club Group Expiry"];
      let hash = await sha256(email);
      return { hash, date };
    });

    const allMembers = await Promise.all(memberPromises);

    const res = await registerMembers(allMembers);

    const resbody = await res.json();

    const newMembers = members.slice();
    resbody.forEach((member, i) => {
      newMembers[i]["Status"] = member.statusCode;
    });
    setMembers(newMembers);

    console.log("sent!");
    setBulkSubmit(true);
  };

  return (
    <div className={styles.Manager}>
      <h1>Member Manager</h1>
      <h2>Add New Member</h2>
      <form className={styles.entryArea} onSubmit={postNewUser}>
        <input
          className={styles.input}
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
        />
        {showSingleSubmit ? (
          <input className={styles.input} type="submit" value="submit" />
        ) : (
          <CircleLoader size={20} color="blue" />
        )}
      </form>
      <h2>Bulk Upload Member Details</h2>
      <input
        id="file-upload"
        className={styles.fileupload}
        type="file"
        onChange={onFileUpload}
        text={"select exported member details"}
      />
      <div className={styles.filepreview} id="file-contents">
        <MemberRow email={"Email"} date={"Expiry"} status={"Status"} />
        {members.map((row, i) => (
          <MemberRow
            key={row["Email"]}
            email={row["Email"]}
            date={row["Club Group Expiry"]}
            status={row["Status"] || "wait"}
          />
        ))}
      </div>
      <div className={styles.buttonArea}>
        {showBulkSubmit ? (
          <button onClick={postNewUsers}>Post Members</button>
        ) : (
          <CircleLoader size={40} color="blue" />
        )}
      </div>
    </div>
  );
}

export default Manager;
