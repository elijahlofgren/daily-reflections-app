export default {

  // Begin adapted from https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /* Latitude/longitude spherical geodesy tools          (c) Chris Veness 2002-2017  */
  /*                                                     MIT Licence                 */
  /* www.movable-type.co.uk/scripts/latlong.html                                     */
  /* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-spherical.html        */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /** converts numeric degrees to radians */
  toRadians(number) {
    return number * (Math.PI / 180);
  },

  /**
   * Returns the distance between two GPS points (using haversine formula).
   *
   * @param   {LatLon} point - Latitude/longitude of source point.
   * @param   {LatLon} point - Latitude/longitude of destination point.
   * @returns {number} Distance between this point and destination point, in miles.
   *
   * @example
   *     var p1 = new LatLon(52.205, 0.119);
   *     var p2 = new LatLon(48.857, 2.351);
   *     var d = p1.distanceTo(p2); // 404.3 km
   */
  distanceTo(point1, point2) {
    const self = this;
    const radius = 6371e3; // Radius of earth in meters

    // a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
    // tanδ = √(a) / √(1−a)
    // see mathforum.org/library/drmath/view/51879.html for derivation

    const R = radius;
    const φ1 = self.toRadians(point1.lat);
    const λ1 = self.toRadians(point1.lon);
    const φ2 = self.toRadians(point2.lat);
    const λ2 = self.toRadians(point2.lon);
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2))
          + (Math.cos(φ1) * Math.cos(φ2)
          * Math.sin(Δλ / 2) * Math.sin(Δλ / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    const miles = d * 0.000621;
    const rounded = miles.toFixed(2);
    return rounded;
  },
  // End adapted from https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js

};

