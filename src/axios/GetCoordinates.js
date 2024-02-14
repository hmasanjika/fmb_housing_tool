import axios from "axios";

const URL = "https://maps.googleapis.com/maps/api/geocode";
const key = "AIzaSyB-DDSMVD0rYKzP8e-ueH_6HGXBrHCDUzA";
//const key = "AIzaSyB__EtBVr1pwPt3gTKBgp83NocjBZ9lj8o";

const GetCoordinates = async (address) => {
  const addressInfos = await axios
    .get(`${URL}/json?address=${address}&key=${key}`)
    .then((res) => {
      return res.data.results[0];
    })
    .catch((error) => {
      return error;
    });
  return addressInfos;
};

export default GetCoordinates;
