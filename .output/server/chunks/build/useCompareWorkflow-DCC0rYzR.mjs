import { c as useNuxtApp, u as useRuntimeConfig } from './server.mjs';
import { computed, toRef, isRef } from 'vue';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const COMPARE_STATUS = {
  COMPLETE: "complete"
};
const nowText = "Mar 13, 2026 at 1:38 PM";
const clone = (value) => JSON.parse(JSON.stringify(value));
const chPrefaceColumns = [
  { name: "fname_ch", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E14\u0E47\u0E01", type: "text" },
  { name: "lname_ch", label: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E40\u0E14\u0E47\u0E01", type: "text" },
  { name: "nickname_ch", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E48\u0E19\u0E40\u0E14\u0E47\u0E01", type: "text" },
  { name: "informant", label: "\u0E1C\u0E39\u0E49\u0E43\u0E2B\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", type: "text" },
  { name: "informantID", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E39\u0E49\u0E43\u0E2B\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", type: "select", options: ["H01", "H02", "H03", "H04", "H05", "H06"] },
  { name: "tam", label: "\u0E15\u0E33\u0E1A\u0E25", type: "text" },
  { name: "moo", label: "\u0E2B\u0E21\u0E39\u0E48", type: "text" },
  { name: "home", label: "\u0E1A\u0E49\u0E32\u0E19\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48", type: "text" },
  { name: "tel", label: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23", type: "text" },
  { name: "name_tel", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E40\u0E1A\u0E2D\u0E23\u0E4C", type: "text" },
  { name: "memid_tel", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23", type: "select", options: ["H01", "H02", "H03", "H04", "H05", "H06"] },
  { name: "nickname_1", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E48\u0E19\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25 1", type: "text" },
  { name: "fullname_1", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E15\u0E47\u0E21\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25 1", type: "text" },
  { name: "day_1", label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E21\u0E20\u0E32\u0E29\u0E13\u0E4C", type: "number" },
  { name: "month_1", label: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E21\u0E20\u0E32\u0E29\u0E13\u0E4C", type: "select", options: ["\u0E21.\u0E04.", "\u0E01.\u0E1E.", "\u0E21\u0E35.\u0E04.", "\u0E40\u0E21.\u0E22.", "\u0E1E.\u0E04.", "\u0E21\u0E34.\u0E22.", "\u0E01.\u0E04.", "\u0E2A.\u0E04.", "\u0E01.\u0E22.", "\u0E15.\u0E04.", "\u0E1E.\u0E22.", "\u0E18.\u0E04."] },
  { name: "timeS_1", label: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21", type: "text" },
  { name: "timeE_1", label: "\u0E40\u0E27\u0E25\u0E32\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14", type: "text" }
];
const b1Columns = [
  { name: "school_name", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19", type: "text" },
  { name: "grade", label: "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19", type: "text" },
  { name: "score", label: "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19", type: "number" },
  { name: "survey_date", label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", type: "date" },
  { name: "note_json", label: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 JSON", type: "json" }
];
const hhColumns = [
  { name: "head_name", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E2B\u0E31\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E04\u0E23\u0E31\u0E27\u0E40\u0E23\u0E37\u0E2D\u0E19", type: "text" },
  { name: "members", label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01", type: "number" },
  { name: "income_group", label: "\u0E01\u0E25\u0E38\u0E48\u0E21\u0E23\u0E32\u0E22\u0E44\u0E14\u0E49", type: "select", options: ["\u0E15\u0E48\u0E33", "\u0E01\u0E25\u0E32\u0E07", "\u0E2A\u0E39\u0E07"] },
  { name: "has_phone", label: "\u0E21\u0E35\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C", type: "select", options: ["0", "1"] }
];
const createChRows = (round) => [
  {
    CID: "202194100901",
    member_id: "001H05",
    round,
    fname_ch: round === 1 ? "\u0E2D\u0E31\u0E1F\u0E23\u0E34\u0E19" : "\u0E13\u0E31\u0E10\u0E10\u0E32\u0E23\u0E34\u0E19\u0E17\u0E23\u0E4C",
    lname_ch: round === 1 ? "\u0E21\u0E39\u0E23\u0E2D\u0E41\u0E21\u0E47\u0E07" : "\u0E27\u0E34\u0E0A\u0E32",
    nickname_ch: round === 1 ? "\u0E2D\u0E31\u0E1F\u0E23\u0E34\u0E19" : "\u0E13\u0E34\u0E0A\u0E32",
    informant: round === 1 ? "\u0E19\u0E35\u0E48" : "\u0E40\u0E21\u0E32\u0E30\u0E25\u0E34",
    informantID: round === 1 ? "H03" : "H01",
    tam: round === 1 ? "09" : "10",
    moo: round === 1 ? "01" : "05",
    home: round === 1 ? "60" : "115",
    tel: round === 1 ? "08-1735-4272" : "09-3794-8264",
    name_tel: round === 1 ? "\u0E19\u0E35\u0E48" : "\u0E1B\u0E32\u0E15\u0E35\u0E40\u0E21\u0E32\u0E30",
    memid_tel: round === 1 ? "H03" : "H06",
    nickname_1: round === 1 ? "\u0E0B\u0E39\u0E2E\u0E31\u0E22" : "\u0E40\u0E1F\u0E35\u0E22",
    fullname_1: round === 1 ? "\u0E0B\u0E39\u0E2E\u0E31\u0E22\u0E25\u0E32" : "\u0E42\u0E0B\u0E1F\u0E35\u0E22\u0E30\u0E2B\u0E4C",
    day_1: round === 1 ? "20" : "24",
    month_1: round === 1 ? "\u0E01.\u0E04." : "\u0E15.\u0E04.",
    timeS_1: round === 1 ? "11.00" : "09.16",
    timeE_1: round === 1 ? "12.50" : "10.15"
  },
  {
    CID: "202194100902",
    member_id: "001H02",
    round,
    fname_ch: "\u0E19\u0E39\u0E23\u0E35\u0E19",
    lname_ch: "\u0E21\u0E30\u0E22\u0E39\u0E42\u0E0B\u0E4A\u0E30",
    nickname_ch: "\u0E19\u0E39\u0E23\u0E35\u0E19",
    informant: "\u0E21\u0E32\u0E23\u0E14\u0E32",
    informantID: "H02",
    tam: "09",
    moo: "01",
    home: "72",
    tel: "08-0000-2222",
    name_tel: "\u0E21\u0E32\u0E23\u0E14\u0E32",
    memid_tel: "H02",
    nickname_1: "\u0E2D\u0E32\u0E2D\u0E35\u0E0B\u0E30\u0E2B\u0E4C",
    fullname_1: "\u0E2D\u0E32\u0E2D\u0E35\u0E0B\u0E30\u0E2B\u0E4C \u0E21\u0E30\u0E22\u0E39\u0E42\u0E0B\u0E4A\u0E30",
    day_1: "21",
    month_1: "\u0E01.\u0E04.",
    timeS_1: "10.00",
    timeE_1: "11.15"
  },
  {
    CID: "202194100903",
    member_id: "001H03",
    round,
    fname_ch: round === 1 ? "\u0E0B\u0E31\u0E25\u0E21\u0E32" : "\u0E0B\u0E31\u0E25\u0E21\u0E32\u0E19",
    lname_ch: "\u0E22\u0E39\u0E42\u0E0B\u0E4A\u0E30",
    nickname_ch: "\u0E0B\u0E31\u0E25",
    informant: "\u0E1A\u0E34\u0E14\u0E32",
    informantID: "H01",
    tam: "08",
    moo: "03",
    home: round === 1 ? "14" : "14/1",
    tel: "08-8888-3333",
    name_tel: "\u0E1A\u0E34\u0E14\u0E32",
    memid_tel: "H01",
    nickname_1: "\u0E2D\u0E31\u0E19\u0E27\u0E32",
    fullname_1: "\u0E2D\u0E31\u0E19\u0E27\u0E32 \u0E22\u0E39\u0E42\u0E0B\u0E4A\u0E30",
    day_1: "22",
    month_1: "\u0E01.\u0E04.",
    timeS_1: "13.00",
    timeE_1: round === 1 ? "14.00" : "14.10"
  },
  {
    CID: "202194100904",
    member_id: "001H04",
    round,
    fname_ch: "\u0E2E\u0E32\u0E0B\u0E31\u0E19",
    lname_ch: "\u0E14\u0E2D\u0E40\u0E25\u0E32\u0E30",
    nickname_ch: round === 1 ? "" : "\u0E0B\u0E31\u0E19",
    informant: "\u0E22\u0E32\u0E22",
    informantID: "H04",
    tam: "11",
    moo: "02",
    home: "91",
    tel: round === 1 ? null : "09-1111-4444",
    name_tel: "\u0E22\u0E32\u0E22",
    memid_tel: "H04",
    nickname_1: "\u0E21\u0E32\u0E23\u0E35\u0E41\u0E22",
    fullname_1: "\u0E21\u0E32\u0E23\u0E35\u0E41\u0E22 \u0E14\u0E2D\u0E40\u0E25\u0E32\u0E30",
    day_1: "23",
    month_1: "\u0E01.\u0E04.",
    timeS_1: "08.30",
    timeE_1: "09.25"
  },
  {
    CID: "202194100905",
    member_id: "001H05",
    round,
    fname_ch: "\u0E19\u0E39\u0E23\u0E2D\u0E31\u0E22\u0E19\u0E32",
    lname_ch: "\u0E2A\u0E32\u0E41\u0E25\u0E30",
    nickname_ch: "\u0E19\u0E32",
    informant: "\u0E41\u0E21\u0E48",
    informantID: "H02",
    tam: "10",
    moo: "07",
    home: "34",
    tel: "09-2222-5555",
    name_tel: "\u0E41\u0E21\u0E48",
    memid_tel: "H02",
    nickname_1: "\u0E2D\u0E31\u0E22\u0E19\u0E32",
    fullname_1: round === 1 ? "\u0E19\u0E39\u0E23\u0E2D\u0E31\u0E22\u0E19\u0E32 \u0E2A\u0E32\u0E41\u0E25\u0E30" : "\u0E19\u0E39\u0E23\u0E44\u0E2D\u0E19\u0E32 \u0E2A\u0E32\u0E41\u0E25\u0E30",
    day_1: "24",
    month_1: round === 1 ? "\u0E2A.\u0E04." : "\u0E01.\u0E04.",
    timeS_1: "15.00",
    timeE_1: "15.45"
  }
];
const createB1Rows = (round) => [
  { CID: "304460970101", round, school_name: round === 1 ? "\u0E1A\u0E49\u0E32\u0E19\u0E04\u0E25\u0E2D\u0E07\u0E43\u0E15\u0E49" : "\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19\u0E1A\u0E49\u0E32\u0E19\u0E04\u0E25\u0E2D\u0E07\u0E43\u0E15\u0E49", grade: "\u0E2D\u0E19\u0E38\u0E1A\u0E32\u0E25 2", score: round === 1 ? "8" : "9", survey_date: "2026-03-13", note_json: round === 1 ? '{"risk":false}' : '{"risk":true}' },
  { CID: "304460970102", round, school_name: "\u0E1A\u0E49\u0E32\u0E19\u0E04\u0E25\u0E2D\u0E07\u0E40\u0E2B\u0E19\u0E37\u0E2D", grade: "\u0E2D\u0E19\u0E38\u0E1A\u0E32\u0E25 3", score: "7", survey_date: "2026-03-13", note_json: '{"risk":false}' },
  { CID: "304460970103", round, school_name: "\u0E27\u0E31\u0E14\u0E1A\u0E32\u0E07\u0E19\u0E32", grade: "\u0E2D\u0E19\u0E38\u0E1A\u0E32\u0E25 2", score: round === 1 ? "0" : "", survey_date: round === 1 ? "2026-03-12" : "2026-03-13", note_json: null },
  { CID: "304460970104", round, school_name: "\u0E40\u0E17\u0E28\u0E1A\u0E32\u0E25 1", grade: "\u0E2D\u0E19\u0E38\u0E1A\u0E32\u0E25 1", score: "6", survey_date: "2026-03-14", note_json: '{"risk":false}' },
  { CID: "304460970105", round, school_name: round === 1 ? "\u0E1A\u0E49\u0E32\u0E19\u0E17\u0E38\u0E48\u0E07" : "\u0E1A\u0E49\u0E32\u0E19\u0E17\u0E38\u0E48\u0E07\u0E43\u0E2B\u0E21\u0E48", grade: "\u0E2D\u0E19\u0E38\u0E1A\u0E32\u0E25 3", score: "10", survey_date: "2026-03-14", note_json: '{"risk":false}' }
];
const createHhRows = (round) => [
  { CID: "99010001", round, head_name: round === 1 ? "\u0E2A\u0E21\u0E1E\u0E23 \u0E43\u0E08\u0E14\u0E35" : "\u0E2A\u0E21\u0E1E\u0E23 \u0E43\u0E08\u0E14\u0E35", members: "4", income_group: "\u0E01\u0E25\u0E32\u0E07", has_phone: "1" },
  { CID: "99010002", round, head_name: round === 1 ? "\u0E2D\u0E32\u0E23\u0E35\u0E22\u0E4C \u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07" : "\u0E2D\u0E32\u0E23\u0E35 \u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07", members: round === 1 ? "3" : "4", income_group: "\u0E15\u0E48\u0E33", has_phone: "1" },
  { CID: "99010003", round, head_name: "\u0E21\u0E32\u0E19\u0E30 \u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22", members: "5", income_group: "\u0E01\u0E25\u0E32\u0E07", has_phone: "0" },
  { CID: "99010004", round, head_name: "\u0E19\u0E07\u0E19\u0E38\u0E0A \u0E02\u0E22\u0E31\u0E19", members: round === 1 ? "2" : "3", income_group: round === 1 ? "\u0E2A\u0E39\u0E07" : "\u0E01\u0E25\u0E32\u0E07", has_phone: "1" },
  { CID: "99010005", round, head_name: "\u0E18\u0E31\u0E19\u0E27\u0E32 \u0E21\u0E35\u0E2A\u0E38\u0E02", members: "6", income_group: "\u0E15\u0E48\u0E33", has_phone: round === 1 ? "0" : "1" }
];
const tableDatasets = {
  "tcls2025_ch1.preface_ch": {
    name: "preface_ch",
    displayName: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E14\u0E47\u0E01",
    primaryKeys: ["CID", "member_id"],
    roundField: "round",
    excludedColumns: ["round"],
    columns: chPrefaceColumns,
    round1: createChRows(1),
    round2: createChRows(2)
  },
  "tcls2025_ch1.b1": {
    name: "b1",
    displayName: "\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 1 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19",
    primaryKeys: ["CID"],
    roundField: "round",
    excludedColumns: ["round"],
    columns: b1Columns,
    round1: createB1Rows(1),
    round2: createB1Rows(2)
  },
  "tcls2025_hhre.hh": {
    name: "hh",
    displayName: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E23\u0E31\u0E27\u0E40\u0E23\u0E37\u0E2D\u0E19",
    primaryKeys: ["CID"],
    roundField: "round",
    excludedColumns: ["round"],
    columns: hhColumns,
    round1: createHhRows(1),
    round2: createHhRows(2)
  },
  "tcls2025_hhre.hh_member": {
    name: "hh_member",
    displayName: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E04\u0E23\u0E31\u0E27\u0E40\u0E23\u0E37\u0E2D\u0E19",
    primaryKeys: ["CID", "member_id"],
    roundField: "round",
    excludedColumns: ["round"],
    columns: chPrefaceColumns.slice(0, 6),
    round1: createChRows(1),
    round2: createChRows(2)
  }
};
const projects = [
  {
    id: "tcls2025_hhbl",
    code: "HHBL2025",
    displayName: "Household Baseline 2025",
    rawDatabase: "tcls2025_hhbl",
    cmpDatabase: "tcls2025_hhbl_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "green",
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: "tcls2025_hhre",
    code: "HHRE2025",
    displayName: "Household Resurvey 2025",
    rawDatabase: "tcls2025_hhre",
    cmpDatabase: "tcls2025_hhre_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "green",
    active: true,
    updatedAt: nowText,
    tables: ["hh", "hh_member"]
  },
  {
    id: "tcls2025_ch0",
    code: "CH0BASE2025",
    displayName: "Baseline Children_2025 (Cohort 0)",
    rawDatabase: "tcls2025_ch0",
    cmpDatabase: "tcls2025_ch0_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "blue",
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: "tcls2025_ch1",
    code: "CH1BASE2025",
    displayName: "Children Baseline 2025 (CH1)",
    rawDatabase: "tcls2025_ch1",
    cmpDatabase: "tcls2025_ch1_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "blue",
    active: true,
    updatedAt: nowText,
    tables: ["preface_ch", "b1"]
  },
  {
    id: "tcls2025_ch2",
    code: "CH2RES2025",
    displayName: "Children Resurvey 2025 (CH2)",
    rawDatabase: "tcls2025_ch2",
    cmpDatabase: "tcls2025_ch2_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "yellow",
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: "tcls2025_ch10_screen",
    code: "CH10SCREEN2025",
    displayName: "Children_Resurvey 2025 \u0E40\u0E14\u0E47\u0E01\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E2D\u0E07 (cohort 10, 11, 12)",
    rawDatabase: "tcls2025_ch10_screen",
    cmpDatabase: "tcls2025_ch10_screen_cmp",
    searchColumn: "",
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: "exact",
    color: "red",
    active: true,
    updatedAt: nowText,
    tables: []
  }
];
const tableMeta = [
  { name: "preface_ch", icon: "error", allowed: true },
  { name: "hh", icon: "ok", allowed: true },
  { name: "hh_member", icon: "ok", allowed: true },
  { name: "b1b", icon: "ok", allowed: false },
  { name: "b1b_table1", icon: "ok", allowed: false },
  { name: "b1", icon: "ok", allowed: true },
  { name: "b1a1", icon: "ok", allowed: false }
];
const auditSeed = [
  {
    id: 1,
    taskId: "TASK-2025-001",
    projectId: "tcls2025_ch1",
    tableName: "preface_ch",
    primaryKey: "202194100900001H01",
    columnName: "fname_ch",
    round1Value: "\u0E2D\u0E31\u0E1F\u0E23\u0E34\u0E19",
    round2Value: "\u0E13\u0E31\u0E10\u0E10\u0E32\u0E23\u0E34\u0E19\u0E17\u0E23\u0E4C",
    selectedValue: "\u0E13\u0E31\u0E10\u0E10\u0E32\u0E23\u0E34\u0E19\u0E17\u0E23\u0E4C",
    source: "round2",
    user: "nuda",
    changedAt: "2026-03-13 13:25:00"
  },
  {
    id: 2,
    taskId: "TASK-2025-001",
    projectId: "tcls2025_ch1",
    tableName: "preface_ch",
    primaryKey: "202194100899001H02",
    columnName: "round",
    round1Value: "1",
    round2Value: "2",
    selectedValue: "0",
    source: "system",
    user: "nuda",
    changedAt: "2026-03-13 13:20:00"
  }
];
function getMockProjects() {
  return clone(projects);
}
function getMockTableCatalog(projectId) {
  const project = projects.find((item) => item.id === projectId);
  return tableMeta.map((item) => {
    const dataset = tableDatasets[`${projectId}.${item.name}`];
    const allowed = Boolean((project == null ? void 0 : project.tables.includes(item.name)) && dataset);
    return {
      ...item,
      allowed,
      displayName: (dataset == null ? void 0 : dataset.displayName) || item.name,
      primaryKeys: (dataset == null ? void 0 : dataset.primaryKeys) || [],
      roundField: (dataset == null ? void 0 : dataset.roundField) || "round"
    };
  });
}
function getMockSampleIds(projectId) {
  const project = projects.find((item) => item.id === projectId);
  const ids = [];
  Object.entries(tableDatasets).forEach(([key, dataset]) => {
    if (!key.startsWith(`${projectId}.`)) {
      return;
    }
    const sourceRows = [...dataset.round1, ...dataset.round2];
    sourceRows.forEach((row) => {
      const sampleId = composePrimaryKey(row, dataset.primaryKeys);
      if (sampleId && !ids.includes(sampleId)) {
        ids.push(sampleId);
      }
    });
  });
  return ids.slice(0, 20).map((id) => {
    const parts = splitMockSearchId(project, id);
    return {
      id,
      project_code: (project == null ? void 0 : project.surveyProjectCode) || "tcls2025",
      database_code: projectId,
      search_id1: parts.searchId1,
      searchId1: parts.searchId1,
      search_id2: parts.searchId2,
      searchId2: parts.searchId2
    };
  });
}
function getMockAuditLogs() {
  return clone(auditSeed);
}
function getDataset(projectId, tableName) {
  return tableDatasets[`${projectId}.${tableName}`];
}
function composePrimaryKey(row, primaryKeys) {
  return primaryKeys.map((key) => {
    var _a;
    return (_a = row[key]) != null ? _a : "";
  }).join("");
}
function splitMockSearchId(project, id) {
  const text = String(id || "");
  const id1Start = Math.max(1, Number((project == null ? void 0 : project.searchId1Start) || 1));
  const id1Length = Math.max(1, Number((project == null ? void 0 : project.searchId1Length) || 12));
  const id2Start = Math.max(1, Number((project == null ? void 0 : project.searchId2Start) || id1Start + id1Length));
  const id2Length = (project == null ? void 0 : project.searchId2Length) ? Number(project.searchId2Length) : null;
  return {
    searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
    searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
  };
}
function buildPreview(project, table, searchMode, searchId, selectedPrimaryKeys) {
  const dataset = getDataset(project.id, table.name);
  if (!dataset) {
    return null;
  }
  const keys = (selectedPrimaryKeys == null ? void 0 : selectedPrimaryKeys.length) ? selectedPrimaryKeys : dataset.primaryKeys;
  const matches = (row) => {
    const key = composePrimaryKey(row, keys);
    return searchMode === "exact" ? key === searchId : key.startsWith(searchId);
  };
  const round1Keys = dataset.round1.filter(matches).map((row) => composePrimaryKey(row, keys));
  const round2Keys = dataset.round2.filter(matches).map((row) => composePrimaryKey(row, keys));
  const set1 = new Set(round1Keys);
  const set2 = new Set(round2Keys);
  const intersection = round1Keys.filter((key) => set2.has(key));
  const onlyRound1 = round1Keys.filter((key) => !set2.has(key));
  const onlyRound2 = round2Keys.filter((key) => !set1.has(key));
  return {
    round1Count: round1Keys.length,
    round2Count: round2Keys.length,
    intersectionCount: intersection.length,
    onlyRound1Count: onlyRound1.length,
    onlyRound2Count: onlyRound2.length,
    matchedKeys: intersection,
    rawDatabase: project.rawDatabase,
    cmpDatabase: project.cmpDatabase,
    targetTable: table.name,
    targetFullName: `${project.cmpDatabase}.${table.name}`,
    willCreateTable: true,
    copiedRows: round1Keys.length
  };
}
function buildCompareRecords(project, table, searchMode, searchId, selectedPrimaryKeys) {
  const dataset = getDataset(project.id, table.name);
  if (!dataset) {
    return [];
  }
  const keys = (selectedPrimaryKeys == null ? void 0 : selectedPrimaryKeys.length) ? selectedPrimaryKeys : dataset.primaryKeys;
  const preview = buildPreview(project, table, searchMode, searchId, keys);
  const matchedKeySet = new Set((preview == null ? void 0 : preview.matchedKeys) || []);
  const round2ByKey = new Map(dataset.round2.map((row) => [composePrimaryKey(row, keys), row]));
  return dataset.round1.filter((row) => matchedKeySet.has(composePrimaryKey(row, keys))).map((round1Row, index) => {
    const primaryKey = composePrimaryKey(round1Row, keys);
    const round2Row = round2ByKey.get(primaryKey);
    const fields = dataset.columns.map((column) => {
      const round1Value = normalizeValue(round1Row[column.name]);
      const round2Value = normalizeValue(round2Row == null ? void 0 : round2Row[column.name]);
      const same = round1Value === round2Value;
      return {
        key: column.name,
        label: column.label,
        type: column.type,
        options: column.options || [],
        round1Value,
        round2Value,
        same,
        status: same ? "same" : "different",
        selectedSource: same ? "round1" : "",
        selectedValue: same ? round1Value : "",
        customInput: ""
      };
    });
    return {
      id: `${project.id}-${table.name}-${primaryKey}`,
      sequence: index + 1,
      primaryKey,
      primaryKeyValues: Object.fromEntries(keys.map((key) => [key, round1Row[key]])),
      status: fields.every((field) => field.same) ? "complete" : "pending",
      fields
    };
  });
}
function normalizeValue(value) {
  if (value === null || typeof value === "undefined") {
    return "";
  }
  return String(value);
}
function buildAuditLog({ record, field, selectedValue, source, projectId, tableName, user }) {
  return {
    id: Date.now() + Math.random(),
    taskId: `TASK-${projectId.toUpperCase()}`,
    projectId,
    tableName,
    primaryKey: record.primaryKey,
    columnName: field.key,
    round1Value: field.round1Value,
    round2Value: field.round2Value,
    selectedValue,
    source,
    user,
    changedAt: (/* @__PURE__ */ new Date()).toLocaleString("th-TH", { hour12: false })
  };
}
function buildCsv(logs) {
  const header = ["task_id", "project_id", "table_name", "primary_key", "column_name", "round1_value", "round2_value", "selected_value", "source", "user", "changed_at"];
  const lines = logs.map((log) => [
    log.taskId,
    log.projectId,
    log.tableName,
    log.primaryKey,
    log.columnName,
    log.round1Value,
    log.round2Value,
    log.selectedValue,
    log.source,
    log.user,
    log.changedAt
  ].map(escapeCsv).join(","));
  return [header.join(","), ...lines].join("\n");
}
function escapeCsv(value) {
  const text = String(value != null ? value : "");
  return `"${text.replaceAll('"', '""')}"`;
}
function normalizeResponse(response) {
  var _a;
  if ((response == null ? void 0 : response.success) === false) {
    const message = response.message || "API request failed";
    throw new Error(message);
  }
  return (_a = response == null ? void 0 : response.data) != null ? _a : response;
}
function useCompareApi() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const loginUrl = config.public.loginUrl || "https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php";
  const sampleIdsLimit = String(config.public.sampleIdsLimit || "all");
  async function request(path, options = {}) {
    if (!apiBase) {
      throw new Error("API base URL is not configured");
    }
    const response = await $fetch(`${apiBase}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        ...{},
        ...options.headers || {}
      }
    });
    return normalizeResponse(response);
  }
  return {
    usingMock: !apiBase,
    async login(credentials) {
      return $fetch(loginUrl, {
        method: "POST",
        body: {
          username: credentials.username.trim(),
          password: credentials.password
        }
      });
    },
    async listProjects() {
      if (!apiBase) {
        return getMockProjects();
      }
      const data = await request("/projects.php");
      return (data.projects || []).map(normalizeProject);
    },
    async listTables(projectId) {
      if (!apiBase) {
        return getMockTableCatalog(projectId);
      }
      const data = await request(`/project-tables.php?project_id=${encodeURIComponent(projectId)}`);
      return (data.tables || []).map(normalizeTable);
    },
    async listSampleIds(projectOrId) {
      const project = typeof projectOrId === "object" && projectOrId !== null ? projectOrId : null;
      const projectId = (project == null ? void 0 : project.id) || projectOrId;
      if (!apiBase) {
        return getMockSampleIds(projectId).map((sample) => normalizeSampleId(sample, project));
      }
      const query = new URLSearchParams({ project_id: projectId });
      if (sampleIdsLimit) {
        query.set("limit", sampleIdsLimit);
      }
      const data = await request(`/sample-ids.php?${query.toString()}`);
      if (Array.isArray(data.sample_ids)) {
        return data.sample_ids.map((sample) => normalizeSampleId(sample, project));
      }
      return (data.samples || []).map((sample) => normalizeSampleId(sample, project)).filter((item) => item.id);
    },
    async previewScope(payload) {
      if (!apiBase) {
        const tables = getMockTableCatalog(payload.projectId).filter((table) => table.allowed).map((table) => {
          const preview = buildPreview(payload.project, table, payload.searchMode, payload.searchId, table.primaryKeys);
          const hasBothRounds = Number((preview == null ? void 0 : preview.round1Count) || 0) > 0 && Number((preview == null ? void 0 : preview.round2Count) || 0) > 0;
          const isSelectable = hasBothRounds && Number((preview == null ? void 0 : preview.intersectionCount) || 0) > 0;
          return {
            ...preview,
            tableName: table.name,
            table_name: table.name,
            displayName: table.displayName,
            display_name: table.displayName,
            primaryKeys: table.primaryKeys,
            primary_keys: table.primaryKeys,
            selectable: isSelectable,
            hasBothRounds,
            has_both_rounds: hasBothRounds
          };
        });
        return {
          searchId1: payload.searchId1,
          search_id1: payload.searchId1,
          searchId2: payload.searchId2,
          search_id2: payload.searchId2,
          searchId: payload.searchId,
          search_id: payload.searchId,
          searchMode: payload.searchMode,
          search_mode: payload.searchMode,
          tables,
          totals: tables.reduce((acc, table) => {
            acc.round1Count += Number(table.round1Count || 0);
            acc.round2Count += Number(table.round2Count || 0);
            acc.intersectionCount += Number(table.intersectionCount || 0);
            acc.onlyRound1Count += Number(table.onlyRound1Count || 0);
            acc.onlyRound2Count += Number(table.onlyRound2Count || 0);
            return acc;
          }, { round1Count: 0, round2Count: 0, intersectionCount: 0, onlyRound1Count: 0, onlyRound2Count: 0 })
        };
      }
      const data = await request("/compare-scope-preview.php", {
        method: "POST",
        body: {
          project_id: payload.projectId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2,
          search_id: payload.searchId,
          search_mode: payload.searchMode
        }
      });
      return data.preview;
    },
    async previewCompare(payload) {
      if (!apiBase) {
        return buildPreview(payload.project, payload.table, payload.searchMode, payload.searchId, payload.primaryKeys);
      }
      const data = await request("/compare-preview.php", {
        method: "POST",
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          search_mode: payload.searchMode,
          search_id: payload.searchId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2,
          primary_keys: payload.primaryKeys
        }
      });
      return data.preview;
    },
    async prepareCompare(payload) {
      var _a, _b, _c;
      if (!apiBase) {
        return {
          prepared: true,
          created: (_a = payload.preview) == null ? void 0 : _a.willCreateTable,
          copiedRows: ((_b = payload.preview) == null ? void 0 : _b.copiedRows) || 0,
          targetTable: (_c = payload.preview) == null ? void 0 : _c.targetFullName
        };
      }
      return request("/compare-prepare.php", {
        method: "POST",
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          primary_keys: payload.primaryKeys,
          search_mode: payload.searchMode,
          search_id: payload.searchId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2
        }
      });
    },
    async getCompareRecords(payload) {
      if (!apiBase) {
        return buildCompareRecords(payload.project, payload.table, payload.searchMode, payload.searchId, payload.primaryKeys);
      }
      const query = new URLSearchParams({
        project_id: payload.projectId,
        table_name: payload.tableName,
        search_mode: payload.searchMode,
        search_id: payload.searchId,
        search_id1: payload.searchId1 || "",
        search_id2: payload.searchId2 || ""
      });
      const data = await request(`/compare-record.php?${query.toString()}`);
      return data.records || [];
    },
    async saveCompare(payload) {
      if (!apiBase) {
        return { saved: true };
      }
      return request("/compare-save.php", {
        method: "POST",
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          run_id: payload.runId,
          primary_key: payload.primaryKey,
          values: payload.values
        }
      });
    }
  };
}
function normalizeProject(project) {
  const questionnaireName = project.questionnaireName || project.questionnaire_name || "";
  return {
    ...project,
    id: project.id || project.project_id,
    code: project.code || project.project_code,
    displayName: questionnaireName || project.displayName || project.display_name,
    questionnaireName,
    color: project.color || "blue",
    surveyProjectCode: project.surveyProjectCode || project.survey_project_code || "",
    groupCode: project.groupCode || project.survey_project_code || "",
    databaseCode: project.databaseCode || project.database_code || project.project_id || project.id,
    rawDatabase: project.rawDatabase || project.raw_database,
    cmpDatabase: project.cmpDatabase || project.cmp_database,
    searchColumn: project.searchColumn || project.search_column || "",
    searchId1Start: Number(project.searchId1Start || project.search_id1_start || 1),
    searchId1Length: Number(project.searchId1Length || project.search_id1_length || 12),
    searchId2Start: Number(project.searchId2Start || project.search_id2_start || 13),
    searchId2Length: project.searchId2Length || project.search_id2_length || null,
    searchId2Mode: project.searchId2Mode || project.search_id2_mode || "exact",
    active: Boolean(project.active),
    tableCount: Number(project.tableCount || project.table_count || 0),
    tables: project.tables || (Number(project.tableCount || project.table_count || 0) > 0 ? [true] : [])
  };
}
function normalizeSampleId(sample, project = null) {
  if (typeof sample === "string") {
    const id2 = String(sample);
    const parts = splitSearchIdByProject(project, id2);
    return {
      id: id2,
      search_id1: parts.searchId1,
      searchId1: parts.searchId1,
      search_id2: parts.searchId2,
      searchId2: parts.searchId2
    };
  }
  const id = String((sample == null ? void 0 : sample.id) || (sample == null ? void 0 : sample.sample_id) || "");
  const searchId1 = String((sample == null ? void 0 : sample.searchId1) || (sample == null ? void 0 : sample.search_id1) || id);
  const searchId2 = String((sample == null ? void 0 : sample.searchId2) || (sample == null ? void 0 : sample.search_id2) || "");
  return {
    ...sample,
    id,
    search_id1: searchId1,
    searchId1,
    search_id2: searchId2,
    searchId2
  };
}
function splitSearchIdByProject(project, id) {
  const text = String(id || "");
  const id1Start = Math.max(1, Number((project == null ? void 0 : project.searchId1Start) || (project == null ? void 0 : project.search_id1_start) || 1));
  const id1Length = Math.max(1, Number((project == null ? void 0 : project.searchId1Length) || (project == null ? void 0 : project.search_id1_length) || text.length || 1));
  const id2Start = Math.max(1, Number((project == null ? void 0 : project.searchId2Start) || (project == null ? void 0 : project.search_id2_start) || id1Start + id1Length));
  const rawId2Length = (project == null ? void 0 : project.searchId2Length) || (project == null ? void 0 : project.search_id2_length) || null;
  const id2Length = rawId2Length ? Number(rawId2Length) : null;
  return {
    searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
    searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
  };
}
function normalizeTable(table) {
  return {
    ...table,
    name: table.name || table.table_name,
    displayName: table.displayName || table.display_name,
    allowed: Boolean(table.allowed),
    primaryKeys: table.primaryKeys || table.primary_keys || [],
    excludedColumns: table.excludedColumns || table.excluded_columns || [],
    icon: table.icon || (table.allowed ? "ok" : "error")
  };
}
function useCompareWorkflow() {
  const user = useState("compare.user", () => readStoredUser());
  const projects2 = useState("compare.projects", () => getMockProjects());
  const tableCatalog = useState("compare.tableCatalog", () => []);
  const sampleIds = useState("compare.sampleIds", () => []);
  const step = useState("compare.step", () => 1);
  const selectedProjectId = useState("compare.selectedProjectId", () => "");
  const selectedTableName = useState("compare.selectedTableName", () => "");
  const selectedPrimaryKeys = useState("compare.selectedPrimaryKeys", () => []);
  const searchMode = useState("compare.searchMode", () => "prefix");
  const searchId1 = useState("compare.searchId1", () => "");
  const searchId2 = useState("compare.searchId2", () => "");
  const searchId = useState("compare.searchId", () => "");
  const scopePreview = useState("compare.scopePreview", () => null);
  const preview = useState("compare.preview", () => null);
  const prepareResult = useState("compare.prepareResult", () => null);
  const records = useState("compare.records", () => []);
  const activeRecordIndex = useState("compare.activeRecordIndex", () => 0);
  const auditLogs = useState("compare.auditLogs", () => getMockAuditLogs());
  const toast = useState("compare.toast", () => "");
  const lastError = useState("compare.lastError", () => "");
  const lastErrorIcon = useState("compare.lastErrorIcon", () => "error");
  const scopePreviewRequestId = useState("compare.scopePreviewRequestId", () => 0);
  const api = useCompareApi();
  const isAuthenticated = computed(() => Boolean(user.value));
  const selectedProject = computed(() => projects2.value.find((project) => project.id === selectedProjectId.value) || null);
  const selectedTable = computed(() => tableCatalog.value.find((table) => table.name === selectedTableName.value) || null);
  const activeRecord = computed(() => records.value[activeRecordIndex.value] || null);
  const completedRecords = computed(() => records.value.filter((record) => record.status === COMPARE_STATUS.COMPLETE));
  const pendingRecords = computed(() => records.value.filter((record) => record.status !== COMPARE_STATUS.COMPLETE));
  const comparedCount = computed(() => completedRecords.value.length);
  const compareComplete = computed(() => records.value.length > 0 && pendingRecords.value.length === 0);
  const usingMock = computed(() => api.usingMock);
  const combinedSearchId = computed(() => `${searchId1.value || ""}${searchId2.value || ""}`);
  const tableStatuses = computed(() => tableCatalog.value.map((table) => {
    var _a;
    if (!table.allowed) {
      return { ready: false, label: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19", tone: "muted" };
    }
    if (!searchId1.value) {
      return { ready: false, label: "\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E48\u0E2D\u0E19", tone: "warning" };
    }
    const tablePreview = findScopeTablePreview(table.name);
    if (tablePreview == null ? void 0 : tablePreview.error) {
      return { ready: false, label: tablePreview.error, tone: "danger" };
    }
    if (tablePreview) {
      const round1Count = Number(tablePreview.round1Count || 0);
      const round2Count = Number(tablePreview.round2Count || 0);
      const intersectionCount = Number(tablePreview.intersectionCount || 0);
      const compareScopeCount = Number(tablePreview.compareScopeCount || tablePreview.compare_scope_count || 0);
      const intersectionCmpCount = Number(tablePreview.intersectionCmpCount || tablePreview.intersection_cmp_count || 0);
      const comparePendingCount = Number(tablePreview.comparePendingCount || tablePreview.compare_pending_count || 0);
      const rawRoundCountsMatch = round1Count === round2Count;
      const cmpScopeMatchesRound2 = intersectionCmpCount === round2Count || compareScopeCount === round2Count;
      const pendingCmpReady = comparePendingCount > 0 && (cmpScopeMatchesRound2 || rawRoundCountsMatch);
      const hasCompleteRoundPair = round1Count > 0 && round2Count > 0 && (compareScopeCount > 0 ? cmpScopeMatchesRound2 || pendingCmpReady : rawRoundCountsMatch);
      const selectable = (_a = tablePreview.selectable) != null ? _a : hasCompleteRoundPair;
      return {
        ready: Boolean(selectable),
        label: tablePreview.statusText || tablePreview.status_text || (intersectionCount > 0 ? `${intersectionCount} record` : "0 record"),
        tone: tablePreview.statusTone || tablePreview.status_tone || (selectable ? "warning" : "empty"),
        icon: tablePreview.statusIcon || tablePreview.status_icon || (selectable ? "\u25B2" : "\u2612")
      };
    }
    return { ready: false, label: "\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08 round", tone: "warning", icon: "\u25B2" };
  }));
  async function login({ username, password }) {
    var _a, _b;
    lastError.value = "";
    lastErrorIcon.value = "error";
    if (!username || !password) {
      lastError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01 UserName \u0E41\u0E25\u0E30 Password";
      return false;
    }
    try {
      const cleanUsername = username.trim();
      const res = await api.login({ username: cleanUsername, password });
      if (res.status === "error" || !res.token) {
        lastError.value = `${res.message || "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"}<br><br>STAFF RIPED \u0E01\u0E23\u0E38\u0E13\u0E32\u0E43\u0E0A\u0E49\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E07\u0E32\u0E19 (/cvriped) \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E1A\u0E1A\u0E31\u0E0D\u0E0A\u0E35 (/account)`;
        return false;
      }
      if (((_a = res == null ? void 0 : res.user) == null ? void 0 : _a.fromdb) === "spa.1user" && ((_b = res == null ? void 0 : res.user) == null ? void 0 : _b.ttype) === "baseSPA") {
        lastError.value = "\u0E40\u0E27\u0E47\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E19\u0E35\u0E49 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A User Key (KEY___ , K___ ) \u0E41\u0E25\u0E30 Staff RIPED \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19";
        lastErrorIcon.value = "warning";
        return false;
      }
      saveLoginStorage(cleanUsername, res);
      user.value = readStoredUser();
      notify("\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27");
      return true;
    } catch (error) {
      lastError.value = error.message || "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E14\u0E49";
      return false;
    }
  }
  function logout() {
    user.value = null;
    resetWorkspace();
  }
  function hydrateUserFromStorage() {
    user.value = readStoredUser();
    return Boolean(user.value);
  }
  async function refreshProjects() {
    projects2.value = await api.listProjects();
  }
  async function loadTablesForProject(project) {
    if (!(project == null ? void 0 : project.id)) {
      return [];
    }
    return api.listTables(project.id);
  }
  async function selectProject(project) {
    selectedProjectId.value = project.id;
    selectedTableName.value = "";
    selectedPrimaryKeys.value = [];
    searchId1.value = "";
    searchId2.value = "";
    searchId.value = "";
    searchMode.value = "prefix";
    scopePreview.value = null;
    preview.value = null;
    records.value = [];
    activeRecordIndex.value = 0;
    sampleIds.value = [];
    const [tables, samples] = await Promise.all([
      api.listTables(project.id),
      api.listSampleIds(project).catch(() => [])
    ]);
    tableCatalog.value = tables;
    sampleIds.value = samples;
    step.value = 2;
  }
  async function selectProjectWithTable(project, table) {
    await selectProject(project);
    const tableName = (table == null ? void 0 : table.name) || (table == null ? void 0 : table.table_name) || "";
    const matchedTable = tableCatalog.value.find((item) => item.name === tableName);
    if (!(matchedTable == null ? void 0 : matchedTable.allowed)) {
      notify("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14 compare");
      return false;
    }
    selectedTableName.value = matchedTable.name;
    selectedPrimaryKeys.value = [...matchedTable.primaryKeys];
    scopePreview.value = null;
    preview.value = null;
    return true;
  }
  function backToProjectList() {
    selectedProjectId.value = "";
    selectedTableName.value = "";
    selectedPrimaryKeys.value = [];
    searchId1.value = "";
    searchId2.value = "";
    searchId.value = "";
    searchMode.value = "prefix";
    scopePreview.value = null;
    preview.value = null;
    records.value = [];
    tableCatalog.value = [];
    sampleIds.value = [];
    step.value = 1;
  }
  async function selectTable(table) {
    if (!(table == null ? void 0 : table.allowed)) {
      return;
    }
    syncSearchScope();
    if (!searchId1.value.trim()) {
      notify("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07");
      return;
    }
    const status = tableStatusFor(table.name);
    if (!(status == null ? void 0 : status.ready)) {
      notify("\u0E15\u0E32\u0E23\u0E32\u0E07\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07 2 round");
      return;
    }
    selectedTableName.value = table.name;
    selectedPrimaryKeys.value = [...table.primaryKeys];
    const tablePreview = findScopeTablePreview(table.name);
    preview.value = tablePreview || null;
    if (!preview.value) {
      await refreshPreview();
    }
  }
  async function refreshPreview(scopePayload = {}) {
    const scope = syncSearchScope(scopePayload);
    preview.value = null;
    if (!selectedProject.value || !scope.searchId1) {
      scopePreviewRequestId.value += 1;
      scopePreview.value = null;
      return;
    }
    const requestId = scopePreviewRequestId.value + 1;
    scopePreviewRequestId.value = requestId;
    const nextScopePreview = await api.previewScope({
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      searchId: scope.searchId,
      searchMode: scope.searchMode
    });
    if (requestId !== scopePreviewRequestId.value) {
      return;
    }
    scopePreview.value = nextScopePreview;
    const tablePreview = selectedTable.value ? findScopeTablePreview(selectedTable.value.name) : null;
    if (tablePreview) {
      preview.value = tablePreview;
      return;
    }
    if (!selectedTable.value) {
      preview.value = null;
      return;
    }
    preview.value = await api.previewCompare({
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      table: selectedTable.value,
      tableName: selectedTable.value.name,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      primaryKeys: selectedPrimaryKeys.value
    });
  }
  function togglePrimaryKey(key) {
    if (selectedPrimaryKeys.value.includes(key)) {
      if (selectedPrimaryKeys.value.length === 1) {
        notify("\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01 Primary Key \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E15\u0E31\u0E27");
        return;
      }
      selectedPrimaryKeys.value = selectedPrimaryKeys.value.filter((item) => item !== key);
    } else {
      selectedPrimaryKeys.value = [...selectedPrimaryKeys.value, key];
    }
    refreshPreview();
  }
  async function prepareCompare() {
    const scope = syncSearchScope();
    if (!selectedProject.value || !selectedTable.value || !preview.value) {
      notify("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A Preview \u0E01\u0E48\u0E2D\u0E19");
      return false;
    }
    const round1Count = Number(preview.value.round1Count || 0);
    const round2Count = Number(preview.value.round2Count || 0);
    Number(preview.value.intersectionCount || 0);
    const compareScopeCount = Number(preview.value.compareScopeCount || preview.value.compare_scope_count || 0);
    const intersectionCmpCount = Number(preview.value.intersectionCmpCount || preview.value.intersection_cmp_count || 0);
    const comparePendingCount = Number(preview.value.comparePendingCount || preview.value.compare_pending_count || 0);
    const rawRoundCountsMatch = round1Count === round2Count;
    const cmpScopeMatchesRound2 = intersectionCmpCount === round2Count || compareScopeCount === round2Count;
    const pendingCmpReady = comparePendingCount > 0 && (cmpScopeMatchesRound2 || rawRoundCountsMatch);
    const hasComparableRoundPair = Boolean(preview.value.selectable) || round1Count > 0 && round2Count > 0 && (compareScopeCount > 0 ? cmpScopeMatchesRound2 || pendingCmpReady : rawRoundCountsMatch);
    if (!hasComparableRoundPair) {
      notify("\u0E22\u0E31\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01 compare \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19\u0E17\u0E31\u0E49\u0E07 2 round");
      return false;
    }
    const recordPayload = {
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      table: selectedTable.value,
      tableName: selectedTable.value.name,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      primaryKeys: selectedPrimaryKeys.value
    };
    const compareStatus = preview.value.compareStatus || preview.value.compare_status || "";
    if (compareStatus === "complete") {
      prepareResult.value = {
        alreadyComplete: true,
        already_complete: true,
        targetTable: preview.value.targetFullName
      };
      records.value = await api.getCompareRecords(recordPayload);
      activeRecordIndex.value = 0;
      step.value = 4;
      notify("\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E0A\u0E38\u0E14\u0E19\u0E35\u0E49 Compare \u0E41\u0E25\u0E49\u0E27");
      return true;
    }
    prepareResult.value = await api.prepareCompare({
      projectId: selectedProject.value.id,
      tableName: selectedTable.value.name,
      primaryKeys: selectedPrimaryKeys.value,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      preview: preview.value
    });
    records.value = await api.getCompareRecords(recordPayload);
    const firstPending = records.value.findIndex((record) => record.status !== COMPARE_STATUS.COMPLETE);
    activeRecordIndex.value = firstPending >= 0 ? firstPending : 0;
    step.value = 4;
    if (!records.value.length) {
      notify("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A");
      return false;
    }
    notify(`\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 ${records.value.length} \u0E23\u0E2B\u0E31\u0E2A`);
    return true;
  }
  function chooseField(recordId, fieldKey, source) {
    const field = findField(recordId, fieldKey);
    if (!field) {
      return;
    }
    field.selectedSource = source;
    field.selectedValue = source === "round1" ? field.round1Value : field.round2Value;
    field.customInput = "";
  }
  function setCustomField(recordId, fieldKey, value) {
    const field = findField(recordId, fieldKey);
    if (!field) {
      return;
    }
    field.selectedSource = "custom";
    field.customInput = value;
    field.selectedValue = value;
  }
  async function saveActiveRecord() {
    var _a, _b;
    const record = activeRecord.value;
    if (!record || !selectedProject.value || !selectedTable.value) {
      return false;
    }
    const compareFields = record.fields.filter((field) => !field.same);
    const unresolved = compareFields.filter((field) => !hasSaveValue(field.selectedValue));
    if (unresolved.length) {
      notify(`\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A ${unresolved.length} \u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23`);
      return false;
    }
    const changedFields = compareFields.filter((field) => field.selectedValue !== field.round1Value);
    await api.saveCompare({
      projectId: selectedProject.value.id,
      tableName: selectedTable.value.name,
      runId: ((_a = prepareResult.value) == null ? void 0 : _a.runId) || ((_b = prepareResult.value) == null ? void 0 : _b.taskId) || "",
      primaryKey: record.primaryKeyValues,
      values: compareFields.map((field) => ({
        columnName: field.key,
        selectedValue: field.selectedValue,
        selectedSource: field.selectedSource || "round1",
        round1Value: field.round1Value,
        round2Value: field.round2Value
      }))
    });
    changedFields.forEach((field) => {
      var _a2;
      auditLogs.value.unshift(buildAuditLog({
        record,
        field,
        selectedValue: field.selectedValue,
        source: field.selectedSource,
        projectId: selectedProject.value.id,
        tableName: selectedTable.value.name,
        user: ((_a2 = user.value) == null ? void 0 : _a2.username) || "unknown"
      }));
    });
    record.status = COMPARE_STATUS.COMPLETE;
    notify("\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27 \u0E1B\u0E23\u0E31\u0E1A round=0 \u0E40\u0E09\u0E1E\u0E32\u0E30\u0E10\u0E32\u0E19 _cmp");
    const nextIndex = records.value.findIndex((item, index) => index > activeRecordIndex.value && item.status !== COMPARE_STATUS.COMPLETE);
    if (nextIndex >= 0) {
      activeRecordIndex.value = nextIndex;
    }
    return true;
  }
  function resetActiveRecord() {
    const record = activeRecord.value;
    if (!record) {
      return;
    }
    record.fields.forEach((field) => {
      field.selectedSource = field.same ? "round1" : "";
      field.selectedValue = field.same ? field.round1Value : "";
      field.customInput = "";
    });
  }
  function openRecord(index) {
    activeRecordIndex.value = index;
  }
  function addAdminProject(form) {
    const rawDatabase = form.rawDatabase.trim();
    const cmpDatabase = form.cmpDatabase.trim() || rawDatabase.replace(/_raw$/, "_cmp") || `${rawDatabase}_cmp`;
    const newProject = {
      id: form.code.trim().toLowerCase(),
      code: form.code.trim(),
      displayName: form.displayName.trim(),
      rawDatabase,
      cmpDatabase,
      color: "blue",
      active: Boolean(form.active),
      updatedAt: "\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08 Schema",
      tables: []
    };
    projects2.value = [newProject, ...projects2.value];
    notify("\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E41\u0E25\u0E49\u0E27 \u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08 Schema \u0E41\u0E25\u0E30\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C");
  }
  function resetWorkspace() {
    step.value = 1;
    selectedProjectId.value = "";
    selectedTableName.value = "";
    selectedPrimaryKeys.value = [];
    searchMode.value = "prefix";
    searchId1.value = "";
    searchId2.value = "";
    searchId.value = "";
    scopePreview.value = null;
    preview.value = null;
    prepareResult.value = null;
    records.value = [];
    activeRecordIndex.value = 0;
    tableCatalog.value = [];
    sampleIds.value = [];
  }
  function notify(message) {
    toast.value = message;
  }
  function syncSearchScope(scopePayload = {}) {
    var _a, _b, _c, _d, _e, _f;
    const cleanId1 = String((_c = (_b = (_a = scopePayload.searchId1) != null ? _a : scopePayload.search_id1) != null ? _b : searchId1.value) != null ? _c : "").trim();
    const cleanId2 = String((_f = (_e = (_d = scopePayload.searchId2) != null ? _d : scopePayload.search_id2) != null ? _e : searchId2.value) != null ? _f : "").trim();
    searchId1.value = cleanId1;
    searchId2.value = cleanId2;
    searchId.value = `${cleanId1}${cleanId2}`;
    searchMode.value = cleanId2 ? projectSearchId2Mode(selectedProject.value) : "prefix";
    return {
      searchId1: cleanId1,
      searchId2: cleanId2,
      searchId: searchId.value,
      searchMode: searchMode.value
    };
  }
  function findScopeTablePreview(tableName) {
    var _a, _b, _c, _d;
    const currentSearchId = `${searchId1.value || ""}${searchId2.value || ""}`;
    const previewSearchId = ((_a = scopePreview.value) == null ? void 0 : _a.searchId) || ((_b = scopePreview.value) == null ? void 0 : _b.search_id) || "";
    if (!scopePreview.value || previewSearchId !== currentSearchId) {
      return null;
    }
    return ((_d = (_c = scopePreview.value) == null ? void 0 : _c.tables) == null ? void 0 : _d.find((item) => {
      return (item.tableName || item.table_name) === tableName;
    })) || null;
  }
  function tableStatusFor(tableName) {
    const index = tableCatalog.value.findIndex((table) => table.name === tableName);
    return index >= 0 ? tableStatuses.value[index] : null;
  }
  function findField(recordId, fieldKey) {
    const record = records.value.find((item) => item.id === recordId);
    return record == null ? void 0 : record.fields.find((field) => field.key === fieldKey);
  }
  return {
    user,
    projects: projects2,
    tableCatalog,
    sampleIds,
    step,
    selectedProjectId,
    selectedTableName,
    selectedPrimaryKeys,
    searchMode,
    searchId1,
    searchId2,
    searchId,
    combinedSearchId,
    scopePreview,
    preview,
    prepareResult,
    records,
    activeRecordIndex,
    auditLogs,
    toast,
    lastError,
    lastErrorIcon,
    isAuthenticated,
    selectedProject,
    selectedTable,
    activeRecord,
    completedRecords,
    pendingRecords,
    comparedCount,
    compareComplete,
    usingMock,
    tableStatuses,
    login,
    logout,
    hydrateUserFromStorage,
    refreshProjects,
    loadTablesForProject,
    selectProject,
    selectProjectWithTable,
    backToProjectList,
    selectTable,
    refreshPreview,
    togglePrimaryKey,
    prepareCompare,
    chooseField,
    setCustomField,
    saveActiveRecord,
    resetActiveRecord,
    openRecord,
    addAdminProject,
    resetWorkspace,
    buildCsv
  };
}
function readStoredUser() {
  {
    return null;
  }
}
function saveLoginStorage(username, res) {
  {
    return;
  }
}
function projectSearchId2Mode(project) {
  const mode = String((project == null ? void 0 : project.searchId2Mode) || (project == null ? void 0 : project.search_id2_mode) || "exact").toLowerCase();
  return ["exact", "prefix"].includes(mode) ? mode : "exact";
}
function hasSaveValue(value) {
  return value !== null && typeof value !== "undefined" && String(value).trim() !== "";
}

export { useCompareWorkflow as u };
//# sourceMappingURL=useCompareWorkflow-DCC0rYzR.mjs.map
