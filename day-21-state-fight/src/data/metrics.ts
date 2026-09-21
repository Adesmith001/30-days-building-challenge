import type {
  MetricDefinition,
  MetricId,
  StateData,
} from "../types/game";

const VERIFIED = "21 Sep 2026";

export const METRICS:
  Record<MetricId, MetricDefinition> = {
    area: {
      id: "area",

      battleName: "TERRITORY BATTLE",
      label: "LAND AREA",

      question:
        "WHO CONTROLS MORE LAND?",

      unit: "KM²",

      reference: "STATE AREA",

      sourceName:
        "List of Nigerian states by area · reference table",

      sourceUrl:
        "https://en.wikipedia.org/wiki/List_of_Nigerian_states_by_area",

      lastVerified: VERIFIED,

      higherWins: true,

      stateKey: "areaKm2",
    },

    population: {
      id: "population",

      battleName: "PEOPLE BATTLE",
      label: "POPULATION",

      question:
        "WHO HAS MORE PEOPLE?",

      unit: "PEOPLE",

      reference:
        "2022 PROJECTED POPULATION",

      sourceName:
        "NBS Annual Abstract of Statistics 2023 · Table 10",

      sourceUrl:
        "https://microdata.nigerianstat.gov.ng/index.php/catalog/180/download/1354/Annual_Abstract_2023.pdf",

      lastVerified: VERIFIED,

      higherWins: true,

      stateKey: "population2022",
    },

    density: {
      id: "density",

      battleName: "DENSITY BATTLE",

      label:
        "POPULATION DENSITY",

      question:
        "WHO PACKS MORE PEOPLE IN?",

      unit: "PEOPLE / KM²",

      reference:
        "DERIVED FROM 2022 POPULATION ÷ LAND AREA",

      sourceName:
        "Derived from NBS population and state area data",

      sourceUrl:
        "https://www.nigerianstat.gov.ng/",

      lastVerified: VERIFIED,

      higherWins: true,

      stateKey: "density2022",
    },

    igr: {
      id: "igr",

      battleName:
        "TREASURY BATTLE",

      label:
        "INTERNALLY GENERATED REVENUE",

      question:
        "WHO FILLED THE BIGGER TREASURY?",

      unit: "NAIRA",

      reference: "IGR · 2023",

      sourceName:
        "BudgIT State of States 2024",

      sourceUrl:
        "https://budgit.org/post_publications/state-of-states-2024-report-2/",

      lastVerified: VERIFIED,

      higherWins: true,

      stateKey: "igr2023",
    },

    lgas: {
      id: "lgas",

      battleName: "COUNCIL BATTLE",

      label:
        "LOCAL GOVERNMENT AREAS",

      question:
        "WHO HAS MORE LGAs?",

      unit: "LGAs",

      reference:
        "CONSTITUTIONALLY RECOGNISED LGAs",

      sourceName:
        "INEC state office and LGA directory",

      sourceUrl:
        "https://inecnigeria.org/about/state-offices/",

      lastVerified: VERIFIED,

      higherWins: true,

      stateKey: "lgas",
    },

    created: {
      id: "created",

      battleName: "LEGACY BATTLE",

      label:
        "STATE CREATION YEAR",

      question:
        "WHO BECAME A STATE FIRST?",

      unit: "YEAR",

      reference:
        "EARLIER YEAR WINS",

      sourceName:
        "Nigeria state creation chronology",

      sourceUrl:
        "https://en.wikipedia.org/wiki/List_of_Nigerian_states_by_date_of_statehood",

      lastVerified: VERIFIED,

      higherWins: false,

      stateKey: "createdYear",
    },
  };

export const METRIC_IDS =
  Object.keys(METRICS) as MetricId[];

export function getMetricValue(
  state: StateData,
  metricId: MetricId,
) {
  const metric =
    METRICS[metricId];

  return Number(
    state[metric.stateKey],
  );
}