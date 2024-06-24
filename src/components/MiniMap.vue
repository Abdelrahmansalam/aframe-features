<template>
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 200px; width: 200px;"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker :lat-lng="center">
        <l-popup>
          <span>This is the center of the mini map</span>
        </l-popup>
      </l-marker>
    </l-map>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  
  export default {
    name: "MiniMap",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
    },
    data() {
      return {
        zoom: 13,
        center: [51.505, -0.09],
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };
    },
  };
  </script>
  
  <style>
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
  </style>
  