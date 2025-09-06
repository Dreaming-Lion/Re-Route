// src/components/common/Icon.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
export const Icon = ({ name, size = 20, color }: { name: any; size?: number; color?: string }) => (
  <Ionicons name={name} size={size} color={color} />
);
