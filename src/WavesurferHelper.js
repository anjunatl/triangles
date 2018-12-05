import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js'
import _ from 'underscore'

function getRegionsFromAnnotations(annotations) {
  return annotations.map(annotation => {
    return annotation.region
  })
}

function createWavesurferInstance(waveformElement) {
  return WaveSurfer.create({
    container: waveformElement,
    backend: 'MediaElement',
    responsive: true,
    plugins: [
      RegionsPlugin.create({
        regions: [],
        dragSelection: {
          slop: 5
        }
      })
    ]
  })
}

function randomColor(alpha) {
  return (
    'rgba(' +
    [
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      alpha || 1
    ] +
    ')'
  )
}

function attachWavesurferEvents(wavesurfer, savedRevions) {
  wavesurfer.on('region-click', _.partial(playRegionOnClick, wavesurfer))
  //wavesurfer.on('waveform-ready', _.partial(addSavedRegionsToWaveform, wavesurfer, savedRevions)) // waveform-ready doesn't fire if peaks is an array, for some reason
  wavesurfer.on('ready', _.partial(addSavedRegionsToWaveform, wavesurfer, savedRevions))

  function playRegionOnClick(wavesurfer, region, e) {
    e.stopPropagation()
    wavesurfer.stop()
    region.playLoop()
  }
}

function addSavedRegionsToWaveform(wavesurfer, savedRegions) {
    if (savedRegions && savedRegions.length > 0) {
      savedRegions.forEach(region => {
        region.color = randomColor(0.1)
        wavesurfer.addRegion(region)
      })
    }
}

function loadSongWithOrWithoutPeaks(wavesurfer, songUrl, peaks) {
  if (_.isEmpty(peaks)) {
    wavesurfer.load(songUrl, null, 'auto')
  } else {
    wavesurfer.load(songUrl, peaks, 'auto')
  }
}

function exportPeakData(wavesurfer) {
    // Defaults but with `nowindow=true`
    // https://wavesurfer-js.org/api/class/src/wavesurfer.js~WaveSurfer.html#instance-method-exportPCM
    return wavesurfer.exportPCM(1024, 10000, true, 0)
}

const WavesurferHelper = {
  getRegionsFromAnnotations,
  createWavesurferInstance,
  attachWavesurferEvents,
  randomColor,
  addSavedRegionsToWaveform,
  loadSongWithOrWithoutPeaks,
  exportPeakData
}

export default WavesurferHelper
