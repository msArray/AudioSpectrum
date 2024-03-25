import { Spectrum } from './components/spectrum';
import { render } from "preact";
import './style.css';

export function App() {
	return (
		<>
			<Spectrum />
			<div style={{ position: 'absolute', right: 0, bottom: 0 }}>
				<p>Audio Spectrum by <a href="https://github.com/msArray">msArray</a></p>
				<p>Sample Audio by <a href="https://ikson.com/">Ikson</a> <a href="https://www.youtube.com/watch?v=QMOadtGpwlw&ab_channel=TELLYOURSTORYmusicbyikson%E2%84%A2">~New Day~</a></p>
			</div>
		</>
	);
}

render(<App />, document.body);