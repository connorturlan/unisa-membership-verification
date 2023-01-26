import { useState } from "react";
import reactLogo from "./assets/react.svg";
import styles from "./App.module.scss";
import Accepted from "./components/Accepted/Accepted.jsx";
import Rejected from "./components/Rejected/Rejected.jsx";

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

function App() {
	const [isSubmitted, setSubmitted] = useState(false);
	const [isAccepted, setAccepted] = useState(false);

	const pollDatabase = async (prehash) => {
		const hash = await sha256(prehash);

		console.log(hash);

		const res = await fetch(
			"https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
			{
				method: "POST",
				body: JSON.stringify({ hash }),
			}
		);
		const json = await res.json();

		setAccepted(json.isValid);
		setSubmitted(true);
	};

	const submitForm = (e) => {
		e.preventDefault();

		const name = e.target.name.value;
		const email = e.target.email.value;

		const prehash = (name + email).toLowerCase().replace(/\s/g, "");
		pollDatabase(prehash);
	};

	return (
		<div className={styles.App}>
			<form className={styles.entry} onSubmit={submitForm}>
				<h1>UniSA Volleyball Club</h1>
				<h2>
					Please enter the following details to verify your
					membership.
				</h2>
				<h2>
					<b>Notice</b>: Do not refresh this page.
				</h2>
				<input
					className={styles.input}
					type="text"
					name="name"
					id="name"
					placeholder="Full Name"
				/>
				<input
					className={styles.input}
					type="email"
					name="email"
					id="email"
					placeholder="Email Address"
				/>
				{!isSubmitted && (
					<input
						className={styles.input}
						type="submit"
						value="submit"
					/>
				)}
				{isSubmitted && ((isAccepted && <Accepted />) || <Rejected />)}
				<h3>
					<a href="https://www.google.com">privacy</a>
				</h3>
			</form>
		</div>
	);
}

export default App;
