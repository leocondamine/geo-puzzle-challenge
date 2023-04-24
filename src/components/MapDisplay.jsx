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
  changeFeatureColor,
  blinkFeature,
  gameURL,
}) => {
  const vectorSource = useMemo(() => {
    return new VectorSource({
      url: gameURL,
      format: new GeoJSON(),
    });
  }, [gameURL]);

  const createFeatureStyle = (color) => {
    return new Style({
      fill: new Fill({
        color: color,
      }),
    });
  };
  const landColorHexa = "#006400";
  const landStyle = createFeatureStyle(landColorHexa);

  const vectorLayer = useMemo(() => {
    return new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        return landStyle;
      },
    });
  }, [vectorSource]);

  const map = useMemo(() => {
    return new Map({
      layers: [vectorLayer],
      target: "map",
      view: new View({
        center: [0, 0],
        zoom: 2,
        constrainRotation: 16,
      }),
    });
  }, [vectorLayer]);

  useEffect(() => {
    map.setTarget("map");
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
      const rotation = map.getView().getRotation();
      const oblique = rotation % (Math.PI / 2) !== 0;
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
    return () => {
      map.setTarget(null);
    };
  }, [map]);

  const handleMapClick = (name) => {
    onFeatureClicked(name);
  };

  const blinkDuration = 1500;
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    clearInterval(intervalId);
    console.log("===============passed==============");
    if (changeFeatureColor) {
      const feature = changeFeatureColor.feature;
      const color = changeFeatureColor.color;
      const isInfinite = false;
      console.log(feature, color);
      if (vectorSource) {
        blinkFeatureColorDisp(feature, "white", isInfinite);
        setTimeout(() => {
          changeFeatureColorDisp(feature, color);
        }, blinkDuration + 400);
      }
    }
  }, [changeFeatureColor]);

  useEffect(() => {
    const feature = blinkFeature.feature;
    const color = blinkFeature.color;
    const isInfinite = blinkFeature.isInfinite;
    console.log(isInfinite);
    blinkFeatureColorDisp(feature, color, isInfinite);
    setTimeout(() => {
      changeFeatureColorDisp(feature, landColorHexa);
      // console.log("function is passed 2 !!!!!!!!!");
    }, blinkDuration + 400);
  }, [blinkFeature]);

  const changeFeatureColorDisp = (name, color) => {
    vectorSource.forEachFeature((feature) => {
      if (feature.get("NAME") === name) {
        feature.setStyle(createFeatureStyle(color));
      }
    });
  };

  const blinkFeatureColorDisp = (name, color, isFinite) => {
    vectorSource.forEachFeature((feature) => {
      if (feature.get("NAME") === name) {
        feature.setStyle(createFeatureStyle(color));
        const intervalIdLocalScope = setInterval(() => {
          const currentFeatureStyle = feature.getStyle().getFill();
          if (currentFeatureStyle.getColor() === color) {
            feature.setStyle(landStyle);
          } else {
            feature.setStyle(createFeatureStyle(color));
          }
        }, 400);

        if (isFinite === false) {
          setTimeout(() => {
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
        className="map absolute bottom-0 top-0 w-full overflow-hidden"
      ></div>
      {/* <div className="absolute top-0 bottom-0">
        Selected regions: <span id="info">None</span>
      </div> */}
    </div>
  );
};

export default MapDisplay;
