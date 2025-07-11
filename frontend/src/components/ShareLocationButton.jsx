
// import React from "react";

// const ShareLocationButton = () => {
//   const handleClick = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const res = await fetch("http://localhost:5000/api/location", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ latitude, longitude }),
//           });

//           if (res.ok) {
//             alert("Location shared successfully!");
//           } else {
//             alert("Failed to share location");
//           }
//         } catch (error) {
//           console.error("Error:", error);
//           alert("Something went wrong");
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         alert("Permission denied or failed to get location");
//       }
//     );
//   };

//   return (
//     <button onClick={handleClick}>
//       📍 Share Location
//     </button>
//   );
// };

// export default ShareLocationButton;
