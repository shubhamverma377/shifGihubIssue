const milestoneMapping = [
  { 'Milestone 1': 1 },
  { 'Milestone 2': 2 },
  { 'Milestone 3': 3 },
  { 'Milestone 4': 4 },
  { 'Milestone 5': 5 },
  { 'Milestone 6': 6 },
  { 'Milestone 7': 7 },
  { 'Milestone 8': 8 },
  { 'Milestone 9': 9 },
  { 'Milestone 10': 10 },
  { 'Milestone 11': 11 },
  { 'Milestone 12': 12 },
  { 'Milestone 13': 13 },
  { 'Milestone 14': 14 },
  { 'Milestone 15': 15 },
  { 'Milestone 16': 16 },
  { 'Milestone 17': 17 },
  { 'Milestone 18': 18 },
  { 'Milestone 19': 19 },
  { 'Milestone 20': 20 },
  { 'QA Task Management': 21 },
  { 'Evolve 3.5 Months - Sprint 1': 22 },
  { 'Evolve 3.5 Months - Sprint 2': 23 },
  { 'PointingFish Security': 24 },
  { 'Fluied pilot priorities': 25 },
  { 'Flueid OCR Tuning': 26 },
  { 'Fluied pilot Final': 27 },
  { 'Release 1': 28 },
];

export const milestoneMap = (oldMs) => {
  // console.log(`Old --->`, oldMs);
  const msValue = milestoneMapping.find((ms) => {
    if (ms[`${oldMs}`] != undefined) {
      const mskey = ms[`${oldMs}`];
      return mskey;
    }
  });

  // console.log(`Milestone Value --->`, msValue[`${oldMs}`]);
  return msValue[`${oldMs}`];
};

// milestoneMap("Milestone 11");
