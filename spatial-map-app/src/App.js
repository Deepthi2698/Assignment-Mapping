import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Popup, LayersControl, LayerGroup } from "react-leaflet";
import spatialData from "../src/spatialData.json";
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

const App = () => {
  const [layers, setLayers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    setLayers(spatialData.layers);
    setPolygons(spatialData.polygons);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <MapContainer center={[40.748817, -73.985428]} zoom={10} style={{ height: "100vh", width: "75%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LayersControl position="topright">
          <BaseLayer checked name="Map View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          {layers.map(layer => (
            <Overlay key={layer.id} checked name={layer.name}>
              <LayerGroup>
                {layer.points.map(point => (
                  <Marker key={point.id} position={point.coordinates}>
                    <Popup onOpen={() => setSelectedFeature(point)}>
                      <div>
                        <strong>{point.name}</strong>
                        <p>Coordinates: {point.coordinates.join(", ")}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </Overlay>
          ))}
          {polygons.map(polygon => (
            <Polygon key={polygon.id} positions={polygon.coordinates}>
              <Popup onOpen={() => setSelectedFeature(polygon)}>
                <div>
                  <strong>{polygon.name}</strong>
                  <p>Coordinates: {JSON.stringify(polygon.coordinates)}</p>
                </div>
              </Popup>
            </Polygon>
          ))}
        </LayersControl>
      </MapContainer>

      {/* Side panel to show details of the selected feature */}
      <div style={{ padding: "1em", width: "25%" }}>
        <h2>Selected Feature</h2>
        {selectedFeature ? (
          <div>
            <p><strong>ID:</strong> {selectedFeature.id}</p>
            <p><strong>Name:</strong> {selectedFeature.name}</p>
            <p><strong>Coordinates:</strong> {JSON.stringify(selectedFeature.coordinates)}</p>
          </div>
        ) : (
          <p>Click on a point or polygon to view details</p>
        )}
      </div>
    </div>
  );
};

export default App;
