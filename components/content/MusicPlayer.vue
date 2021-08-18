<template>
	<main
		class="music-player"
		:class="{ dark: dashboardDark, invert: audioPlayerDark }"
	>
		<div class="music-player__top">
			<button
				class="button"
				@click="toggle"
				@mouseenter="
					() => !hasStarted && !loggedIn && changeCursor('Click to unmute')
				"
				@mouseleave="changeCursor('')"
				:class="{
					'large-hit-area': !hasStarted && !loggedIn,
					'small-icon': !hasStarted
				}"
			>
				<svg-icon
					:name="!hasStarted ? 'muted' : musicPlaying ? 'pause' : 'play'"
				/>
			</button>
			<p>{{ title || songs[current].title }}</p>
		</div>

		<p class="music-player__time">
			{{ currentTime }}
		</p>

		<audio-spectrum-bars :animate="!hasStarted || musicPlaying" />

		<div class="music-player__canvas-container" ref="canvasContainer">
			<canvas ref="canvas" id="canvas"></canvas>
		</div>

		<audio-visualizer
			v-if="showAudioVisualizer"
			:audioData="audioData"
			:has-started="hasStarted"
			@clicked="$emit('clicked')"
		/>
	</main>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { MUSIC_PLAY_PAUSE, TEXT_CURSOR } from '~/model/constants'
import { MMSS } from '~/utils/HHMMSS'
import AudioVisualizer from '~/components/content/AudioVisualizer.vue'
import SimplexNoise from 'simplex-noise'
import AudioSpectrumBars from '~/components/content/AudioSpectrumBars.vue'

const filterData = (audioBuffer, samples) => {
	const rawData = audioBuffer
	const blockSize = Math.floor(rawData.length / samples)

	const getSummedValuesInSingleBlock = idx =>
		[...Array(blockSize)].reduce(
			(acc, _, idx2) => (acc += Math.abs(rawData[blockSize * idx + idx2])),
			0
		)

	return [...Array(samples)].map(
		(_, idx) => getSummedValuesInSingleBlock(idx) / blockSize
	)
}

