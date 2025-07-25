const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Custom routes
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/machines/:id/metrics": "/energyReadings?machineId=:id",
    "/machines/:id/recommendations": "/recommendations?machineId=:id",
  })
);

// Add custom middleware for simulating real-time updates
server.use((req, res, next) => {
  if (req.method === "GET" && req.path === "/energyReadings") {
    // Simulate real-time data by adding random variations
    const data = router.db.get("energyReadings").value();
    const latestReading = { ...data[0] };

    latestReading.id = Date.now();
    latestReading.timestamp = new Date().toISOString();
    latestReading.powerConsumption *= 0.9 + Math.random() * 0.2; // ±10% variation
    latestReading.temperature *= 0.95 + Math.random() * 0.1; // ±5% variation

    router.db.get("energyReadings").push(latestReading).write();
  }
  next();
});

server.use(middlewares);
server.use(router);

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Access the API at http://localhost:${port}`);
});
