import { _ as _sfc_main$1 } from './LegacyPanel-DJJ9u9fC.mjs';
import { _ as _sfc_main$2 } from './DetailPanel-xEeGelPg.mjs';
import { ref, reactive, computed, mergeProps, withCtx, unref, createVNode, withDirectives, isRef, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, withKeys, withModifiers, vModelText, createTextVNode, createCommentVNode, useSSRContext } from 'file://E:/Project2026/compare-data/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass } from 'file://E:/Project2026/compare-data/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, a as useRoute, u as useRuntimeConfig } from './server.mjs';
import { u as useCompareWorkflow } from './useCompareWorkflow-DCC0rYzR.mjs';
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
  __name: "report",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    useRoute();
    const { user } = useCompareWorkflow();
    const apiBase = String(config.public.apiBase || "").replace(/\/$/, "");
    const loading = ref(false);
    const loadError = ref("");
    const projects = ref([]);
    const selectedProjectId = ref("");
    const selectedProject = ref(null);
    const summaryMode = ref("table_all");
    const summaryTables = ref([]);
    const tableColumns = ref([]);
    const reportRows = ref([]);
    const searchInput = ref("");
    const appliedSearchId = ref("");
    const tableSearch = ref("");
    const limit = ref(10);
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0,
      from: 0,
      to: 0
    });
    const detailRows = computed(() => {
      var _a, _b;
      return [
        { label: "USER:", value: ((_a = user.value) == null ? void 0 : _a.username) || "\u0E1C\u0E39\u0E49\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21" },
        { label: "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", value: ((_b = selectedProject.value) == null ? void 0 : _b.rawDatabase) || "-" }
      ];
    });
    const visibleRows = computed(() => {
      const term = tableSearch.value.trim().toLowerCase();
      if (!term) {
        return reportRows.value;
      }
      return reportRows.value.filter((row) => {
        const values = [
          row.id,
          row.recp,
          row.recpr2,
          row.recby,
          row.recby2,
          ...Object.values(row.tables || {}).map((cell) => `${cell.icon || ""} ${cell.label || ""}`)
        ];
        return values.some((value) => String(value || "").toLowerCase().includes(term));
      });
    });
    const summaryTotals = computed(() => {
      const round1 = summaryTables.value.reduce((sum, table) => sum + Number(table.round1Count || 0), 0);
      const compare = summaryTables.value.reduce((sum, table) => sum + Number(table.compareCount || 0), 0);
      return {
        round1,
        compare,
        remaining: Math.max(0, round1 - compare)
      };
    });
    const summaryFirstColumnLabel = computed(() => summaryMode.value === "database_preface" ? "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" : "\u0E15\u0E32\u0E23\u0E32\u0E07");
    const totalPages = computed(() => Math.max(1, Math.ceil(pagination.total / pagination.limit)));
    const pageItems = computed(() => {
      const current = pagination.page;
      const total = totalPages.value;
      const pages = /* @__PURE__ */ new Set([1, total]);
      for (let page = current - 2; page <= current + 2; page += 1) {
        if (page >= 1 && page <= total) {
          pages.add(page);
        }
      }
      const sorted = [...pages].sort((a, b) => a - b);
      const items = [];
      let previous = 0;
      sorted.forEach((page) => {
        if (previous && page - previous > 1) {
          items.push({ key: `ellipsis-${previous}-${page}`, label: "...", ellipsis: true, disabled: true });
        }
        items.push({ key: `page-${page}`, label: String(page), value: page });
        previous = page;
      });
      return items;
    });
    async function loadReport(page = pagination.page) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (!apiBase) {
        loadError.value = "API base URL is not configured";
        return;
      }
      loading.value = true;
      loadError.value = "";
      try {
        const query = {
          page,
          limit: limit.value
        };
        if (selectedProjectId.value) {
          query.project_id = selectedProjectId.value;
        }
        if (appliedSearchId.value) {
          query.search_id = appliedSearchId.value;
        }
        const res = await $fetch(`${apiBase}/report.php`, {
          credentials: "include",
          query
        });
        if ((res == null ? void 0 : res.success) === false) {
          throw new Error(res.message || "Cannot load report");
        }
        const data = (res == null ? void 0 : res.data) || {};
        console.log(data);
        projects.value = (data.projects || []).map(normalizeProject);
        selectedProject.value = normalizeSelectedProject(data.selected_project);
        summaryMode.value = data.summary_mode || "table_all";
        selectedProjectId.value = ((_a = selectedProject.value) == null ? void 0 : _a.id) || selectedProjectId.value || ((_b = projects.value[0]) == null ? void 0 : _b.id) || "";
        summaryTables.value = (data.tables || []).map(normalizeSummaryTable);
        tableColumns.value = (data.table_columns || []).map(normalizeTableColumn);
        reportRows.value = (data.rows || []).map(normalizeReportRow);
        console.log(reportRows.value);
        Object.assign(pagination, {
          page: Number(((_c = data.pagination) == null ? void 0 : _c.page) || page || 1),
          limit: Number(((_d = data.pagination) == null ? void 0 : _d.limit) || limit.value),
          total: Number(((_e = data.pagination) == null ? void 0 : _e.total) || 0),
          from: Number(((_f = data.pagination) == null ? void 0 : _f.from) || 0),
          to: Number(((_g = data.pagination) == null ? void 0 : _g.to) || 0)
        });
      } catch (error) {
        loadError.value = ((_h = error == null ? void 0 : error.data) == null ? void 0 : _h.message) || (error == null ? void 0 : error.message) || "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E1C\u0E25\u0E44\u0E14\u0E49";
        projects.value = [];
        summaryMode.value = "table_all";
        summaryTables.value = [];
        tableColumns.value = [];
        reportRows.value = [];
        Object.assign(pagination, { page: 1, limit: limit.value, total: 0, from: 0, to: 0 });
      } finally {
        loading.value = false;
      }
    }
    function changeDatabase() {
      pagination.page = 1;
      tableSearch.value = "";
      loadReport(1);
    }
    function submitSearch() {
      appliedSearchId.value = searchInput.value.trim();
      tableSearch.value = "";
      pagination.page = 1;
      loadReport(1);
    }
    function clearSearch() {
      searchInput.value = "";
      appliedSearchId.value = "";
      tableSearch.value = "";
      pagination.page = 1;
      loadReport(1);
    }
    function changeLimit() {
      pagination.page = 1;
      loadReport(1);
    }
    function goPage(page) {
      const next = Math.min(Math.max(1, Number(page || 1)), totalPages.value);
      if (next === pagination.page) {
        return;
      }
      loadReport(next);
    }
    function normalizeProject(project) {
      const id = String((project == null ? void 0 : project.project_id) || (project == null ? void 0 : project.id) || (project == null ? void 0 : project.database_code) || "");
      return {
        ...project,
        id,
        displayName: (project == null ? void 0 : project.questionnaire_name) || (project == null ? void 0 : project.display_name) || (project == null ? void 0 : project.database_code) || id
      };
    }
    function normalizeSelectedProject(project) {
      if (!project) {
        return null;
      }
      return {
        ...project,
        id: project.project_id || project.id || project.database_code,
        displayName: project.questionnaire_name || project.display_name || project.database_code,
        rawDatabase: project.raw_database || project.rawDatabase || ""
      };
    }
    function normalizeSummaryTable(table) {
      return {
        tableName: table.table_name || table.tableName,
        displayName: table.display_name || table.displayName || table.table_name || table.tableName,
        round1Count: Number(table.round1_count || table.round1Count || 0),
        round2Count: Number(table.round2_count || table.round2Count || 0),
        compareCount: Number(table.compare_count || table.compareCount || 0)
      };
    }
    function normalizeTableColumn(table) {
      return {
        tableName: table.table_name || table.tableName,
        displayName: table.display_name || table.displayName || table.table_name || table.tableName
      };
    }
    function normalizeReportRow(row) {
      return {
        id: String(row.id || ""),
        recp: row.recp || row.recby || "",
        recpr2: row.recpr2 || row.recby2 || "",
        recby: row.recby || row.recp || "",
        recby2: row.recby2 || row.recpr2 || "",
        tables: row.tables || {}
      };
    }
    function formatNumber(value) {
      return new Intl.NumberFormat("th-TH").format(Number(value || 0));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$1;
      const _component_CommonDetailPanel = _sfc_main$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))} data-v-63040254><div class="workspace-grid report-workspace" data-v-63040254><section class="main-column" data-v-63040254>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E04\u0E49\u0E19\u0E2B\u0E32:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="report-search-form" data-v-63040254${_scopeId}><div class="report-control-row" data-v-63040254${_scopeId}><span class="input-prefix" data-v-63040254${_scopeId}>\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25:</span><select${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-63040254${_scopeId}><!--[-->`);
            ssrRenderList(unref(projects), (project) => {
              _push2(`<option${ssrRenderAttr("value", project.id)} data-v-63040254${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectId)) ? ssrLooseContain(unref(selectedProjectId), project.id) : ssrLooseEqual(unref(selectedProjectId), project.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.displayName)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="search-line" data-v-63040254${_scopeId}><span class="input-prefix" data-v-63040254${_scopeId}>Search By ID</span><input${ssrRenderAttr("value", unref(searchInput))}${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} placeholder="\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32" data-v-63040254${_scopeId}><div class="report-search-actions" data-v-63040254${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-63040254${_scopeId}>\u0E04\u0E49\u0E19\u0E2B\u0E32</button><button class="btn btn-danger" type="button"${ssrIncludeBooleanAttr(unref(loading) || !unref(appliedSearchId)) ? " disabled" : ""} data-v-63040254${_scopeId}>\u0E25\u0E49\u0E32\u0E07\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32</button></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "report-search-form" }, [
                createVNode("div", { class: "report-control-row" }, [
                  createVNode("span", { class: "input-prefix" }, "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25:"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                    disabled: unref(loading),
                    onChange: changeDatabase
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(projects), (project) => {
                      return openBlock(), createBlock("option", {
                        key: project.id,
                        value: project.id
                      }, toDisplayString(project.displayName), 9, ["value"]);
                    }), 128))
                  ], 40, ["onUpdate:modelValue", "disabled"]), [
                    [vModelSelect, unref(selectedProjectId)]
                  ])
                ]),
                createVNode("div", { class: "search-line" }, [
                  createVNode("span", { class: "input-prefix" }, "Search By ID"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(searchInput) ? searchInput.value = $event : null,
                    disabled: unref(loading),
                    placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32",
                    onKeydown: withKeys(withModifiers(submitSearch, ["prevent"]), ["enter"])
                  }, null, 40, ["onUpdate:modelValue", "disabled", "onKeydown"]), [
                    [
                      vModelText,
                      unref(searchInput),
                      void 0,
                      { trim: true }
                    ]
                  ]),
                  createVNode("div", { class: "report-search-actions" }, [
                    createVNode("button", {
                      class: "btn btn-gray",
                      type: "button",
                      disabled: unref(loading),
                      onClick: submitSearch
                    }, "\u0E04\u0E49\u0E19\u0E2B\u0E32", 8, ["disabled"]),
                    createVNode("button", {
                      class: "btn btn-danger",
                      type: "button",
                      disabled: unref(loading) || !unref(appliedSearchId),
                      onClick: clearSearch
                    }, "\u0E25\u0E49\u0E32\u0E07\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32", 8, ["disabled"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loadError)) {
        _push(`<p class="error-text report-error" data-v-63040254>${ssrInterpolate(unref(loadError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(loading) && !unref(summaryTables).length) {
              _push2(`<div class="report-empty" data-v-63040254${_scopeId}>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19...</div>`);
            } else {
              _push2(`<div class="report-table-wrap" data-v-63040254${_scopeId}><table class="report-summary-table" data-v-63040254${_scopeId}><thead data-v-63040254${_scopeId}><tr data-v-63040254${_scopeId}><th data-v-63040254${_scopeId}>${ssrInterpolate(unref(summaryFirstColumnLabel))}</th><th data-v-63040254${_scopeId}>Round1<br data-v-63040254${_scopeId}><small data-v-63040254${_scopeId}>(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)</small></th><th data-v-63040254${_scopeId}>Round2<br data-v-63040254${_scopeId}><small data-v-63040254${_scopeId}>(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)</small></th><th data-v-63040254${_scopeId}>Compare<br data-v-63040254${_scopeId}><small data-v-63040254${_scopeId}>(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)</small></th></tr></thead><tbody data-v-63040254${_scopeId}><!--[-->`);
              ssrRenderList(unref(summaryTables), (table) => {
                _push2(`<tr data-v-63040254${_scopeId}><td data-v-63040254${_scopeId}>${ssrInterpolate(table.displayName)}</td><td data-v-63040254${_scopeId}>${ssrInterpolate(formatNumber(table.round1Count))}</td><td data-v-63040254${_scopeId}>${ssrInterpolate(formatNumber(table.round2Count))}</td><td data-v-63040254${_scopeId}>${ssrInterpolate(formatNumber(table.compareCount))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (!unref(summaryTables).length) {
                _push2(`<tr data-v-63040254${_scopeId}><td colspan="4" data-v-63040254${_scopeId}>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 compare</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            }
          } else {
            return [
              unref(loading) && !unref(summaryTables).length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "report-empty"
              }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19...")) : (openBlock(), createBlock("div", {
                key: 1,
                class: "report-table-wrap"
              }, [
                createVNode("table", { class: "report-summary-table" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", null, toDisplayString(unref(summaryFirstColumnLabel)), 1),
                      createVNode("th", null, [
                        createTextVNode("Round1"),
                        createVNode("br"),
                        createVNode("small", null, "(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)")
                      ]),
                      createVNode("th", null, [
                        createTextVNode("Round2"),
                        createVNode("br"),
                        createVNode("small", null, "(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)")
                      ]),
                      createVNode("th", null, [
                        createTextVNode("Compare"),
                        createVNode("br"),
                        createVNode("small", null, "(\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)")
                      ])
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(summaryTables), (table) => {
                      return openBlock(), createBlock("tr", {
                        key: table.tableName
                      }, [
                        createVNode("td", null, toDisplayString(table.displayName), 1),
                        createVNode("td", null, toDisplayString(formatNumber(table.round1Count)), 1),
                        createVNode("td", null, toDisplayString(formatNumber(table.round2Count)), 1),
                        createVNode("td", null, toDisplayString(formatNumber(table.compareCount)), 1)
                      ]);
                    }), 128)),
                    !unref(summaryTables).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", { colspan: "4" }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 compare")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="report-result-copy" data-v-63040254><p data-v-63040254>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ${ssrInterpolate(formatNumber(unref(summaryTotals).round1))} record</p><p data-v-63040254>\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E25\u0E49\u0E27 ${ssrInterpolate(formatNumber(unref(summaryTotals).compare))} record</p><p data-v-63040254>\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D ${ssrInterpolate(formatNumber(unref(summaryTotals).remaining))} record</p><h2 data-v-63040254>\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32 : <strong data-v-63040254>${ssrInterpolate(formatNumber(unref(pagination).from))}</strong> Of <strong data-v-63040254>${ssrInterpolate(formatNumber(unref(pagination).total))}</strong> record</h2></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E1C\u0E25 (\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="report-table-tools" data-v-63040254${_scopeId}><label data-v-63040254${_scopeId}> Show <select${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-63040254${_scopeId}><option${ssrRenderAttr("value", 10)} data-v-63040254${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 10) : ssrLooseEqual(unref(limit), 10)) ? " selected" : ""}${_scopeId}>10</option><option${ssrRenderAttr("value", 25)} data-v-63040254${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 25) : ssrLooseEqual(unref(limit), 25)) ? " selected" : ""}${_scopeId}>25</option><option${ssrRenderAttr("value", 50)} data-v-63040254${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 50) : ssrLooseEqual(unref(limit), 50)) ? " selected" : ""}${_scopeId}>50</option><option${ssrRenderAttr("value", 100)} data-v-63040254${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 100) : ssrLooseEqual(unref(limit), 100)) ? " selected" : ""}${_scopeId}>100</option></select> entries </label><label data-v-63040254${_scopeId}> Search: <input${ssrRenderAttr("value", unref(tableSearch))} placeholder="" data-v-63040254${_scopeId}></label></div><div class="report-table-wrap report-data-scroll" data-v-63040254${_scopeId}><table class="report-data-table" data-v-63040254${_scopeId}><thead data-v-63040254${_scopeId}><tr data-v-63040254${_scopeId}><th data-v-63040254${_scopeId}>ID</th><th data-v-63040254${_scopeId}>\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E23\u0E2D\u0E1A1</th><th data-v-63040254${_scopeId}>\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E23\u0E2D\u0E1A2</th><!--[-->`);
            ssrRenderList(unref(tableColumns), (table) => {
              _push2(`<th data-v-63040254${_scopeId}>${ssrInterpolate(table.tableName)}</th>`);
            });
            _push2(`<!--]--></tr></thead><tbody data-v-63040254${_scopeId}><!--[-->`);
            ssrRenderList(unref(visibleRows), (row) => {
              _push2(`<tr data-v-63040254${_scopeId}><td data-v-63040254${_scopeId}>${ssrInterpolate(row.id)}</td><td class="text-left" data-v-63040254${_scopeId}>${ssrInterpolate(row.recp || row.recby || "-")}</td><td class="text-left" data-v-63040254${_scopeId}>${ssrInterpolate(row.recpr2 || row.recby2 || "-")}</td><!--[-->`);
              ssrRenderList(unref(tableColumns), (table) => {
                var _a, _b, _c, _d, _e, _f;
                _push2(`<td data-v-63040254${_scopeId}><span class="${ssrRenderClass(["legend ", ((_b = (_a = row.tables) == null ? void 0 : _a[table.tableName]) == null ? void 0 : _b.tone) || "empty"])}"${ssrRenderAttr("title", ((_d = (_c = row.tables) == null ? void 0 : _c[table.tableName]) == null ? void 0 : _d.label) || "")} data-v-63040254${_scopeId}>${ssrInterpolate(((_f = (_e = row.tables) == null ? void 0 : _e[table.tableName]) == null ? void 0 : _f.icon) || "--")}</span></td>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]-->`);
            if (!unref(visibleRows).length) {
              _push2(`<tr data-v-63040254${_scopeId}><td${ssrRenderAttr("colspan", 3 + unref(tableColumns).length)} data-v-63040254${_scopeId}>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E32\u0E21\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div><div class="report-pagination" data-v-63040254${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(loading) || unref(pagination).page <= 1) ? " disabled" : ""} data-v-63040254${_scopeId}>Previous</button><!--[-->`);
            ssrRenderList(unref(pageItems), (pageItem) => {
              _push2(`<button type="button"${ssrIncludeBooleanAttr(unref(loading) || pageItem.disabled) ? " disabled" : ""} class="${ssrRenderClass({ active: pageItem.value === unref(pagination).page, ellipsis: pageItem.ellipsis })}" data-v-63040254${_scopeId}>${ssrInterpolate(pageItem.label)}</button>`);
            });
            _push2(`<!--]--><button type="button"${ssrIncludeBooleanAttr(unref(loading) || unref(pagination).page >= unref(totalPages)) ? " disabled" : ""} data-v-63040254${_scopeId}>Next</button></div>`);
          } else {
            return [
              createVNode("div", { class: "report-table-tools" }, [
                createVNode("label", null, [
                  createTextVNode(" Show "),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(limit) ? limit.value = $event : null,
                    disabled: unref(loading),
                    onChange: changeLimit
                  }, [
                    createVNode("option", { value: 10 }, "10"),
                    createVNode("option", { value: 25 }, "25"),
                    createVNode("option", { value: 50 }, "50"),
                    createVNode("option", { value: 100 }, "100")
                  ], 40, ["onUpdate:modelValue", "disabled"]), [
                    [
                      vModelSelect,
                      unref(limit),
                      void 0,
                      { number: true }
                    ]
                  ]),
                  createTextVNode(" entries ")
                ]),
                createVNode("label", null, [
                  createTextVNode(" Search: "),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(tableSearch) ? tableSearch.value = $event : null,
                    placeholder: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(tableSearch),
                      void 0,
                      { trim: true }
                    ]
                  ])
                ])
              ]),
              createVNode("div", { class: "report-table-wrap report-data-scroll" }, [
                createVNode("table", { class: "report-data-table" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", null, "ID"),
                      createVNode("th", null, "\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E23\u0E2D\u0E1A1"),
                      createVNode("th", null, "\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E23\u0E2D\u0E1A2"),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(tableColumns), (table) => {
                        return openBlock(), createBlock("th", {
                          key: table.tableName
                        }, toDisplayString(table.tableName), 1);
                      }), 128))
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(visibleRows), (row) => {
                      return openBlock(), createBlock("tr", {
                        key: row.id
                      }, [
                        createVNode("td", null, toDisplayString(row.id), 1),
                        createVNode("td", { class: "text-left" }, toDisplayString(row.recp || row.recby || "-"), 1),
                        createVNode("td", { class: "text-left" }, toDisplayString(row.recpr2 || row.recby2 || "-"), 1),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(tableColumns), (table) => {
                          var _a, _b, _c, _d, _e, _f;
                          return openBlock(), createBlock("td", {
                            key: `${row.id}-${table.tableName}`
                          }, [
                            createVNode("span", {
                              class: ["legend ", ((_b = (_a = row.tables) == null ? void 0 : _a[table.tableName]) == null ? void 0 : _b.tone) || "empty"],
                              title: ((_d = (_c = row.tables) == null ? void 0 : _c[table.tableName]) == null ? void 0 : _d.label) || ""
                            }, toDisplayString(((_f = (_e = row.tables) == null ? void 0 : _e[table.tableName]) == null ? void 0 : _f.icon) || "--"), 11, ["title"])
                          ]);
                        }), 128))
                      ]);
                    }), 128)),
                    !unref(visibleRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: 3 + unref(tableColumns).length
                      }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E32\u0E21\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02", 8, ["colspan"])
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createVNode("div", { class: "report-pagination" }, [
                createVNode("button", {
                  type: "button",
                  disabled: unref(loading) || unref(pagination).page <= 1,
                  onClick: ($event) => goPage(unref(pagination).page - 1)
                }, "Previous", 8, ["disabled", "onClick"]),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(pageItems), (pageItem) => {
                  return openBlock(), createBlock("button", {
                    key: pageItem.key,
                    type: "button",
                    disabled: unref(loading) || pageItem.disabled,
                    class: { active: pageItem.value === unref(pagination).page, ellipsis: pageItem.ellipsis },
                    onClick: ($event) => !pageItem.ellipsis && goPage(pageItem.value)
                  }, toDisplayString(pageItem.label), 11, ["disabled", "onClick"]);
                }), 128)),
                createVNode("button", {
                  type: "button",
                  disabled: unref(loading) || unref(pagination).page >= unref(totalPages),
                  onClick: ($event) => goPage(unref(pagination).page + 1)
                }, "Next", 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><aside class="side-column" data-v-63040254>`);
      _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
      _push(ssrRenderComponent(_component_CommonLegacyPanel, {
        title: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22",
        compact: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="legend-list" data-v-63040254${_scopeId}><li data-v-63040254${_scopeId}><span class="legend warning" data-v-63040254${_scopeId}>\u25B2</span>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23 compare</li><li data-v-63040254${_scopeId}><span class="legend ok" data-v-63040254${_scopeId}>\u2713</span>Compare \u0E41\u0E25\u0E49\u0E27</li><li data-v-63040254${_scopeId}><span class="legend error" data-v-63040254${_scopeId}>\u2716</span>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19</li><li data-v-63040254${_scopeId}><span class="legend slash" data-v-63040254${_scopeId}>/</span>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19</li><li data-v-63040254${_scopeId}><span class="legend empty" data-v-63040254${_scopeId}>--</span>\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A</li></ul>`);
          } else {
            return [
              createVNode("ul", { class: "legend-list" }, [
                createVNode("li", null, [
                  createVNode("span", { class: "legend warning" }, "\u25B2"),
                  createTextVNode("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23 compare")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend ok" }, "\u2713"),
                  createTextVNode("Compare \u0E41\u0E25\u0E49\u0E27")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend error" }, "\u2716"),
                  createTextVNode("\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend slash" }, "/"),
                  createTextVNode("\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend empty" }, "--"),
                  createTextVNode("\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const report = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-63040254"]]);

export { report as default };
//# sourceMappingURL=report-DsXlrhCs.mjs.map
