// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { Box, OrbitControls } from "@react-three/drei";
// import Icon from "../../components/AppIcon";

// const DigitalTwinPanel = ({ energyData, machines }) => {
//   return (
//     <div className="bg-card border border-border rounded-lg p-4 h-96">
//       <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
//         <Icon name="Cube" size={16} className="mr-2 text-primary" />
//         Jumeau Numérique
//       </h3>
//       <Canvas>
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} />
//         {machines.map((machine) => {
//           const entry = energyData.find((e) => e.machine_id === machine.id);
//           const color =
//             machine.status === "optimal"
//               ? "green"
//               : machine.status === "alert"
//               ? "red"
//               : "yellow";
//           return (
//             <Box
//               key={machine.id}
//               position={[Math.random() * 4 - 2, Math.random() * 4 - 2, 0]}
//               args={[0.5, 0.5, 0.5]}
//             >
//               <meshStandardMaterial color={color} />
//             </Box>
//           );
//         })}
//         <OrbitControls />
//       </Canvas>
//       <p className="text-sm text-muted-foreground mt-2">
//         Machines: {machines.length}, Actives:{" "}
//         {energyData.filter((e) => e.power_usage_kW > 0).length}
//       </p>
//     </div>
//   );
// };

// export default DigitalTwinPanel;
