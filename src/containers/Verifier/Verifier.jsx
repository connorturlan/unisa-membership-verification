import { useEffect, useState } from "react";
import styles from "./Verifier.module.scss";

import Accepted from "../../components/Accepted/Accepted.jsx";
import Rejected from "../../components/Rejected/Rejected.jsx";
import { setCookie, getCookie } from "../../utils/cookies";

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

function Verifier() {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isAccepted, setAccepted] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const pollDatabase = async (prehash) => {
    const hash = await sha256(prehash);

    // console.log("polling: ", hash);

    const res = await fetch(
      "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
      {
        method: "POST",
        body: JSON.stringify({ hash }),
      }
    );
    const json = await res.json();

    const accepted = (res.status === 200) | (res.status === 202);
    setAccepted(accepted);
    setSubmitted(true);

    // if accepted, give the user a cookie so they can safely refresh the page.
    if (accepted) {
      const cookie = prehash.toUpperCase();
      setCookie("accepted", cookie, 1);
      setSubmittedEmail(cookie);
    }

    // set the admin cookie if valid.
    if (res.status == 202) {
      setCookie("isAdmin", true, 1);
    } else {
      setCookie("isAdmin", "", 1);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    const name = ""; //e.target.name.value;
    const email = e.target.email.value;

    const prehash = (name + email).toLowerCase().replace(/\s/g, "");
    pollDatabase(prehash);
  };

  useEffect(() => {
    const cookie = getCookie("accepted");
    if (cookie !== "") {
      setAccepted(true);
      setSubmitted(true);
    }

    setSubmittedEmail(cookie);
  }, []);

  return (
    <form
      className={
        styles.entry +
        " " +
        (isSubmitted &&
          (isAccepted ? styles.entry__accepted : styles.entry__rejected))
      }
      onSubmit={submitForm}
    >
      <div class={styles.title}>
        <img className={styles.imageGoats} src="theGoats.JPG" alt="" />
        <h1>UniSA Volleyball Club</h1>
      </div>
      {!isAccepted && (
        <>
          <h2>Please enter the following details to verify your membership.</h2>
          <div className={styles.inputbar}>
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
            />
            <input className={styles.input} type="submit" value="submit" />
          </div>
        </>
      )}
      {isSubmitted && ((isAccepted && <Accepted />) || <Rejected />)}
      {isSubmitted && isAccepted && (
        <p className={styles.submittedEmail}>
          <b>{submittedEmail}</b>
        </p>
      )}
      <img className={styles.imageUnisa} src="unisaSport.png" alt="" />
      <h3>
        <a href="https://www.google.com">privacy</a>
      </h3>
    </form>
  );
}

export default Verifier;
