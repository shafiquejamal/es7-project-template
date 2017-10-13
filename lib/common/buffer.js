// Uses code from https://stackoverflow.com/questions/29734397/drawing-a-fixed-length-circle-in-d3-js

const getDestinationPoint = (latDeg, lonDeg, brngDeg, d) => {
  const R = 6371;
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;
  const brng = brngDeg * deg2rad;
  const lat = latDeg * deg2rad;
  const lon = lonDeg * deg2rad;
  const lat2 = Math.asin((Math.sin(lat) * Math.cos(d / R)) +
    (Math.cos(lat) * Math.sin(d / R) * Math.cos(brng)));
  const lon2 = lon + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat),
    Math.cos(d / R) - (Math.sin(lat) * Math.sin(lat2)));
  return [lat2 * rad2deg, lon2 * rad2deg];
};

export const circlePath = (lat, lon, radius, projection, nIntervals) => {
  const intervalAngle = (360 / nIntervals);
  const pointsData = [];
  for (let i = 0; i < nIntervals; i++) {
    pointsData.push(getDestinationPoint(lat, lon, i * intervalAngle, radius));
  }
  if (projection) {
    return pointsData.map(point =>
      [projection([point[1], point[0]])[0], projection([point[1], point[0]])[1]]
    );
  } else {
    return pointsData;
  }
};

export const circlePathLeaflet = (lat, lon, radius, projection, nIntervals) => {
  const intervalAngle = (360 / nIntervals);
  const pointsData = [];
  for (let i = 0; i < nIntervals; i++) {
    pointsData.push(getDestinationPoint(lat, lon, i * intervalAngle, radius));
  }
  if (projection) {
    return pointsData.map(point =>
      [projection.latLngToLayerPoint([point[0], point[1]]).x,
        projection.latLngToLayerPoint([point[0], point[1]]).y]
    );
  } else {
    return pointsData;
  }
};
