export interface SchoolInfo {
  departments: string[];
  levels: string[];
}

export const schoolsData: Record<string, SchoolInfo> = {
  "EM-LYON": {
    departments: ["BBA", "MSc", "MBA"],
    levels: ["1A", "2A", "3A"],
  },
  "KEDGE": {
    departments: ["BBA", "Programme Grande Ecole"],
    levels: ["L1", "L2", "M1", "M2"],
  },
};
