import type {
  ComparisonDraft,
  ComparisonPrefs,
} from "../types/comparison";

export const emptyDraft: ComparisonDraft = {
  routine: {
    workDaysPerWeek: 5,
    remoteDaysPerWeek: 0,
    workWeeksPerYear: 48,
  },

  homeA: {
    id: "a",
    name: "",
    annualRent: 0,
    oneWayMinutes: 0,
    oneWayTransportCost: 0,
    mode: "Bus",
  },

  homeB: {
    id: "b",
    name: "",
    annualRent: 0,
    oneWayMinutes: 0,
    oneWayTransportCost: 0,
    mode: "Mixed",
  },
};

export const demoDraft: ComparisonDraft = {
  routine: {
    workDaysPerWeek: 5,
    remoteDaysPerWeek: 0,
    workWeeksPerYear: 48,
  },

  homeA: {
    id: "a",
    name: "Yaba",
    annualRent: 2_400_000,
    oneWayMinutes: 35,
    oneWayTransportCost: 1_200,
    mode: "Bus",
  },

  homeB: {
    id: "b",
    name: "Ikorodu",
    annualRent: 1_500_000,
    oneWayMinutes: 95,
    oneWayTransportCost: 2_500,
    mode: "Mixed",
  },
};

export const defaultPrefs: ComparisonPrefs = {
  valueTimeEnabled: false,
  hourlyValue: 3_000,
};