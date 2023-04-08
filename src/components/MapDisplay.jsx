import React, { Component, useEffect, useMemo, useState } from "react";
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
  triggerChangeFeatureColor,
  changeFeatureColor,
  blink,
}) => {
  const vectorSource = useMemo(() => {
    return new VectorSource({
      url: "https://cdn.rawgit.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
      format: new GeoJSON(),
    });
  }, []);

  const blinkDuration = 1500;

  useEffect(() => {
    console.log("function is passed !!!!!!!!!");
    const feature = changeFeatureColor().feature;
    const color = changeFeatureColor().color;
    console.log(feature, color);
    if (vectorSource) {
      blinkFeatureColorDisp(feature, "white");
      setTimeout(() => {
        changeFeatureColorDisp(feature, color);
        console.log("function is passed 2 !!!!!!!!!");
      }, blinkDuration + 500); // wait for 5 seconds
    }
  }, [triggerChangeFeatureColor]);

  useEffect(() => {
    const feature = blink.feature;
    const color = blink.color;
    console.log(feature, color);

    blinkFeatureColorDisp(feature, color);
  }, [blink]);

  const handleMapClick = (name) => {
    onFeatureClicked(name);
  };

  const landColorHexa = "#006400";

  const landStyle = new Style({
    fill: new Fill({
      color: landColorHexa,
    }),
  });

  const map = new Map({
    layers: [
      new VectorLayer({
        source: vectorSource,
        background: "#1a2b39",
        style: function (feature) {
          // const color = "#eeeeee";
          // landStyle.getFill().setColor(color);
          return landStyle;
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

  // a normal select interaction to handle click
  const select = new Select({ style: null });
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

  const changeFeatureColorDisp = (name, color) => {
    console.log("change feature color executed");
    vectorSource.forEachFeature((feature) => {
      if (feature.get("NAME") === name) {
        const newStyle = new Style({
          fill: new Fill({
            color: color,
          }),
        });
        feature.setStyle(newStyle);
      }
    });
  };

  const blinkFeatureColorDisp = (name, color) => {
    vectorSource.forEachFeature((feature) => {
      if (feature.get("NAME") === name) {
        const initStyle = new Style({
          fill: new Fill({
            color: color,
          }),
        });
        feature.setStyle(initStyle);
        const style = feature.getStyle();
        style.setFill(new Fill({ color: color }));
        const intervalId = setInterval(() => {
          const fill = style.getFill();
          if (fill.getColor() === color) {
            style.setFill(new Fill({ color: landColorHexa }));
          } else {
            style.setFill(new Fill({ color: color }));
          }
          feature.setStyle(style);
        }, 200);
        setTimeout(() => {
          clearInterval(intervalId);
        }, blinkDuration);
      }
    });
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
