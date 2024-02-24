import styles from "./App.module.scss";

import Manager from "./containers/Manager/Manager.jsx";
import Verifier from "./containers/Verifier/Verifier.jsx";

function App() {
  return (
    <div className={styles.App}>
      {window.location.pathname == "/admin" ? <Manager /> : <Verifier />};
    </div>
  );
}

export default App;
