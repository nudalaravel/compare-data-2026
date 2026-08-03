globalThis.__timing__.logStart('Load chunks/build/admin-2wmvq8IE');import { _ as _sfc_main$1 } from './LegacyPanel-DJJ9u9fC.mjs';
import { ref, reactive, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, withDirectives, isRef, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRuntimeConfig } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const apiBase = String(config.public.apiBase || "").replace(/\/$/, "");
    const adminTabs = [
      { id: "recompare", label: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 Compare / Recompare" },
      { id: "chk_user", label: "CHK_USER / Export" },
      { id: "daily", label: "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19 Compare \u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" }
    ];
    const activeTab = ref("recompare");
    const projects = ref([]);
    const databases = ref([]);
    const tables = ref([]);
    const selectedProjectCode = ref("");
    const selectedDatabaseId = ref("");
    const selectedTableName = ref("");
    const loadError = ref("");
    const actionMessage = ref("");
    ref(false);
    const loadingTables = ref(false);
    const loadingPreview = ref(false);
    const deletingCompare = ref("");
    const loadingChkUser = ref(false);
    const loadingDaily = ref(false);
    const recomparePreview = ref(null);
    const recompareResult = ref(null);
    const chkUserRows = ref([]);
    const chkUserTotal = ref(0);
    const dailyReport = ref({});
    const dailyRows = ref([]);
    const dailyDate = ref(localDateString());
    const recompareForm = reactive({
      search_id: ""
    });
    const chkUserFilters = reactive({
      search_id: "",
      limit: 500
    });
    const filteredDatabases = computed(() => {
      if (!selectedProjectCode.value) return databases.value;
      return databases.value.filter((database) => database.project_code === selectedProjectCode.value);
    });
    const selectedProject = computed(() => projects.value.find((project) => project.project_code === selectedProjectCode.value) || null);
    const selectedDatabase = computed(() => databases.value.find((database) => Number(database.database_id) === Number(selectedDatabaseId.value)) || null);
    const recompareColumns = computed(() => {
      var _a;
      return ((_a = recomparePreview.value) == null ? void 0 : _a.columns) || [];
    });
    const recompareMatrixRows = computed(() => {
      var _a;
      return ((_a = recomparePreview.value) == null ? void 0 : _a.matrix_rows) || [];
    });
    const recompareTotals = computed(() => {
      var _a;
      return ((_a = recomparePreview.value) == null ? void 0 : _a.totals) || {};
    });
    const recompareTableColspan = computed(() => 4 + recompareColumns.value.length);
    const canRecompareAll = computed(() => Boolean(recompareForm.search_id.trim()) && recompareMatrixRows.value.length > 0);
    const adminUsername = computed(() => {
      return "";
    });
    watch(selectedProjectCode, () => {
      const first = filteredDatabases.value[0];
      selectedDatabaseId.value = first ? String(first.database_id) : "";
    });
    watch(selectedDatabaseId, async () => {
      selectedTableName.value = "";
      recomparePreview.value = null;
      recompareResult.value = null;
      await loadTables();
    });
    watch(selectedTableName, (tableName) => {
      selectedTableName.value = tableName || "";
    });
    watch(() => recompareForm.search_id, () => {
      recomparePreview.value = null;
      recompareResult.value = null;
    });
    function localDateString(date = /* @__PURE__ */ new Date()) {
      const copy = new Date(date);
      copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
      return copy.toISOString().slice(0, 10);
    }
    function toolUrl(params = {}) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null && value !== "") {
          query.set(key, value);
        }
      });
      return `${apiBase}/manage/admin-compare-tools.php${query.toString() ? `?${query}` : ""}`;
    }
    function authHeaders() {
      return {};
    }
    async function fetchTool(params = {}, options = {}) {
      if (!apiBase) {
        throw new Error("API base URL is not configured");
      }
      return await $fetch(toolUrl(params), {
        ...options,
        headers: {
          ...authHeaders(),
          ...options.headers || {}
        }
      });
    }
    async function loadTables() {
      var _a, _b;
      if (!selectedDatabaseId.value) {
        tables.value = [];
        return;
      }
      loadingTables.value = true;
      try {
        const res = await fetchTool({ action: "tables", database_id: selectedDatabaseId.value });
        tables.value = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.tables) || [];
        if (!selectedTableName.value && tables.value.length) {
          selectedTableName.value = tables.value[0].table_name;
        }
      } catch (error) {
        tables.value = [];
        loadError.value = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E15\u0E32\u0E23\u0E32\u0E07\u0E44\u0E14\u0E49";
      } finally {
        loadingTables.value = false;
      }
    }
    function validateScope(requireTable = true, requireSearch = false) {
      actionMessage.value = "";
      loadError.value = "";
      if (!selectedDatabaseId.value) {
        loadError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25";
        return false;
      }
      if (requireTable && !selectedTableName.value) {
        loadError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07";
        return false;
      }
      if (requireSearch && !recompareForm.search_id.trim()) {
        loadError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01 Search ID";
        return false;
      }
      return true;
    }
    async function loadRecomparePreview(clearResult = true) {
      var _a;
      if (!validateScope(false, false)) return;
      loadingPreview.value = true;
      if (clearResult) {
        recompareResult.value = null;
      }
      try {
        const res = await fetchTool({
          action: "recompare-preview-all",
          database_id: selectedDatabaseId.value,
          search_id: recompareForm.search_id.trim()
        });
        recomparePreview.value = (res == null ? void 0 : res.data) || null;
        actionMessage.value = "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A\u0E41\u0E25\u0E49\u0E27";
      } catch (error) {
        recomparePreview.value = null;
        loadError.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || (error == null ? void 0 : error.message) || "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        loadingPreview.value = false;
      }
    }
    async function executeRecompareCell(row, column) {
      var _a;
      const tableName = (column == null ? void 0 : column.table_name) || "";
      const searchId = (row == null ? void 0 : row.id) || "";
      const cell = ((_a = row == null ? void 0 : row.cells) == null ? void 0 : _a[tableName]) || null;
      if (!validateScope(false, false)) return;
      if (!recomparePreview.value) {
        await loadRecomparePreview(false);
      }
      if (!tableName || !searchId || !(cell == null ? void 0 : cell.has_compare_data)) {
        loadError.value = "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E19 _cmp \u0E2B\u0E23\u0E37\u0E2D chk_user \u0E02\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E19\u0E35\u0E49";
        return;
      }
      await executeRecompareForTable(tableName, searchId);
    }
    async function executeRecompareForTable(tableName, searchId) {
      var _a, _b, _c;
      const ok = (void 0).confirm(`\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E02\u0E2D\u0E07 ${(_a = selectedDatabase.value) == null ? void 0 : _a.compare_database}.${tableName} \u0E23\u0E2B\u0E31\u0E2A ${searchId} ?`);
      if (!ok) return;
      deletingCompare.value = recompareCellKey(searchId, tableName);
      try {
        const res = await fetchTool({}, {
          method: "POST",
          body: {
            action: "recompare",
            database_id: Number(selectedDatabaseId.value),
            table_name: tableName,
            search_id: searchId,
            confirm: true
          }
        });
        recompareResult.value = ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.result) || null;
        actionMessage.value = "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 compare/recompare \u0E41\u0E25\u0E49\u0E27";
        await loadRecomparePreview(false);
      } catch (error) {
        loadError.value = ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.message) || (error == null ? void 0 : error.message) || "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 compare/recompare \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        deletingCompare.value = "";
      }
    }
    async function executeRecompareAll() {
      var _a, _b;
      if (!validateScope(false, true)) return;
      if (!recompareMatrixRows.value.length) {
        loadError.value = "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49";
        return;
      }
      const searchId = recompareForm.search_id.trim();
      const ok = (void 0).confirm(`\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E2D\u0E07 ${(_a = selectedDatabase.value) == null ? void 0 : _a.compare_database} \u0E23\u0E2B\u0E31\u0E2A ${searchId} ?`);
      if (!ok) return;
      deletingCompare.value = "__all__";
      try {
        const res = await fetchTool({}, {
          method: "POST",
          body: {
            action: "recompare-all",
            database_id: Number(selectedDatabaseId.value),
            search_id: searchId,
            confirm: true
          }
        });
        recompareResult.value = (res == null ? void 0 : res.data) || null;
        actionMessage.value = "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 compare/recompare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E25\u0E49\u0E27";
        await loadRecomparePreview(false);
      } catch (error) {
        loadError.value = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 compare/recompare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        deletingCompare.value = "";
      }
    }
    function chkUserParams(extra = {}) {
      return {
        action: "chk_user",
        database_id: selectedDatabaseId.value,
        search_id: chkUserFilters.search_id.trim(),
        limit: chkUserFilters.limit,
        ...extra
      };
    }
    async function loadChkUserRows() {
      var _a, _b, _c;
      if (!validateScope(false, false)) return;
      loadingChkUser.value = true;
      try {
        const res = await fetchTool(chkUserParams());
        chkUserRows.value = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.rows) || [];
        chkUserTotal.value = Number(((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.total) || 0);
        actionMessage.value = "\u0E42\u0E2B\u0E25\u0E14 CHK_USER \u0E41\u0E25\u0E49\u0E27";
      } catch (error) {
        chkUserRows.value = [];
        chkUserTotal.value = 0;
        loadError.value = ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.message) || (error == null ? void 0 : error.message) || "\u0E42\u0E2B\u0E25\u0E14 CHK_USER \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        loadingChkUser.value = false;
      }
    }
    async function exportChkUser() {
      var _a;
      if (!validateScope(false, false)) return;
      loadingChkUser.value = true;
      try {
        const response = await fetch(toolUrl(chkUserParams({ export: "xls" })), {
          headers: authHeaders()
        });
        if (!response.ok) {
          throw new Error("Export failed");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = (void 0).createElement("a");
        link.href = url;
        link.download = `chk_user_${((_a = selectedDatabase.value) == null ? void 0 : _a.database_code) || "export"}_${Date.now()}.xls`;
        (void 0).body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        actionMessage.value = "Export CHK_USER \u0E40\u0E1B\u0E47\u0E19 XLS \u0E41\u0E25\u0E49\u0E27";
      } catch (error) {
        loadError.value = (error == null ? void 0 : error.message) || "Export CHK_USER \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        loadingChkUser.value = false;
      }
    }
    async function loadDailyReport() {
      var _a, _b;
      loadingDaily.value = true;
      try {
        const res = await fetchTool({ action: "daily-report", date: dailyDate.value });
        dailyReport.value = (res == null ? void 0 : res.data) || {};
        dailyRows.value = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.rows) || [];
        actionMessage.value = activeTab.value === "daily" ? "\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27" : actionMessage.value;
      } catch (error) {
        dailyReport.value = {};
        dailyRows.value = [];
        loadError.value = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
      } finally {
        loadingDaily.value = false;
      }
    }
    function databaseLabel(database) {
      const name = database.questionnaire_name || database.database_code;
      return `${name} (${database.database_code})`;
    }
    function formatNumber(value) {
      return new Intl.NumberFormat("th-TH").format(Number(value || 0));
    }
    function formatDateTime(value) {
      return value ? String(value).replace("T", " ").slice(0, 19) : "-";
    }
    function recompareStatusText(row) {
      if (!row.cmp_table_exists) return "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E32\u0E23\u0E32\u0E07 _cmp";
      if (!row.has_compare_data) return "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1E\u0E1A compare";
      if (Number(row.cmp_completed_rows || 0) > 0) return "Compare \u0E41\u0E25\u0E49\u0E27";
      if (Number(row.cmp_pending_rows || 0) > 0) return "\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E2D compare";
      return "\u0E21\u0E35\u0E40\u0E09\u0E1E\u0E32\u0E30 chk_user";
    }
    function recompareStatusClass(row) {
      if (!row.cmp_table_exists || !row.has_compare_data) return "muted";
      if (Number(row.cmp_completed_rows || 0) > 0) return "ok";
      if (Number(row.cmp_pending_rows || 0) > 0) return "warning";
      return "danger";
    }
    function recompareCellKey(searchId, tableName) {
      return `${searchId}:${tableName}`;
    }
    function recompareCellIcon(cell) {
      if (!(cell == null ? void 0 : cell.has_compare_data)) return "--";
      if (Number(cell.cmp_completed_rows || 0) > 0) return "\u2713";
      if (Number(cell.cmp_pending_rows || 0) > 0) return "\u25B2";
      return "\u2713";
    }
    function recompareCellTitle(cell) {
      return [
        recompareStatusText(cell),
        `cmp: ${formatNumber(cell.cmp_rows)}`,
        `cmp complete: ${formatNumber(cell.cmp_completed_rows)}`,
        `cmp pending: ${formatNumber(cell.cmp_pending_rows)}`,
        `chk_user: ${formatNumber(cell.chk_user_rows)}`
      ].join("\n");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page admin-page" }, _attrs))} data-v-1bc5df0c><header class="admin-page-head" data-v-1bc5df0c><div data-v-1bc5df0c><h1 class="page-title" data-v-1bc5df0c>Administrator</h1><p class="updated" data-v-1bc5df0c>\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E14\u0E39\u0E41\u0E25 Compare Data, CHK_USER \u0E41\u0E25\u0E30\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E01\u0E32\u0E23 compare \u0E23\u0E32\u0E22\u0E27\u0E31\u0E19</p></div><span class="admin-user-pill" data-v-1bc5df0c>USER: ${ssrInterpolate(unref(adminUsername) || "-")}</span></header><nav class="admin-submenu" aria-label="Administrator submenu" data-v-1bc5df0c><!--[-->`);
      ssrRenderList(adminTabs, (tab) => {
        _push(`<button class="${ssrRenderClass({ active: unref(activeTab) === tab.id })}" type="button" data-v-1bc5df0c>${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></nav>`);
      if (unref(loadError)) {
        _push(`<p class="error-text admin-error" data-v-1bc5df0c>${ssrInterpolate(unref(loadError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(actionMessage)) {
        _push(`<p class="admin-message" data-v-1bc5df0c>${ssrInterpolate(unref(actionMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "recompare") {
        _push(`<section class="admin-tool-grid" data-v-1bc5df0c>`);
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 Compare / Recompare" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> \u0E40\u0E25\u0E37\u0E2D\u0E01 Project \u0E41\u0E25\u0E30\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07 \u0E16\u0E49\u0E32\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E01\u0E23\u0E2D\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E49\u0E19 \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E01\u0E32\u0E23\u0E01\u0E14 Recompare \u0E22\u0E31\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E25\u0E1A\u0E01\u0E27\u0E49\u0E32\u0E07\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> Project <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(projects), (project) => {
                _push2(`<option${ssrRenderAttr("value", project.project_code)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectCode)) ? ssrLooseContain(unref(selectedProjectCode), project.project_code) : ssrLooseEqual(unref(selectedProjectCode), project.project_code)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.project_name)} (${ssrInterpolate(project.project_code)}) </option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> \u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredDatabases), (database) => {
                _push2(`<option${ssrRenderAttr("value", database.database_id)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDatabaseId)) ? ssrLooseContain(unref(selectedDatabaseId), database.database_id) : ssrLooseEqual(unref(selectedDatabaseId), database.database_id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(databaseLabel(database))}</option>`);
              });
              _push2(`<!--]--></select></label><label class="wide" data-v-1bc5df0c${_scopeId}> Search ID <input${ssrRenderAttr("value", unref(recompareForm).search_id)} placeholder="\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E01\u0E47\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25\u0E44\u0E14\u0E49" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingPreview)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingPreview) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08..." : "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A")}</button><button class="btn btn-warning" type="button"${ssrIncludeBooleanAttr(!unref(canRecompareAll) || unref(deletingCompare) === "__all__") ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(deletingCompare) === "__all__" ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E1A\u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07..." : "Recompare all")}</button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " \u0E40\u0E25\u0E37\u0E2D\u0E01 Project \u0E41\u0E25\u0E30\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07 \u0E16\u0E49\u0E32\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E01\u0E23\u0E2D\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E49\u0E19 \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E01\u0E32\u0E23\u0E01\u0E14 Recompare \u0E22\u0E31\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E25\u0E1A\u0E01\u0E27\u0E49\u0E32\u0E07\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B "),
                createVNode("div", { class: "admin-form-grid" }, [
                  createVNode("label", null, [
                    createTextVNode(" Project "),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => isRef(selectedProjectCode) ? selectedProjectCode.value = $event : null
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(projects), (project) => {
                        return openBlock(), createBlock("option", {
                          key: project.project_code,
                          value: project.project_code
                        }, toDisplayString(project.project_name) + " (" + toDisplayString(project.project_code) + ") ", 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(selectedProjectCode)]
                    ])
                  ]),
                  createVNode("label", null, [
                    createTextVNode(" \u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 "),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => isRef(selectedDatabaseId) ? selectedDatabaseId.value = $event : null
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredDatabases), (database) => {
                        return openBlock(), createBlock("option", {
                          key: database.database_id,
                          value: database.database_id
                        }, toDisplayString(databaseLabel(database)), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(selectedDatabaseId)]
                    ])
                  ]),
                  createVNode("label", { class: "wide" }, [
                    createTextVNode(" Search ID "),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(recompareForm).search_id = $event,
                      placeholder: "\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E01\u0E47\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25\u0E44\u0E14\u0E49"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(recompareForm).search_id,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ])
                ]),
                createVNode("div", { class: "admin-actions" }, [
                  createVNode("button", {
                    class: "btn btn-gray",
                    type: "button",
                    disabled: unref(loadingPreview),
                    onClick: loadRecomparePreview
                  }, toDisplayString(unref(loadingPreview) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08..." : "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A"), 9, ["disabled"]),
                  createVNode("button", {
                    class: "btn btn-warning",
                    type: "button",
                    disabled: !unref(canRecompareAll) || unref(deletingCompare) === "__all__",
                    onClick: executeRecompareAll
                  }, toDisplayString(unref(deletingCompare) === "__all__" ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E1A\u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07..." : "Recompare all"), 9, ["disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E2A\u0E23\u0E38\u0E1B Scope" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b, _c, _d, _e, _f;
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Project</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(((_a = unref(selectedProject)) == null ? void 0 : _a.project_name) || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Database</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(((_b = unref(selectedDatabase)) == null ? void 0 : _b.database_code) || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Compare DB</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(((_c = unref(selectedDatabase)) == null ? void 0 : _c.compare_database) || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Search ID</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(recompareForm).search_id || "-")}</dd></div></dl>`);
              if (unref(recomparePreview)) {
                _push2(`<div class="preview-box" data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>\u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07</strong><div class="metric-grid" data-v-1bc5df0c${_scopeId}><span data-v-1bc5df0c${_scopeId}>cmp rows</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_rows))}</b><span data-v-1bc5df0c${_scopeId}>cmp complete</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_completed_rows))}</b><span data-v-1bc5df0c${_scopeId}>cmp pending</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_pending_rows))}</b><span data-v-1bc5df0c${_scopeId}>chk_user rows</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).chk_user_rows))}</b></div><small data-v-1bc5df0c${_scopeId}>\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E43\u0E19 ${ssrInterpolate(formatNumber(unref(recompareTotals).tables_with_cmp_rows))} \u0E08\u0E32\u0E01 ${ssrInterpolate(formatNumber(unref(recompareTotals).tables))} \u0E15\u0E32\u0E23\u0E32\u0E07</small></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(recompareResult)) {
                _push2(`<div class="preview-box success" data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E41\u0E25\u0E49\u0E27</strong><div class="metric-grid" data-v-1bc5df0c${_scopeId}><span data-v-1bc5df0c${_scopeId}>deleted cmp</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareResult).deleted_cmp_rows))}</b><span data-v-1bc5df0c${_scopeId}>deleted chk_user</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareResult).deleted_chk_user_rows))}</b></div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "Project"),
                    createVNode("dd", null, toDisplayString(((_d = unref(selectedProject)) == null ? void 0 : _d.project_name) || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "Database"),
                    createVNode("dd", null, toDisplayString(((_e = unref(selectedDatabase)) == null ? void 0 : _e.database_code) || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "Compare DB"),
                    createVNode("dd", null, toDisplayString(((_f = unref(selectedDatabase)) == null ? void 0 : _f.compare_database) || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "Search ID"),
                    createVNode("dd", null, toDisplayString(unref(recompareForm).search_id || "-"), 1)
                  ])
                ]),
                unref(recomparePreview) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "preview-box"
                }, [
                  createVNode("strong", null, "\u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07"),
                  createVNode("div", { class: "metric-grid" }, [
                    createVNode("span", null, "cmp rows"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareTotals).cmp_rows)), 1),
                    createVNode("span", null, "cmp complete"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareTotals).cmp_completed_rows)), 1),
                    createVNode("span", null, "cmp pending"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareTotals).cmp_pending_rows)), 1),
                    createVNode("span", null, "chk_user rows"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareTotals).chk_user_rows)), 1)
                  ]),
                  createVNode("small", null, "\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 compare \u0E43\u0E19 " + toDisplayString(formatNumber(unref(recompareTotals).tables_with_cmp_rows)) + " \u0E08\u0E32\u0E01 " + toDisplayString(formatNumber(unref(recompareTotals).tables)) + " \u0E15\u0E32\u0E23\u0E32\u0E07", 1)
                ])) : createCommentVNode("", true),
                unref(recompareResult) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "preview-box success"
                }, [
                  createVNode("strong", null, "\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E41\u0E25\u0E49\u0E27"),
                  createVNode("div", { class: "metric-grid" }, [
                    createVNode("span", null, "deleted cmp"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareResult).deleted_cmp_rows)), 1),
                    createVNode("span", null, "deleted chk_user"),
                    createVNode("b", null, toDisplayString(formatNumber(unref(recompareResult).deleted_chk_user_rows)), 1)
                  ])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "recompare") {
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 Compare \u0E17\u0E35\u0E48\u0E1E\u0E1A" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="admin-table-wrap" data-v-1bc5df0c${_scopeId}><table class="admin-data-table recompare-table recompare-matrix" data-v-1bc5df0c${_scopeId}><thead data-v-1bc5df0c${_scopeId}><tr data-v-1bc5df0c${_scopeId}><th data-v-1bc5df0c${_scopeId}>No</th><th data-v-1bc5df0c${_scopeId}>ID</th><th data-v-1bc5df0c${_scopeId}>UserR1</th><th data-v-1bc5df0c${_scopeId}>UserR2</th><!--[-->`);
              ssrRenderList(unref(recompareColumns), (column) => {
                _push2(`<th data-v-1bc5df0c${_scopeId}>${ssrInterpolate(column.table_name)} `);
                if (column.display_name && column.display_name !== column.table_name) {
                  _push2(`<small data-v-1bc5df0c${_scopeId}>${ssrInterpolate(column.display_name)}</small>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</th>`);
              });
              _push2(`<!--]--></tr></thead><tbody data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(recompareMatrixRows), (row, index) => {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td class="number-cell" data-v-1bc5df0c${_scopeId}>${ssrInterpolate(index + 1)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.id)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.user_r1 || "-")}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.user_r2 || "-")}</td><!--[-->`);
                ssrRenderList(unref(recompareColumns), (column) => {
                  _push2(`<td class="recompare-cell-wrap" data-v-1bc5df0c${_scopeId}>`);
                  if (row.cells && row.cells[column.table_name]) {
                    _push2(`<div class="recompare-cell" data-v-1bc5df0c${_scopeId}><span class="${ssrRenderClass(["cell-icon", recompareStatusClass(row.cells[column.table_name])])}"${ssrRenderAttr("title", recompareCellTitle(row.cells[column.table_name]))} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(recompareCellIcon(row.cells[column.table_name]))}</span><button class="btn btn-warning btn-small" type="button"${ssrIncludeBooleanAttr(!row.cells[column.table_name].has_compare_data || unref(deletingCompare) === recompareCellKey(row.id, column.table_name)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(deletingCompare) === recompareCellKey(row.id, column.table_name) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E1A..." : "Recompare")}</button></div>`);
                  } else {
                    _push2(`<span class="empty-cell" data-v-1bc5df0c${_scopeId}>--</span>`);
                  }
                  _push2(`</td>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]-->`);
              if (unref(recomparePreview) && !unref(recompareMatrixRows).length) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td${ssrRenderAttr("colspan", unref(recompareTableColspan))} data-v-1bc5df0c${_scopeId}>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E35\u0E49</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              if (!unref(recomparePreview)) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td${ssrRenderAttr("colspan", unref(recompareTableColspan))} data-v-1bc5df0c${_scopeId}>\u0E01\u0E14 \u201C\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A\u201D \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            } else {
              return [
                createVNode("div", { class: "admin-table-wrap" }, [
                  createVNode("table", { class: "admin-data-table recompare-table recompare-matrix" }, [
                    createVNode("thead", null, [
                      createVNode("tr", null, [
                        createVNode("th", null, "No"),
                        createVNode("th", null, "ID"),
                        createVNode("th", null, "UserR1"),
                        createVNode("th", null, "UserR2"),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(recompareColumns), (column) => {
                          return openBlock(), createBlock("th", {
                            key: column.table_name
                          }, [
                            createTextVNode(toDisplayString(column.table_name) + " ", 1),
                            column.display_name && column.display_name !== column.table_name ? (openBlock(), createBlock("small", { key: 0 }, toDisplayString(column.display_name), 1)) : createCommentVNode("", true)
                          ]);
                        }), 128))
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(recompareMatrixRows), (row, index) => {
                        return openBlock(), createBlock("tr", {
                          key: row.id
                        }, [
                          createVNode("td", { class: "number-cell" }, toDisplayString(index + 1), 1),
                          createVNode("td", null, toDisplayString(row.id), 1),
                          createVNode("td", null, toDisplayString(row.user_r1 || "-"), 1),
                          createVNode("td", null, toDisplayString(row.user_r2 || "-"), 1),
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(recompareColumns), (column) => {
                            return openBlock(), createBlock("td", {
                              key: `${row.id}:${column.table_name}`,
                              class: "recompare-cell-wrap"
                            }, [
                              row.cells && row.cells[column.table_name] ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "recompare-cell"
                              }, [
                                createVNode("span", {
                                  class: ["cell-icon", recompareStatusClass(row.cells[column.table_name])],
                                  title: recompareCellTitle(row.cells[column.table_name])
                                }, toDisplayString(recompareCellIcon(row.cells[column.table_name])), 11, ["title"]),
                                createVNode("button", {
                                  class: "btn btn-warning btn-small",
                                  type: "button",
                                  disabled: !row.cells[column.table_name].has_compare_data || unref(deletingCompare) === recompareCellKey(row.id, column.table_name),
                                  onClick: ($event) => executeRecompareCell(row, column)
                                }, toDisplayString(unref(deletingCompare) === recompareCellKey(row.id, column.table_name) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E1A..." : "Recompare"), 9, ["disabled", "onClick"])
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "empty-cell"
                              }, "--"))
                            ]);
                          }), 128))
                        ]);
                      }), 128)),
                      unref(recomparePreview) && !unref(recompareMatrixRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", { colspan: unref(recompareTableColspan) }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E35\u0E49", 8, ["colspan"])
                      ])) : createCommentVNode("", true),
                      !unref(recomparePreview) ? (openBlock(), createBlock("tr", { key: 1 }, [
                        createVNode("td", { colspan: unref(recompareTableColspan) }, "\u0E01\u0E14 \u201C\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E08\u0E30\u0E25\u0E1A\u201D \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E17\u0E38\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07", 8, ["colspan"])
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "chk_user") {
        _push(`<section class="admin-tool-grid" data-v-1bc5df0c>`);
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 CHK_USER" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> \u0E40\u0E25\u0E37\u0E2D\u0E01 Project \u0E41\u0E25\u0E30\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07 \`_cmp.chk_user\` \u0E16\u0E49\u0E32\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E01\u0E23\u0E2D\u0E07\u0E41\u0E1A\u0E1A prefix \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E15\u0E32\u0E21 limit </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> Project <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(projects), (project) => {
                _push2(`<option${ssrRenderAttr("value", project.project_code)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectCode)) ? ssrLooseContain(unref(selectedProjectCode), project.project_code) : ssrLooseEqual(unref(selectedProjectCode), project.project_code)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.project_name)} (${ssrInterpolate(project.project_code)}) </option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> \u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredDatabases), (database) => {
                _push2(`<option${ssrRenderAttr("value", database.database_id)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDatabaseId)) ? ssrLooseContain(unref(selectedDatabaseId), database.database_id) : ssrLooseEqual(unref(selectedDatabaseId), database.database_id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(databaseLabel(database))}</option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> Search ID <input${ssrRenderAttr("value", unref(chkUserFilters).search_id)} placeholder="\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E01\u0E47\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25\u0E44\u0E14\u0E49" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingChkUser)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingChkUser) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14..." : "\u0E41\u0E2A\u0E14\u0E07 CHK_USER")}</button><button class="btn btn-warning" type="button"${ssrIncludeBooleanAttr(unref(loadingChkUser) || !unref(chkUserRows).length) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}> EXPORT XLS </button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " \u0E40\u0E25\u0E37\u0E2D\u0E01 Project \u0E41\u0E25\u0E30\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07 `_cmp.chk_user` \u0E16\u0E49\u0E32\u0E01\u0E23\u0E2D\u0E01 Search ID \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E01\u0E23\u0E2D\u0E07\u0E41\u0E1A\u0E1A prefix \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E15\u0E32\u0E21 limit "),
                createVNode("div", { class: "admin-form-grid" }, [
                  createVNode("label", null, [
                    createTextVNode(" Project "),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => isRef(selectedProjectCode) ? selectedProjectCode.value = $event : null
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(projects), (project) => {
                        return openBlock(), createBlock("option", {
                          key: project.project_code,
                          value: project.project_code
                        }, toDisplayString(project.project_name) + " (" + toDisplayString(project.project_code) + ") ", 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(selectedProjectCode)]
                    ])
                  ]),
                  createVNode("label", null, [
                    createTextVNode(" \u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 "),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => isRef(selectedDatabaseId) ? selectedDatabaseId.value = $event : null
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredDatabases), (database) => {
                        return openBlock(), createBlock("option", {
                          key: database.database_id,
                          value: database.database_id
                        }, toDisplayString(databaseLabel(database)), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(selectedDatabaseId)]
                    ])
                  ]),
                  createVNode("label", null, [
                    createTextVNode(" Search ID "),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(chkUserFilters).search_id = $event,
                      placeholder: "\u0E44\u0E21\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E01\u0E47\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25\u0E44\u0E14\u0E49"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(chkUserFilters).search_id,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ])
                ]),
                createVNode("div", { class: "admin-actions" }, [
                  createVNode("button", {
                    class: "btn btn-gray",
                    type: "button",
                    disabled: unref(loadingChkUser),
                    onClick: loadChkUserRows
                  }, toDisplayString(unref(loadingChkUser) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14..." : "\u0E41\u0E2A\u0E14\u0E07 CHK_USER"), 9, ["disabled"]),
                  createVNode("button", {
                    class: "btn btn-warning",
                    type: "button",
                    disabled: unref(loadingChkUser) || !unref(chkUserRows).length,
                    onClick: exportChkUser
                  }, " EXPORT XLS ", 8, ["disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E2A\u0E23\u0E38\u0E1B CHK_USER" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b;
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Compare DB</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(((_a = unref(selectedDatabase)) == null ? void 0 : _a.compare_database) || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(chkUserTotal)))} rows</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(chkUserRows).length))} rows</dd></div></dl>`);
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "Compare DB"),
                    createVNode("dd", null, toDisplayString(((_b = unref(selectedDatabase)) == null ? void 0 : _b.compare_database) || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"),
                    createVNode("dd", null, toDisplayString(formatNumber(unref(chkUserTotal))) + " rows", 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25"),
                    createVNode("dd", null, toDisplayString(formatNumber(unref(chkUserRows).length)) + " rows", 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "chk_user") {
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "CHK_USER Detail" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="admin-table-wrap" data-v-1bc5df0c${_scopeId}><table class="admin-data-table" data-v-1bc5df0c${_scopeId}><thead data-v-1bc5df0c${_scopeId}><tr data-v-1bc5df0c${_scopeId}><th data-v-1bc5df0c${_scopeId}>Project</th><th data-v-1bc5df0c${_scopeId}>Database</th><th data-v-1bc5df0c${_scopeId}>User</th><th data-v-1bc5df0c${_scopeId}>Tab</th><th data-v-1bc5df0c${_scopeId}>HHID</th><th data-v-1bc5df0c${_scopeId}>date</th><th data-v-1bc5df0c${_scopeId}>time</th><th data-v-1bc5df0c${_scopeId}>keyfields</th><th data-v-1bc5df0c${_scopeId}>val_r1</th><th data-v-1bc5df0c${_scopeId}>val_r2</th><th data-v-1bc5df0c${_scopeId}>val</th></tr></thead><tbody data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(chkUserRows), (row, index) => {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.project)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.database)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.user)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.tab)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.hhid)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.date)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.time)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.keyfields)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.val_r1)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.val_r2)}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.val)}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (!unref(chkUserRows).length) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td colspan="11" data-v-1bc5df0c${_scopeId}>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 CHK_USER \u0E15\u0E32\u0E21\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            } else {
              return [
                createVNode("div", { class: "admin-table-wrap" }, [
                  createVNode("table", { class: "admin-data-table" }, [
                    createVNode("thead", null, [
                      createVNode("tr", null, [
                        createVNode("th", null, "Project"),
                        createVNode("th", null, "Database"),
                        createVNode("th", null, "User"),
                        createVNode("th", null, "Tab"),
                        createVNode("th", null, "HHID"),
                        createVNode("th", null, "date"),
                        createVNode("th", null, "time"),
                        createVNode("th", null, "keyfields"),
                        createVNode("th", null, "val_r1"),
                        createVNode("th", null, "val_r2"),
                        createVNode("th", null, "val")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(chkUserRows), (row, index) => {
                        return openBlock(), createBlock("tr", {
                          key: `${row.hhid}-${row.tab}-${row.keyfields}-${index}`
                        }, [
                          createVNode("td", null, toDisplayString(row.project), 1),
                          createVNode("td", null, toDisplayString(row.database), 1),
                          createVNode("td", null, toDisplayString(row.user), 1),
                          createVNode("td", null, toDisplayString(row.tab), 1),
                          createVNode("td", null, toDisplayString(row.hhid), 1),
                          createVNode("td", null, toDisplayString(row.date), 1),
                          createVNode("td", null, toDisplayString(row.time), 1),
                          createVNode("td", null, toDisplayString(row.keyfields), 1),
                          createVNode("td", null, toDisplayString(row.val_r1), 1),
                          createVNode("td", null, toDisplayString(row.val_r2), 1),
                          createVNode("td", null, toDisplayString(row.val), 1)
                        ]);
                      }), 128)),
                      !unref(chkUserRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", { colspan: "11" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 CHK_USER \u0E15\u0E32\u0E21\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "daily") {
        _push(`<section class="admin-tool-grid" data-v-1bc5df0c>`);
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19 Compare \u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> \u0E41\u0E2A\u0E14\u0E07\u0E27\u0E48\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E21\u0E35\u0E01\u0E32\u0E23 compare Project \u0E44\u0E2B\u0E19 \u0E10\u0E32\u0E19\u0E44\u0E2B\u0E19 \u0E15\u0E32\u0E23\u0E32\u0E07\u0E44\u0E2B\u0E19 \u0E41\u0E25\u0E30\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E01\u0E35\u0E48\u0E23\u0E2B\u0E31\u0E2A\u0E41\u0E25\u0E49\u0E27 \u0E42\u0E14\u0E22\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 \`cmp_compare_run_records\` \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E36\u0E07 fallback \u0E44\u0E1B\u0E2D\u0E48\u0E32\u0E19 \`_cmp.chk_user\` </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 <input${ssrRenderAttr("value", unref(dailyDate))} type="date" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingDaily)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingDaily) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14..." : "\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19")}</button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " \u0E41\u0E2A\u0E14\u0E07\u0E27\u0E48\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E21\u0E35\u0E01\u0E32\u0E23 compare Project \u0E44\u0E2B\u0E19 \u0E10\u0E32\u0E19\u0E44\u0E2B\u0E19 \u0E15\u0E32\u0E23\u0E32\u0E07\u0E44\u0E2B\u0E19 \u0E41\u0E25\u0E30\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E01\u0E35\u0E48\u0E23\u0E2B\u0E31\u0E2A\u0E41\u0E25\u0E49\u0E27 \u0E42\u0E14\u0E22\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 `cmp_compare_run_records` \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E36\u0E07 fallback \u0E44\u0E1B\u0E2D\u0E48\u0E32\u0E19 `_cmp.chk_user` "),
                createVNode("div", { class: "admin-form-grid" }, [
                  createVNode("label", null, [
                    createTextVNode(" \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 "),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => isRef(dailyDate) ? dailyDate.value = $event : null,
                      type: "date"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(dailyDate)]
                    ])
                  ])
                ]),
                createVNode("div", { class: "admin-actions" }, [
                  createVNode("button", {
                    class: "btn btn-gray",
                    type: "button",
                    disabled: unref(loadingDaily),
                    onClick: loadDailyReport
                  }, toDisplayString(unref(loadingDaily) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14..." : "\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19"), 9, ["disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E2A\u0E23\u0E38\u0E1B\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b, _c, _d;
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(dailyReport).date || unref(dailyDate))}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(dailyReport).source || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E2B\u0E31\u0E2A</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(((_a = unref(dailyReport).summary) == null ? void 0 : _a.compared_ids) || 0))}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(((_b = unref(dailyReport).summary) == null ? void 0 : _b.completed_records) || 0))}</dd></div></dl>`);
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48"),
                    createVNode("dd", null, toDisplayString(unref(dailyReport).date || unref(dailyDate)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"),
                    createVNode("dd", null, toDisplayString(unref(dailyReport).source || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E2B\u0E31\u0E2A"),
                    createVNode("dd", null, toDisplayString(formatNumber(((_c = unref(dailyReport).summary) == null ? void 0 : _c.compared_ids) || 0)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"),
                    createVNode("dd", null, toDisplayString(formatNumber(((_d = unref(dailyReport).summary) == null ? void 0 : _d.completed_records) || 0)), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "daily") {
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 Compare \u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="admin-table-wrap" data-v-1bc5df0c${_scopeId}><table class="admin-data-table" data-v-1bc5df0c${_scopeId}><thead data-v-1bc5df0c${_scopeId}><tr data-v-1bc5df0c${_scopeId}><th data-v-1bc5df0c${_scopeId}>Project</th><th data-v-1bc5df0c${_scopeId}>\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</th><th data-v-1bc5df0c${_scopeId}>\u0E15\u0E32\u0E23\u0E32\u0E07</th><th data-v-1bc5df0c${_scopeId}>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E2B\u0E31\u0E2A</th><th data-v-1bc5df0c${_scopeId}>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23</th><th data-v-1bc5df0c${_scopeId}>\u0E40\u0E23\u0E34\u0E48\u0E21</th><th data-v-1bc5df0c${_scopeId}>\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14</th></tr></thead><tbody data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(dailyRows), (row) => {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.project_name || row.project_code)}</strong><small data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.project_code)}</small></td><td data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.questionnaire_name || row.database_code)}</strong><small data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.database_code)}</small></td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.table_name)}</td><td class="number-cell" data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(row.compared_ids))}</td><td class="number-cell" data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(row.completed_records))}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatDateTime(row.first_completed_at))}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatDateTime(row.last_completed_at))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (!unref(dailyRows).length) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td colspan="7" data-v-1bc5df0c${_scopeId}>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E43\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            } else {
              return [
                createVNode("div", { class: "admin-table-wrap" }, [
                  createVNode("table", { class: "admin-data-table" }, [
                    createVNode("thead", null, [
                      createVNode("tr", null, [
                        createVNode("th", null, "Project"),
                        createVNode("th", null, "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"),
                        createVNode("th", null, "\u0E15\u0E32\u0E23\u0E32\u0E07"),
                        createVNode("th", null, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E2B\u0E31\u0E2A"),
                        createVNode("th", null, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"),
                        createVNode("th", null, "\u0E40\u0E23\u0E34\u0E48\u0E21"),
                        createVNode("th", null, "\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dailyRows), (row) => {
                        return openBlock(), createBlock("tr", {
                          key: `${row.project_code}-${row.database_code}-${row.table_name}`
                        }, [
                          createVNode("td", null, [
                            createVNode("strong", null, toDisplayString(row.project_name || row.project_code), 1),
                            createVNode("small", null, toDisplayString(row.project_code), 1)
                          ]),
                          createVNode("td", null, [
                            createVNode("strong", null, toDisplayString(row.questionnaire_name || row.database_code), 1),
                            createVNode("small", null, toDisplayString(row.database_code), 1)
                          ]),
                          createVNode("td", null, toDisplayString(row.table_name), 1),
                          createVNode("td", { class: "number-cell" }, toDisplayString(formatNumber(row.compared_ids)), 1),
                          createVNode("td", { class: "number-cell" }, toDisplayString(formatNumber(row.completed_records)), 1),
                          createVNode("td", null, toDisplayString(formatDateTime(row.first_completed_at)), 1),
                          createVNode("td", null, toDisplayString(formatDateTime(row.last_completed_at)), 1)
                        ]);
                      }), 128)),
                      !unref(dailyRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", { colspan: "7" }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 compare \u0E43\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1bc5df0c"]]);

export { admin as default };;globalThis.__timing__.logEnd('Load chunks/build/admin-2wmvq8IE');
//# sourceMappingURL=admin-2wmvq8IE.mjs.map
