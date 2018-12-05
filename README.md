△△ Triangles ▽▽
===

Idea
---
* Database of song reference notes
* v1 Goal: Timestamp-referenced note-taking
* Ideally: BPM-matched note-taking w/ hotkeys, midi, or audio support for more efficient note-taking

### Concepts
* Uploaded songs have an audio link, a bpm, a key, & a collection of Notes
* Notes are timestamped instances of Ideas
* Ideas are essentially taggable descriptions of things like sounds, rhytmns, chords, & emotions perceived while listening to the Song

There's a point in [EDMProd's interview with Anki](https://soundcloud.com/edmprod/episode99) that he mentions diving through the library of music that made impressions on him over his life, took notes on what in the song made it stick out to him, and then noticed patterns over time.

### Future Ideas?
* Soundcloud, YouTube link support instead of just file upload
* Rhythm programming using the web audio API
    * Specify or detect BPM
    * Optional metronome layer + timing-tuning offset control
    * Record (/quantize) taps + velocities using a microphone feed of the user tapping on a desk in a quiet room - listen to the sample w/ headphones on & drum away
    * [wavesurfer's microphone plugin](https://wavesurfer-js.org/plugins/microphone.html) for viz?

### Interesting reads along the way
* [Calling functions in time with a BPM - 2011](https://stackoverflow.com/questions/8333981/how-do-you-sync-javascript-animations-with-the-tempo-of-a-song-without-building)
* [Detecting tempo of a song using browser's Audio API - 2014](https://jmperezperez.com/bpm-detection-javascript/) - [[demo]](https://jmperezperez.com/beats-audio-api/)
* [Beatroot algorithm BPM detection in JS - 2017](https://github.com/killercrush/music-tempo) - [[docs]](https://killercrush.github.io/music-tempo/docs/index.html)
* [ToneJS Time](https://github.com/Tonejs/Tone.js/wiki/Time), [Transport](https://github.com/Tonejs/Tone.js/wiki/Transport), [Player (Sampler)](https://tonejs.github.io/docs/#Player)
* [wavesurfer.js backends - WebAudio vs MediaElement - 2017](https://github.com/katspaugh/wavesurfer.js/issues/676#issuecomment-278166199)
* [Interacting with Soundcloud's embed widget API](https://developers.soundcloud.com/docs/api/sdks#player)
    * [wavesurfer can't seem to read it, maybe](https://github.com/katspaugh/wavesurfer.js/issues/905)
* [wavesurfer plugin to load videos via video js](https://github.com/collab-project/videojs-wavesurfer#examples)

### Notes
* Currently using `MediaElement` for `wavesurfer.js`'s backend
    * When wavesurfer loads with a `cachedPeaks` array, with annotations, and without `backend=MediaElement` & `.load()`'s `preload=true`, the waveform will display without annotations until an interaction with the wavesurfer instance causes it to load

[△](https://twitter.com/mmmatches/status/1016870386682736641)