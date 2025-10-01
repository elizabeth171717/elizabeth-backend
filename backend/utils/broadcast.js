let universalMenuData = {
  restaurantName: "",
  sections: [],
};

let wss = null;

function initBroadcast(wsServer) {
  wss = wsServer;
}

function broadcastMenuUpdate(newMenu) {
  universalMenuData = newMenu;
  if (!wss) return; // no WebSocket server yet
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: "menu-update", data: universalMenuData }));
    }
  });
}

module.exports = { initBroadcast, broadcastMenuUpdate };
