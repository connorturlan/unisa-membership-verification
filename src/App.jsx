import { useState } from "react";
import reactLogo from "./assets/react.svg";
import style from "./App.module.scss";
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
		<div className={style.App}>
			<form className={style.entry} onSubmit={submitForm}>
				<h1>UniSA Volleyball Club</h1>
				<h2>
					Please enter the following details to verify your
					membership.
				</h2>
				<h2>
					<b>Notice</b>: Do not refresh this page.
				</h2>
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Full Name"
				/>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Email Address"
				/>
				<input type="submit" value="submit" />
				{isSubmitted && ((isAccepted && <Accepted />) || <Rejected />)}
				<h3>
					<a href="https://www.google.com">privacy</a>
				</h3>
			</form>
		</div>
		// <div className="App">
		//   <div>
		//     <a href="https://vitejs.dev" target="_blank">
		//       <img src="/vite.svg" className="logo" alt="Vite logo" />
		//     </a>
		//     <a href="https://reactjs.org" target="_blank">
		//       <img src={reactLogo} className="logo react" alt="React logo" />
		//     </a>
		//   </div>
		//   <h1>Vite + React</h1>
		//   <div className="card">
		//     <button onClick={() => setCount((count) => count + 1)}>
		//       count is {count}
		//     </button>
		//     <p>
		//       Edit <code>src/App.jsx</code> and save to test HMR
		//     </p>
		//   </div>
		//   <p className="read-the-docs">
		//     Click on the Vite and React logos to learn more
		//   </p>
		// </div>
	);
}

export default App;
