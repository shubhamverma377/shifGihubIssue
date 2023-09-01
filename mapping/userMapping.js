// let userMapping = [
//   // {gitlab : github}
//   { garvitjain47B: 'sumeet47' },
//   { kalinkarchinmay: 'sumeet47' },
//   { SnehalAgrawal: 'sumeet47' },
//   { 'Sumeet-dhole': 'sumeet47' },
//   { 'gagandeep.chawla': 'sumeet47' },
//   { Satyendravis: 'sumeet47' },
//   { Deepak_Jodhwani: 'sumeet47' },
//   { Ajayjoshi05: 'sumeet47' },
//   { nikhilkucheriya: 'nikhilkucheriya' },
//   { Rohit47B: 'nikhilkucheriya' },
//   { 'devansh.shinde': 'nikhilkucheriya' },
//   // { "akash.jaiswal1": "akash.jaiswal1" },
//   { anujg47b: 'nikhilkucheriya' },
//   { shubh_47billion: 'nikhilkucheriya' },
//   { vineetkotiya47: 'nikhilkucheriya' },
//   { priyankashah: 'priyanka47b' },
//   { 'prakhar.malviya': 'priyanka47b' },
//   { 'mitali.rathore47': 'priyanka47b' },
//   { ChetanB47B: 'priyanka47b' },
//   { 'alka.singh': 'priyanka47b' },
//   { Praveen47Billion: 'priyanka47b' },
//   { 'ritesh.saraf': 'priyanka47b' },
//   { dipali321: 'priyanka47b' },
//   { DivyaGupta47: 'priyanka47b' },
//   { yogesh47b: 'nikhilkucheriya' },
//   { sunil47b: 'nikhilkucheriya' },
//   { 'sachin.gangil': 'nikhilkucheriya' },
//   { 'himanshu.tiwari': 'nikhilkucheriya' },
//   { adeshvyas: 'nikhilkucheriya' },
//   { 'nirmal.kushwah': 'nikhilkucheriya' },
//   { 'himanshu.muley': 'sumeet47' },
//   { 'rituja.luthra': 'sumeet47' },
//   { 'nishchay.chawla': 'sumeet47' },
//   { 'Simran-patidar47': 'sumeet47' },
//   // { ronnie47b: "ronnie47b" },
//   // { harsh47b: "harsh47b" },
//   // { ankitlele47B: "ankitlele47B" },
//   // { sakshi47: "sakshi47" },
//   // {"kartik47billion":"kartik47billion"}
//   // {"abhishek47billion":"abhishek47billion"}
// ];

let userMapping = [
  // {gitlab : github}
  { garvitjain47B: 'garvitjain47B' },
  { kalinkarchinmay: 'kalinkarchinmay' },
  { SnehalAgrawal: 'snehal47' },
  { 'Sumeet-dhole': 'sumeet47' },
  { 'gagandeep.chawla': 'chawla-gagandeep' },
  { Satyendravis: 'Satyendra47' },
  { Deepak_Jodhwani: 'Deepak47B' },
  { Ajayjoshi05: 'ajayjoshi47' },
  { nikhilkucheriya: 'nikhilkucheriya' },
  { Rohit47B: 'Rohit47B-RB' },
  { 'devansh.shinde': 'devanshshinde' },
  // { "akash.jaiswal1": "akash.jaiswal1" },
  { anujg47b: 'anuj47billion' },
  { shubh_47billion: 'shubhamverma47' },
  { vineetkotiya47: 'vineetkotiya' },
  { priyankashah: 'priyanka47b' },
  { 'prakhar.malviya': 'prakhar47b' },
  { 'mitali.rathore47': 'MitaliRathore47' },
  { ChetanB47B: 'ChetanB47B' },
  { 'alka.singh': 'alkasingh47B' },
  { Praveen47Billion: 'Praveen47Billion' },
  { 'ritesh.saraf': 'ritesh47billion' },
  { dipali321: 'Dipali-desai' },
  { DivyaGupta47: 'DivyaGupta47' },
  { yogesh47b: 'yogesh47' },
  { sunil47b: 'sunilchaurasia47' },
  { 'sachin.gangil': 'Sgangil47' },
  { 'himanshu.tiwari': 'HimanshuT47B' },
  { adeshvyas: 'adeshvyas' },
  { 'nirmal.kushwah': 'nirmalk47' },
  { 'himanshu.muley': 'himanshumuley1806' },
  { 'rituja.luthra': 'ritujaLuthra20' },
  { 'nishchay.chawla': 'nishchay47b' },
  { 'Simran-patidar47': 'Simran-patidar47' },
  // { ronnie47b: "ronnie47b" },
  // { harsh47b: "harsh47b" },
  // { ankitlele47B: "ankitlele47B" },
  // { sakshi47: "sakshi47" },
  // {"kartik47billion":"kartik47billion"}
  // {"abhishek47billion":"abhishek47billion"}
];

export const userMap = (oldUser) => {
  const userValue = userMapping.find((user) => {
    if (user[`${oldUser}`] != undefined) {
      const userkey = user[`${oldUser}`];
      return userkey;
    } else {
      return undefined;
    }
  });

  if (userValue === undefined) {
    return `null-${oldUser}`;
  } else {
    const value = userValue[`${oldUser}`];
    return value;
  }
};

// userMap("harsh47b");
