import { ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _export_sfc, u as useRuntimeConfig } from "../server.mjs";
import { u as useHead } from "./v3-BRAkCVbx.js";
import "E:/Project2026/compare-data/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/Project2026/compare-data/node_modules/hookable/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/h3/dist/index.mjs";
import "pinia";
import "E:/Project2026/compare-data/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "E:/Project2026/compare-data/node_modules/ufo/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/klona/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = {
  __name: "list",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Survey List"
    });
    const runtimeConfig = useRuntimeConfig();
    const appBaseUrl = normalizeAppBaseUrl(runtimeConfig.public.appBaseUrl || "/compare-data/");
    const defaultApiBase = `${appBaseUrl.replace(/\/$/, "")}/api`;
    String(runtimeConfig.public.apiBase || defaultApiBase).replace(/\/$/, "");
    runtimeConfig.public.loginUrl || "https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php";
    const projectStatusOptions = [
      { value: "draft", label: "ร่าง" },
      { value: "preparing", label: "กำลังเตรียม Compare" },
      { value: "active", label: "เปิดคีย์ข้อมูล" },
      { value: "ready", label: "พร้อม compare data" },
      { value: "key_closed", label: "คีย์จบแล้ว" },
      { value: "ended", label: "จบโครงการ" }
    ];
    const databaseStatusOptions = [
      { value: "draft", label: "ร่าง" },
      { value: "ready", label: "พร้อมตั้งค่าตาราง" },
      { value: "prepared", label: "เตรียม Compare แล้ว" },
      { value: "disabled", label: "ปิดใช้งาน" }
    ];
    const adminTabs = [
      { id: "projects", label: "Project" },
      { id: "databases", label: "Database" },
      { id: "tables", label: "Tables" },
      { id: "columns", label: "Variables" }
    ];
    const surveySystems = ref([]);
    const projectsLoading = ref(false);
    const projectLoadError = ref("");
    const showAdminLogin = ref(false);
    const adminLoginLoading = ref(false);
    const adminLoginError = ref("");
    const adminSession = ref(null);
    ref(null);
    const adminTab = ref("projects");
    const adminMessage = ref("");
    const adminError = ref("");
    const adminSaving = ref(false);
    const adminLoading = ref(false);
    const adminCredentials = reactive({
      username: "",
      password: ""
    });
    const selectedProjectCode = ref("");
    const selectedDatabaseId = ref(null);
    const selectedTableId = ref(null);
    const selectedTableName = ref("");
    const adminDatabases = ref([]);
    const adminTables = ref([]);
    const adminColumns = ref([]);
    const tablesLoading = ref(false);
    const columnsLoading = ref(false);
    const projectForm = reactive({
      project_code: "",
      project_name: "",
      keyin_url: "",
      compare_url: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "preparing",
      keyin_active: true,
      compare_ready: false,
      is_visible: true,
      display_order: 0
    });
    const databaseForm = reactive({
      database_id: null,
      project_code: "",
      database_code: "",
      questionnaire_name: "",
      table_preface: "",
      sample_ids_sql: "",
      search_column: "",
      search_id1_start: 1,
      search_id1_length: 12,
      search_id2_start: 13,
      search_id2_length: null,
      search_id2_mode: "exact",
      raw_database: "",
      compare_database: "",
      round_field: "round",
      round1_value: "1",
      round2_value: "2",
      completed_round_value: "0",
      compare_enabled: true,
      description: "",
      status: "draft",
      display_order: 0
    });
    const selectedProject = computed(() => surveySystems.value.find((project) => project.project_code === selectedProjectCode.value) || null);
    const selectedDatabase = computed(() => adminDatabases.value.find((database) => database.database_id === selectedDatabaseId.value) || null);
    const canUseDatabaseTools = computed(() => Boolean(selectedProjectCode.value));
    const canUseTableTools = computed(() => Boolean(selectedDatabaseId.value));
    const canUseColumnTools = computed(() => Boolean(selectedTableId.value));
    function normalizeAppBaseUrl(value) {
      const trimmed = String(value).trim();
      if (!trimmed || trimmed === "/") {
        return "/";
      }
      return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
    }
    function defaultKeyinUrl(projectCode) {
      return `https://ripedresearch.org/survey/${encodeURIComponent(projectCode)}`;
    }
    function defaultCompareUrl(projectCode) {
      return `${appBaseUrl}?project=${encodeURIComponent(projectCode)}`;
    }
    function resolveCompareHref(system) {
      return system.compare_url || defaultCompareUrl(system.project_code);
    }
    function resolveSurveyHref(system) {
      return system.survey_url || system.keyin_url || defaultKeyinUrl(system.project_code);
    }
    function canCompare(system) {
      return system.compare_ready && !system.project_ended;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "survey-list-page" }, _attrs))} data-v-7463d4ac><section class="survey-hero" data-v-7463d4ac><div class="survey-hero-nav survey-container" data-v-7463d4ac><strong data-v-7463d4ac>Survey List</strong><nav data-v-7463d4ac><button class="survey-admin-nav-button" type="button" data-v-7463d4ac> สำหรับผู้ดูแลระบบ </button></nav></div><div class="survey-hero-content" data-v-7463d4ac><h1 data-v-7463d4ac>Survey Web</h1><p data-v-7463d4ac>(web keyin data online)</p><p data-v-7463d4ac>All website on http://ripedresearch.org/survey</p></div></section>`);
      if (unref(adminSession)) {
        _push(`<section class="survey-container admin-workspace" data-v-7463d4ac><header class="admin-head" data-v-7463d4ac><div data-v-7463d4ac><p data-v-7463d4ac>Administrator</p><h2 data-v-7463d4ac>จัดการระบบ Key-in และ Compare</h2></div><div class="admin-session" data-v-7463d4ac><span data-v-7463d4ac>Admin: ${ssrInterpolate(unref(adminSession).username)}</span><button type="button" data-v-7463d4ac>ออกจากโหมดผู้ดูแล</button></div></header><div class="admin-tabbar" data-v-7463d4ac><!--[-->`);
        ssrRenderList(adminTabs, (tab) => {
          _push(`<button class="${ssrRenderClass({ active: unref(adminTab) === tab.id })}" type="button" data-v-7463d4ac>${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(adminMessage)) {
          _push(`<p class="admin-message" data-v-7463d4ac>${ssrInterpolate(unref(adminMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(adminError)) {
          _push(`<p class="admin-error" data-v-7463d4ac>${ssrInterpolate(unref(adminError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "projects" ? null : { display: "none" })}" data-v-7463d4ac><div class="section-title" data-v-7463d4ac><h3 data-v-7463d4ac>Project</h3><button type="button" data-v-7463d4ac>เพิ่มใหม่</button></div><p class="tab-hint" data-v-7463d4ac> เพิ่มหรือแก้โครงการหลักที่จะแสดงในหน้า Survey List พร้อมกำหนด URL คีย์ข้อมูล, URL compare, ช่วงเวลา และสถานะเปิดใช้งาน </p><form class="admin-form" data-v-7463d4ac><label data-v-7463d4ac> Project Code <input${ssrRenderAttr("value", unref(projectForm).project_code)} placeholder="tcls2027" data-v-7463d4ac></label><label data-v-7463d4ac> Project Name <input${ssrRenderAttr("value", unref(projectForm).project_name)} placeholder="TCLS2027" data-v-7463d4ac></label><label data-v-7463d4ac> Key-in URL <input${ssrRenderAttr("value", unref(projectForm).keyin_url)} placeholder="https://ripedresearch.org/survey/tcls2027" data-v-7463d4ac></label><label data-v-7463d4ac> Compare URL <input${ssrRenderAttr("value", unref(projectForm).compare_url)} placeholder="/compare-data/?project=tcls2027" data-v-7463d4ac></label><label data-v-7463d4ac> Start Date <input${ssrRenderAttr("value", unref(projectForm).start_date)} type="date" data-v-7463d4ac></label><label data-v-7463d4ac> End Date <input${ssrRenderAttr("value", unref(projectForm).end_date)} type="date" data-v-7463d4ac></label><label data-v-7463d4ac> Status <select data-v-7463d4ac><!--[-->`);
        ssrRenderList(projectStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-7463d4ac${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).status) ? ssrLooseContain(unref(projectForm).status, option.value) : ssrLooseEqual(unref(projectForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-7463d4ac> Display Order <input${ssrRenderAttr("value", unref(projectForm).display_order)} type="number" data-v-7463d4ac></label><label class="full" data-v-7463d4ac> Description <textarea rows="3" data-v-7463d4ac>${ssrInterpolate(unref(projectForm).description)}</textarea></label><div class="admin-check-row full" data-v-7463d4ac><label data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).keyin_active) ? ssrLooseContain(unref(projectForm).keyin_active, null) : unref(projectForm).keyin_active) ? " checked" : ""} type="checkbox" data-v-7463d4ac> เปิดคีย์ข้อมูล</label><label data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).compare_ready) ? ssrLooseContain(unref(projectForm).compare_ready, null) : unref(projectForm).compare_ready) ? " checked" : ""} type="checkbox" data-v-7463d4ac> เปิด compare data</label><label data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).is_visible) ? ssrLooseContain(unref(projectForm).is_visible, null) : unref(projectForm).is_visible) ? " checked" : ""} type="checkbox" data-v-7463d4ac> แสดงบนหน้า list</label></div><div class="form-actions full" data-v-7463d4ac><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Project")}</button></div></form><div class="admin-table-wrap" data-v-7463d4ac><table class="admin-table" data-v-7463d4ac><thead data-v-7463d4ac><tr data-v-7463d4ac><th data-v-7463d4ac>Project</th><th data-v-7463d4ac>Status</th><th data-v-7463d4ac>DB</th><th data-v-7463d4ac>Prepared</th><th data-v-7463d4ac>Tables</th><th data-v-7463d4ac>จัดการ</th></tr></thead><tbody data-v-7463d4ac><!--[-->`);
        ssrRenderList(unref(surveySystems), (project) => {
          _push(`<tr class="${ssrRenderClass({ selected: project.project_code === unref(selectedProjectCode) })}" data-v-7463d4ac><td data-v-7463d4ac><strong data-v-7463d4ac>${ssrInterpolate(project.project_name)}</strong><small data-v-7463d4ac>${ssrInterpolate(project.project_code)}</small></td><td data-v-7463d4ac><span class="${ssrRenderClass(["mini-status", project.statusTone])}" data-v-7463d4ac>${ssrInterpolate(project.status_text)}</span></td><td data-v-7463d4ac>${ssrInterpolate(project.database_count)}</td><td data-v-7463d4ac>${ssrInterpolate(project.prepared_count)}</td><td data-v-7463d4ac>${ssrInterpolate(project.table_count)}</td><td data-v-7463d4ac><button type="button" data-v-7463d4ac>เลือก</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "databases" ? null : { display: "none" })}" data-v-7463d4ac><div class="section-title" data-v-7463d4ac><h3 data-v-7463d4ac>Project Database</h3><button type="button"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac>เพิ่มฐานใหม่</button></div><p class="tab-hint" data-v-7463d4ac> เพิ่มชุดแบบสอบถามหรือฐานข้อมูลของ Project ระบุฐาน raw และชื่อฐาน compare ที่สัมพันธ์กัน โดยยังไม่สร้างฐาน _cmp จนกดเตรียมระบบ Compare </p><p class="section-note" data-v-7463d4ac>${ssrInterpolate(unref(selectedProject) ? `Project: ${unref(selectedProject).project_name}` : "เลือก Project ก่อนเพิ่มฐานข้อมูล")}</p><form class="admin-form" data-v-7463d4ac><label data-v-7463d4ac> Database Code <input${ssrRenderAttr("value", unref(databaseForm).database_code)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-7463d4ac></label><label data-v-7463d4ac> ชื่อแบบสอบถาม <input${ssrRenderAttr("value", unref(databaseForm).questionnaire_name)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="เช่น แบบสอบถามเด็ก CH1" data-v-7463d4ac></label><label data-v-7463d4ac> Preface Table <input${ssrRenderAttr("value", unref(databaseForm).table_preface)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="preface_ch" data-v-7463d4ac></label><label data-v-7463d4ac> Raw Database <input${ssrRenderAttr("value", unref(databaseForm).raw_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-7463d4ac></label><label data-v-7463d4ac> Compare Database <input${ssrRenderAttr("value", unref(databaseForm).compare_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch_cmp" data-v-7463d4ac></label><label data-v-7463d4ac> Round Field <input${ssrRenderAttr("value", unref(databaseForm).round_field)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="round" data-v-7463d4ac></label><label data-v-7463d4ac> Search Column <input${ssrRenderAttr("value", unref(databaseForm).search_column)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="CID" data-v-7463d4ac></label><label data-v-7463d4ac> searchId1 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id1_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac></label><label data-v-7463d4ac> searchId1 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id1_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac></label><label data-v-7463d4ac> searchId2 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id2_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac></label><label data-v-7463d4ac> searchId2 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id2_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="blank = end" data-v-7463d4ac></label><label data-v-7463d4ac> searchId2 Mode <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac><option value="exact" data-v-7463d4ac${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "exact") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "exact")) ? " selected" : ""}>Exact</option><option value="prefix" data-v-7463d4ac${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "prefix") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "prefix")) ? " selected" : ""}>Prefix</option></select></label><label data-v-7463d4ac> Round 1 Value <input${ssrRenderAttr("value", unref(databaseForm).round1_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="1" data-v-7463d4ac></label><label data-v-7463d4ac> Round 2 Value <input${ssrRenderAttr("value", unref(databaseForm).round2_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="2" data-v-7463d4ac></label><label data-v-7463d4ac> Completed Value <input${ssrRenderAttr("value", unref(databaseForm).completed_round_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="0" data-v-7463d4ac></label><label class="admin-check" data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).compare_enabled) ? ssrLooseContain(unref(databaseForm).compare_enabled, null) : unref(databaseForm).compare_enabled) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac><span data-v-7463d4ac>Compare Enabled</span></label><label data-v-7463d4ac> Status <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac><!--[-->`);
        ssrRenderList(databaseStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-7463d4ac${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).status) ? ssrLooseContain(unref(databaseForm).status, option.value) : ssrLooseEqual(unref(databaseForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-7463d4ac> Display Order <input${ssrRenderAttr("value", unref(databaseForm).display_order)} type="number"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac></label><label class="full" data-v-7463d4ac> Description <textarea${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="2" data-v-7463d4ac>${ssrInterpolate(unref(databaseForm).description)}</textarea></label><label class="full" data-v-7463d4ac> Sample ID SQL <textarea class="sample-sql-textarea"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="10" placeholder="SELECT &#39;cct2025&#39; AS project_code, &#39;cct2025&#39; AS database_code, CID AS id FROM cct2025.table0 UNION SELECT &#39;cct2025&#39;, &#39;cct2025&#39;, CID FROM cct2025.table1" data-v-7463d4ac>${ssrInterpolate(unref(databaseForm).sample_ids_sql)}</textarea><small class="field-help" data-v-7463d4ac>ใช้เมื่อเงื่อนไขรหัสของโครงการไม่ตายตัว SQL ต้องคืนเฉพาะ project_code, database_code, id</small></label><p class="field-help full" data-v-7463d4ac> Search split uses 1-based positions. Default searchId1 is positions 1-12 and searchId2 starts at 13, so position 12 is not duplicated. </p><div class="form-actions full" data-v-7463d4ac><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Database")}</button><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(selectedDatabaseId)) ? " disabled" : ""} data-v-7463d4ac> เตรียมระบบ Compare </button></div></form><div class="admin-table-wrap" data-v-7463d4ac><table class="admin-table" data-v-7463d4ac><thead data-v-7463d4ac><tr data-v-7463d4ac><th data-v-7463d4ac>Database Code</th><th data-v-7463d4ac>ชื่อแบบ</th><th data-v-7463d4ac>Preface</th><th data-v-7463d4ac>Raw</th><th data-v-7463d4ac>Compare</th><th data-v-7463d4ac>Round</th><th data-v-7463d4ac>Enabled</th><th data-v-7463d4ac>Status</th><th data-v-7463d4ac>Tables</th><th data-v-7463d4ac>จัดการ</th></tr></thead><tbody data-v-7463d4ac><!--[-->`);
        ssrRenderList(unref(adminDatabases), (database) => {
          _push(`<tr class="${ssrRenderClass({ selected: database.database_id === unref(selectedDatabaseId) })}" data-v-7463d4ac><td data-v-7463d4ac>${ssrInterpolate(database.database_code)}</td><td data-v-7463d4ac>${ssrInterpolate(database.questionnaire_name || "-")}</td><td data-v-7463d4ac>${ssrInterpolate(database.table_preface || database.tablePreface || "-")}</td><td data-v-7463d4ac>${ssrInterpolate(database.raw_database)}</td><td data-v-7463d4ac>${ssrInterpolate(database.compare_database)}</td><td data-v-7463d4ac>${ssrInterpolate(database.round1_value || "1")}/${ssrInterpolate(database.round2_value || "2")}/${ssrInterpolate(database.completed_round_value || "0")}</td><td data-v-7463d4ac>${ssrInterpolate(database.compare_enabled ? "on" : "off")}</td><td data-v-7463d4ac>${ssrInterpolate(database.is_prepared ? "prepared" : database.status)}</td><td data-v-7463d4ac>${ssrInterpolate(database.table_count)}</td><td data-v-7463d4ac><button type="button" data-v-7463d4ac>เลือก</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(adminLoading) && !unref(adminDatabases).length) {
          _push(`<tr data-v-7463d4ac><td colspan="10" data-v-7463d4ac>ยังไม่มีฐานข้อมูลใน Project นี้</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "tables" ? null : { display: "none" })}" data-v-7463d4ac><div class="section-title" data-v-7463d4ac><h3 data-v-7463d4ac>Tables</h3><button type="button"${ssrIncludeBooleanAttr(unref(tablesLoading) || !unref(canUseTableTools)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(tablesLoading) ? "กำลัง scan..." : "Scan Tables")}</button></div><p class="tab-hint" data-v-7463d4ac> Scan ตารางจาก raw database เลือกตารางที่เปิด Compare และกำหนดชื่อแสดงได้ ส่วน Primary Key และ Order แสดงเพื่ออ้างอิงเท่านั้น </p><p class="section-note" data-v-7463d4ac>${ssrInterpolate(unref(selectedDatabase) ? `Raw database: ${unref(selectedDatabase).raw_database}` : "เลือก Database ก่อน scan ตาราง")}</p><div class="admin-table-wrap wide" data-v-7463d4ac><table class="admin-table" data-v-7463d4ac><thead data-v-7463d4ac><tr data-v-7463d4ac><th data-v-7463d4ac>เปิด Compare</th><th data-v-7463d4ac>Table</th><th data-v-7463d4ac>Display Name</th><th data-v-7463d4ac>Primary Key</th><th data-v-7463d4ac>Order</th><th data-v-7463d4ac>Raw</th><th data-v-7463d4ac>จัดการ</th></tr></thead><tbody data-v-7463d4ac><!--[-->`);
        ssrRenderList(unref(adminTables), (table) => {
          _push(`<tr class="${ssrRenderClass({ selected: table.table_id === unref(selectedTableId) })}" data-v-7463d4ac><td data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(table.allow_compare) ? ssrLooseContain(table.allow_compare, null) : table.allow_compare) ? " checked" : ""} type="checkbox" data-v-7463d4ac></td><td data-v-7463d4ac>${ssrInterpolate(table.table_name)}</td><td data-v-7463d4ac><input${ssrRenderAttr("value", table.display_name)} data-v-7463d4ac></td><td data-v-7463d4ac><span class="readonly-text" data-v-7463d4ac>${ssrInterpolate(table.primary_keys_text || "-")}</span></td><td data-v-7463d4ac><span class="readonly-order" data-v-7463d4ac>${ssrInterpolate(table.display_order)}</span></td><td data-v-7463d4ac>${ssrInterpolate(table.exists_in_raw ? "พบ" : "ไม่พบ")}</td><td class="button-stack" data-v-7463d4ac><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-7463d4ac>บันทึก</button><button type="button"${ssrIncludeBooleanAttr(!table.table_id) ? " disabled" : ""} data-v-7463d4ac>ตัวแปร</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(tablesLoading) && !unref(adminTables).length) {
          _push(`<tr data-v-7463d4ac><td colspan="7" data-v-7463d4ac>ยังไม่มีรายการตาราง กด Scan Tables เพื่ออ่านจาก raw database</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "columns" ? null : { display: "none" })}" data-v-7463d4ac><div class="section-title" data-v-7463d4ac><h3 data-v-7463d4ac>Variables</h3><button type="button"${ssrIncludeBooleanAttr(unref(columnsLoading) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(columnsLoading) ? "กำลัง scan..." : "Scan Variables")}</button></div><p class="tab-hint" data-v-7463d4ac> ตั้งค่าตัวแปรของตารางที่เลือก โดยระบบจะ scan ตัวแปรจาก raw table ทุกครั้ง และบันทึกลงฐานกลางเฉพาะตัวแปรที่ถูกซ่อนเท่านั้น </p><dl class="column-head-hint" data-v-7463d4ac><div data-v-7463d4ac><dt data-v-7463d4ac>Variables</dt><dd data-v-7463d4ac>ชื่อตัวแปรจาก raw table</dd></div><div data-v-7463d4ac><dt data-v-7463d4ac>Type</dt><dd data-v-7463d4ac>ชนิดข้อมูลที่ scan จากฐานข้อมูล</dd></div><div data-v-7463d4ac><dt data-v-7463d4ac>Visible</dt><dd data-v-7463d4ac>ติ๊กออกเพื่อซ่อนตัวแปร ระบบจะเก็บเฉพาะรายการที่ถูกซ่อน</dd></div><div data-v-7463d4ac><dt data-v-7463d4ac>PK</dt><dd data-v-7463d4ac>ใช้เป็น key จับคู่ข้อมูล</dd></div><div data-v-7463d4ac><dt data-v-7463d4ac>Order</dt><dd data-v-7463d4ac>ลำดับการแสดงตัวแปร อ่านอย่างเดียว</dd></div></dl><p class="section-note" data-v-7463d4ac>${ssrInterpolate(unref(selectedTableName) ? `Table: ${unref(selectedTableName)}` : "เลือกตารางก่อนตั้งค่าตัวแปร")}</p><div class="admin-table-wrap wide" data-v-7463d4ac><table class="admin-table column-table" data-v-7463d4ac><thead data-v-7463d4ac><tr data-v-7463d4ac><th data-v-7463d4ac>Variable</th><th data-v-7463d4ac>Type</th><th data-v-7463d4ac>Visible</th><th data-v-7463d4ac>PK</th><th data-v-7463d4ac>Order</th></tr></thead><tbody data-v-7463d4ac><!--[-->`);
        ssrRenderList(unref(adminColumns), (column) => {
          _push(`<tr data-v-7463d4ac><td data-v-7463d4ac>${ssrInterpolate(column.column_name)}</td><td data-v-7463d4ac>${ssrInterpolate(column.data_type)}</td><td data-v-7463d4ac><input${ssrIncludeBooleanAttr(Array.isArray(column.visible) ? ssrLooseContain(column.visible, null) : column.visible) ? " checked" : ""} type="checkbox" data-v-7463d4ac></td><td data-v-7463d4ac><span class="${ssrRenderClass(["readonly-flag", { active: column.is_primary_key }])}" data-v-7463d4ac>${ssrInterpolate(column.is_primary_key ? "PK" : "-")}</span></td><td data-v-7463d4ac><span class="readonly-order" data-v-7463d4ac>${ssrInterpolate(column.display_order)}</span></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(columnsLoading) && !unref(adminColumns).length) {
          _push(`<tr data-v-7463d4ac><td colspan="5" data-v-7463d4ac>ยังไม่มีรายการตัวแปร เลือกตารางแล้วกด Scan Variables</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><div class="form-actions" data-v-7463d4ac><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Hidden Columns")}</button></div></section></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="survey-container survey-tools" data-v-7463d4ac><div data-v-7463d4ac><h2 data-v-7463d4ac>ระบบคีย์และโปรเจกต์ Compare</h2><p data-v-7463d4ac>เลือกโปรเจกต์เพื่อเข้าสู่ระบบคีย์ข้อมูล หรือเข้าสู่ระบบเปรียบเทียบข้อมูลผ่านพารามิเตอร์ project</p></div></section><section class="survey-container survey-card-grid" data-v-7463d4ac>`);
      if (unref(projectsLoading)) {
        _push(`<div class="survey-empty-state" data-v-7463d4ac> กำลังโหลดรายการโปรเจกต์จากฐานข้อมูล... </div>`);
      } else if (unref(projectLoadError)) {
        _push(`<div class="survey-empty-state error" data-v-7463d4ac>${ssrInterpolate(unref(projectLoadError))}</div>`);
      } else if (!unref(surveySystems).length) {
        _push(`<div class="survey-empty-state" data-v-7463d4ac> ยังไม่มีรายการโปรเจกต์ในฐานข้อมูล </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(surveySystems), (system) => {
        _push(`<article class="survey-system-card" data-v-7463d4ac><span class="monitor-icon" aria-hidden="true" data-v-7463d4ac></span><h3 data-v-7463d4ac>${ssrInterpolate(system.title)}</h3><p data-v-7463d4ac>${ssrInterpolate(system.subtitle)}</p><em class="${ssrRenderClass(["survey-status", system.statusTone])}" data-v-7463d4ac>${ssrInterpolate(system.status_text)}</em><small data-v-7463d4ac>${ssrInterpolate(system.summary)}</small><div class="survey-card-meta" data-v-7463d4ac><span data-v-7463d4ac>${ssrInterpolate(system.database_count)} ฐานข้อมูล</span><span data-v-7463d4ac>${ssrInterpolate(system.table_count)} ตาราง compare</span></div><div class="survey-card-actions" data-v-7463d4ac>`);
        if (system.keyin_active) {
          _push(`<a class="survey-key-button"${ssrRenderAttr("href", resolveSurveyHref(system))} data-v-7463d4ac> คีย์ข้อมูล </a>`);
        } else {
          _push(`<button class="survey-key-button disabled" type="button" disabled data-v-7463d4ac>${ssrInterpolate(system.project_ended ? "จบโครงการ" : "ปิดคีย์แล้ว")}</button>`);
        }
        if (canCompare(system)) {
          _push(`<a class="survey-compare-button"${ssrRenderAttr("href", resolveCompareHref(system))} data-v-7463d4ac> compare data </a>`);
        } else {
          _push(`<button class="survey-compare-button disabled" type="button" disabled data-v-7463d4ac> compare data </button>`);
        }
        _push(`</div></article>`);
      });
      _push(`<!--]--></section><footer class="survey-footer" data-v-7463d4ac><div class="survey-footer-content" data-v-7463d4ac><div class="spa-brand" aria-label="SPA" data-v-7463d4ac><span class="spa-mark" aria-hidden="true" data-v-7463d4ac></span><strong data-v-7463d4ac>SPA</strong></div><div class="spa-link-row" data-v-7463d4ac><span data-v-7463d4ac>go to System for Project Administrator(SPA) ?</span><a href="https://ripedresearch.org/spa" data-v-7463d4ac>Click here</a></div></div></footer>`);
      if (unref(showAdminLogin)) {
        _push(`<div class="admin-modal-backdrop" data-v-7463d4ac><section class="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title" data-v-7463d4ac><header data-v-7463d4ac><h2 id="admin-login-title" data-v-7463d4ac>สำหรับผู้ดูแลระบบ</h2><button type="button" aria-label="Close" data-v-7463d4ac>×</button></header><form class="admin-login-form" data-v-7463d4ac><label data-v-7463d4ac> UserName <input${ssrRenderAttr("value", unref(adminCredentials).username)} autocomplete="username" data-v-7463d4ac></label><label data-v-7463d4ac> Password <input${ssrRenderAttr("value", unref(adminCredentials).password)} type="password" autocomplete="current-password" data-v-7463d4ac></label>`);
        if (unref(adminLoginError)) {
          _push(`<p class="admin-error" data-v-7463d4ac>${ssrInterpolate(unref(adminLoginError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer data-v-7463d4ac><button class="admin-cancel-button" type="button" data-v-7463d4ac>ยกเลิก</button><button class="admin-login-button" type="submit"${ssrIncludeBooleanAttr(unref(adminLoginLoading)) ? " disabled" : ""} data-v-7463d4ac>${ssrInterpolate(unref(adminLoginLoading) ? "กำลังตรวจสอบ..." : "Login")}</button></footer></form></section></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7463d4ac"]]);
export {
  list as default
};
//# sourceMappingURL=list-DHOfi4eb.js.map
