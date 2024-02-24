import styles from "./Manager.module.scss";

function Manager(props) {
  const onFileUpload = (event) => {
    // Get The File From The Input
    let file = event.target.files[0];
    let filename = file.name;
    // Create A File Reader HTML5
    let reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function (e) {
      let data = e.target.result;
      let cfb = XLS.CFB.read(data, { type: "binary" });
      let wb = XLS.parse_xlscfb(cfb);
      // Loop Over Each Sheet
      wb.SheetNames.forEach(function (sheetName) {
        // Obtain The Current Row As CSV
        let sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
        let oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

        document.getElementById("file-contents").innerText = filename;
        document.getElementById("file-contents").innerHTML = sCSV;
        console.log(oJS);
      });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(file);
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
