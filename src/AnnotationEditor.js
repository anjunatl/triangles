import React, { Component } from 'react'
import _ from 'underscore'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js'

class AnnotationEditor extends Component {
  constructor(props) {
    super(props)
    this.wavesurfer = null
    this.state = {
      songUrl: null,
      annotations: [],
      cachedPeaks: []
    }
  }

  togglePlayer() {
    this.wavesurfer.playPause()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.songUrl !== this.state.songUrl) {
      return true
    }

    console.log('Checking for annotations update.')
    if (!_.isEqual(nextState.annotations, this.state.annotations)) {
      console.time()
      console.log('nextState.annotations, this.state.annotations are not equal - equality check ran')
      return true
    }
    console.log('Finished checking for annotations update.')
    console.timeEnd()

    return true
  }

  render() {
    return (
      <div className='AnnotationEditor'>
        {this.props.annotationData && (
          <div className='container'>
            <div id='wavesurfer' />
            <button onClick={this.togglePlayer.bind(this)}>Start/Stop</button>
          </div>
        )}
      </div>
    )
  }

  componentDidMount() {
    const renderedEditorElement = document.querySelector('.AnnotationEditor')
    const waveformElement = document.querySelector('#wavesurfer')
    const wavesurferNeedsInitializing = !this.wavesurfer
    const canAttachWavesurfer = !!renderedEditorElement && !!this.props.annotationData

    if (wavesurferNeedsInitializing && canAttachWavesurfer) {
      const savedRegions = getRegionsFromAnnotations(this.props.annotationData.annotations)
      this.wavesurfer = createWavesurferInstance(savedRegions)

      if (_.isEmpty(this.state.cachedPeaks)) {
        loadSongAndSavePeakData.call(this, this.wavesurfer, this.props.annotationData.songUrl)
      } else {
        loadSongWithUrlAndPeakData.call(this, this.props.annotationData.songUrl, this.props.annotationData.cachedPeaks)
      }

      this.setState({
        songUrl: this.props.annotationData.songUrl,
        annotations: this.props.annotationData.annotations
      })

      /* TODO: I dislike that the wavesurfer init is using the props values but it was the 
      most straightforward thing I could figure out right now  it'd be nicer to save them 
      with setState then have the ws init use the state vars */

      function getRegionsFromAnnotations(annotations) {
        return annotations.map(annotation => {
          return annotation.region
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

      function createWavesurferInstance(savedRegions) {
        const wavesurfer = WaveSurfer.create({
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

        wavesurfer.on('waveform-ready', _loadSavedRegions)
        wavesurfer.on('region-click', _playRegionOnClick)
        // wavesurfer.on('region-click', _editRegionOnClick)

        return wavesurfer

        function _loadSavedRegions() {
          if (savedRegions && savedRegions.length > 0) {
            savedRegions.forEach(region => {
              region.color = randomColor(0.1)
              wavesurfer.addRegion(region)
            })
          }
        }

        function _playRegionOnClick(region, e) {
          e.stopPropagation()
          wavesurfer.stop()
          region.play()
        }

        // function _editRegionOnClick(region) {

        // }
      }

      function loadSongAndSavePeakData(wavesurfer, songUrl) {
        wavesurfer.load(songUrl, null, true)
        wavesurfer.on('ready', () => {
          // Defaults but with `nowindow=true`
          // https://wavesurfer-js.org/api/class/src/wavesurfer.js~WaveSurfer.html#instance-method-exportPCM
          const peaks = wavesurfer.exportPCM(1024, 10000, true, 0)
          this.setState({ cachedPeaks: peaks })
        })
      }

      function loadSongWithUrlAndPeakData(wavesurfer, songUrl, peaks) {
        wavesurfer.load(songUrl, peaks, true)
      }
    }
  }

  componentWillUnmount() {
    if (this.wavesurfer) {
      this.wavesurfer.destroyPlugin('regions')
      this.wavesurfer.destroy()
    }
  }
}

export default AnnotationEditor
