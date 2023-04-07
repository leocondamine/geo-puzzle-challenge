import React, { Component, useEffect, useState } from "react";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { DragBox, Select } from "ol/interaction";
import { Fill, Stroke, Style } from "ol/style";
import { platformModifierKeyOnly } from "ol/events/condition";

const MapDisplay = ({
  onFeatureClicked,
  passchangeFeatureColor,
  changeFeatureColor,
}) => {
  const initVectorSource = new VectorSource({
    url: "https://cdn.rawgit.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
    format: new GeoJSON(),
  });

  const [vectorSource, setVectorSource] = useState(initVectorSource);

  const gfeatures = vectorSource.getFeatures();
  console.log(gfeatures);

  useEffect(() => {
    console.log("function is passed !!!!!!!!!");
    console.log(changeFeatureColor);
    const feature = changeFeatureColor().feature;
    const color = changeFeatureColor().color;
    console.log(feature, color);
    if (vectorSource) {
      vchangeFeatureColor(feature, color);
      console.log("function is passed 2 !!!!!!!!!");
    }
  }, [passchangeFeatureColor]);

  const handleMapClick = (name) => {
    // changeFeatureColor(name); // change color to red
    onFeatureClicked(name);
  };

  const style = new Style({
    fill: new Fill({
      color: "#eeeeee",
    }),
  });

  const map = new Map({
    layers: [
      new VectorLayer({
        source: vectorSource,
        background: "#1a2b39",
        style: function (feature) {
          const color = feature.get("COLOR_BIO") || "#eeeeee";
          style.getFill().setColor(color);
          return style;
        },
      }),
    ],
    target: "map",
    view: new View({
      center: [0, 0],
      zoom: 2,
      constrainRotation: 16,
    }),
  });

  // const selectedStyle = new Style({
  //   fill: new Fill({
  //     color: "rgba(255, 100, 255, 0.7)",
  //   }),
  //   stroke: new Stroke({
  //     color: "rgba(255, 255, 255, 0.7)",
  //     width: 2,
  //   }),
  // });

  // a normal select interaction to handle click
  const select = new Select();
  map.addInteraction(select);

  const selectedFeatures = select.getFeatures();

  // a DragBox interaction used to select features by drawing boxes
  const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
  });

  map.addInteraction(dragBox);

  dragBox.on("boxend", function () {
    const extent = dragBox.getGeometry().getExtent();
    const boxFeatures = vectorSource
      .getFeaturesInExtent(extent)
      .filter((feature) => feature.getGeometry().intersectsExtent(extent));

    // features that intersect the box geometry are added to the
    // collection of selected features

    // if the view is not obliquely rotated the box geometry and
    // its extent are equalivalent so intersecting features can
    // be added directly to the collection
    const rotation = map.getView().getRotation();
    const oblique = rotation % (Math.PI / 2) !== 0;

    // when the view is obliquely rotated the box extent will
    // exceed its geometry so both the box and the candidate
    // feature geometries are rotated around a common anchor
    // to confirm that, with the box geometry aligned with its
    // extent, the geometries intersect
    if (oblique) {
      const anchor = [0, 0];
      const geometry = dragBox.getGeometry().clone();
      geometry.rotate(-rotation, anchor);
      const extent = geometry.getExtent();
      boxFeatures.forEach(function (feature) {
        const geometry = feature.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        if (geometry.intersectsExtent(extent)) {
          selectedFeatures.push(feature);
        }
      });
    } else {
      selectedFeatures.extend(boxFeatures);
    }
  });

  // clear selection when drawing a new box and when clicking on the map
  dragBox.on("boxstart", function () {
    selectedFeatures.clear();
  });

  const infoBox = document.getElementById("info");

  selectedFeatures.on(["add", "remove"], function () {
    const names = selectedFeatures.getArray().map(function (feature) {
      return feature.get("NAME");
    });
    handleMapClick(names[0]);
    if (names.length > 0) {
      infoBox.innerHTML = names.join(", ");
    } else {
      infoBox.innerHTML = "None";
    }
  });

  // const newStyle = new Style({
  //   fill: new Fill({
  //     color: "blue",
  //   }),
  // });

  const vchangeFeatureColor = (name, color) => {
    console.log("change feature color executed");
    console.log(name);
    console.log(color);

    const features = vectorSource.getFeatures();
    // console.log(features);
    vectorSource.forEachFeature((feature) => {
      // console.log(feature);
      if (feature.get("NAME") === name) {
        const newStyle = new Style({
          fill: new Fill({
            color: color,
          }),
        });
        feature.setStyle(newStyle);
      }
    });
    // if (feature.get("NAME") === "Chile") {
    //   // create new style for the selected feature
    //   const newStyle = new Style({
    //     fill: new Fill({
    //       color: "red",
    //     }),
    //   });
    //   // store the original style in a property
    //   if (!feature.get("__oldStyle")) {
    //     feature.set("__oldStyle", feature.getStyle());
    //   }
    //   // set the new style for the selected feature
    //   feature.setStyle(newStyle);
    // } else {
    //   // reset the style of other features
    //   const oldStyle = feature.get("__oldStyle");
    //   if (oldStyle) {
    //     feature.setStyle(oldStyle);
    //   }
    // }
  };

  return (
    <div>
      <div
        id="map"
        className="map absolute top-0 bottom-0 w-full overflow-hidden"
      ></div>
      <div className="absolute top-0 bottom-0">
        Selected regions: <span id="info">None</span>
      </div>
    </div>
  );
};

export default MapDisplay;