export default {
	// extends: WindowContent,
	name: 'music-player',
	components: { AudioVisualizer, AudioSpectrumBars },
	props: {
		showAudioVisualizer: { type: Boolean, default: true },
		src: { type: String, default: '' },
		title: { type: String, default: '' },
		autoplay: { type: Boolean, default: false }
	},
	data() {
		return {
			// related to canvas and animation
			// placed here to be 'globally' available
			audioContext: null,
			analyser: null,
			dataArray: null,
			ctx: null,
			barWidth: null,
			BG_COLOR: null, // computed from css value
			WIDTH: null,
			HEIGHT: null,

			audio: null,
			loaded: false,
			current: 0,

			// playback values
			duration: null,
			progress: null,
			audioData: Array(20).fill(2),
			frame: 0,
			hasStarted: false,
			simplex: null,
			fakeTime: 0
		}
	},
	watch: {
		keyPressed(event) {
			if (event.code === 'Space') {
				this[MUSIC_PLAY_PAUSE.action](!this.musicPlaying)
			}
		},
		musicPlaying(playing) {
			if (this.musicPlaying) {
				this.audio.play().catch(err => console.warn(err))
				this.fadeIn()
				this.hasStarted = true
				this.updateData()
			} else {
				this.audio.pause()
			}
		},
		appTabUnfocused(appTabUnfocused) {
			if (appTabUnfocused) {
				this.audio.volume = 0
			} else {
				this.fadeIn()
			}
		}
	},
	computed: {
		...mapState(['appTabUnfocused', 'topMostWindow']),
		...mapState('ganniFm', ['songs', 'musicPlaying']),
		...mapState('user', ['keyPressed', 'loggedIn']),
		...mapState('utils', ['dashboardDark', '__prod__', 'audioPlayerDark']),
		currentTime() {
			return MMSS(this.progress)
		}
	},
	methods: {
		...mapActions('ganniFm', [MUSIC_PLAY_PAUSE.action]),
		...mapActions('utils', [TEXT_CURSOR.action]),
		playlist(n) {
			const newCurrent = this.current + n
			this.current =
				newCurrent === this.songs.length // reach last
					? 0 // start over
					: newCurrent < 0 // reach first
					? this.songs.length - 1 // start from last
					: newCurrent
			this.playNewSong()
		},
		toggle() {
			this[MUSIC_PLAY_PAUSE.action](!this.musicPlaying)
		},
		playNewSong() {
			this.audio.pause()
			this.audio.src = this.src || this.songs[this.current].src
			this.audio.currentTime = 0
			setTimeout(() => {
				if (this.musicPlaying) {
					this.audio.play().catch(err => console.warn(err))
					this.fadeIn()
				}
			}, 100)
		},
		setupCanvas() {
			const canvasContainer = this.$refs.canvasContainer
			const canvas = this.$refs.canvas

			// setup / style canvas
			const dpr = window.devicePixelRatio || 1
			canvas.width =
				parseInt(window.getComputedStyle(canvasContainer).width) * dpr
			canvas.height =
				parseInt(window.getComputedStyle(canvasContainer).height) * dpr
			this.ctx = canvas.getContext('2d')
			this.ctx.translate(-0.5, -0.5)
			this.ctx.scale(dpr, dpr)

			// setup audio context
			this.analyser = this.audioContext.createAnalyser()
			var buffer = this.audioContext.createBuffer(1, 1, 22050)
			var source = this.audioContext.createBufferSource()

			const src = this.audioContext.createMediaElementSource(this.audio)
			src.buffer = buffer
			src.connect(this.analyser)
			this.analyser.connect(this.audioContext.destination)
			this.analyser.fftSize = 256
			this.analyser.smoothingTimeConstant = 0.9
			const bufferLength = this.analyser.frequencyBinCount
			this.dataArray = new Uint8Array(bufferLength)

			this.WIDTH = canvas.width / dpr
			this.HEIGHT = canvas.height / dpr
			this.BG_COLOR = window.getComputedStyle(canvasContainer).backgroundColor

			this.barWidth = this.WIDTH / bufferLength + 3
		},
		/**
		 * https://www.mattmontag.com/web/unlock-web-audio-in-safari-for-ios-and-macos
		 */
		unlockAudioContext(audioCtx) {
			if (audioCtx.state !== 'suspended') return
			const b = document.body
			const events = ['touchstart', 'touchend', 'mousedown', 'keydown']
			const unlock = () => {
				audioCtx.resume().then(clean)
			}
			const clean = () => {
				events.forEach(e => b.removeEventListener(e, unlock))
			}
			events.forEach(e => b.addEventListener(e, unlock, false))
		},
		setLoadedState() {
			this.loaded = true
			const AudioContext = window.AudioContext || window.webkitAudioContext
			this.audioContext = new AudioContext()

			this.unlockAudioContext(this.audioContext) // fixes no-sound in safari

			// run first time audio gets played
			// this.audio.addEventListener('play', this.setupCanvas.bind(this), {
			// 	once: true
			// })

			this.duration = this.audio.duration

			if (this.autoplay) {
				this[MUSIC_PLAY_PAUSE.action](true)
			}
		},
		updateData() {
			const renderFrame = () => {
				if (!this.musicPlaying && this.dataArray.every(v => v === 0)) return
				requestAnimationFrame(renderFrame)

				this.progress = this.audio.currentTime
				this.$emit('progress', this.audio.currentTime)

				/**
				 * Kill switch
				 */
				return

				if (!this.showAudioVisualizer) return

				// be sure everything is hooked up and referencable
				if (!this.analyser || !this.ctx || !this.dataArray) return

				/**
				 * MAGIC:
				 */
				this.analyser.getByteFrequencyData(this.dataArray)

				if (this.frame % 5 === 0) {
					this.audioData = filterData(this.dataArray, 37)
						.map(x => x / 128)
						.filter((_, i) => i > 1 && i % 2 === 0)
				}

				this.frame++
			}

			renderFrame()
		},
		idleAnimation() {
			const tick = (t = 0) => {
				if (this.hasStarted) {
					return
				}

				requestAnimationFrame(tick)

				// if (this.frame % 5 === 0) {
				// 	this.audioData = filterData(
				// 		[...Array(37)].map((_, idx) =>
				// 			this.simplex
				// 				? this.simplex.noise2D(idx / 100, this.frame / 100) *
				// 				  (250 - idx * 5)
				// 				: 0
				// 		),
				// 		37
				// 	)
				// 		.map(x => x / 128)
				// 		.filter((_, i) => i > 1 && i % 2 === 0)
				// }

				this.audio.currentTime =
					Math.floor(t / 1000) % (this.audio.duration - 30) || 60

				this.$emit('progress', this.audio.currentTime)

				this.progress = this.audio.currentTime

				this.frame++
			}

			tick()
		},
		fadeIn() {
			let volume = 0
			const loop = () => {
				this.audio.volume = volume
				volume += 0.01
				if (volume <= 0.5) {
					requestAnimationFrame(loop)
				}
			}
			loop()
		},
		changeCursor(str) {
			this[TEXT_CURSOR.action]({ str })
		}
	},
	mounted() {
		this.audio = new Audio(this.src || this.songs[this.current].src)
		this.audio.crossOrigin = 'anonymous'
		this.audio.volume = 0.5
		this.audio.addEventListener(
			'canplaythrough',
			() => {
				this.audio.currentTime = 0
				this.setLoadedState()
			},
			{ once: true }
		)
		this.audio.addEventListener('ended', this.playlist.bind(this, 1))
		// this.simplex = new SimplexNoise(Math.random)

		if (!this.autoplay) {
			this.idleAnimation()
		}
	},
	beforeDestroy() {
		this.audio.pause()
		this[MUSIC_PLAY_PAUSE.action](false)
	}
}
</script>
