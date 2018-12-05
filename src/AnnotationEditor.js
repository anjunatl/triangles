import React, { Component } from 'react'
import _ from 'underscore'
import WavesurferHelper from './WavesurferHelper'

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
      const savedRegions = WavesurferHelper.getRegionsFromAnnotations(this.props.annotationData.annotations)
      this.wavesurfer = WavesurferHelper.createWavesurferInstance(waveformElement)
      WavesurferHelper.attachWavesurferEvents(this.wavesurfer, savedRegions)

      if (_.isEmpty(this.state.cachedPeaks)) { 
        this.wavesurfer.on('waveform-ready', () => {
          this.setState({
            cachedPeaks: WavesurferHelper.exportPeakData(this.wavesurfer)
          })
        })
      }

      WavesurferHelper.loadSongWithOrWithoutPeaks(
        this.wavesurfer,
        this.props.annotationData.songUrl,
        this.props.annotationData.cachedPeaks
      )

      this.setState({
        songUrl: this.props.annotationData.songUrl,
        annotations: this.props.annotationData.annotations
      })

      /* TODO: I dislike that the wavesurfer init is using the props values but it was the 
      most straightforward thing I could figure out right now  it'd be nicer to save them 
      with setState then have the ws init use the state vars */
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
