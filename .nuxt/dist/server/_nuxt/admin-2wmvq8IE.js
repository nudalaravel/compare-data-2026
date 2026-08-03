import { _ as _sfc_main$1 } from "./LegacyPanel-DJJ9u9fC.js";
import { ref, reactive, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, withDirectives, isRef, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _export_sfc, u as useRuntimeConfig } from "../server.mjs";
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
const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const apiBase = String(config.public.apiBase || "").replace(/\/$/, "");
    const adminTabs = [
      { id: "recompare", label: "ยกเลิก Compare / Recompare" },
      { id: "chk_user", label: "CHK_USER / Export" },
      { id: "daily", label: "รายงาน Compare รายวัน" }
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
    const recompareColumns = computed(() => recomparePreview.value?.columns || []);
    const recompareMatrixRows = computed(() => recomparePreview.value?.matrix_rows || []);
    const recompareTotals = computed(() => recomparePreview.value?.totals || {});
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
      if (!selectedDatabaseId.value) {
        tables.value = [];
        return;
      }
      loadingTables.value = true;
      try {
        const res = await fetchTool({ action: "tables", database_id: selectedDatabaseId.value });
        tables.value = res?.data?.tables || [];
        if (!selectedTableName.value && tables.value.length) {
          selectedTableName.value = tables.value[0].table_name;
        }
      } catch (error) {
        tables.value = [];
        loadError.value = error?.data?.message || error?.message || "ไม่สามารถโหลดรายการตารางได้";
      } finally {
        loadingTables.value = false;
      }
    }
    function validateScope(requireTable = true, requireSearch = false) {
      actionMessage.value = "";
      loadError.value = "";
      if (!selectedDatabaseId.value) {
        loadError.value = "กรุณาเลือกฐานข้อมูล";
        return false;
      }
      if (requireTable && !selectedTableName.value) {
        loadError.value = "กรุณาเลือกตาราง";
        return false;
      }
      if (requireSearch && !recompareForm.search_id.trim()) {
        loadError.value = "กรุณากรอก Search ID";
        return false;
      }
      return true;
    }
    async function loadRecomparePreview(clearResult = true) {
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
        recomparePreview.value = res?.data || null;
        actionMessage.value = "ตรวจสอบข้อมูลที่จะลบแล้ว";
      } catch (error) {
        recomparePreview.value = null;
        loadError.value = error?.data?.message || error?.message || "ตรวจสอบข้อมูลที่จะลบไม่สำเร็จ";
      } finally {
        loadingPreview.value = false;
      }
    }
    async function executeRecompareCell(row, column) {
      const tableName = column?.table_name || "";
      const searchId = row?.id || "";
      const cell = row?.cells?.[tableName] || null;
      if (!validateScope(false, false)) return;
      if (!recomparePreview.value) {
        await loadRecomparePreview(false);
      }
      if (!tableName || !searchId || !cell?.has_compare_data) {
        loadError.value = "ไม่พบข้อมูลใน _cmp หรือ chk_user ของตารางนี้";
        return;
      }
      await executeRecompareForTable(tableName, searchId);
    }
    async function executeRecompareForTable(tableName, searchId) {
      const ok = (void 0).confirm(`ยืนยันลบข้อมูล compare ของ ${selectedDatabase.value?.compare_database}.${tableName} รหัส ${searchId} ?`);
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
        recompareResult.value = res?.data?.result || null;
        actionMessage.value = "ยกเลิก compare/recompare แล้ว";
        await loadRecomparePreview(false);
      } catch (error) {
        loadError.value = error?.data?.message || error?.message || "ยกเลิก compare/recompare ไม่สำเร็จ";
      } finally {
        deletingCompare.value = "";
      }
    }
    async function executeRecompareAll() {
      if (!validateScope(false, true)) return;
      if (!recompareMatrixRows.value.length) {
        loadError.value = "ยังไม่มีรายการ compare สำหรับรหัสนี้";
        return;
      }
      const searchId = recompareForm.search_id.trim();
      const ok = (void 0).confirm(`ยืนยันลบข้อมูล compare ทุกตารางของ ${selectedDatabase.value?.compare_database} รหัส ${searchId} ?`);
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
        recompareResult.value = res?.data || null;
        actionMessage.value = "ยกเลิก compare/recompare ทุกตารางแล้ว";
        await loadRecomparePreview(false);
      } catch (error) {
        loadError.value = error?.data?.message || error?.message || "ยกเลิก compare/recompare ทุกตารางไม่สำเร็จ";
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
      if (!validateScope(false, false)) return;
      loadingChkUser.value = true;
      try {
        const res = await fetchTool(chkUserParams());
        chkUserRows.value = res?.data?.rows || [];
        chkUserTotal.value = Number(res?.data?.total || 0);
        actionMessage.value = "โหลด CHK_USER แล้ว";
      } catch (error) {
        chkUserRows.value = [];
        chkUserTotal.value = 0;
        loadError.value = error?.data?.message || error?.message || "โหลด CHK_USER ไม่สำเร็จ";
      } finally {
        loadingChkUser.value = false;
      }
    }
    async function exportChkUser() {
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
        link.download = `chk_user_${selectedDatabase.value?.database_code || "export"}_${Date.now()}.xls`;
        (void 0).body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        actionMessage.value = "Export CHK_USER เป็น XLS แล้ว";
      } catch (error) {
        loadError.value = error?.message || "Export CHK_USER ไม่สำเร็จ";
      } finally {
        loadingChkUser.value = false;
      }
    }
    async function loadDailyReport() {
      loadingDaily.value = true;
      try {
        const res = await fetchTool({ action: "daily-report", date: dailyDate.value });
        dailyReport.value = res?.data || {};
        dailyRows.value = res?.data?.rows || [];
        actionMessage.value = activeTab.value === "daily" ? "โหลดรายงานรายวันแล้ว" : actionMessage.value;
      } catch (error) {
        dailyReport.value = {};
        dailyRows.value = [];
        loadError.value = error?.data?.message || error?.message || "โหลดรายงานรายวันไม่สำเร็จ";
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
      if (!row.cmp_table_exists) return "ยังไม่มีตาราง _cmp";
      if (!row.has_compare_data) return "ยังไม่พบ compare";
      if (Number(row.cmp_completed_rows || 0) > 0) return "Compare แล้ว";
      if (Number(row.cmp_pending_rows || 0) > 0) return "มีข้อมูลรอ compare";
      return "มีเฉพาะ chk_user";
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
      if (!cell?.has_compare_data) return "--";
      if (Number(cell.cmp_completed_rows || 0) > 0) return "✓";
      if (Number(cell.cmp_pending_rows || 0) > 0) return "▲";
      return "✓";
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
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page admin-page" }, _attrs))} data-v-1bc5df0c><header class="admin-page-head" data-v-1bc5df0c><div data-v-1bc5df0c><h1 class="page-title" data-v-1bc5df0c>Administrator</h1><p class="updated" data-v-1bc5df0c>เครื่องมือดูแล Compare Data, CHK_USER และรายงานการ compare รายวัน</p></div><span class="admin-user-pill" data-v-1bc5df0c>USER: ${ssrInterpolate(unref(adminUsername) || "-")}</span></header><nav class="admin-submenu" aria-label="Administrator submenu" data-v-1bc5df0c><!--[-->`);
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ยกเลิก Compare / Recompare" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> เลือก Project และฐานข้อมูลเพื่อดูข้อมูล compare ทุกตาราง ถ้ากรอก Search ID ระบบจะกรองเฉพาะรหัสนั้น ถ้าไม่กรอกจะแสดงยอดรวมทั้งหมด การกด Recompare ยังต้องกรอก Search ID เพื่อไม่ให้ลบกว้างเกินไป </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> Project <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(projects), (project) => {
                _push2(`<option${ssrRenderAttr("value", project.project_code)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectCode)) ? ssrLooseContain(unref(selectedProjectCode), project.project_code) : ssrLooseEqual(unref(selectedProjectCode), project.project_code)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.project_name)} (${ssrInterpolate(project.project_code)}) </option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> ฐานข้อมูล <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredDatabases), (database) => {
                _push2(`<option${ssrRenderAttr("value", database.database_id)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDatabaseId)) ? ssrLooseContain(unref(selectedDatabaseId), database.database_id) : ssrLooseEqual(unref(selectedDatabaseId), database.database_id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(databaseLabel(database))}</option>`);
              });
              _push2(`<!--]--></select></label><label class="wide" data-v-1bc5df0c${_scopeId}> Search ID <input${ssrRenderAttr("value", unref(recompareForm).search_id)} placeholder="ไม่กรอกก็แสดงผลได้" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingPreview)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingPreview) ? "กำลังตรวจ..." : "ตรวจสอบข้อมูลที่จะลบ")}</button><button class="btn btn-warning" type="button"${ssrIncludeBooleanAttr(!unref(canRecompareAll) || unref(deletingCompare) === "__all__") ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(deletingCompare) === "__all__" ? "กำลังลบทุกตาราง..." : "Recompare all")}</button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " เลือก Project และฐานข้อมูลเพื่อดูข้อมูล compare ทุกตาราง ถ้ากรอก Search ID ระบบจะกรองเฉพาะรหัสนั้น ถ้าไม่กรอกจะแสดงยอดรวมทั้งหมด การกด Recompare ยังต้องกรอก Search ID เพื่อไม่ให้ลบกว้างเกินไป "),
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
                    createTextVNode(" ฐานข้อมูล "),
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
                      placeholder: "ไม่กรอกก็แสดงผลได้"
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
                  }, toDisplayString(unref(loadingPreview) ? "กำลังตรวจ..." : "ตรวจสอบข้อมูลที่จะลบ"), 9, ["disabled"]),
                  createVNode("button", {
                    class: "btn btn-warning",
                    type: "button",
                    disabled: !unref(canRecompareAll) || unref(deletingCompare) === "__all__",
                    onClick: executeRecompareAll
                  }, toDisplayString(unref(deletingCompare) === "__all__" ? "กำลังลบทุกตาราง..." : "Recompare all"), 9, ["disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "สรุป Scope" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Project</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(selectedProject)?.project_name || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Database</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(selectedDatabase)?.database_code || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Compare DB</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(selectedDatabase)?.compare_database || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Search ID</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(recompareForm).search_id || "-")}</dd></div></dl>`);
              if (unref(recomparePreview)) {
                _push2(`<div class="preview-box" data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>ผลตรวจสอบทุกตาราง</strong><div class="metric-grid" data-v-1bc5df0c${_scopeId}><span data-v-1bc5df0c${_scopeId}>cmp rows</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_rows))}</b><span data-v-1bc5df0c${_scopeId}>cmp complete</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_completed_rows))}</b><span data-v-1bc5df0c${_scopeId}>cmp pending</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).cmp_pending_rows))}</b><span data-v-1bc5df0c${_scopeId}>chk_user rows</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareTotals).chk_user_rows))}</b></div><small data-v-1bc5df0c${_scopeId}>พบข้อมูล compare ใน ${ssrInterpolate(formatNumber(unref(recompareTotals).tables_with_cmp_rows))} จาก ${ssrInterpolate(formatNumber(unref(recompareTotals).tables))} ตาราง</small></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(recompareResult)) {
                _push2(`<div class="preview-box success" data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>ดำเนินการแล้ว</strong><div class="metric-grid" data-v-1bc5df0c${_scopeId}><span data-v-1bc5df0c${_scopeId}>deleted cmp</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareResult).deleted_cmp_rows))}</b><span data-v-1bc5df0c${_scopeId}>deleted chk_user</span><b data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(recompareResult).deleted_chk_user_rows))}</b></div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "Project"),
                    createVNode("dd", null, toDisplayString(unref(selectedProject)?.project_name || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "Database"),
                    createVNode("dd", null, toDisplayString(unref(selectedDatabase)?.database_code || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "Compare DB"),
                    createVNode("dd", null, toDisplayString(unref(selectedDatabase)?.compare_database || "-"), 1)
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
                  createVNode("strong", null, "ผลตรวจสอบทุกตาราง"),
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
                  createVNode("small", null, "พบข้อมูล compare ใน " + toDisplayString(formatNumber(unref(recompareTotals).tables_with_cmp_rows)) + " จาก " + toDisplayString(formatNumber(unref(recompareTotals).tables)) + " ตาราง", 1)
                ])) : createCommentVNode("", true),
                unref(recompareResult) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "preview-box success"
                }, [
                  createVNode("strong", null, "ดำเนินการแล้ว"),
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "รายการ Compare ที่พบ" }, {
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
                    _push2(`<div class="recompare-cell" data-v-1bc5df0c${_scopeId}><span class="${ssrRenderClass(["cell-icon", recompareStatusClass(row.cells[column.table_name])])}"${ssrRenderAttr("title", recompareCellTitle(row.cells[column.table_name]))} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(recompareCellIcon(row.cells[column.table_name]))}</span><button class="btn btn-warning btn-small" type="button"${ssrIncludeBooleanAttr(!row.cells[column.table_name].has_compare_data || unref(deletingCompare) === recompareCellKey(row.id, column.table_name)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(deletingCompare) === recompareCellKey(row.id, column.table_name) ? "กำลังลบ..." : "Recompare")}</button></div>`);
                  } else {
                    _push2(`<span class="empty-cell" data-v-1bc5df0c${_scopeId}>--</span>`);
                  }
                  _push2(`</td>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]-->`);
              if (unref(recomparePreview) && !unref(recompareMatrixRows).length) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td${ssrRenderAttr("colspan", unref(recompareTableColspan))} data-v-1bc5df0c${_scopeId}>ยังไม่มีรายการ compare สำหรับฐานข้อมูลนี้</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              if (!unref(recomparePreview)) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td${ssrRenderAttr("colspan", unref(recompareTableColspan))} data-v-1bc5df0c${_scopeId}>กด “ตรวจสอบข้อมูลที่จะลบ” เพื่อดูรายการ compare ทุกตาราง</td></tr>`);
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
                                }, toDisplayString(unref(deletingCompare) === recompareCellKey(row.id, column.table_name) ? "กำลังลบ..." : "Recompare"), 9, ["disabled", "onClick"])
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "empty-cell"
                              }, "--"))
                            ]);
                          }), 128))
                        ]);
                      }), 128)),
                      unref(recomparePreview) && !unref(recompareMatrixRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", { colspan: unref(recompareTableColspan) }, "ยังไม่มีรายการ compare สำหรับฐานข้อมูลนี้", 8, ["colspan"])
                      ])) : createCommentVNode("", true),
                      !unref(recomparePreview) ? (openBlock(), createBlock("tr", { key: 1 }, [
                        createVNode("td", { colspan: unref(recompareTableColspan) }, "กด “ตรวจสอบข้อมูลที่จะลบ” เพื่อดูรายการ compare ทุกตาราง", 8, ["colspan"])
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "จัดการข้อมูล CHK_USER" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> เลือก Project และฐานข้อมูลเพื่อดูรายการในตาราง \`_cmp.chk_user\` ถ้ากรอก Search ID ระบบจะกรองแบบ prefix ถ้าไม่กรอกจะแสดงรายการล่าสุดตาม limit </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> Project <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(projects), (project) => {
                _push2(`<option${ssrRenderAttr("value", project.project_code)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectCode)) ? ssrLooseContain(unref(selectedProjectCode), project.project_code) : ssrLooseEqual(unref(selectedProjectCode), project.project_code)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.project_name)} (${ssrInterpolate(project.project_code)}) </option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> ฐานข้อมูล <select data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredDatabases), (database) => {
                _push2(`<option${ssrRenderAttr("value", database.database_id)} data-v-1bc5df0c${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDatabaseId)) ? ssrLooseContain(unref(selectedDatabaseId), database.database_id) : ssrLooseEqual(unref(selectedDatabaseId), database.database_id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(databaseLabel(database))}</option>`);
              });
              _push2(`<!--]--></select></label><label data-v-1bc5df0c${_scopeId}> Search ID <input${ssrRenderAttr("value", unref(chkUserFilters).search_id)} placeholder="ไม่กรอกก็แสดงผลได้" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingChkUser)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingChkUser) ? "กำลังโหลด..." : "แสดง CHK_USER")}</button><button class="btn btn-warning" type="button"${ssrIncludeBooleanAttr(unref(loadingChkUser) || !unref(chkUserRows).length) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}> EXPORT XLS </button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " เลือก Project และฐานข้อมูลเพื่อดูรายการในตาราง `_cmp.chk_user` ถ้ากรอก Search ID ระบบจะกรองแบบ prefix ถ้าไม่กรอกจะแสดงรายการล่าสุดตาม limit "),
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
                    createTextVNode(" ฐานข้อมูล "),
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
                      placeholder: "ไม่กรอกก็แสดงผลได้"
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
                  }, toDisplayString(unref(loadingChkUser) ? "กำลังโหลด..." : "แสดง CHK_USER"), 9, ["disabled"]),
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "สรุป CHK_USER" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>Compare DB</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(selectedDatabase)?.compare_database || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>จำนวนทั้งหมด</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(chkUserTotal)))} rows</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>แสดงผล</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(chkUserRows).length))} rows</dd></div></dl>`);
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "Compare DB"),
                    createVNode("dd", null, toDisplayString(unref(selectedDatabase)?.compare_database || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "จำนวนทั้งหมด"),
                    createVNode("dd", null, toDisplayString(formatNumber(unref(chkUserTotal))) + " rows", 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "แสดงผล"),
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
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td colspan="11" data-v-1bc5df0c${_scopeId}>ไม่พบข้อมูล CHK_USER ตามเงื่อนไข</td></tr>`);
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
                        createVNode("td", { colspan: "11" }, "ไม่พบข้อมูล CHK_USER ตามเงื่อนไข")
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "รายงาน Compare รายวัน" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="tool-hint" data-v-1bc5df0c${_scopeId}> แสดงว่าวันที่เลือกมีการ compare Project ไหน ฐานไหน ตารางไหน และเสร็จกี่รหัสแล้ว โดยอ้างอิง \`cmp_compare_run_records\` ถ้าไม่มีข้อมูลจึง fallback ไปอ่าน \`_cmp.chk_user\` </p><div class="admin-form-grid" data-v-1bc5df0c${_scopeId}><label data-v-1bc5df0c${_scopeId}> วันที่ <input${ssrRenderAttr("value", unref(dailyDate))} type="date" data-v-1bc5df0c${_scopeId}></label></div><div class="admin-actions" data-v-1bc5df0c${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loadingDaily)) ? " disabled" : ""} data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(loadingDaily) ? "กำลังโหลด..." : "แสดงรายงานรายวัน")}</button></div>`);
            } else {
              return [
                createVNode("p", { class: "tool-hint" }, " แสดงว่าวันที่เลือกมีการ compare Project ไหน ฐานไหน ตารางไหน และเสร็จกี่รหัสแล้ว โดยอ้างอิง `cmp_compare_run_records` ถ้าไม่มีข้อมูลจึง fallback ไปอ่าน `_cmp.chk_user` "),
                createVNode("div", { class: "admin-form-grid" }, [
                  createVNode("label", null, [
                    createTextVNode(" วันที่ "),
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
                  }, toDisplayString(unref(loadingDaily) ? "กำลังโหลด..." : "แสดงรายงานรายวัน"), 9, ["disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "สรุปรายวัน" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<dl class="detail-list" data-v-1bc5df0c${_scopeId}><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>วันที่</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(dailyReport).date || unref(dailyDate))}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>แหล่งข้อมูล</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(unref(dailyReport).source || "-")}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>จำนวนรหัส</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(dailyReport).summary?.compared_ids || 0))}</dd></div><div data-v-1bc5df0c${_scopeId}><dt data-v-1bc5df0c${_scopeId}>จำนวนรายการ</dt><dd data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(unref(dailyReport).summary?.completed_records || 0))}</dd></div></dl>`);
            } else {
              return [
                createVNode("dl", { class: "detail-list" }, [
                  createVNode("div", null, [
                    createVNode("dt", null, "วันที่"),
                    createVNode("dd", null, toDisplayString(unref(dailyReport).date || unref(dailyDate)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "แหล่งข้อมูล"),
                    createVNode("dd", null, toDisplayString(unref(dailyReport).source || "-"), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "จำนวนรหัส"),
                    createVNode("dd", null, toDisplayString(formatNumber(unref(dailyReport).summary?.compared_ids || 0)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("dt", null, "จำนวนรายการ"),
                    createVNode("dd", null, toDisplayString(formatNumber(unref(dailyReport).summary?.completed_records || 0)), 1)
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
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "รายการ Compare รายวัน" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="admin-table-wrap" data-v-1bc5df0c${_scopeId}><table class="admin-data-table" data-v-1bc5df0c${_scopeId}><thead data-v-1bc5df0c${_scopeId}><tr data-v-1bc5df0c${_scopeId}><th data-v-1bc5df0c${_scopeId}>Project</th><th data-v-1bc5df0c${_scopeId}>ฐานข้อมูล</th><th data-v-1bc5df0c${_scopeId}>ตาราง</th><th data-v-1bc5df0c${_scopeId}>จำนวนรหัส</th><th data-v-1bc5df0c${_scopeId}>จำนวนรายการ</th><th data-v-1bc5df0c${_scopeId}>เริ่ม</th><th data-v-1bc5df0c${_scopeId}>ล่าสุด</th></tr></thead><tbody data-v-1bc5df0c${_scopeId}><!--[-->`);
              ssrRenderList(unref(dailyRows), (row) => {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.project_name || row.project_code)}</strong><small data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.project_code)}</small></td><td data-v-1bc5df0c${_scopeId}><strong data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.questionnaire_name || row.database_code)}</strong><small data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.database_code)}</small></td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(row.table_name)}</td><td class="number-cell" data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(row.compared_ids))}</td><td class="number-cell" data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatNumber(row.completed_records))}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatDateTime(row.first_completed_at))}</td><td data-v-1bc5df0c${_scopeId}>${ssrInterpolate(formatDateTime(row.last_completed_at))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (!unref(dailyRows).length) {
                _push2(`<tr data-v-1bc5df0c${_scopeId}><td colspan="7" data-v-1bc5df0c${_scopeId}>ยังไม่มีรายการ compare ในวันที่เลือก</td></tr>`);
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
                        createVNode("th", null, "ฐานข้อมูล"),
                        createVNode("th", null, "ตาราง"),
                        createVNode("th", null, "จำนวนรหัส"),
                        createVNode("th", null, "จำนวนรายการ"),
                        createVNode("th", null, "เริ่ม"),
                        createVNode("th", null, "ล่าสุด")
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
                        createVNode("td", { colspan: "7" }, "ยังไม่มีรายการ compare ในวันที่เลือก")
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
export {
  admin as default
};
//# sourceMappingURL=admin-2wmvq8IE.js.map
