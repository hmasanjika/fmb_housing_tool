import { AddressCoordinates } from "../models/types";

export const getDistance = (
  latlngFrom: AddressCoordinates,
  latlngTo: AddressCoordinates
) => {
  const lat1 = latlngFrom.lat;
  const lon1 = latlngFrom.lng;
  const lat2 = latlngTo.lat;
  const lon2 = latlngTo.lng;
  const radius = 6371; // Radius of the earth in km
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * c; // Distance in km
  return distance.toFixed(2);
};
