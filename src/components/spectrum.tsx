import { Component, createRef } from "preact";
import { Application, Graphics } from "pixi.js";
import Music from "../assets/music.mp3";

export class Spectrum extends Component {
    config = {
        size: 800,
        circleMode: false
    }
    state = {
        playing: false,
    }
    audio: HTMLAudioElement;
    audioContext: AudioContext;
    nodeAnalyser: AnalyserNode;
    nodeSource: MediaElementAudioSourceNode;
    canv = createRef<HTMLCanvasElement>();
    app: Application;
    bars: Graphics[] = [];

    playAudio = () => {
        this.audioContext = new AudioContext();
        this.nodeAnalyser = this.audioContext.createAnalyser();

        this.nodeAnalyser.fftSize = 1024; // ここの値を大きくすると細かくなります 範囲 32~32768
        this.nodeAnalyser.smoothingTimeConstant = 0.85;
        this.nodeAnalyser.connect(this.audioContext.destination);

        this.setState({ playing: true });
        this.audio = new Audio(Music);

        this.nodeSource = this.audioContext.createMediaElementSource(this.audio);
        this.nodeSource.connect(this.nodeAnalyser);

        this.audio.play();
        (async () => {
            this.app = new Application();
            await this.app.init({
                canvas: this.canv.current,
                width: this.config.size,
                height: this.config.size,
                backgroundColor: 0x000000,
                antialias: true,
                //backgroundAlpha: 0,
            });

            for (let i = 0; i < this.nodeAnalyser.frequencyBinCount; i++) {
                const bar = new Graphics();
                bar.pivot.set(this.config.size / this.nodeAnalyser.frequencyBinCount / 2, 0);
                bar.rect(0, 0, this.config.size / this.nodeAnalyser.frequencyBinCount, 10);
                bar.fill(0xffffff/* * Math.random()*/); // ここで色をランダムにしています
                this.bars.push(bar);
            }

            this.bars.forEach((bar, i) => {
                if (!this.config.circleMode) {
                    bar.x = (i + 0.5) * this.config.size / this.nodeAnalyser.frequencyBinCount;
                    bar.y = this.config.size / 2;
                    bar.rotation = Math.PI;
                } else {
                    bar.x = 200 + 100 * Math.cos(2 * Math.PI * i / this.nodeAnalyser.frequencyBinCount);
                    bar.y = 200 + 100 * Math.sin(2 * Math.PI * i / this.nodeAnalyser.frequencyBinCount);
                    bar.rotation = 2 * Math.PI * i / this.nodeAnalyser.frequencyBinCount - Math.PI / 2;
                }
                this.app.stage.addChild(bar);
            });

            this.audio.play();

            this.app.ticker.add(() => {
                this.update();
            });
        })()
    }

    update = () => {
        const data = new Uint8Array(this.nodeAnalyser.frequencyBinCount);
        this.nodeAnalyser.getByteFrequencyData(data);
        this.bars.forEach((bar, i) => {
            bar.height = data[i];
        });
    }

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <button style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, margin: 'auto', height: 30, width: 120, display: this.state.playing && 'none' }} onClick={this.playAudio}>
                    Play
                </button>
                <canvas ref={this.canv} />
            </div>
        )
    }
}