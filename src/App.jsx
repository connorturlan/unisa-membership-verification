import { useEffect, useState } from "react";
import styles from "./App.module.scss";

import Manager from "./containers/Manager/Manager.jsx";
import Verifier from "./containers/Verifier/Verifier.jsx";
import { getCookie } from "./utils/cookies.js";

function App() {
  const [isAdmin, setAdmin] = useState(!!getCookie("isAdmin"));

  const onResponse = (e) => {
    console.log("response recieved.");
    setAdmin(!!getCookie("isAdmin"));
  };

  return (
    <div className={styles.App}>
      <div className={styles.Container}>
        <Verifier onResponse={onResponse} />
        {isAdmin && <Manager />}
      </div>
    </div>
  );
}

export default App;
