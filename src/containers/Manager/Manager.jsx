import * as XLSX from "xlsx";
import styles from "./Manager.module.scss";
import { useState } from "react";
import MemberRow from "../../components/MemberRow/MemberRow";

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

const sha256 = async (s) => {
  // same as: py -c "from hashlib import sha256; print(sha256(bytes('', 'utf8')).hexdigest())"
  const msgBuffer = new TextEncoder().encode(s);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

function Manager(props) {
  const [members, setMembers] = useState([]);
  const [memberStatuses, setStatus] = useState([]);

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
      const mdata = extractMemberData(data);
      setMembers(mdata);
    };
    reader.readAsBinaryString(event.target.files[0]);
  };

  const postNewUsers = async () => {
    // # prehash = re.sub(r'\s+', "", ''.join(line.split(',')[:2]))
    // # name, email, date = (s.strip() for s in line.strip().split(','))
    // # userHash = hash_sha256(prehash)
    // email = row['Email'].strip()
    // date = row['Club Group Expiry']
    // emailHash = hash_sha256(email)
    const allPromises = members.map(async (row, i) => {
      let email = row["Email"];
      let date = row["Club Group Expiry"];
      let hash = await sha256(email);
      console.log(email, hash);
      // # post the data to the api, email only.
      // print(email, ">", emailHash, end='\t')
      // res = requests.post(
      // 	"https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
      // 	json={
      // 		"auth": AUTH_TOKEN,
      // 		"hash": emailHash,
      // 		"date": date,
      // 		"accessed": 0
      // 	})
      // print(res.status_code)
      const body = JSON.stringify({
        auth: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        hash,
        date,
        accessed: 0,
      });

      return setTimeout(
        async () =>
          await fetch(
            "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
            {
              method: "POST",
              body,
            }
          ).then((res) => {
            console.log(res.status);
            const newmembers = members.slice();
            newmembers[i]["Status"] = res.status;
            setMembers(newmembers);
          }),
        i * 100
      );
    });

    console.log("await...");
    await Promise.all(allPromises);
    console.log("sent!");
  };

  return (
    <div className={styles.Manager}>
      <h1>Member Manager</h1>
      <h2>Upload Member Details</h2>
      <input
        id="file-upload"
        className={styles.fileupload}
        type="file"
        onChange={onFileUpload}
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
      <button onClick={postNewUsers}>Post Members</button>
    </div>
  );
}

export default Manager;
