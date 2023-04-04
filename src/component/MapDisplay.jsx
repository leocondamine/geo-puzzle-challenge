import React from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const MapDisplay = () => {
  const map = new Map({
    target: "map-container",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
  return (
    <div>
      <div id="map-container" className="map absolute top-0 bottom-0 w-full"> map </div>
    </div>
  );
};

export default MapDisplay;
