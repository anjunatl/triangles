import React, { Component } from 'react'
import './App.css'

import AnnotationEditor from './AnnotationEditor'
import AnnotationsApi from './AnnotationsApi'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      annotationKey: '',
      annotationData: null
    }
  }

  async componentWillMount() {
    const annotationData = await AnnotationsApi.getAnnotation()
    this.setState({
      annotationKey: annotationData.id,
      annotationData: annotationData
    })
  }

  render() {
    return (
      <div className="App">
        <AnnotationEditor annotationData={this.state.annotationData} key={this.state.annotationKey}></AnnotationEditor>
      </div>
    )
  }
}

export default App
