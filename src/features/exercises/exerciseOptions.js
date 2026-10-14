// src/features/exercises/exerciseOptions.js
export const MUSCLE_LABELS = {
  pecho: "Pecho",
  espalda: "Espalda",
  lumbares: "Lumbares",
  hombros: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  antebrazos: "Antebrazos",
  cuadriceps: "Cuádriceps",
  isquios: "Isquiotibiales",
  gluteos: "Glúteos",
  gemelos: "Gemelos",
  aductores: "Aductores",
  abs: "Abdomen",
  cardio: "Cardio",
  full_body: "Cuerpo completo",
};

export const EQUIPMENT_LABELS = {
  barras: "Barras",
  mancuernas: "Mancuernas",
  maquinas: "Máquinas",
  poleas: "Poleas",
  banco: "Banco",
  peso_corporal: "Peso corporal",
  bandas: "Bandas",
  kettlebells: "Kettlebells",
  ninguno: "Ninguno",
};

export const TYPE_OPTIONS = [
  { value: "strength", label: "Fuerza" },
  { value: "cardio", label: "Cardio" },
];

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  descriptionMax: 1500,
  imageMB: 2,
  videoMB: 15,
  imageTypes: ["image/jpeg", "image/png", "image/webp"],
  videoTypes: ["video/mp4", "video/webm"],
};