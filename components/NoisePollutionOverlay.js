import React, {Component} from 'react';

import DeckGL, {ScreenGridLayer} from 'deck.gl';

export default class NoisePollutionOverlay extends Component {

  static get defaultViewport() {
    return {
      longitude: 29.1,
      latitude: 41.015,
      zoom: 10.2,
      maxZoom: 20,
      minZoom: 10,
      pitch: 0,
      bearing: 14.3
    };
  }

  render() {
    const {viewport, cellSize, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new ScreenGridLayer({
      id: 'grid',
      data,
      minColor: [0, 0, 0, 0],
      maxColor: [182,62,62, 255],
      getPosition: d => d,
      cellSizePixels: cellSize
    });

    return (
      <DeckGL {...viewport} layers={ [layer] } />
    );
  }
}
