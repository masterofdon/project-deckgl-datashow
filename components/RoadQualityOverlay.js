/* global window */
import React, {Component} from 'react';
import DeckGL, {HexagonLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [28.430499 ,40.763982, 12000, 28.836189, 40.772722, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.5,
  lightsStrength: [0.8, 0.0, 0.6, 0.0],
  numberOfLights: 2
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 10};

const defaultProps = {
  radius: 600,
  upperPercentile: 100,
  coverage: 0.5
};

export default class RoadQualityOverlay extends Component {

  static get defaultColorRange() {
    return colorRange;
  }

  static get defaultViewport() {

    return {
      longitude: 29.1,
      latitude: 41.015,
      zoom: 10.2,
      maxZoom: 20,
      minZoom: 10,
      pitch: 45,
      bearing: 14.3
    };
  }

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
    this.zoomIntervalTimer = null;
    this.startZoomAnimateTimer = null;
    this.state = {
      elevationScale: elevationScale.min
    };
    this.zoom = 7;
    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);

  }

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();
    this._endAnimateZoom();
    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);    
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 50);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }

  _animateZoom(){
    if(this.props.viewport.zoom == this.props.viewport.maxZoom){
      this._endAnimateZoom();
    } else {
      this.setState({zoom : this.props.viewport.zoom + 0.3})
    }
  }

  _startAnimateZoom(){
    this.zoomIntervalTimer = window.setInterval(this._animateZoom,50);    
  }
  _endAnimateZoom(){
    window.clearTimeout(this.startZoomAnimateTimer);
    window.clearTimeout(this.zoomIntervalTimer);
  }

  render() {
    const {viewport, data, radius, coverage, upperPercentile} = this.props;

    if (!data) {
      return null;
    }

    const layers = [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        elevationRange: [0, 1200],
        elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: d => d,
        lightSettings: LIGHT_SETTINGS,
        onHover: this.props.onHover,
        opacity: 1,
        pickable: Boolean(this.props.onHover),
        radius,
        upperPercentile
      })
    ];

    return <DeckGL {...viewport} layers={layers} initWebGLParameters />;
  }
}

RoadQualityOverlay.displayName = 'RoadQualityOverlay';
RoadQualityOverlay.defaultProps = defaultProps;
