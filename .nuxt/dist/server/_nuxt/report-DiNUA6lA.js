import { _ as _sfc_main$1 } from "./LegacyPanel-DJJ9u9fC.js";
import { _ as _sfc_main$2 } from "./DetailPanel-xEeGelPg.js";
import { ref, reactive, computed, mergeProps, withCtx, unref, createVNode, withDirectives, isRef, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, withKeys, withModifiers, vModelText, createTextVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc, a as useRoute, u as useRuntimeConfig } from "../server.mjs";
import { u as useCompareWorkflow } from "./useCompareWorkflow-DCC0rYzR.js";
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
    const detailRows = computed(() => [
      { label: "USER:", value: user.value?.username || "ผู้เยี่ยมชม" },
      { label: "ฐานข้อมูล", value: selectedProject.value?.rawDatabase || "-" }
    ]);
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
    const summaryFirstColumnLabel = computed(() => summaryMode.value === "database_preface" ? "ฐานข้อมูล" : "ตาราง");
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
        if (res?.success === false) {
          throw new Error(res.message || "Cannot load report");
        }
        const data = res?.data || {};
        console.log(data);
        projects.value = (data.projects || []).map(normalizeProject);
        selectedProject.value = normalizeSelectedProject(data.selected_project);
        summaryMode.value = data.summary_mode || "table_all";
        selectedProjectId.value = selectedProject.value?.id || selectedProjectId.value || projects.value[0]?.id || "";
        summaryTables.value = (data.tables || []).map(normalizeSummaryTable);
        tableColumns.value = (data.table_columns || []).map(normalizeTableColumn);
        reportRows.value = (data.rows || []).map(normalizeReportRow);
        console.log(reportRows.value);
        Object.assign(pagination, {
          page: Number(data.pagination?.page || page || 1),
          limit: Number(data.pagination?.limit || limit.value),
          total: Number(data.pagination?.total || 0),
          from: Number(data.pagination?.from || 0),
          to: Number(data.pagination?.to || 0)
        });
      } catch (error) {
        loadError.value = error?.data?.message || error?.message || "ไม่สามารถโหลดรายงานผลได้";
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
      const id = String(project?.project_id || project?.id || project?.database_code || "");
      return {
        ...project,
        id,
        displayName: project?.questionnaire_name || project?.display_name || project?.database_code || id
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
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))} data-v-babdae15><div class="workspace-grid report-workspace" data-v-babdae15><section class="main-column" data-v-babdae15>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ค้นหา:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="report-search-form" data-v-babdae15${_scopeId}><div class="report-control-row" data-v-babdae15${_scopeId}><span class="input-prefix" data-v-babdae15${_scopeId}>ฐานข้อมูล:</span><select${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-babdae15${_scopeId}><!--[-->`);
            ssrRenderList(unref(projects), (project) => {
              _push2(`<option${ssrRenderAttr("value", project.id)} data-v-babdae15${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectId)) ? ssrLooseContain(unref(selectedProjectId), project.id) : ssrLooseEqual(unref(selectedProjectId), project.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(project.displayName)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="search-line" data-v-babdae15${_scopeId}><span class="input-prefix" data-v-babdae15${_scopeId}>Search By ID</span><input${ssrRenderAttr("value", unref(searchInput))}${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} placeholder="กรอกรหัสที่ต้องการค้นหา" data-v-babdae15${_scopeId}><div class="report-search-actions" data-v-babdae15${_scopeId}><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-babdae15${_scopeId}>ค้นหา</button><button class="btn btn-danger" type="button"${ssrIncludeBooleanAttr(unref(loading) || !unref(appliedSearchId)) ? " disabled" : ""} data-v-babdae15${_scopeId}>ล้างการค้นหา</button></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "report-search-form" }, [
                createVNode("div", { class: "report-control-row" }, [
                  createVNode("span", { class: "input-prefix" }, "ฐานข้อมูล:"),
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
                    placeholder: "กรอกรหัสที่ต้องการค้นหา",
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
                    }, "ค้นหา", 8, ["disabled"]),
                    createVNode("button", {
                      class: "btn btn-danger",
                      type: "button",
                      disabled: unref(loading) || !unref(appliedSearchId),
                      onClick: clearSearch
                    }, "ล้างการค้นหา", 8, ["disabled"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loadError)) {
        _push(`<p class="error-text report-error" data-v-babdae15>${ssrInterpolate(unref(loadError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "จำนวนข้อมูลทั้งหมด:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(loading) && !unref(summaryTables).length) {
              _push2(`<div class="report-empty" data-v-babdae15${_scopeId}>กำลังโหลดรายงาน...</div>`);
            } else {
              _push2(`<div class="report-table-wrap" data-v-babdae15${_scopeId}><table class="report-summary-table" data-v-babdae15${_scopeId}><thead data-v-babdae15${_scopeId}><tr data-v-babdae15${_scopeId}><th data-v-babdae15${_scopeId}>${ssrInterpolate(unref(summaryFirstColumnLabel))}</th><th data-v-babdae15${_scopeId}>Round1<br data-v-babdae15${_scopeId}><small data-v-babdae15${_scopeId}>(จำนวนข้อมูล)</small></th><th data-v-babdae15${_scopeId}>Round2<br data-v-babdae15${_scopeId}><small data-v-babdae15${_scopeId}>(จำนวนข้อมูล)</small></th><th data-v-babdae15${_scopeId}>Compare<br data-v-babdae15${_scopeId}><small data-v-babdae15${_scopeId}>(จำนวนข้อมูล)</small></th></tr></thead><tbody data-v-babdae15${_scopeId}><!--[-->`);
              ssrRenderList(unref(summaryTables), (table) => {
                _push2(`<tr data-v-babdae15${_scopeId}><td data-v-babdae15${_scopeId}>${ssrInterpolate(table.displayName)}</td><td data-v-babdae15${_scopeId}>${ssrInterpolate(formatNumber(table.round1Count))}</td><td data-v-babdae15${_scopeId}>${ssrInterpolate(formatNumber(table.round2Count))}</td><td data-v-babdae15${_scopeId}>${ssrInterpolate(formatNumber(table.compareCount))}</td></tr>`);
              });
              _push2(`<!--]-->`);
              if (!unref(summaryTables).length) {
                _push2(`<tr data-v-babdae15${_scopeId}><td colspan="4" data-v-babdae15${_scopeId}>ยังไม่มีรายการตารางที่เปิด compare</td></tr>`);
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
              }, "กำลังโหลดรายงาน...")) : (openBlock(), createBlock("div", {
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
                        createVNode("small", null, "(จำนวนข้อมูล)")
                      ]),
                      createVNode("th", null, [
                        createTextVNode("Round2"),
                        createVNode("br"),
                        createVNode("small", null, "(จำนวนข้อมูล)")
                      ]),
                      createVNode("th", null, [
                        createTextVNode("Compare"),
                        createVNode("br"),
                        createVNode("small", null, "(จำนวนข้อมูล)")
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
                      createVNode("td", { colspan: "4" }, "ยังไม่มีรายการตารางที่เปิด compare")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="report-result-copy" data-v-babdae15><p data-v-babdae15>จำนวนทั้งหมด ${ssrInterpolate(formatNumber(unref(summaryTotals).round1))} record</p><p data-v-babdae15>เปรียบเทียบข้อมูลแล้ว ${ssrInterpolate(formatNumber(unref(summaryTotals).compare))} record</p><p data-v-babdae15>คงเหลือ ${ssrInterpolate(formatNumber(unref(summaryTotals).remaining))} record</p><h2 data-v-babdae15>ผลการค้นหา : <strong data-v-babdae15>${ssrInterpolate(formatNumber(unref(pagination).from))}</strong> Of <strong data-v-babdae15>${ssrInterpolate(formatNumber(unref(pagination).total))}</strong> record</h2></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "รายงานผล (ตารางข้อมูล)" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="report-table-tools" data-v-babdae15${_scopeId}><label data-v-babdae15${_scopeId}> Show <select${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-babdae15${_scopeId}><option${ssrRenderAttr("value", 10)} data-v-babdae15${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 10) : ssrLooseEqual(unref(limit), 10)) ? " selected" : ""}${_scopeId}>10</option><option${ssrRenderAttr("value", 25)} data-v-babdae15${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 25) : ssrLooseEqual(unref(limit), 25)) ? " selected" : ""}${_scopeId}>25</option><option${ssrRenderAttr("value", 50)} data-v-babdae15${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 50) : ssrLooseEqual(unref(limit), 50)) ? " selected" : ""}${_scopeId}>50</option><option${ssrRenderAttr("value", 100)} data-v-babdae15${ssrIncludeBooleanAttr(Array.isArray(unref(limit)) ? ssrLooseContain(unref(limit), 100) : ssrLooseEqual(unref(limit), 100)) ? " selected" : ""}${_scopeId}>100</option></select> entries </label><label data-v-babdae15${_scopeId}> Search: <input${ssrRenderAttr("value", unref(tableSearch))} placeholder="" data-v-babdae15${_scopeId}></label></div><div class="report-table-wrap report-data-scroll" data-v-babdae15${_scopeId}><table class="report-data-table" data-v-babdae15${_scopeId}><thead data-v-babdae15${_scopeId}><tr data-v-babdae15${_scopeId}><th data-v-babdae15${_scopeId}>ID</th><th data-v-babdae15${_scopeId}>ผู้บันทึกข้อมูล รอบ1</th><th data-v-babdae15${_scopeId}>ผู้บันทึกข้อมูล รอบ2</th><!--[-->`);
            ssrRenderList(unref(tableColumns), (table) => {
              _push2(`<th data-v-babdae15${_scopeId}>${ssrInterpolate(table.tableName)}</th>`);
            });
            _push2(`<!--]--></tr></thead><tbody data-v-babdae15${_scopeId}><!--[-->`);
            ssrRenderList(unref(visibleRows), (row) => {
              _push2(`<tr data-v-babdae15${_scopeId}><td data-v-babdae15${_scopeId}>${ssrInterpolate(row)}</td><td class="text-left" data-v-babdae15${_scopeId}>${ssrInterpolate(row.recp || row.recby || "-")}</td><td class="text-left" data-v-babdae15${_scopeId}>${ssrInterpolate(row.recpr2 || row.recby2 || "-")}</td><!--[-->`);
              ssrRenderList(unref(tableColumns), (table) => {
                _push2(`<td data-v-babdae15${_scopeId}><span class="${ssrRenderClass(["report-status-icon", row.tables?.[table.tableName]?.tone || "empty"])}"${ssrRenderAttr("title", row.tables?.[table.tableName]?.label || "")} data-v-babdae15${_scopeId}>${ssrInterpolate(row.tables?.[table.tableName]?.icon || "--")}</span></td>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]-->`);
            if (!unref(visibleRows).length) {
              _push2(`<tr data-v-babdae15${_scopeId}><td${ssrRenderAttr("colspan", 3 + unref(tableColumns).length)} data-v-babdae15${_scopeId}>ไม่พบข้อมูลตามเงื่อนไข</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div><div class="report-pagination" data-v-babdae15${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(loading) || unref(pagination).page <= 1) ? " disabled" : ""} data-v-babdae15${_scopeId}>Previous</button><!--[-->`);
            ssrRenderList(unref(pageItems), (pageItem) => {
              _push2(`<button type="button"${ssrIncludeBooleanAttr(unref(loading) || pageItem.disabled) ? " disabled" : ""} class="${ssrRenderClass({ active: pageItem.value === unref(pagination).page, ellipsis: pageItem.ellipsis })}" data-v-babdae15${_scopeId}>${ssrInterpolate(pageItem.label)}</button>`);
            });
            _push2(`<!--]--><button type="button"${ssrIncludeBooleanAttr(unref(loading) || unref(pagination).page >= unref(totalPages)) ? " disabled" : ""} data-v-babdae15${_scopeId}>Next</button></div>`);
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
                      createVNode("th", null, "ผู้บันทึกข้อมูล รอบ1"),
                      createVNode("th", null, "ผู้บันทึกข้อมูล รอบ2"),
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
                        createVNode("td", null, toDisplayString(row), 1),
                        createVNode("td", { class: "text-left" }, toDisplayString(row.recp || row.recby || "-"), 1),
                        createVNode("td", { class: "text-left" }, toDisplayString(row.recpr2 || row.recby2 || "-"), 1),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(tableColumns), (table) => {
                          return openBlock(), createBlock("td", {
                            key: `${row.id}-${table.tableName}`
                          }, [
                            createVNode("span", {
                              class: ["report-status-icon", row.tables?.[table.tableName]?.tone || "empty"],
                              title: row.tables?.[table.tableName]?.label || ""
                            }, toDisplayString(row.tables?.[table.tableName]?.icon || "--"), 11, ["title"])
                          ]);
                        }), 128))
                      ]);
                    }), 128)),
                    !unref(visibleRows).length ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: 3 + unref(tableColumns).length
                      }, "ไม่พบข้อมูลตามเงื่อนไข", 8, ["colspan"])
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
      _push(`</section><aside class="side-column" data-v-babdae15>`);
      _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
      _push(ssrRenderComponent(_component_CommonLegacyPanel, {
        title: "คำอธิบาย",
        compact: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="legend-list" data-v-babdae15${_scopeId}><li data-v-babdae15${_scopeId}><span class="legend warning" data-v-babdae15${_scopeId}>▲</span>ยังไม่ดำเนินการ compare</li><li data-v-babdae15${_scopeId}><span class="legend ok" data-v-babdae15${_scopeId}>✓</span>Compare แล้ว</li><li data-v-babdae15${_scopeId}><span class="legend error" data-v-babdae15${_scopeId}>✖</span>ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน</li><li data-v-babdae15${_scopeId}><span class="legend slash" data-v-babdae15${_scopeId}>/</span>ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน</li><li data-v-babdae15${_scopeId}><span class="legend empty" data-v-babdae15${_scopeId}>--</span>ไม่มีข้อมูลทั้งสองรอบ</li></ul>`);
          } else {
            return [
              createVNode("ul", { class: "legend-list" }, [
                createVNode("li", null, [
                  createVNode("span", { class: "legend warning" }, "▲"),
                  createTextVNode("ยังไม่ดำเนินการ compare")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend ok" }, "✓"),
                  createTextVNode("Compare แล้ว")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend error" }, "✖"),
                  createTextVNode("ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend slash" }, "/"),
                  createTextVNode("ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน")
                ]),
                createVNode("li", null, [
                  createVNode("span", { class: "legend empty" }, "--"),
                  createTextVNode("ไม่มีข้อมูลทั้งสองรอบ")
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
const report = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-babdae15"]]);
export {
  report as default
};
//# sourceMappingURL=report-DiNUA6lA.js.map
