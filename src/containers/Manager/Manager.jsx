import { IO } from "@grapecity/spread-excelio";
import styles from "./Manager.module.scss";

const extractMemberData = (raw) => {
  console.log(raw);
  const sheets = raw.sheets;
  const membersTable = sheets.Members;
  const rawdata = membersTable.data.dataTable.map((row) => row.value);

  console.log("1");
  console.log(rawdata);

  const titles = rawdata[0];
  console.log(titles);
  console.log("1.5");
  const rows = rawdata.slice(1, rawdata.length() - 1);

  console.log("2");
  const data = rows.map((row) =>
    titles.reduce((o, title, i) => {
      o[title] = row[i];
      return o;
    }, {})
  );

  console.log(data);
};

const postNewUsers = (tableData) => {
  // # prehash = re.sub(r'\s+', "", ''.join(line.split(',')[:2]))
  // # name, email, date = (s.strip() for s in line.strip().split(','))
  // # userHash = hash_sha256(prehash)
  // email = row['Email'].strip()
  // date = row['Club Group Expiry']
  // emailHash = hash_sha256(email)
  // # post the hash to the api, name + email.
  // # print(prehash, ">", userHash, end='\t')
  // # res = requests.post(
  // #     "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
  // #     json={
  // #         "auth": AUTH_TOKEN,
  // #         "hash": userHash,
  // #         "date": date
  // #     })
  // # print(res.status_code)
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
};

function Manager(props) {
  const onFileUpload = (event) => {
    const excelIO = new IO();
    const deserializationOptions = {
      frozenRowsAsColumnHeaders: true,
    };
    Array.from(event.target.files).forEach((file) =>
      excelIO.open(file, (data) => {
        console.log("done");
        extractMemberData(data.sheet(0));
      })
    );
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
      <h3 id="file-name">name</h3>
      <p id="file-contents">contents</p>
    </div>
  );
}

export default Manager;
