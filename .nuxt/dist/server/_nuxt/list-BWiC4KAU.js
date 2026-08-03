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
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "survey-list-page" }, _attrs))} data-v-039e0794><section class="survey-hero" data-v-039e0794><div class="survey-hero-nav survey-container" data-v-039e0794><strong data-v-039e0794>Survey List</strong><nav data-v-039e0794><button class="survey-admin-nav-button" type="button" data-v-039e0794> สำหรับผู้ดูแลระบบ </button></nav></div><div class="survey-hero-content" data-v-039e0794><h1 data-v-039e0794>Survey Web</h1><p data-v-039e0794>(web keyin data online)</p><p data-v-039e0794>All website on http://ripedresearch.org/survey</p></div></section>`);
      if (unref(adminSession)) {
        _push(`<section class="survey-container admin-workspace" data-v-039e0794><header class="admin-head" data-v-039e0794><div data-v-039e0794><p data-v-039e0794>Administrator</p><h2 data-v-039e0794>จัดการระบบ Key-in และ Compare</h2></div><div class="admin-session" data-v-039e0794><span data-v-039e0794>Admin: ${ssrInterpolate(unref(adminSession).username)}</span><button type="button" data-v-039e0794>ออกจากโหมดผู้ดูแล</button></div></header><div class="admin-tabbar" data-v-039e0794><!--[-->`);
        ssrRenderList(adminTabs, (tab) => {
          _push(`<button class="${ssrRenderClass({ active: unref(adminTab) === tab.id })}" type="button" data-v-039e0794>${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(adminMessage)) {
          _push(`<p class="admin-message" data-v-039e0794>${ssrInterpolate(unref(adminMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(adminError)) {
          _push(`<p class="admin-error" data-v-039e0794>${ssrInterpolate(unref(adminError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "projects" ? null : { display: "none" })}" data-v-039e0794><div class="section-title" data-v-039e0794><h3 data-v-039e0794>Project</h3><button type="button" data-v-039e0794>เพิ่มใหม่</button></div><p class="tab-hint" data-v-039e0794> เพิ่มหรือแก้โครงการหลักที่จะแสดงในหน้า Survey List พร้อมกำหนด URL คีย์ข้อมูล, URL compare, ช่วงเวลา และสถานะเปิดใช้งาน </p><form class="admin-form" data-v-039e0794><label data-v-039e0794> Project Code <input${ssrRenderAttr("value", unref(projectForm).project_code)} placeholder="tcls2027" data-v-039e0794></label><label data-v-039e0794> Project Name <input${ssrRenderAttr("value", unref(projectForm).project_name)} placeholder="TCLS2027" data-v-039e0794></label><label data-v-039e0794> Key-in URL <input${ssrRenderAttr("value", unref(projectForm).keyin_url)} placeholder="https://ripedresearch.org/survey/tcls2027" data-v-039e0794></label><label data-v-039e0794> Compare URL <input${ssrRenderAttr("value", unref(projectForm).compare_url)} placeholder="/compare-data/?project=tcls2027" data-v-039e0794></label><label data-v-039e0794> Start Date <input${ssrRenderAttr("value", unref(projectForm).start_date)} type="date" data-v-039e0794></label><label data-v-039e0794> End Date <input${ssrRenderAttr("value", unref(projectForm).end_date)} type="date" data-v-039e0794></label><label data-v-039e0794> Status <select data-v-039e0794><!--[-->`);
        ssrRenderList(projectStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-039e0794${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).status) ? ssrLooseContain(unref(projectForm).status, option.value) : ssrLooseEqual(unref(projectForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-039e0794> Display Order <input${ssrRenderAttr("value", unref(projectForm).display_order)} type="number" data-v-039e0794></label><label class="full" data-v-039e0794> Description <textarea rows="3" data-v-039e0794>${ssrInterpolate(unref(projectForm).description)}</textarea></label><div class="admin-check-row full" data-v-039e0794><label data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).keyin_active) ? ssrLooseContain(unref(projectForm).keyin_active, null) : unref(projectForm).keyin_active) ? " checked" : ""} type="checkbox" data-v-039e0794> เปิดคีย์ข้อมูล</label><label data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).compare_ready) ? ssrLooseContain(unref(projectForm).compare_ready, null) : unref(projectForm).compare_ready) ? " checked" : ""} type="checkbox" data-v-039e0794> เปิด compare data</label><label data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).is_visible) ? ssrLooseContain(unref(projectForm).is_visible, null) : unref(projectForm).is_visible) ? " checked" : ""} type="checkbox" data-v-039e0794> แสดงบนหน้า list</label></div><div class="form-actions full" data-v-039e0794><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Project")}</button></div></form><div class="admin-table-wrap" data-v-039e0794><table class="admin-table" data-v-039e0794><thead data-v-039e0794><tr data-v-039e0794><th data-v-039e0794>Project</th><th data-v-039e0794>Status</th><th data-v-039e0794>DB</th><th data-v-039e0794>Prepared</th><th data-v-039e0794>Tables</th><th data-v-039e0794>จัดการ</th></tr></thead><tbody data-v-039e0794><!--[-->`);
        ssrRenderList(unref(surveySystems), (project) => {
          _push(`<tr class="${ssrRenderClass({ selected: project.project_code === unref(selectedProjectCode) })}" data-v-039e0794><td data-v-039e0794><strong data-v-039e0794>${ssrInterpolate(project.project_name)}</strong><small data-v-039e0794>${ssrInterpolate(project.project_code)}</small></td><td data-v-039e0794><span class="${ssrRenderClass(["mini-status", project.statusTone])}" data-v-039e0794>${ssrInterpolate(project.status_text)}</span></td><td data-v-039e0794>${ssrInterpolate(project.database_count)}</td><td data-v-039e0794>${ssrInterpolate(project.prepared_count)}</td><td data-v-039e0794>${ssrInterpolate(project.table_count)}</td><td data-v-039e0794><button type="button" data-v-039e0794>เลือก</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "databases" ? null : { display: "none" })}" data-v-039e0794><div class="section-title" data-v-039e0794><h3 data-v-039e0794>Project Database</h3><button type="button"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794>เพิ่มฐานใหม่</button></div><p class="tab-hint" data-v-039e0794> เพิ่มชุดแบบสอบถามหรือฐานข้อมูลของ Project ระบุฐาน raw และชื่อฐาน compare ที่สัมพันธ์กัน โดยยังไม่สร้างฐาน _cmp จนกดเตรียมระบบ Compare </p><p class="section-note" data-v-039e0794>${ssrInterpolate(unref(selectedProject) ? `Project: ${unref(selectedProject).project_name}` : "เลือก Project ก่อนเพิ่มฐานข้อมูล")}</p><form class="admin-form" data-v-039e0794><label data-v-039e0794> Database Code <input${ssrRenderAttr("value", unref(databaseForm).database_code)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-039e0794></label><label data-v-039e0794> ชื่อแบบสอบถาม <input${ssrRenderAttr("value", unref(databaseForm).questionnaire_name)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="เช่น แบบสอบถามเด็ก CH1" data-v-039e0794></label><label data-v-039e0794> Raw Database <input${ssrRenderAttr("value", unref(databaseForm).raw_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-039e0794></label><label data-v-039e0794> Compare Database <input${ssrRenderAttr("value", unref(databaseForm).compare_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch_cmp" data-v-039e0794></label><label data-v-039e0794> Round Field <input${ssrRenderAttr("value", unref(databaseForm).round_field)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="round" data-v-039e0794></label><label data-v-039e0794> Search Column <input${ssrRenderAttr("value", unref(databaseForm).search_column)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="CID" data-v-039e0794></label><label data-v-039e0794> searchId1 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id1_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794></label><label data-v-039e0794> searchId1 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id1_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794></label><label data-v-039e0794> searchId2 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id2_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794></label><label data-v-039e0794> searchId2 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id2_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="blank = end" data-v-039e0794></label><label data-v-039e0794> searchId2 Mode <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794><option value="exact" data-v-039e0794${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "exact") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "exact")) ? " selected" : ""}>Exact</option><option value="prefix" data-v-039e0794${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "prefix") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "prefix")) ? " selected" : ""}>Prefix</option></select></label><label data-v-039e0794> Round 1 Value <input${ssrRenderAttr("value", unref(databaseForm).round1_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="1" data-v-039e0794></label><label data-v-039e0794> Round 2 Value <input${ssrRenderAttr("value", unref(databaseForm).round2_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="2" data-v-039e0794></label><label data-v-039e0794> Completed Value <input${ssrRenderAttr("value", unref(databaseForm).completed_round_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="0" data-v-039e0794></label><label class="admin-check" data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).compare_enabled) ? ssrLooseContain(unref(databaseForm).compare_enabled, null) : unref(databaseForm).compare_enabled) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794><span data-v-039e0794>Compare Enabled</span></label><label data-v-039e0794> Status <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794><!--[-->`);
        ssrRenderList(databaseStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-039e0794${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).status) ? ssrLooseContain(unref(databaseForm).status, option.value) : ssrLooseEqual(unref(databaseForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-039e0794> Display Order <input${ssrRenderAttr("value", unref(databaseForm).display_order)} type="number"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794></label><label class="full" data-v-039e0794> Description <textarea${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="2" data-v-039e0794>${ssrInterpolate(unref(databaseForm).description)}</textarea></label><label class="full" data-v-039e0794> Sample ID SQL <textarea class="sample-sql-textarea"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="10" placeholder="SELECT &#39;cct2025&#39; AS project_code, &#39;cct2025&#39; AS database_code, CID AS id FROM cct2025.table0 UNION SELECT &#39;cct2025&#39;, &#39;cct2025&#39;, CID FROM cct2025.table1" data-v-039e0794>${ssrInterpolate(unref(databaseForm).sample_ids_sql)}</textarea><small class="field-help" data-v-039e0794>ใช้เมื่อเงื่อนไขรหัสของโครงการไม่ตายตัว SQL ต้องคืนเฉพาะ project_code, database_code, id</small></label><p class="field-help full" data-v-039e0794> Search split uses 1-based positions. Default searchId1 is positions 1-12 and searchId2 starts at 13, so position 12 is not duplicated. </p><div class="form-actions full" data-v-039e0794><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Database")}</button><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(selectedDatabaseId)) ? " disabled" : ""} data-v-039e0794> เตรียมระบบ Compare </button></div></form><div class="admin-table-wrap" data-v-039e0794><table class="admin-table" data-v-039e0794><thead data-v-039e0794><tr data-v-039e0794><th data-v-039e0794>Database Code</th><th data-v-039e0794>ชื่อแบบ</th><th data-v-039e0794>Raw</th><th data-v-039e0794>Compare</th><th data-v-039e0794>Round</th><th data-v-039e0794>Enabled</th><th data-v-039e0794>Status</th><th data-v-039e0794>Tables</th><th data-v-039e0794>จัดการ</th></tr></thead><tbody data-v-039e0794><!--[-->`);
        ssrRenderList(unref(adminDatabases), (database) => {
          _push(`<tr class="${ssrRenderClass({ selected: database.database_id === unref(selectedDatabaseId) })}" data-v-039e0794><td data-v-039e0794>${ssrInterpolate(database.database_code)}</td><td data-v-039e0794>${ssrInterpolate(database.questionnaire_name || "-")}</td><td data-v-039e0794>${ssrInterpolate(database.raw_database)}</td><td data-v-039e0794>${ssrInterpolate(database.compare_database)}</td><td data-v-039e0794>${ssrInterpolate(database.round1_value || "1")}/${ssrInterpolate(database.round2_value || "2")}/${ssrInterpolate(database.completed_round_value || "0")}</td><td data-v-039e0794>${ssrInterpolate(database.compare_enabled ? "on" : "off")}</td><td data-v-039e0794>${ssrInterpolate(database.is_prepared ? "prepared" : database.status)}</td><td data-v-039e0794>${ssrInterpolate(database.table_count)}</td><td data-v-039e0794><button type="button" data-v-039e0794>เลือก</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(adminLoading) && !unref(adminDatabases).length) {
          _push(`<tr data-v-039e0794><td colspan="9" data-v-039e0794>ยังไม่มีฐานข้อมูลใน Project นี้</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "tables" ? null : { display: "none" })}" data-v-039e0794><div class="section-title" data-v-039e0794><h3 data-v-039e0794>Tables</h3><button type="button"${ssrIncludeBooleanAttr(unref(tablesLoading) || !unref(canUseTableTools)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(tablesLoading) ? "กำลัง scan..." : "Scan Tables")}</button></div><p class="tab-hint" data-v-039e0794> Scan ตารางจาก raw database เลือกตารางที่เปิด Compare และกำหนดชื่อแสดงได้ ส่วน Primary Key และ Order แสดงเพื่ออ้างอิงเท่านั้น </p><p class="section-note" data-v-039e0794>${ssrInterpolate(unref(selectedDatabase) ? `Raw database: ${unref(selectedDatabase).raw_database}` : "เลือก Database ก่อน scan ตาราง")}</p><div class="admin-table-wrap wide" data-v-039e0794><table class="admin-table" data-v-039e0794><thead data-v-039e0794><tr data-v-039e0794><th data-v-039e0794>เปิด Compare</th><th data-v-039e0794>Table</th><th data-v-039e0794>Display Name</th><th data-v-039e0794>Primary Key</th><th data-v-039e0794>Order</th><th data-v-039e0794>Raw</th><th data-v-039e0794>จัดการ</th></tr></thead><tbody data-v-039e0794><!--[-->`);
        ssrRenderList(unref(adminTables), (table) => {
          _push(`<tr class="${ssrRenderClass({ selected: table.table_id === unref(selectedTableId) })}" data-v-039e0794><td data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(table.allow_compare) ? ssrLooseContain(table.allow_compare, null) : table.allow_compare) ? " checked" : ""} type="checkbox" data-v-039e0794></td><td data-v-039e0794>${ssrInterpolate(table.table_name)}</td><td data-v-039e0794><input${ssrRenderAttr("value", table.display_name)} data-v-039e0794></td><td data-v-039e0794><span class="readonly-text" data-v-039e0794>${ssrInterpolate(table.primary_keys_text || "-")}</span></td><td data-v-039e0794><span class="readonly-order" data-v-039e0794>${ssrInterpolate(table.display_order)}</span></td><td data-v-039e0794>${ssrInterpolate(table.exists_in_raw ? "พบ" : "ไม่พบ")}</td><td class="button-stack" data-v-039e0794><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-039e0794>บันทึก</button><button type="button"${ssrIncludeBooleanAttr(!table.table_id) ? " disabled" : ""} data-v-039e0794>ตัวแปร</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(tablesLoading) && !unref(adminTables).length) {
          _push(`<tr data-v-039e0794><td colspan="7" data-v-039e0794>ยังไม่มีรายการตาราง กด Scan Tables เพื่ออ่านจาก raw database</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "columns" ? null : { display: "none" })}" data-v-039e0794><div class="section-title" data-v-039e0794><h3 data-v-039e0794>Variables</h3><button type="button"${ssrIncludeBooleanAttr(unref(columnsLoading) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(columnsLoading) ? "กำลัง scan..." : "Scan Variables")}</button></div><p class="tab-hint" data-v-039e0794> ตั้งค่าตัวแปรของตารางที่เลือก โดยระบบจะ scan ตัวแปรจาก raw table ทุกครั้ง และบันทึกลงฐานกลางเฉพาะตัวแปรที่ถูกซ่อนเท่านั้น </p><dl class="column-head-hint" data-v-039e0794><div data-v-039e0794><dt data-v-039e0794>Variables</dt><dd data-v-039e0794>ชื่อตัวแปรจาก raw table</dd></div><div data-v-039e0794><dt data-v-039e0794>Type</dt><dd data-v-039e0794>ชนิดข้อมูลที่ scan จากฐานข้อมูล</dd></div><div data-v-039e0794><dt data-v-039e0794>Visible</dt><dd data-v-039e0794>ติ๊กออกเพื่อซ่อนตัวแปร ระบบจะเก็บเฉพาะรายการที่ถูกซ่อน</dd></div><div data-v-039e0794><dt data-v-039e0794>PK</dt><dd data-v-039e0794>ใช้เป็น key จับคู่ข้อมูล</dd></div><div data-v-039e0794><dt data-v-039e0794>Order</dt><dd data-v-039e0794>ลำดับการแสดงตัวแปร อ่านอย่างเดียว</dd></div></dl><p class="section-note" data-v-039e0794>${ssrInterpolate(unref(selectedTableName) ? `Table: ${unref(selectedTableName)}` : "เลือกตารางก่อนตั้งค่าตัวแปร")}</p><div class="admin-table-wrap wide" data-v-039e0794><table class="admin-table column-table" data-v-039e0794><thead data-v-039e0794><tr data-v-039e0794><th data-v-039e0794>Variable</th><th data-v-039e0794>Type</th><th data-v-039e0794>Visible</th><th data-v-039e0794>PK</th><th data-v-039e0794>Order</th></tr></thead><tbody data-v-039e0794><!--[-->`);
        ssrRenderList(unref(adminColumns), (column) => {
          _push(`<tr data-v-039e0794><td data-v-039e0794>${ssrInterpolate(column.column_name)}</td><td data-v-039e0794>${ssrInterpolate(column.data_type)}</td><td data-v-039e0794><input${ssrIncludeBooleanAttr(Array.isArray(column.visible) ? ssrLooseContain(column.visible, null) : column.visible) ? " checked" : ""} type="checkbox" data-v-039e0794></td><td data-v-039e0794><span class="${ssrRenderClass(["readonly-flag", { active: column.is_primary_key }])}" data-v-039e0794>${ssrInterpolate(column.is_primary_key ? "PK" : "-")}</span></td><td data-v-039e0794><span class="readonly-order" data-v-039e0794>${ssrInterpolate(column.display_order)}</span></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(columnsLoading) && !unref(adminColumns).length) {
          _push(`<tr data-v-039e0794><td colspan="5" data-v-039e0794>ยังไม่มีรายการตัวแปร เลือกตารางแล้วกด Scan Variables</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><div class="form-actions" data-v-039e0794><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(adminSaving) ? "กำลังบันทึก..." : "บันทึก Hidden Columns")}</button></div></section></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="survey-container survey-tools" data-v-039e0794><div data-v-039e0794><h2 data-v-039e0794>ระบบคีย์และโปรเจกต์ Compare</h2><p data-v-039e0794>เลือกโปรเจกต์เพื่อเข้าสู่ระบบคีย์ข้อมูล หรือเข้าสู่ระบบเปรียบเทียบข้อมูลผ่านพารามิเตอร์ project</p></div></section><section class="survey-container survey-card-grid" data-v-039e0794>`);
      if (unref(projectsLoading)) {
        _push(`<div class="survey-empty-state" data-v-039e0794> กำลังโหลดรายการโปรเจกต์จากฐานข้อมูล... </div>`);
      } else if (unref(projectLoadError)) {
        _push(`<div class="survey-empty-state error" data-v-039e0794>${ssrInterpolate(unref(projectLoadError))}</div>`);
      } else if (!unref(surveySystems).length) {
        _push(`<div class="survey-empty-state" data-v-039e0794> ยังไม่มีรายการโปรเจกต์ในฐานข้อมูล </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(surveySystems), (system) => {
        _push(`<article class="survey-system-card" data-v-039e0794><span class="monitor-icon" aria-hidden="true" data-v-039e0794></span><h3 data-v-039e0794>${ssrInterpolate(system.title)}</h3><p data-v-039e0794>${ssrInterpolate(system.subtitle)}</p><em class="${ssrRenderClass(["survey-status", system.statusTone])}" data-v-039e0794>${ssrInterpolate(system.status_text)}</em><small data-v-039e0794>${ssrInterpolate(system.summary)}</small><div class="survey-card-meta" data-v-039e0794><span data-v-039e0794>${ssrInterpolate(system.database_count)} ฐานข้อมูล</span><span data-v-039e0794>${ssrInterpolate(system.table_count)} ตาราง compare</span></div><div class="survey-card-actions" data-v-039e0794>`);
        if (system.keyin_active) {
          _push(`<a class="survey-key-button"${ssrRenderAttr("href", resolveSurveyHref(system))} data-v-039e0794> คีย์ข้อมูล </a>`);
        } else {
          _push(`<button class="survey-key-button disabled" type="button" disabled data-v-039e0794>${ssrInterpolate(system.project_ended ? "จบโครงการ" : "ปิดคีย์แล้ว")}</button>`);
        }
        if (canCompare(system)) {
          _push(`<a class="survey-compare-button"${ssrRenderAttr("href", resolveCompareHref(system))} data-v-039e0794> compare data </a>`);
        } else {
          _push(`<button class="survey-compare-button disabled" type="button" disabled data-v-039e0794> compare data </button>`);
        }
        _push(`</div></article>`);
      });
      _push(`<!--]--></section><footer class="survey-footer" data-v-039e0794><div class="survey-footer-content" data-v-039e0794><div class="spa-brand" aria-label="SPA" data-v-039e0794><span class="spa-mark" aria-hidden="true" data-v-039e0794></span><strong data-v-039e0794>SPA</strong></div><div class="spa-link-row" data-v-039e0794><span data-v-039e0794>go to System for Project Administrator(SPA) ?</span><a href="https://ripedresearch.org/spa" data-v-039e0794>Click here</a></div></div></footer>`);
      if (unref(showAdminLogin)) {
        _push(`<div class="admin-modal-backdrop" data-v-039e0794><section class="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title" data-v-039e0794><header data-v-039e0794><h2 id="admin-login-title" data-v-039e0794>สำหรับผู้ดูแลระบบ</h2><button type="button" aria-label="Close" data-v-039e0794>×</button></header><form class="admin-login-form" data-v-039e0794><label data-v-039e0794> UserName <input${ssrRenderAttr("value", unref(adminCredentials).username)} autocomplete="username" data-v-039e0794></label><label data-v-039e0794> Password <input${ssrRenderAttr("value", unref(adminCredentials).password)} type="password" autocomplete="current-password" data-v-039e0794></label>`);
        if (unref(adminLoginError)) {
          _push(`<p class="admin-error" data-v-039e0794>${ssrInterpolate(unref(adminLoginError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer data-v-039e0794><button class="admin-cancel-button" type="button" data-v-039e0794>ยกเลิก</button><button class="admin-login-button" type="submit"${ssrIncludeBooleanAttr(unref(adminLoginLoading)) ? " disabled" : ""} data-v-039e0794>${ssrInterpolate(unref(adminLoginLoading) ? "กำลังตรวจสอบ..." : "Login")}</button></footer></form></section></div>`);
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
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-039e0794"]]);
export {
  list as default
};
//# sourceMappingURL=list-BWiC4KAU.js.map
