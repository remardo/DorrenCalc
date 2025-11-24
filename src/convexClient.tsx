import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

// Создаем клиент Convex
const convex = new ConvexReactClient(
  process.env.CONVEX_URL || "http://localhost:8000"
);

// Провайдер для React компонентов
export const ConvexProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

export default convex;