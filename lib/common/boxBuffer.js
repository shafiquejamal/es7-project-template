// uses code from https://stackoverflow.com/questions/238260/how-to-calculate-the-bounding-box-for-a-given-lat-lng-location

/**
 * @param {number} distance - distance (km) from the point represented by centerPoint
 * @param {array} centerPoint - two-dimensional array containing center coords [latitude, longitude]
 * @description
 *   Computes the bounding coordinates of all points on the surface of a sphere
 *   that has a great circle distance to the point represented by the centerPoint
 *   argument that is less or equal to the distance argument.
 *   Technique from: Jan Matuschek <http://JanMatuschek.de/LatitudeLongitudeBoundingCoordinates>
 * @author Alex Salisbury
*/

const degToRad = deg => deg * (Math.PI / 180);
const radToDeg = rad => (180 * rad) / Math.PI;

const getBoundingBox = (centerPoint, distance) => {
  var MIN_LAT, MAX_LAT, MIN_LON, MAX_LON, R, radDist, degLat, degLon, radLat, radLon, minLat, maxLat, minLon, maxLon, deltaLon;
  if (distance < 0) {
    return 'Illegal arguments';
  }
  // coordinate limits
  MIN_LAT = degToRad(-90);
  MAX_LAT = degToRad(90);
  MIN_LON = degToRad(-180);
  MAX_LON = degToRad(180);
  // Earth's radius (km)
  R = 6378.1;
  // angular distance in radians on a great circle
  radDist = distance / R;
  // center point coordinates (deg)
  degLat = centerPoint[0];
  degLon = centerPoint[1];
  // center point coordinates (rad)
  radLat = degToRad(degLat);
  radLon = degToRad(degLon);
  // minimum and maximum latitudes for given distance
  minLat = radLat - radDist;
  maxLat = radLat + radDist;
  // minimum and maximum longitudes for given distance
  minLon = void 0;
  maxLon = void 0;
  // define deltaLon to help determine min and max longitudes
  deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  if (minLat > MIN_LAT && maxLat < MAX_LAT) {
    minLon = radLon - deltaLon;
    maxLon = radLon + deltaLon;
    if (minLon < MIN_LON) {
      minLon = minLon + 2 * Math.PI;
    }
    if (maxLon > MAX_LON) {
      maxLon = maxLon - 2 * Math.PI;
    }
  } else { // a pole is within the given distance
    minLat = Math.max(minLat, MIN_LAT);
    maxLat = Math.min(maxLat, MAX_LAT);
    minLon = MIN_LON;
    maxLon = MAX_LON;
  }
  return [
    radToDeg(minLon),
    radToDeg(minLat),
    radToDeg(maxLon),
    radToDeg(maxLat),
  ];
};

export const boundedSquareLeaflet = (lat, lng, length, projection) => {
  const corners = getBoundingBox([lat, lng], length);
  const sw = [corners[1], corners[0]];
  const ne = [corners[3], corners[2]];
  const nw = [corners[3], corners[0]];
  const se = [corners[1], corners[2]];
  const pointsData = [sw, nw, ne, se, sw];
  return pointsData.map(point => [
    projection.latLngToLayerPoint([point[0], point[1]]).x,
    projection.latLngToLayerPoint([point[0], point[1]]).y,
  ]);
};
