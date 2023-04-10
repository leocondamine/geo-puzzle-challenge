import React, { Component, useEffect, useMemo, useState } from "react";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { DragBox, Select } from "ol/interaction";
import { Fill, Stroke, Style } from "ol/style";
import { platformModifierKeyOnly } from "ol/events/condition";
import countries_simplified from "../maps/countries_simplified.json";

const MapDisplay = ({ onFeatureClicked, changeFeatureColor, blink }) => {
  const vectorSource = useMemo(() => {
    return new VectorSource({
      url: "https://cdn.rawgit.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
      features: new GeoJSON().readFeatures(countries_simplified),
      format: new GeoJSON(),
    });
  }, []);

  const blinkDuration = 1500;
  const landColorHexa = "#006400";
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    clearInterval(intervalId);
    // console.log(
    //   "=============== right after infinite i id ====================="
    // );
    // console.log(intervalId);
    console.log("===============passed==============");
    // if (changeFeatureColor) {
    const feature = changeFeatureColor.feature;
    const color = changeFeatureColor.color;
    const isInfinite = false;
    console.log(feature, color);
    if (vectorSource) {
      blinkFeatureColorDisp(feature, "white", isInfinite);
      setTimeout(() => {
        changeFeatureColorDisp(feature, color);
      }, blinkDuration + 300);
    }
    // }
  }, [changeFeatureColor]);

  useEffect(() => {
    const feature = blink.feature;
    const color = blink.color;
    const isInfinite = blink.isInfinite;
    console.log(isInfinite);
    blinkFeatureColorDisp(feature, color, isInfinite);
    setTimeout(() => {
      changeFeatureColorDisp(feature, landColorHexa);
      // console.log("function is passed 2 !!!!!!!!!");
    }, blinkDuration + 400);
  }, [blink]);

  const handleMapClick = (name) => {
    onFeatureClicked(name);
  };

  const landStyle = new Style({
    fill: new Fill({
      color: landColorHexa,
    }),
  });

  // a normal select interaction to handle click
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

  const blinkFeatureColorDisp = (name, color, isFinite) => {
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
        const intervalIdLocalScope = setInterval(() => {
          const fill = style.getFill();
          if (fill.getColor() === color) {
            style.setFill(new Fill({ color: landColorHexa }));
          } else {
            style.setFill(new Fill({ color: color }));
          }
          feature.setStyle(style);
        }, 400);
        console.log("====================================");
        console.log(intervalIdLocalScope);
        console.log("====================================");
        if (isFinite === false) {
          setTimeout(() => {
            console.log("stop blinking");
            console.log(intervalIdLocalScope);
            clearInterval(intervalIdLocalScope);
          }, blinkDuration);
        } else {
          setIntervalId(intervalIdLocalScope);
        }
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
