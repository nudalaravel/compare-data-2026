import { ref, reactive, computed, mergeProps, unref, useSSRContext } from 'file://E:/Project2026/compare-data/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'file://E:/Project2026/compare-data/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, u as useRuntimeConfig } from './server.mjs';
import { u as useHead } from './v3-BRAkCVbx.mjs';
import 'file://E:/Project2026/compare-data/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file://E:/Project2026/compare-data/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://E:/Project2026/compare-data/node_modules/h3/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/ufo/dist/index.mjs';
import '../_/nitro.mjs';
import 'file://E:/Project2026/compare-data/node_modules/destr/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/hookable/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/node-mock-http/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/unstorage/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/unstorage/drivers/fs.mjs';
import 'file:///E:/Project2026/compare-data/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import 'file://E:/Project2026/compare-data/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://E:/Project2026/compare-data/node_modules/ohash/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/klona/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/defu/dist/defu.mjs';
import 'file://E:/Project2026/compare-data/node_modules/scule/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://E:/Project2026/compare-data/node_modules/pathe/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/unhead/dist/server.mjs';
import 'node:async_hooks';
import 'file://E:/Project2026/compare-data/node_modules/devalue/index.js';
import 'file://E:/Project2026/compare-data/node_modules/unhead/dist/utils.mjs';
import 'file://E:/Project2026/compare-data/node_modules/unhead/dist/plugins.mjs';
import 'file://E:/Project2026/compare-data/node_modules/nuxt/node_modules/unctx/dist/index.mjs';
import 'file://E:/Project2026/compare-data/node_modules/pinia/dist/pinia.js';
import 'file://E:/Project2026/compare-data/node_modules/vue-router/vue-router.node.mjs';

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
      { value: "draft", label: "\u0E23\u0E48\u0E32\u0E07" },
      { value: "preparing", label: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21 Compare" },
      { value: "active", label: "\u0E40\u0E1B\u0E34\u0E14\u0E04\u0E35\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" },
      { value: "ready", label: "\u0E1E\u0E23\u0E49\u0E2D\u0E21 compare data" },
      { value: "key_closed", label: "\u0E04\u0E35\u0E22\u0E4C\u0E08\u0E1A\u0E41\u0E25\u0E49\u0E27" },
      { value: "ended", label: "\u0E08\u0E1A\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23" }
    ];
    const databaseStatusOptions = [
      { value: "draft", label: "\u0E23\u0E48\u0E32\u0E07" },
      { value: "ready", label: "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E15\u0E32\u0E23\u0E32\u0E07" },
      { value: "prepared", label: "\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21 Compare \u0E41\u0E25\u0E49\u0E27" },
      { value: "disabled", label: "\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" }
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
      display_order: 0,
      color: "blue"
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
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "survey-list-page" }, _attrs))} data-v-1045711c><section class="survey-hero" data-v-1045711c><div class="survey-hero-nav survey-container" data-v-1045711c><strong data-v-1045711c>Survey List</strong><nav data-v-1045711c><button class="survey-admin-nav-button" type="button" data-v-1045711c> \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A </button></nav></div><div class="survey-hero-content" data-v-1045711c><h1 data-v-1045711c>Survey Web</h1><p data-v-1045711c>(web keyin data online)</p><p data-v-1045711c>All website on http://ripedresearch.org/survey</p></div></section>`);
      if (unref(adminSession)) {
        _push(`<section class="survey-container admin-workspace" data-v-1045711c><header class="admin-head" data-v-1045711c><div data-v-1045711c><p data-v-1045711c>Administrator</p><h2 data-v-1045711c>\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E23\u0E30\u0E1A\u0E1A Key-in \u0E41\u0E25\u0E30 Compare</h2></div><div class="admin-session" data-v-1045711c><span data-v-1045711c>Admin: ${ssrInterpolate(unref(adminSession).username)}</span><button type="button" data-v-1045711c>\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25</button></div></header><div class="admin-tabbar" data-v-1045711c><!--[-->`);
        ssrRenderList(adminTabs, (tab) => {
          _push(`<button class="${ssrRenderClass({ active: unref(adminTab) === tab.id })}" type="button" data-v-1045711c>${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(adminMessage)) {
          _push(`<p class="admin-message" data-v-1045711c>${ssrInterpolate(unref(adminMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(adminError)) {
          _push(`<p class="admin-error" data-v-1045711c>${ssrInterpolate(unref(adminError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "projects" ? null : { display: "none" })}" data-v-1045711c><div class="section-title" data-v-1045711c><h3 data-v-1045711c>Project</h3><button type="button" data-v-1045711c>\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48</button></div><p class="tab-hint" data-v-1045711c> \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E23\u0E37\u0E2D\u0E41\u0E01\u0E49\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23\u0E2B\u0E25\u0E31\u0E01\u0E17\u0E35\u0E48\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32 Survey List \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E33\u0E2B\u0E19\u0E14 URL \u0E04\u0E35\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25, URL compare, \u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32 \u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 </p><form class="admin-form" data-v-1045711c><label data-v-1045711c> Project Code <input${ssrRenderAttr("value", unref(projectForm).project_code)} placeholder="tcls2027" data-v-1045711c></label><label data-v-1045711c> Project Name <input${ssrRenderAttr("value", unref(projectForm).project_name)} placeholder="TCLS2027" data-v-1045711c></label><label data-v-1045711c> Key-in URL <input${ssrRenderAttr("value", unref(projectForm).keyin_url)} placeholder="https://ripedresearch.org/survey/tcls2027" data-v-1045711c></label><label data-v-1045711c> Compare URL <input${ssrRenderAttr("value", unref(projectForm).compare_url)} placeholder="/compare-data/?project=tcls2027" data-v-1045711c></label><label data-v-1045711c> Start Date <input${ssrRenderAttr("value", unref(projectForm).start_date)} type="date" data-v-1045711c></label><label data-v-1045711c> End Date <input${ssrRenderAttr("value", unref(projectForm).end_date)} type="date" data-v-1045711c></label><label data-v-1045711c> Status <select data-v-1045711c><!--[-->`);
        ssrRenderList(projectStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).status) ? ssrLooseContain(unref(projectForm).status, option.value) : ssrLooseEqual(unref(projectForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-1045711c> Display Order <input${ssrRenderAttr("value", unref(projectForm).display_order)} type="number" data-v-1045711c></label><label class="full" data-v-1045711c> Description <textarea rows="3" data-v-1045711c>${ssrInterpolate(unref(projectForm).description)}</textarea></label><div class="admin-check-row full" data-v-1045711c><label data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).keyin_active) ? ssrLooseContain(unref(projectForm).keyin_active, null) : unref(projectForm).keyin_active) ? " checked" : ""} type="checkbox" data-v-1045711c> \u0E40\u0E1B\u0E34\u0E14\u0E04\u0E35\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</label><label data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).compare_ready) ? ssrLooseContain(unref(projectForm).compare_ready, null) : unref(projectForm).compare_ready) ? " checked" : ""} type="checkbox" data-v-1045711c> \u0E40\u0E1B\u0E34\u0E14 compare data</label><label data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(unref(projectForm).is_visible) ? ssrLooseContain(unref(projectForm).is_visible, null) : unref(projectForm).is_visible) ? " checked" : ""} type="checkbox" data-v-1045711c> \u0E41\u0E2A\u0E14\u0E07\u0E1A\u0E19\u0E2B\u0E19\u0E49\u0E32 list</label></div><div class="form-actions full" data-v-1045711c><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(adminSaving) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01..." : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Project")}</button></div></form><div class="admin-table-wrap" data-v-1045711c><table class="admin-table" data-v-1045711c><thead data-v-1045711c><tr data-v-1045711c><th data-v-1045711c>Project</th><th data-v-1045711c>Status</th><th data-v-1045711c>DB</th><th data-v-1045711c>Prepared</th><th data-v-1045711c>Tables</th><th data-v-1045711c>\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23</th></tr></thead><tbody data-v-1045711c><!--[-->`);
        ssrRenderList(unref(surveySystems), (project) => {
          _push(`<tr class="${ssrRenderClass({ selected: project.project_code === unref(selectedProjectCode) })}" data-v-1045711c><td data-v-1045711c><strong data-v-1045711c>${ssrInterpolate(project.project_name)}</strong><small data-v-1045711c>${ssrInterpolate(project.project_code)}</small></td><td data-v-1045711c><span class="${ssrRenderClass(["mini-status", project.statusTone])}" data-v-1045711c>${ssrInterpolate(project.status_text)}</span></td><td data-v-1045711c>${ssrInterpolate(project.database_count)}</td><td data-v-1045711c>${ssrInterpolate(project.prepared_count)}</td><td data-v-1045711c>${ssrInterpolate(project.table_count)}</td><td data-v-1045711c><button type="button" data-v-1045711c>\u0E40\u0E25\u0E37\u0E2D\u0E01</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "databases" ? null : { display: "none" })}" data-v-1045711c><div class="section-title" data-v-1045711c><h3 data-v-1045711c>Project Database</h3><button type="button"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c>\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E10\u0E32\u0E19\u0E43\u0E2B\u0E21\u0E48</button></div><p class="tab-hint" data-v-1045711c> \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E0A\u0E38\u0E14\u0E41\u0E1A\u0E1A\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E2B\u0E23\u0E37\u0E2D\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E02\u0E2D\u0E07 Project \u0E23\u0E30\u0E1A\u0E38\u0E10\u0E32\u0E19 raw \u0E41\u0E25\u0E30\u0E0A\u0E37\u0E48\u0E2D\u0E10\u0E32\u0E19 compare \u0E17\u0E35\u0E48\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E01\u0E31\u0E19 \u0E42\u0E14\u0E22\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E10\u0E32\u0E19 _cmp \u0E08\u0E19\u0E01\u0E14\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E23\u0E30\u0E1A\u0E1A Compare </p><p class="section-note" data-v-1045711c>${ssrInterpolate(unref(selectedProject) ? `Project: ${unref(selectedProject).project_name}` : "\u0E40\u0E25\u0E37\u0E2D\u0E01 Project \u0E01\u0E48\u0E2D\u0E19\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25")}</p><form class="admin-form" data-v-1045711c><label data-v-1045711c> Database Code <input${ssrRenderAttr("value", unref(databaseForm).database_code)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-1045711c></label><label data-v-1045711c> \u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E1A\u0E1A\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21 <input${ssrRenderAttr("value", unref(databaseForm).questionnaire_name)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="\u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E1A\u0E1A\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E40\u0E14\u0E47\u0E01 CH1" data-v-1045711c></label><label data-v-1045711c> Preface Table <input${ssrRenderAttr("value", unref(databaseForm).table_preface)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="preface_ch" data-v-1045711c></label><label data-v-1045711c> Raw Database <input${ssrRenderAttr("value", unref(databaseForm).raw_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch" data-v-1045711c></label><label data-v-1045711c> Compare Database <input${ssrRenderAttr("value", unref(databaseForm).compare_database)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="tcls2027_ch_cmp" data-v-1045711c></label><label data-v-1045711c> Round Field <input${ssrRenderAttr("value", unref(databaseForm).round_field)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="round" data-v-1045711c></label><label data-v-1045711c> Search Column <input${ssrRenderAttr("value", unref(databaseForm).search_column)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="CID" data-v-1045711c></label><label data-v-1045711c> searchId1 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id1_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c></label><label data-v-1045711c> searchId1 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id1_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c></label><label data-v-1045711c> searchId2 Start <input${ssrRenderAttr("value", unref(databaseForm).search_id2_start)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c></label><label data-v-1045711c> searchId2 Length <input${ssrRenderAttr("value", unref(databaseForm).search_id2_length)} type="number" min="1"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="blank = end" data-v-1045711c></label><label data-v-1045711c> searchId2 Mode <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c><option value="exact" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "exact") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "exact")) ? " selected" : ""}>Exact</option><option value="prefix" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).search_id2_mode) ? ssrLooseContain(unref(databaseForm).search_id2_mode, "prefix") : ssrLooseEqual(unref(databaseForm).search_id2_mode, "prefix")) ? " selected" : ""}>Prefix</option></select></label><label data-v-1045711c> Round 1 Value <input${ssrRenderAttr("value", unref(databaseForm).round1_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="1" data-v-1045711c></label><label data-v-1045711c> Round 2 Value <input${ssrRenderAttr("value", unref(databaseForm).round2_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="2" data-v-1045711c></label><label data-v-1045711c> Completed Value <input${ssrRenderAttr("value", unref(databaseForm).completed_round_value)}${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} placeholder="0" data-v-1045711c></label><label class="admin-check" data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).compare_enabled) ? ssrLooseContain(unref(databaseForm).compare_enabled, null) : unref(databaseForm).compare_enabled) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c><span data-v-1045711c>Compare Enabled</span></label><label data-v-1045711c> Status <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c><!--[-->`);
        ssrRenderList(databaseStatusOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option.value)} data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).status) ? ssrLooseContain(unref(databaseForm).status, option.value) : ssrLooseEqual(unref(databaseForm).status, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
        });
        _push(`<!--]--></select></label><label data-v-1045711c> Display Order <input${ssrRenderAttr("value", unref(databaseForm).display_order)} type="number"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c></label><label data-v-1045711c> \u0E2A\u0E35 (\u0E08\u0E31\u0E14\u0E01\u0E25\u0E38\u0E48\u0E21\u0E1B\u0E38\u0E48\u0E21\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25) <select${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c><option value="green" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).color) ? ssrLooseContain(unref(databaseForm).color, "green") : ssrLooseEqual(unref(databaseForm).color, "green")) ? " selected" : ""}>\u0E40\u0E02\u0E35\u0E22\u0E27</option><option value="blue" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).color) ? ssrLooseContain(unref(databaseForm).color, "blue") : ssrLooseEqual(unref(databaseForm).color, "blue")) ? " selected" : ""}>\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19</option><option value="red" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).color) ? ssrLooseContain(unref(databaseForm).color, "red") : ssrLooseEqual(unref(databaseForm).color, "red")) ? " selected" : ""}>\u0E41\u0E14\u0E07</option><option value="yellow" data-v-1045711c${ssrIncludeBooleanAttr(Array.isArray(unref(databaseForm).color) ? ssrLooseContain(unref(databaseForm).color, "yellow") : ssrLooseEqual(unref(databaseForm).color, "yellow")) ? " selected" : ""}>\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07</option></select></label><label class="full" data-v-1045711c> Description <textarea${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="2" data-v-1045711c>${ssrInterpolate(unref(databaseForm).description)}</textarea></label><label class="full" data-v-1045711c> Sample ID SQL <textarea class="sample-sql-textarea"${ssrIncludeBooleanAttr(!unref(canUseDatabaseTools)) ? " disabled" : ""} rows="10" placeholder="SELECT &#39;cct2025&#39; AS project_code, &#39;cct2025&#39; AS database_code, CID AS id FROM cct2025.table0 UNION SELECT &#39;cct2025&#39;, &#39;cct2025&#39;, CID FROM cct2025.table1" data-v-1045711c>${ssrInterpolate(unref(databaseForm).sample_ids_sql)}</textarea><small class="field-help" data-v-1045711c>\u0E43\u0E0A\u0E49\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A\u0E02\u0E2D\u0E07\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23\u0E44\u0E21\u0E48\u0E15\u0E32\u0E22\u0E15\u0E31\u0E27 SQL \u0E15\u0E49\u0E2D\u0E07\u0E04\u0E37\u0E19\u0E40\u0E09\u0E1E\u0E32\u0E30 project_code, database_code, id</small></label><p class="field-help full" data-v-1045711c> Search split uses 1-based positions. Default searchId1 is positions 1-12 and searchId2 starts at 13, so position 12 is not duplicated. </p><div class="form-actions full" data-v-1045711c><button type="submit"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseDatabaseTools)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(adminSaving) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01..." : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Database")}</button><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(selectedDatabaseId)) ? " disabled" : ""} data-v-1045711c> \u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E23\u0E30\u0E1A\u0E1A Compare </button></div></form><div class="admin-table-wrap" data-v-1045711c><table class="admin-table" data-v-1045711c><thead data-v-1045711c><tr data-v-1045711c><th data-v-1045711c>Database Code</th><th data-v-1045711c>\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E1A\u0E1A</th><th data-v-1045711c>Preface</th><th data-v-1045711c>Raw</th><th data-v-1045711c>Compare</th><th data-v-1045711c>Round</th><th data-v-1045711c>Enabled</th><th data-v-1045711c>Status</th><th data-v-1045711c>Tables</th><th data-v-1045711c>\u0E2A\u0E35</th><th data-v-1045711c>\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23</th></tr></thead><tbody data-v-1045711c><!--[-->`);
        ssrRenderList(unref(adminDatabases), (database) => {
          _push(`<tr class="${ssrRenderClass({ selected: database.database_id === unref(selectedDatabaseId) })}" data-v-1045711c><td data-v-1045711c>${ssrInterpolate(database.database_code)}</td><td data-v-1045711c>${ssrInterpolate(database.questionnaire_name || "-")}</td><td data-v-1045711c>${ssrInterpolate(database.table_preface || database.tablePreface || "-")}</td><td data-v-1045711c>${ssrInterpolate(database.raw_database)}</td><td data-v-1045711c>${ssrInterpolate(database.compare_database)}</td><td data-v-1045711c>${ssrInterpolate(database.round1_value || "1")}/${ssrInterpolate(database.round2_value || "2")}/${ssrInterpolate(database.completed_round_value || "0")}</td><td data-v-1045711c>${ssrInterpolate(database.compare_enabled ? "on" : "off")}</td><td data-v-1045711c>${ssrInterpolate(database.is_prepared ? "prepared" : database.status)}</td><td data-v-1045711c>${ssrInterpolate(database.table_count)}</td><td data-v-1045711c><span class="${ssrRenderClass(["color-swatch", database.color || "blue"])}"${ssrRenderAttr("title", database.color || "blue")} data-v-1045711c></span></td><td data-v-1045711c><button type="button" data-v-1045711c>\u0E40\u0E25\u0E37\u0E2D\u0E01</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(adminLoading) && !unref(adminDatabases).length) {
          _push(`<tr data-v-1045711c><td colspan="11" data-v-1045711c>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E19 Project \u0E19\u0E35\u0E49</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "tables" ? null : { display: "none" })}" data-v-1045711c><div class="section-title" data-v-1045711c><h3 data-v-1045711c>Tables</h3><button type="button"${ssrIncludeBooleanAttr(unref(tablesLoading) || !unref(canUseTableTools)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(tablesLoading) ? "\u0E01\u0E33\u0E25\u0E31\u0E07 scan..." : "Scan Tables")}</button></div><p class="tab-hint" data-v-1045711c> Scan \u0E15\u0E32\u0E23\u0E32\u0E07\u0E08\u0E32\u0E01 raw database \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 Compare \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07\u0E41\u0E25\u0E30 Order (\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25) \u0E44\u0E14\u0E49 \u0E2A\u0E48\u0E27\u0E19 Primary Key \u0E41\u0E2A\u0E14\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 </p><p class="section-note" data-v-1045711c>${ssrInterpolate(unref(selectedDatabase) ? `Raw database: ${unref(selectedDatabase).raw_database}` : "\u0E40\u0E25\u0E37\u0E2D\u0E01 Database \u0E01\u0E48\u0E2D\u0E19 scan \u0E15\u0E32\u0E23\u0E32\u0E07")}</p><div class="admin-table-wrap wide" data-v-1045711c><table class="admin-table" data-v-1045711c><thead data-v-1045711c><tr data-v-1045711c><th data-v-1045711c>\u0E40\u0E1B\u0E34\u0E14 Compare</th><th data-v-1045711c>Table</th><th data-v-1045711c>Display Name</th><th data-v-1045711c>Primary Key</th><th data-v-1045711c>Order</th><th data-v-1045711c>Raw</th><th data-v-1045711c>\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23</th></tr></thead><tbody data-v-1045711c><!--[-->`);
        ssrRenderList(unref(adminTables), (table) => {
          _push(`<tr class="${ssrRenderClass({ selected: table.table_id === unref(selectedTableId) })}" data-v-1045711c><td data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(table.allow_compare) ? ssrLooseContain(table.allow_compare, null) : table.allow_compare) ? " checked" : ""} type="checkbox" data-v-1045711c></td><td data-v-1045711c>${ssrInterpolate(table.table_name)}</td><td data-v-1045711c><input${ssrRenderAttr("value", table.display_name)} data-v-1045711c></td><td data-v-1045711c><span class="readonly-text" data-v-1045711c>${ssrInterpolate(table.primary_keys_text || "-")}</span></td><td data-v-1045711c><input${ssrRenderAttr("value", table.display_order)} type="number" data-v-1045711c></td><td data-v-1045711c>${ssrInterpolate(table.exists_in_raw ? "\u0E1E\u0E1A" : "\u0E44\u0E21\u0E48\u0E1E\u0E1A")}</td><td class="button-stack" data-v-1045711c><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving)) ? " disabled" : ""} data-v-1045711c>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</button><button type="button"${ssrIncludeBooleanAttr(!table.table_id) ? " disabled" : ""} data-v-1045711c>\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23</button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(tablesLoading) && !unref(adminTables).length) {
          _push(`<tr data-v-1045711c><td colspan="7" data-v-1045711c>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E15\u0E32\u0E23\u0E32\u0E07 \u0E01\u0E14 Scan Tables \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E48\u0E32\u0E19\u0E08\u0E32\u0E01 raw database</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><section class="admin-section" style="${ssrRenderStyle(unref(adminTab) === "columns" ? null : { display: "none" })}" data-v-1045711c><div class="section-title" data-v-1045711c><h3 data-v-1045711c>Variables</h3><button type="button"${ssrIncludeBooleanAttr(unref(columnsLoading) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(columnsLoading) ? "\u0E01\u0E33\u0E25\u0E31\u0E07 scan..." : "Scan Variables")}</button></div><p class="tab-hint" data-v-1045711c> \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E02\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E42\u0E14\u0E22\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30 scan \u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E08\u0E32\u0E01 raw table \u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07 \u0E41\u0E25\u0E30\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E07\u0E10\u0E32\u0E19\u0E01\u0E25\u0E32\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E0B\u0E48\u0E2D\u0E19\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 </p><dl class="column-head-hint" data-v-1045711c><div data-v-1045711c><dt data-v-1045711c>Variables</dt><dd data-v-1045711c>\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E08\u0E32\u0E01 raw table</dd></div><div data-v-1045711c><dt data-v-1045711c>Type</dt><dd data-v-1045711c>\u0E0A\u0E19\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48 scan \u0E08\u0E32\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</dd></div><div data-v-1045711c><dt data-v-1045711c>Visible</dt><dd data-v-1045711c>\u0E15\u0E34\u0E4A\u0E01\u0E2D\u0E2D\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E0B\u0E48\u0E2D\u0E19\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E0B\u0E48\u0E2D\u0E19</dd></div><div data-v-1045711c><dt data-v-1045711c>PK</dt><dd data-v-1045711c>\u0E43\u0E0A\u0E49\u0E40\u0E1B\u0E47\u0E19 key \u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</dd></div><div data-v-1045711c><dt data-v-1045711c>Order</dt><dd data-v-1045711c>\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E41\u0E2A\u0E14\u0E07\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 \u0E2D\u0E48\u0E32\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27</dd></div></dl><p class="section-note" data-v-1045711c>${ssrInterpolate(unref(selectedTableName) ? `Table: ${unref(selectedTableName)}` : "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E01\u0E48\u0E2D\u0E19\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23")}</p><div class="admin-table-wrap wide" data-v-1045711c><table class="admin-table column-table" data-v-1045711c><thead data-v-1045711c><tr data-v-1045711c><th data-v-1045711c>Variable</th><th data-v-1045711c>Type</th><th data-v-1045711c>Visible</th><th data-v-1045711c>PK</th><th data-v-1045711c>Order</th></tr></thead><tbody data-v-1045711c><!--[-->`);
        ssrRenderList(unref(adminColumns), (column) => {
          _push(`<tr data-v-1045711c><td data-v-1045711c>${ssrInterpolate(column.column_name)}</td><td data-v-1045711c>${ssrInterpolate(column.data_type)}</td><td data-v-1045711c><input${ssrIncludeBooleanAttr(Array.isArray(column.visible) ? ssrLooseContain(column.visible, null) : column.visible) ? " checked" : ""} type="checkbox" data-v-1045711c></td><td data-v-1045711c><span class="${ssrRenderClass(["readonly-flag", { active: column.is_primary_key }])}" data-v-1045711c>${ssrInterpolate(column.is_primary_key ? "PK" : "-")}</span></td><td data-v-1045711c><span class="readonly-order" data-v-1045711c>${ssrInterpolate(column.display_order)}</span></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(columnsLoading) && !unref(adminColumns).length) {
          _push(`<tr data-v-1045711c><td colspan="5" data-v-1045711c>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 Scan Variables</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><div class="form-actions" data-v-1045711c><button type="button"${ssrIncludeBooleanAttr(unref(adminSaving) || !unref(canUseColumnTools)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(adminSaving) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01..." : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Hidden Columns")}</button></div></section></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="survey-container survey-tools" data-v-1045711c><div data-v-1045711c><h2 data-v-1045711c>\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E41\u0E25\u0E30\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C Compare</h2><p data-v-1045711c>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E48\u0E32\u0E19\u0E1E\u0E32\u0E23\u0E32\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C project</p></div></section><section class="survey-container survey-card-grid" data-v-1045711c>`);
      if (unref(projectsLoading)) {
        _push(`<div class="survey-empty-state" data-v-1045711c> \u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E08\u0E32\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25... </div>`);
      } else if (unref(projectLoadError)) {
        _push(`<div class="survey-empty-state error" data-v-1045711c>${ssrInterpolate(unref(projectLoadError))}</div>`);
      } else if (!unref(surveySystems).length) {
        _push(`<div class="survey-empty-state" data-v-1045711c> \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E43\u0E19\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(surveySystems), (system) => {
        _push(`<article class="survey-system-card" data-v-1045711c><span class="monitor-icon" aria-hidden="true" data-v-1045711c></span><h3 data-v-1045711c>${ssrInterpolate(system.title)}</h3><p data-v-1045711c>${ssrInterpolate(system.subtitle)}</p><em class="${ssrRenderClass(["survey-status", system.statusTone])}" data-v-1045711c>${ssrInterpolate(system.status_text)}</em><small data-v-1045711c>${ssrInterpolate(system.summary)}</small><div class="survey-card-meta" data-v-1045711c><span data-v-1045711c>${ssrInterpolate(system.database_count)} \u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</span><span data-v-1045711c>${ssrInterpolate(system.table_count)} \u0E15\u0E32\u0E23\u0E32\u0E07 compare</span></div><div class="survey-card-actions" data-v-1045711c>`);
        if (system.keyin_active) {
          _push(`<a class="survey-key-button"${ssrRenderAttr("href", resolveSurveyHref(system))} data-v-1045711c> \u0E04\u0E35\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 </a>`);
        } else {
          _push(`<button class="survey-key-button disabled" type="button" disabled data-v-1045711c>${ssrInterpolate(system.project_ended ? "\u0E08\u0E1A\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23" : "\u0E1B\u0E34\u0E14\u0E04\u0E35\u0E22\u0E4C\u0E41\u0E25\u0E49\u0E27")}</button>`);
        }
        if (canCompare(system)) {
          _push(`<a class="survey-compare-button"${ssrRenderAttr("href", resolveCompareHref(system))} data-v-1045711c> compare data </a>`);
        } else {
          _push(`<button class="survey-compare-button disabled" type="button" disabled data-v-1045711c> compare data </button>`);
        }
        _push(`</div></article>`);
      });
      _push(`<!--]--></section><footer class="survey-footer" data-v-1045711c><div class="survey-footer-content" data-v-1045711c><div class="spa-brand" aria-label="SPA" data-v-1045711c><span class="spa-mark" aria-hidden="true" data-v-1045711c></span><strong data-v-1045711c>SPA</strong></div><div class="spa-link-row" data-v-1045711c><span data-v-1045711c>go to System for Project Administrator(SPA) ?</span><a href="https://ripedresearch.org/spa" data-v-1045711c>Click here</a></div></div></footer>`);
      if (unref(showAdminLogin)) {
        _push(`<div class="admin-modal-backdrop" data-v-1045711c><section class="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title" data-v-1045711c><header data-v-1045711c><h2 id="admin-login-title" data-v-1045711c>\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A</h2><button type="button" aria-label="Close" data-v-1045711c>\xD7</button></header><form class="admin-login-form" data-v-1045711c><label data-v-1045711c> UserName <input${ssrRenderAttr("value", unref(adminCredentials).username)} autocomplete="username" data-v-1045711c></label><label data-v-1045711c> Password <input${ssrRenderAttr("value", unref(adminCredentials).password)} type="password" autocomplete="current-password" data-v-1045711c></label>`);
        if (unref(adminLoginError)) {
          _push(`<p class="admin-error" data-v-1045711c>${ssrInterpolate(unref(adminLoginError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer data-v-1045711c><button class="admin-cancel-button" type="button" data-v-1045711c>\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button><button class="admin-login-button" type="submit"${ssrIncludeBooleanAttr(unref(adminLoginLoading)) ? " disabled" : ""} data-v-1045711c>${ssrInterpolate(unref(adminLoginLoading) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A..." : "Login")}</button></footer></form></section></div>`);
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
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1045711c"]]);

export { list as default };
//# sourceMappingURL=list-Dv3wmrJp.mjs.map
