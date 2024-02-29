import { useEffect, useState } from "react";
import styles from "./Verifier.module.scss";

import Accepted from "../../components/Accepted/Accepted.jsx";
import Rejected from "../../components/Rejected/Rejected.jsx";
import { setCookie, getCookie } from "../../utils/cookies";
import { verifyMember } from "../../utils/database.js";
import { sha256 } from "../../utils/utils.js";
import { CircleLoader } from "react-spinners";

function Verifier({ onSubmit, onResponse }) {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isAccepted, setAccepted] = useState(false);
  const [showSpinner, setSpinner] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const pollDatabase = async (prehash) => {
    const hash = await sha256(prehash);

    const member = {
      hash,
      date: "",
    };
    const res = await verifyMember(member);

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
      setCookie("isAdmin", prehash, 1);
    }

    setSpinner(false);
    onResponse && onResponse();
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSpinner(true);
    setTimeout(() => setSpinner(false), 5000);
    onSubmit && onSubmit();

    const email = e.target.email.value;
    const prehash = email.toLowerCase().replace(/\s/g, "");

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
      <div className={styles.title}>
        <div className={styles.imageContainer}>
          <img className={styles.imageGoats} src="goatsIcon.jpg" alt="" />
        </div>
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
            {showSpinner ? (
              <CircleLoader size="34" color="blue" />
            ) : (
              <input className={styles.input} type="submit" value="submit" />
            )}
          </div>
        </>
      )}
      {isSubmitted && (isAccepted ? <Accepted /> : <Rejected />)}
      {(isSubmitted && isAccepted && (
        <p className={styles.submittedEmail}>
          <b>{submittedEmail}</b>
        </p>
      )) ||
        ""}
      <img className={styles.imageUnisa} src="unisaSport.png" alt="" />
    </form>
  );
}

export default Verifier;
