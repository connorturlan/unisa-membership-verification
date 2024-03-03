import * as XLSX from "xlsx";
import styles from "./Manager.module.scss";
import { useState } from "react";
import MemberRow from "../../components/MemberRow/MemberRow";
import { registerMembers } from "../../utils/database";
import { sha256 } from "../../utils/utils";
import { CircleLoader } from "react-spinners";
import { setCookie } from "../../utils/cookies";

const FS = "~";
const RS = "\n";

const extractMemberDataFromCSV = (rawtable) => {
  const raw = rawtable.split(RS);

  const title = raw[0].split(FS);
  const rows = raw.slice(1);

  const data = rows.map((rowstring) => {
    const row = rowstring.split(FS);
    return row.reduce((cell, col, index) => {
      cell[title[index]] = col;
      return cell;
    }, {});
  });

  return data;
};

function Manager(props) {
  const [members, setMembers] = useState([]);
  const [showSingleSubmit, setSingleSubmit] = useState(true);
  const [showBulkSubmit, setBulkSubmit] = useState(true);

  const onMembersUpload = (event) => {
    event.preventDefault();

    const files = event.target.files;
    const f = files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      let readData = XLSX.read(data, { type: "binary" });
      const wsname = readData.SheetNames[0];
      const ws = readData.Sheets[wsname];

      const dataRaw = XLSX.utils.sheet_to_csv(ws, { header: 1, FS, RS });
      const dataParse = extractMemberDataFromCSV(dataRaw);
      setMembers(dataParse);
    };

    reader.readAsBinaryString(f);
  };

  const postNewUser = async (e) => {
    e.preventDefault();
    setSingleSubmit(false);

    const email = e.target.email.value;
    const prehash = email.toLowerCase().replace(/\s/g, "");
    const datetime = new Date();
    datetime.setDate(datetime.getDate() + 1);
    const hash = await sha256(prehash);
    const date = datetime.toISOString();
    const member = { hash, date };

    const res = await registerMembers([member]);
    const resbody = await res.json();

    if (resbody[0] == 2) {
      window.alert("User already exists in database.");
    }

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

  const clearCookies = () => {
    setCookie("accepted", "");
    setCookie("isAdmin", "");
    location.reload(true);
  };

  return (
    <div className={styles.Manager}>
      <h1>Member Manager</h1>
      <div className={styles.buttonArea}>
        <button onClick={clearCookies}>Reset Login</button>
      </div>
      <h2>Add New Endorsed Member</h2>
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
          <CircleLoader size="20px" color="blue" />
        )}
      </form>
      <h2>Bulk Upload Member Details</h2>
      <input
        id="file-upload"
        className={styles.fileupload}
        type="file"
        onChange={onMembersUpload}
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
          <CircleLoader size="40px" color="blue" />
        )}
      </div>
    </div>
  );
}

export default Manager;
