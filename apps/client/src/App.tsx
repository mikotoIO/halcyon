import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { MikotoClient } from "@mikoto-io/mikoto.js";

const mikoto = new MikotoClient({
	url: "http://localhost:9503",
	refreshToken: import.meta.env.VITE_MIKOTO_REFRESH_TOKEN,
});

(globalThis as any).mikoto = mikoto as any;

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vitejs.dev">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button
					type="button"
					onClick={() => {
						setCount((x) => x + 1);
					}}
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
