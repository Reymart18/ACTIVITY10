import axios from "axios";

// Call your backend verify endpoint
export const verifyCheckin = (qrData) => {
  return axios.post(
    "http://localhost:5000/checkin/verify",
    { qrData }, // send the QR code data
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
  );
};
