// import React, { useState, useEffect } from "react";
// import socket from "socket.io-client";

// const serverUrl =
//   process.env.REACT_APP_DEVELOPMENT_MODE === "true"
//     ? "http://localhost:5000"
//     : process.env.REACT_APP_BACK_END_URL;

// const useSocket = (topic) => {
//   const [username, setUsername] = useState("");
//   const [isConnected, setConnected] = useState(false);
//   const [everyoneConnected, setEveryoneConnected] = useState(false);
//   const [roomId, setRoomId] = useState("");
//   const [loadingData, setLoadingData] = useState(false);
//   const [playerJoined, setPlayerJoined] = useState(false);
//   const [players, setPlayers] = useState([]);
//   const [meReady, setMeReady] = useState(false);
//   const [otherPlayerReady, setOtherPlayerReady] = useState(false);

//   useEffect(() => {
//     const client = socket.connect(serverUrl);
//     client.on("connect", () => {
//       console.log("user connected");
//       setConnected(true);
//     });
//     client.on("disconnect", () => {
//       console.log("user disconnected");
//       setConnected(false);
//     });
//     client.on("room-id", (id) => {
//       console.log(id);
//       setLoadingData(false);
//       setRoomId(id);
//     });

//     // maybe I should join the room here?

//     client.on("user-connected", (players) => {
//       setPlayers(players);
//       console.log(players);
//       if (Object.keys(players).length === 2) {
//         setPlayerJoined(true);
//       }
//     });

//     client.on("player-ready", (players) => {
//       setPlayers(players);
//       Object.entries(players).forEach(([player, values]) => {
//         if (values.ready === true) {
//           if (player === username.toString()) {
//             setMeReady(true);
//           } else setOtherPlayerReady(true);
//         }
//       });
//     });

//     client.on("room-is-full", () => {
//       console.log("the room is full");
//       // error handling if someone want to join a room which is full already
//     });

//     return () => client.disconnect();
//   }, []);

//   const getRoomId = (mode, boardSize, winLength, myChar) => {
//     setLoadingData(true);
//     const client = socket.connect(serverUrl);
//     client.emit("get-roomId", mode, boardSize, winLength, myChar);
//   };

//   const joinRoom = (roomId, mode, username) => {
//     setUsername(username);
//     const client = socket.connect(serverUrl);
//     client.emit("join-room", roomId, mode, username);
//   };

//   const setStatusReady = (roomId, mode, username) => {
//     const client = socket.connect(serverUrl);
//     client.emit("ready", roomId, mode, username);
//   }

//   return {
//     isConnected,
//     everyoneConnected,
//     roomId,
//     loadingData,
//     playerJoined,
//     players,
//     meReady,
//     otherPlayerReady,
//     getRoomId,
//     joinRoom,
//     setStatusReady
//   };
// };

// export default useSocket;
