import React, { Component } from "react"
import _ from "underscore"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/src/plugin/regions.js"

class AnnotationEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songUrl: null,
      annotations: [],
      cachedPeaks: []
    }

    this.wavesurfer = null
  }

  togglePlayer() {
    this.wavesurfer.playPause()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if the songurl changes, yes
    if (nextState.songUrl !== this.state.songUrl) {
      return true
    }

    // if the attributes are different, yes (?)
    console.log("Timing annotation equality:")
    console.time()
    if (!_.isEqual(nextState.annotations, this.state.annotations)) {
      console.log("nextState.annotations, this.state.annotations are not equal - equality check ran")
      return true
    }
    console.timeEnd()

    return true
  }

  render() {
    return (
      <div className="AnnotationEditor">
      {this.props.annotationData &&
        <div className="container">
          <div id="wavesurfer" />
          <button onClick={this.togglePlayer.bind(this)}>Start/Stop</button>
        </div>
      }
      </div>
    )
  }

  componentDidMount(prevProps, prevState) {
    const renderedEditorElement = document.querySelector('.AnnotationEditor')
    const waveformElement = document.querySelector("#wavesurfer")
    const wavesurferNeedsInitializing = !this.wavesurfer
    const canAttachWavesurfer = !!renderedEditorElement && !!this.props.annotationData

    if (wavesurferNeedsInitializing && canAttachWavesurfer) {
      const savedRegions = getRegionsFromAnnotations(this.state.annotations)
      this.wavesurfer = createWavesurferInstance.call(this, savedRegions) // this might change into creating the instance then looping through adding annotations to get their IDs to store in memory
      
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
      most straightforward thing I could figure out right now 
      it'd be nicer to save them with setState then have the ws init use the state vars */

      function getRegionsFromAnnotations(annotations) {
        return annotations.map(annotation => {
          return annotation.region
        })
      }

      function createWavesurferInstance(savedRegions) {
        return WaveSurfer.create({
          container: waveformElement,
          backend: "MediaElement",
          responsive: true,
          plugins: [
            RegionsPlugin.create({
              regions: savedRegions,
              dragSelection: {
                slop: 5
              }
            })
          ]
        })
      }

      function loadSongAndSavePeakData(wavesurfer, songUrl) {
        wavesurfer.load(songUrl, null, true)
        wavesurfer.on("ready", () => {
          // Defaults but with `nowindow=true` - https://wavesurfer-js.org/api/class/src/wavesurfer.js~WaveSurfer.html#instance-method-exportPCM
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
      this.wavesurfer.destroyPlugin("regions")
      this.wavesurfer.destroy()
    }
  }
}

export default AnnotationEditor
