globalThis.__timing__.logStart('Load chunks/build/index-DUI1LL9G');import { _ as _sfc_main$8 } from './LegacyPanel-DJJ9u9fC.mjs';
import { ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useModel, withKeys, withModifiers, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderStyle, ssrRenderTeleport, ssrRenderSlot } from 'vue/server-renderer';
import { u as useCompareWorkflow } from './useCompareWorkflow-DCC0rYzR.mjs';
import { a as useRoute } from './server.mjs';
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

const _sfc_main$7 = {
  __name: "ProjectSelector",
  __ssrInlineRender: true,
  props: {
    projects: { type: Array, default: () => [] },
    scopeKey: { type: String, default: "" },
    inlineTableMode: { type: Boolean, default: false },
    inlineTables: { type: Array, default: () => [] },
    inlineTablesLoading: { type: Boolean, default: false },
    inlineSelectedTableName: { type: String, default: "" }
  },
  emits: ["pick", "pick-with-table", "update:inline-selected-table-name"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inlineProject = computed(() => props.inlineTableMode ? props.projects[0] || null : null);
    const selectedInlineTable = computed(() => props.inlineTables.find((table) => table.name === props.inlineSelectedTableName) || null);
    function chooseInlineTable(table) {
      if (!table.allowed) {
        return;
      }
      emit("update:inline-selected-table-name", table.name);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$8;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">1.\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</h1><div class="rule"></div><p class="updated">${ssrInterpolate(__props.scopeKey ? `\u0E41\u0E2A\u0E14\u0E07\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E19 Project: ${__props.scopeKey}` : "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2B\u0E23\u0E37\u0E2D\u0E41\u0E1A\u0E1A\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 compare")}</p><div class="rule"></div>`);
      if (__props.inlineTableMode && unref(inlineProject)) {
        _push(`<div class="inline-table-picker"><button type="button" class="${ssrRenderClass(["legacy-db-button", unref(inlineProject).color])}" aria-disabled="true"><span>${ssrInterpolate(unref(inlineProject).displayName || unref(inlineProject).questionnaireName)}</span><small>${ssrInterpolate(unref(inlineProject).rawDatabase)}</small></button>`);
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="inline-table-hint"${_scopeId}>\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E04\u0E19\u0E35\u0E49\u0E21\u0E35\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 compare \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 Next</p>`);
              if (__props.inlineTablesLoading) {
                _push2(`<div class="empty-state"${_scopeId}>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E15\u0E32\u0E23\u0E32\u0E07...</div>`);
              } else {
                _push2(`<div class="inline-table-list"${_scopeId}><!--[-->`);
                ssrRenderList(__props.inlineTables, (table) => {
                  _push2(`<button type="button" class="${ssrRenderClass(["inline-table-button", { selected: __props.inlineSelectedTableName === table.name }])}"${ssrIncludeBooleanAttr(!table.allowed) ? " disabled" : ""}${_scopeId}><strong${_scopeId}>${ssrInterpolate(table.displayName || table.name)}</strong><small${_scopeId}>${ssrInterpolate(table.name)}</small><em${_scopeId}>${ssrInterpolate(table.allowed ? "\u0E40\u0E1B\u0E34\u0E14 compare" : "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14 compare")}</em></button>`);
                });
                _push2(`<!--]-->`);
                if (!__props.inlineTables.length) {
                  _push2(`<p class="empty-state"${_scopeId}>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 compare</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
            } else {
              return [
                createVNode("p", { class: "inline-table-hint" }, "\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E04\u0E19\u0E35\u0E49\u0E21\u0E35\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 compare \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 Next"),
                __props.inlineTablesLoading ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "empty-state"
                }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E15\u0E32\u0E23\u0E32\u0E07...")) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "inline-table-list"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.inlineTables, (table) => {
                    return openBlock(), createBlock("button", {
                      key: table.name,
                      type: "button",
                      class: ["inline-table-button", { selected: __props.inlineSelectedTableName === table.name }],
                      disabled: !table.allowed,
                      onClick: ($event) => chooseInlineTable(table)
                    }, [
                      createVNode("strong", null, toDisplayString(table.displayName || table.name), 1),
                      createVNode("small", null, toDisplayString(table.name), 1),
                      createVNode("em", null, toDisplayString(table.allowed ? "\u0E40\u0E1B\u0E34\u0E14 compare" : "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14 compare"), 1)
                    ], 10, ["disabled", "onClick"]);
                  }), 128)),
                  !__props.inlineTables.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "empty-state"
                  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 compare")) : createCommentVNode("", true)
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="center-actions"><button class="btn btn-lime" type="button"${ssrIncludeBooleanAttr(!unref(selectedInlineTable)) ? " disabled" : ""}>Next</button></div></div>`);
      } else {
        _push(`<div class="legacy-button-list"><!--[-->`);
        ssrRenderList(__props.projects, (project) => {
          _push(`<button type="button" class="${ssrRenderClass(["legacy-db-button", project.color])}"${ssrIncludeBooleanAttr(!project.active || project.tables.length === 0) ? " disabled" : ""}><span>${ssrInterpolate(project.displayName || project.questionnaireName)}</span><small>${ssrInterpolate(project.rawDatabase)}</small>`);
          if (project.tables.length === 0) {
            _push(`<small>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14 compare</small>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/ProjectSelector.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "DetailPanel",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" },
    rows: { type: Array, default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$8;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({
        title: __props.title,
        compact: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="detail-list"${_scopeId}><!--[-->`);
            ssrRenderList(__props.rows, (row) => {
              _push2(`<div class="detail-row"${_scopeId}><span class="detail-label"${_scopeId}>${ssrInterpolate(row.label)}</span><span class="detail-value"${_scopeId}>${ssrInterpolate(row.value || "-")}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "detail-list" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.rows, (row) => {
                  return openBlock(), createBlock("div", {
                    key: row.label,
                    class: "detail-row"
                  }, [
                    createVNode("span", { class: "detail-label" }, toDisplayString(row.label), 1),
                    createVNode("span", { class: "detail-value" }, toDisplayString(row.value || "-"), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/DetailPanel.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "TableSelector",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: { type: Object, required: true },
    tables: { type: Array, default: () => [] },
    tableStatuses: { type: Array, default: () => [] },
    selectedTable: { type: Object, default: null },
    selectedPrimaryKeys: { type: Array, default: () => [] },
    preview: { type: Object, default: null },
    scopePreview: { type: Object, default: null },
    sampleIds: { type: Array, default: () => [] }
  }, {
    "searchMode": { default: "prefix" },
    "searchModeModifiers": {},
    "searchId1": { default: "" },
    "searchId1Modifiers": {},
    "searchId2": { default: "" },
    "searchId2Modifiers": {},
    "searchId": { default: "" },
    "searchIdModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["back", "select-table", "toggle-primary-key", "refresh-preview", "prepare"], ["update:searchMode", "update:searchId1", "update:searchId2", "update:searchId"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchMode = useModel(__props, "searchMode");
    const searchId1 = useModel(__props, "searchId1");
    const searchId2 = useModel(__props, "searchId2");
    const searchId = useModel(__props, "searchId");
    const emit = __emit;
    const searchId1Select = ref(null);
    const searchId1Query = ref("");
    const searchId2Query = ref("");
    const searchId1Open = ref(false);
    const highlightedSearchId1Index = ref(0);
    let refreshScopeTimer = null;
    const combinedSearchId = computed(() => `${searchId1.value || ""}${searchId2.value || ""}`);
    const normalizedSamples = computed(() => props.sampleIds.map(normalizeSample).filter((sample) => sample.id));
    const searchId1Options = computed(() => {
      const options = /* @__PURE__ */ new Map();
      normalizedSamples.value.forEach((sample) => {
        if (!sample.searchId1 || options.has(sample.searchId1)) {
          return;
        }
        options.set(sample.searchId1, { value: sample.searchId1 });
      });
      return [...options.values()];
    });
    const filteredSearchId1Options = computed(() => {
      const query = searchId1Query.value.trim().toLowerCase();
      const options = query ? searchId1Options.value.filter((option) => option.value.toLowerCase().includes(query)) : searchId1Options.value;
      return options.slice(0, 100);
    });
    const selectedTableStatus = computed(() => {
      const index = props.tables.findIndex((table) => {
        var _a;
        return table.name === ((_a = props.selectedTable) == null ? void 0 : _a.name);
      });
      return index >= 0 ? props.tableStatuses[index] : null;
    });
    const selectedTableReady = computed(() => {
      var _a;
      return Boolean((_a = selectedTableStatus.value) == null ? void 0 : _a.ready);
    });
    const freshPreview = computed(() => {
      var _a, _b;
      const previewSearchId = ((_a = props.preview) == null ? void 0 : _a.searchId) || ((_b = props.preview) == null ? void 0 : _b.search_id) || "";
      return previewSearchId === combinedSearchId.value ? props.preview : null;
    });
    watch([searchId1, searchId2, () => props.project], syncScope, { immediate: true });
    watch(searchId1, (value) => {
      if (searchId1Query.value !== value) {
        searchId1Query.value = String(value || "");
      }
    }, { immediate: true });
    watch(searchId2, (value) => {
      if (searchId2Query.value !== value) {
        searchId2Query.value = String(value || "");
      }
    }, { immediate: true });
    watch(filteredSearchId1Options, () => {
      highlightedSearchId1Index.value = 0;
    });
    function setSearchId1(value) {
      searchId1.value = String(value || "").trim();
      searchId1Query.value = searchId1.value;
      closeSearchId1();
      refreshScope();
    }
    function setSearchId1Query(value) {
      searchId1Query.value = value;
      searchId1.value = value;
      searchId1Open.value = true;
      highlightedSearchId1Index.value = 0;
      scheduleRefreshScope();
    }
    function setSearchId2Query(value) {
      searchId2Query.value = value;
      searchId2.value = value;
      scheduleRefreshScope();
    }
    function openSearchId1() {
      searchId1Query.value = searchId1.value || "";
      searchId1Open.value = true;
      highlightedSearchId1Index.value = 0;
    }
    function closeSearchId1() {
      searchId1Open.value = false;
    }
    function toggleSearchId1() {
      if (searchId1Open.value) {
        closeSearchId1();
        return;
      }
      openSearchId1();
    }
    function moveSearchId1Highlight(direction) {
      if (!searchId1Open.value) {
        openSearchId1();
        return;
      }
      const lastIndex = filteredSearchId1Options.value.length - 1;
      if (lastIndex < 0) {
        highlightedSearchId1Index.value = 0;
        return;
      }
      highlightedSearchId1Index.value = Math.min(
        lastIndex,
        Math.max(0, highlightedSearchId1Index.value + direction)
      );
    }
    function commitSearchId1FromKeyboard() {
      const option = filteredSearchId1Options.value[highlightedSearchId1Index.value];
      setSearchId1((option == null ? void 0 : option.value) || searchId1Query.value);
    }
    function scheduleRefreshScope() {
      if (refreshScopeTimer) {
        (void 0).clearTimeout(refreshScopeTimer);
      }
      refreshScopeTimer = (void 0).setTimeout(() => {
        refreshScopeTimer = null;
        refreshScope();
      }, 250);
    }
    function refreshScope() {
      if (refreshScopeTimer) {
        (void 0).clearTimeout(refreshScopeTimer);
        refreshScopeTimer = null;
      }
      const scope = syncScope();
      emit("refresh-preview", scope);
    }
    function syncScope() {
      const cleanId1 = String(searchId1.value || "").trim();
      const cleanId2 = String(searchId2Query.value || searchId2.value || "").trim();
      searchId1.value = cleanId1;
      searchId2.value = cleanId2;
      searchId2Query.value = cleanId2;
      searchId.value = `${cleanId1}${cleanId2}`;
      searchMode.value = resolveMode();
      return {
        searchId1: cleanId1,
        searchId2: cleanId2,
        searchId: searchId.value,
        searchMode: searchMode.value
      };
    }
    function resolveMode() {
      var _a, _b;
      if (!String(searchId2.value || "").trim()) {
        return "prefix";
      }
      const mode = String(((_a = props.project) == null ? void 0 : _a.searchId2Mode) || ((_b = props.project) == null ? void 0 : _b.search_id2_mode) || "exact").toLowerCase();
      return ["exact", "prefix"].includes(mode) ? mode : "exact";
    }
    function normalizeSample(sample) {
      if (typeof sample === "string") {
        const id2 = String(sample);
        const parts = splitSearchIdByProject(props.project, id2);
        return {
          id: id2,
          databaseCode: props.project.databaseCode || props.project.database_code || props.project.id,
          searchId1: parts.searchId1,
          searchId2: parts.searchId2
        };
      }
      const id = String((sample == null ? void 0 : sample.id) || (sample == null ? void 0 : sample.sample_id) || "");
      return {
        id,
        databaseCode: (sample == null ? void 0 : sample.databaseCode) || (sample == null ? void 0 : sample.database_code) || props.project.databaseCode || props.project.database_code || props.project.id,
        searchId1: String((sample == null ? void 0 : sample.searchId1) || (sample == null ? void 0 : sample.search_id1) || id),
        searchId2: String((sample == null ? void 0 : sample.searchId2) || (sample == null ? void 0 : sample.search_id2) || "")
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$8;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">2.\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</h1><div class="rule"></div><button class="back-link" type="button">\xAB \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A</button><div class="rule"></div><div class="instructions"><p>1. \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E21\u0E39\u0E48 \u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 compare <span class="danger-text">(compare \u0E2B\u0E21\u0E39\u0E48 A \u0E40\u0E1B\u0E47\u0E19\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01)</span></p><p>2. \u0E01\u0E23\u0E2D\u0E01 StructureID \u0E2B\u0E23\u0E37\u0E2D StructureID+MemberID <span class="danger-text">(\u0E40\u0E04\u0E22 compare \u0E2B\u0E21\u0E39\u0E48 A \u0E41\u0E25\u0E49\u0E27)</span></p><p>3. \u0E04\u0E25\u0E34\u0E01\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 compare \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E17\u0E32\u0E07\u0E02\u0E27\u0E32\u0E21\u0E37\u0E2D</p><p>4. \u0E01\u0E14 Select PrimaryKey</p><p>5. \u0E01\u0E14 Next</p></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, {
        title: `Compare Data : ${__props.project.rawDatabase}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="scope-row"${_scopeId}><span class="step-bubble"${_scopeId}>1</span><label${_scopeId}>CID:</label><div class="${ssrRenderClass([{ open: unref(searchId1Open) }, "searchable-select"])}"${_scopeId}><input${ssrRenderAttr("value", unref(searchId1Query))} autocomplete="off" role="combobox" aria-autocomplete="list"${ssrRenderAttr("aria-expanded", unref(searchId1Open) ? "true" : "false")} placeholder="\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E1E\u0E34\u0E21\u0E1E\u0E4C CID"${_scopeId}><button class="searchable-select-toggle" type="button" aria-label="Open CID list"${_scopeId}> \u25BE </button>`);
            if (unref(searchId1Open)) {
              _push2(`<div class="searchable-select-menu" role="listbox"${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredSearchId1Options), (option, index) => {
                _push2(`<button type="button" class="${ssrRenderClass(["searchable-select-option", { active: index === unref(highlightedSearchId1Index) }])}" role="option"${_scopeId}>${ssrInterpolate(option.value)}</button>`);
              });
              _push2(`<!--]-->`);
              if (!unref(filteredSearchId1Options).length) {
                _push2(`<div class="searchable-select-empty"${_scopeId}> \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><span class="step-bubble"${_scopeId}>2</span><input${ssrRenderAttr("value", unref(searchId2Query))} placeholder=""${_scopeId}></div><div class="scope-row"${_scopeId}><label${_scopeId}>New table:</label><input${ssrRenderAttr("value", __props.project.cmpDatabase)} disabled${_scopeId}><input${ssrRenderAttr("value", ((_a = __props.selectedTable) == null ? void 0 : _a.name) || "")} disabled placeholder="\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E08\u0E32\u0E01\u0E14\u0E49\u0E32\u0E19\u0E02\u0E27\u0E32"${_scopeId}></div><div class="center-actions"${_scopeId}><span class="step-bubble"${_scopeId}>4</span><button class="btn btn-lime" type="button"${ssrIncludeBooleanAttr(!__props.selectedTable || !unref(selectedTableReady)) ? " disabled" : ""}${_scopeId}> Select PrimaryKey </button></div>`);
            if (__props.selectedTable) {
              _push2(`<div class="primary-key-zone"${_scopeId}><div class="pk-box"${_scopeId}><h3${_scopeId}>X Drop</h3><div class="pk-list empty-state"${_scopeId}>\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E17\u0E35\u0E48\u0E0B\u0E48\u0E2D\u0E19\u0E08\u0E30\u0E16\u0E39\u0E01\u0E2D\u0E48\u0E32\u0E19\u0E08\u0E32\u0E01 Metadata</div></div><div class="pk-box"${_scopeId}><h3${_scopeId}>Select</h3><!--[-->`);
              ssrRenderList(__props.selectedTable.primaryKeys, (key) => {
                _push2(`<label class="pk-choice"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedPrimaryKeys.includes(key)) ? " checked" : ""}${_scopeId}> ${ssrInterpolate(key)}</label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="center-actions"${_scopeId}><span class="step-bubble"${_scopeId}>5</span><button class="btn btn-lime" type="button"${ssrIncludeBooleanAttr(!unref(freshPreview) || !unref(selectedTableReady)) ? " disabled" : ""}${_scopeId}>Next</button></div>`);
          } else {
            return [
              createVNode("div", { class: "scope-row" }, [
                createVNode("span", { class: "step-bubble" }, "1"),
                createVNode("label", null, "CID:"),
                createVNode("div", {
                  ref_key: "searchId1Select",
                  ref: searchId1Select,
                  class: ["searchable-select", { open: unref(searchId1Open) }]
                }, [
                  createVNode("input", {
                    value: unref(searchId1Query),
                    autocomplete: "off",
                    role: "combobox",
                    "aria-autocomplete": "list",
                    "aria-expanded": unref(searchId1Open) ? "true" : "false",
                    placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E1E\u0E34\u0E21\u0E1E\u0E4C CID",
                    onFocus: openSearchId1,
                    onInput: ($event) => setSearchId1Query($event.target.value),
                    onKeydown: [
                      withKeys(withModifiers(($event) => moveSearchId1Highlight(1), ["prevent"]), ["down"]),
                      withKeys(withModifiers(($event) => moveSearchId1Highlight(-1), ["prevent"]), ["up"]),
                      withKeys(withModifiers(commitSearchId1FromKeyboard, ["prevent"]), ["enter"]),
                      withKeys(withModifiers(closeSearchId1, ["prevent"]), ["esc"])
                    ]
                  }, null, 40, ["value", "aria-expanded", "onInput", "onKeydown"]),
                  createVNode("button", {
                    class: "searchable-select-toggle",
                    type: "button",
                    "aria-label": "Open CID list",
                    onClick: toggleSearchId1
                  }, " \u25BE "),
                  unref(searchId1Open) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "searchable-select-menu",
                    role: "listbox"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredSearchId1Options), (option, index) => {
                      return openBlock(), createBlock("button", {
                        key: option.value,
                        type: "button",
                        class: ["searchable-select-option", { active: index === unref(highlightedSearchId1Index) }],
                        role: "option",
                        onMousedown: withModifiers(($event) => setSearchId1(option.value), ["prevent"])
                      }, toDisplayString(option.value), 43, ["onMousedown"]);
                    }), 128)),
                    !unref(filteredSearchId1Options).length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "searchable-select-empty"
                    }, " \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A ")) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ], 2),
                createVNode("span", { class: "step-bubble" }, "2"),
                createVNode("input", {
                  value: unref(searchId2Query),
                  placeholder: "",
                  onInput: ($event) => setSearchId2Query($event.target.value)
                }, null, 40, ["value", "onInput"])
              ]),
              createVNode("div", { class: "scope-row" }, [
                createVNode("label", null, "New table:"),
                createVNode("input", {
                  value: __props.project.cmpDatabase,
                  disabled: ""
                }, null, 8, ["value"]),
                createVNode("input", {
                  value: ((_b = __props.selectedTable) == null ? void 0 : _b.name) || "",
                  disabled: "",
                  placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E32\u0E23\u0E32\u0E07\u0E08\u0E32\u0E01\u0E14\u0E49\u0E32\u0E19\u0E02\u0E27\u0E32"
                }, null, 8, ["value"])
              ]),
              createVNode("div", { class: "center-actions" }, [
                createVNode("span", { class: "step-bubble" }, "4"),
                createVNode("button", {
                  class: "btn btn-lime",
                  type: "button",
                  disabled: !__props.selectedTable || !unref(selectedTableReady),
                  onClick: ($event) => _ctx.$emit("refresh-preview")
                }, " Select PrimaryKey ", 8, ["disabled", "onClick"])
              ]),
              __props.selectedTable ? (openBlock(), createBlock("div", {
                key: 0,
                class: "primary-key-zone"
              }, [
                createVNode("div", { class: "pk-box" }, [
                  createVNode("h3", null, "X Drop"),
                  createVNode("div", { class: "pk-list empty-state" }, "\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E17\u0E35\u0E48\u0E0B\u0E48\u0E2D\u0E19\u0E08\u0E30\u0E16\u0E39\u0E01\u0E2D\u0E48\u0E32\u0E19\u0E08\u0E32\u0E01 Metadata")
                ]),
                createVNode("div", { class: "pk-box" }, [
                  createVNode("h3", null, "Select"),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.selectedTable.primaryKeys, (key) => {
                    return openBlock(), createBlock("label", {
                      key,
                      class: "pk-choice"
                    }, [
                      createVNode("input", {
                        type: "checkbox",
                        checked: __props.selectedPrimaryKeys.includes(key),
                        onChange: ($event) => _ctx.$emit("toggle-primary-key", key)
                      }, null, 40, ["checked", "onChange"]),
                      createTextVNode(" " + toDisplayString(key), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "center-actions" }, [
                createVNode("span", { class: "step-bubble" }, "5"),
                createVNode("button", {
                  class: "btn btn-lime",
                  type: "button",
                  disabled: !unref(freshPreview) || !unref(selectedTableReady),
                  onClick: ($event) => _ctx.$emit("prepare")
                }, "Next", 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/TableSelector.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "TableTree",
  __ssrInlineRender: true,
  props: {
    tables: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
    selectedName: { type: String, default: "" }
  },
  emits: ["select"],
  setup(__props) {
    function statusTone(status) {
      return (status == null ? void 0 : status.tone) || ((status == null ? void 0 : status.ready) ? "warning" : "empty");
    }
    function statusIcon(status) {
      if (status == null ? void 0 : status.icon) {
        return status.icon;
      }
      const tone = statusTone(status);
      if (tone === "ok") {
        return "\u2713";
      }
      if (tone === "warning") {
        return "\u25B2";
      }
      if (tone === "slash") {
        return "/";
      }
      if (tone === "empty") {
        return "\u2612";
      }
      return "\u2716";
    }
    function statusTitle(status) {
      return (status == null ? void 0 : status.label) || "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$8;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({
        title: "\u2462 \u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
        compact: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="table-tree"${_scopeId}><!--[-->`);
            ssrRenderList(__props.tables, (table, index) => {
              var _a;
              _push2(`<button type="button" class="${ssrRenderClass(["table-node", { selected: __props.selectedName === table.name }])}"${ssrIncludeBooleanAttr(!table.allowed || !((_a = __props.statuses[index]) == null ? void 0 : _a.ready)) ? " disabled" : ""}${ssrRenderAttr("title", statusTitle(__props.statuses[index]))}${_scopeId}><span class="${ssrRenderClass(["tree-icon", statusTone(__props.statuses[index])])}"${_scopeId}>${ssrInterpolate(statusIcon(__props.statuses[index]))}</span><span${_scopeId}>${ssrInterpolate(table.name)}</span></button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "table-tree" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.tables, (table, index) => {
                  var _a;
                  return openBlock(), createBlock("button", {
                    key: table.name,
                    type: "button",
                    class: ["table-node", { selected: __props.selectedName === table.name }],
                    disabled: !table.allowed || !((_a = __props.statuses[index]) == null ? void 0 : _a.ready),
                    title: statusTitle(__props.statuses[index]),
                    onClick: ($event) => _ctx.$emit("select", table)
                  }, [
                    createVNode("span", {
                      class: ["tree-icon", statusTone(__props.statuses[index])]
                    }, toDisplayString(statusIcon(__props.statuses[index])), 3),
                    createVNode("span", null, toDisplayString(table.name), 1)
                  ], 10, ["disabled", "title", "onClick"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/TableTree.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "FieldRow",
  __ssrInlineRender: true,
  props: {
    recordId: { type: String, required: true },
    field: { type: Object, required: true }
  },
  emits: ["choose", "custom"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<tr${ssrRenderAttrs(_attrs)}><td><strong>${ssrInterpolate(__props.field.key)}</strong><small>${ssrInterpolate(__props.field.label)}</small></td><td><button type="button" class="${ssrRenderClass(["choice-button", { selected: __props.field.selectedSource === "round1" }])}">${ssrInterpolate(__props.field.round1Value || "\u0E27\u0E48\u0E32\u0E07")}</button></td><td><button type="button" class="${ssrRenderClass(["choice-button", { selected: __props.field.selectedSource === "round2" }])}">${ssrInterpolate(__props.field.round2Value || "\u0E27\u0E48\u0E32\u0E07")}</button></td><td><input class="save-value-input"${ssrRenderAttr("value", (_a = __props.field.selectedValue) != null ? _a : "")} placeholder="\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E23\u0E2D\u0E01\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E08\u0E30\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01"></td></tr>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/FieldRow.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Step4Compare",
  __ssrInlineRender: true,
  props: {
    project: { type: Object, required: true },
    table: { type: Object, required: true },
    records: { type: Array, default: () => [] },
    activeRecord: { type: Object, default: null },
    activeIndex: { type: Number, default: 0 },
    comparedCount: { type: Number, default: 0 },
    complete: { type: Boolean, default: false }
  },
  emits: ["choose", "custom", "save", "reset", "open-record", "back"],
  setup(__props) {
    const props = __props;
    const differentFields = computed(() => {
      var _a;
      return (((_a = props.activeRecord) == null ? void 0 : _a.fields) || []).filter((field) => !field.same);
    });
    const canSubmit = computed(() => {
      return differentFields.value.every((field) => hasSaveValue(field.selectedValue));
    });
    function hasSaveValue(value) {
      return value !== null && typeof value !== "undefined" && String(value).trim() !== "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$8;
      const _component_CompareFieldRow = _sfc_main$3;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">4.\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</h1><button class="back-link" type="button">\xAB \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A</button><div class="rule"></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E04\u0E49\u0E19\u0E2B\u0E32:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="search-line"${_scopeId}><span class="input-prefix"${_scopeId}>SEARCH ID :</span><input${ssrRenderAttr("value", ((_a = __props.activeRecord) == null ? void 0 : _a.primaryKey) || "")} readonly placeholder="INPUT ID!!"${_scopeId}><button class="btn btn-gray" type="button"${_scopeId}>Search</button></div>`);
          } else {
            return [
              createVNode("div", { class: "search-line" }, [
                createVNode("span", { class: "input-prefix" }, "SEARCH ID :"),
                createVNode("input", {
                  value: ((_b = __props.activeRecord) == null ? void 0 : _b.primaryKey) || "",
                  readonly: "",
                  placeholder: "INPUT ID!!"
                }, null, 8, ["value"]),
                createVNode("button", {
                  class: "btn btn-gray",
                  type: "button"
                }, "Search")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.complete) {
        _push(`<div class="results-table legacy-result"><div class="result-head"><span>Primary Key(s)</span><span>Results</span></div><!--[-->`);
        ssrRenderList(__props.records, (record, index) => {
          _push(`<button type="button" class="result-row done"><span>${ssrInterpolate(record.primaryKey)}</span><span>Compared !!!</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else if (__props.activeRecord) {
        _push(`<div class="compare-card"><header class="compare-card-head"><div><span>Primary Key(s)</span><strong>${ssrInterpolate(__props.activeRecord.primaryKey)}</strong></div><div class="mini-progress"><span>${ssrInterpolate(__props.comparedCount)} / ${ssrInterpolate(__props.records.length)} \u0E23\u0E2B\u0E31\u0E2A</span><i><b style="${ssrRenderStyle({ width: `${__props.records.length ? __props.comparedCount / __props.records.length * 100 : 0}%` })}"></b></i></div></header><div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>field_name</th><th>ROUND 1</th><th>ROUND 2</th><th>\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E08\u0E30\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(differentFields), (field) => {
          _push(ssrRenderComponent(_component_CompareFieldRow, {
            key: field.key,
            "record-id": __props.activeRecord.id,
            field,
            onChoose: (...args) => _ctx.$emit("choose", ...args),
            onCustom: (...args) => _ctx.$emit("custom", ...args)
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (!unref(differentFields).length) {
          _push(`<tr><td colspan="4" class="empty-diff">\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 ROUND 1 \u0E41\u0E25\u0E30 ROUND 2 \u0E15\u0E23\u0E07\u0E01\u0E31\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><footer class="submit-row"><span>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E10\u0E32\u0E19 ${ssrInterpolate(__props.project.cmpDatabase)} \u0E41\u0E25\u0E30\u0E2A\u0E23\u0E49\u0E32\u0E07 Audit Log \u0E41\u0E1A\u0E1A append-only</span><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(!unref(canSubmit)) ? " disabled" : ""}>Submit</button><button class="btn btn-gray" type="button">Reset</button></footer></div>`);
      } else {
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="empty-state"${_scopeId}>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07 ROUND 1 \u0E41\u0E25\u0E30 ROUND 2</p>`);
            } else {
              return [
                createVNode("p", { class: "empty-state" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07 ROUND 1 \u0E41\u0E25\u0E30 ROUND 2")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/Step4Compare.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    confirmText: { type: String, default: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19" },
    cancelText: { type: String, default: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" }
  },
  emits: ["confirm", "close"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="modal-backdrop"><section class="confirm-dialog" role="dialog" aria-modal="true"${ssrRenderAttr("aria-label", __props.title)}><header><h2>${ssrInterpolate(__props.title)}</h2><button type="button" aria-label="\u0E1B\u0E34\u0E14">\xD7</button></header><div class="confirm-content">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div><footer><button type="button" class="btn btn-light">${ssrInterpolate(__props.cancelText)}</button><button type="button" class="btn btn-success">${ssrInterpolate(__props.confirmText)}</button></footer></section></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/ConfirmDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      user,
      projects,
      tableCatalog,
      sampleIds,
      step,
      selectedPrimaryKeys,
      searchMode,
      searchId1,
      searchId2,
      searchId,
      scopePreview,
      preview,
      records,
      activeRecordIndex,
      toast,
      isAuthenticated,
      selectedProject,
      selectedTable,
      activeRecord,
      comparedCount,
      compareComplete,
      usingMock,
      tableStatuses,
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
      openRecord
    } = useCompareWorkflow();
    const route = useRoute();
    const confirmOpen = ref(false);
    const resolvingProject = ref(false);
    const inlineTables = ref([]);
    const inlineTablesLoading = ref(false);
    const inlineSelectedTableName = ref("");
    const projectScopeKey = computed(() => typeof route.query.project === "string" ? route.query.project.trim().toLowerCase() : "");
    const visibleProjects = computed(() => {
      if (!projectScopeKey.value) {
        return projects.value;
      }
      const scoped = findProjectDatabasesByUrlKey(projectScopeKey.value);
      return scoped.length ? scoped : projects.value;
    });
    const inlineTableProject = computed(() => {
      if (!projectScopeKey.value || visibleProjects.value.length !== 1) {
        return null;
      }
      const project = visibleProjects.value[0];
      return isTopLevelProjectKey(projectScopeKey.value, project) ? project : null;
    });
    watch(() => route.query.project, () => {
      resolveProjectFromUrl();
    });
    watch([inlineTableProject, isAuthenticated], ([project, authed]) => {
      if (!authed || !project) {
        resetInlineTables();
        return;
      }
      loadInlineTables(project);
    }, { immediate: true });
    const detailRows = computed(() => {
      var _a, _b, _c;
      return [
        { label: "USER:", value: ((_a = user.value) == null ? void 0 : _a.username) || "nuda" },
        { label: "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", value: ((_b = selectedProject.value) == null ? void 0 : _b.rawDatabase) || "-" },
        { label: "\u0E15\u0E32\u0E23\u0E32\u0E07", value: ((_c = selectedTable.value) == null ? void 0 : _c.name) || "-" }
      ];
    });
    const resultRows = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g;
      return [
        { label: "search", value: ((_a = activeRecord.value) == null ? void 0 : _a.primaryKey) || searchId.value },
        { label: "compare", value: `${records.value.length - comparedCount.value} record` },
        { label: "#rows in ROUND1", value: (_c = (_b = preview.value) == null ? void 0 : _b.round1Count) != null ? _c : "-" },
        { label: "#rows in ROUND2", value: (_e = (_d = preview.value) == null ? void 0 : _d.round2Count) != null ? _e : "-" },
        { label: "#rows intersection", value: (_g = (_f = preview.value) == null ? void 0 : _f.intersectionCount) != null ? _g : "-" }
      ];
    });
    async function openConfirm() {
      var _a, _b;
      const compareStatus = ((_a = preview.value) == null ? void 0 : _a.compareStatus) || ((_b = preview.value) == null ? void 0 : _b.compare_status) || "";
      if (compareStatus === "complete") {
        await prepareCompare();
        return;
      }
      confirmOpen.value = true;
    }
    async function confirmPrepare() {
      confirmOpen.value = false;
      await prepareCompare();
    }
    async function resolveProjectFromUrl() {
      if (!isAuthenticated.value || resolvingProject.value) {
        return;
      }
      const projectKey = projectScopeKey.value;
      if (!projectKey) {
        return;
      }
      resolvingProject.value = true;
      await refreshProjects();
      const scopedDatabases = findProjectDatabasesByUrlKey(projectKey);
      if (scopedDatabases.length === 1 && isTopLevelProjectKey(projectKey, scopedDatabases[0])) {
        backToProjectList();
      } else {
        const exactDatabase = findDatabaseByUrlKey(projectKey);
        if (exactDatabase) {
          resetInlineTables();
          await selectProject(exactDatabase);
        } else if (scopedDatabases.length) {
          backToProjectList();
        }
      }
      resolvingProject.value = false;
    }
    async function loadInlineTables(project) {
      var _a;
      inlineTablesLoading.value = true;
      inlineTables.value = [];
      inlineSelectedTableName.value = "";
      try {
        const tables = await loadTablesForProject(project);
        inlineTables.value = tables;
        inlineSelectedTableName.value = ((_a = tables.find((table) => table.allowed)) == null ? void 0 : _a.name) || "";
      } finally {
        inlineTablesLoading.value = false;
      }
    }
    function resetInlineTables() {
      inlineTables.value = [];
      inlineTablesLoading.value = false;
      inlineSelectedTableName.value = "";
    }
    async function pickInlineTable(project, table) {
      await selectProjectWithTable(project, table);
    }
    function findDatabaseByUrlKey(projectKey) {
      return projects.value.find((project) => {
        const candidates = [
          project.id,
          project.code,
          project.project_id,
          project.project_code,
          project.databaseCode,
          project.database_code,
          project.rawDatabase,
          project.raw_database
        ].filter(Boolean).map((value) => String(value).toLowerCase());
        return candidates.includes(projectKey);
      }) || null;
    }
    function findProjectDatabasesByUrlKey(projectKey) {
      return projects.value.filter((project) => {
        const groupCandidates = [
          project.surveyProjectCode,
          project.survey_project_code,
          project.groupCode,
          project.project_group,
          project.slug
        ].filter(Boolean).map((value) => String(value).toLowerCase());
        const databaseCandidates = [
          project.id,
          project.project_id,
          project.databaseCode,
          project.database_code,
          project.rawDatabase,
          project.raw_database
        ].filter(Boolean).map((value) => String(value).toLowerCase());
        return groupCandidates.includes(projectKey) || databaseCandidates.some((value) => value.startsWith(`${projectKey}_`));
      });
    }
    function isTopLevelProjectKey(projectKey, project) {
      return [
        project.surveyProjectCode,
        project.survey_project_code,
        project.groupCode,
        project.project_group,
        project.slug
      ].filter(Boolean).map((value) => String(value).toLowerCase()).includes(projectKey);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_CompareProjectSelector = _sfc_main$7;
      const _component_CommonDetailPanel = _sfc_main$6;
      const _component_CompareTableSelector = _sfc_main$5;
      const _component_CompareTableTree = _sfc_main$4;
      const _component_CommonLegacyPanel = _sfc_main$8;
      const _component_CompareStep4Compare = _sfc_main$2;
      const _component_CommonConfirmDialog = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}>`);
      if (!unref(isAuthenticated)) {
        _push(`<div class="auth-loading"> \u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19... </div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(usingMock)) {
          _push(`<div class="mock-banner"> \u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Mock Service \u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E23\u0E2D\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21 PHP API \u0E08\u0E23\u0E34\u0E07 </div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(step) === 1) {
          _push(`<div class="workspace-grid">`);
          _push(ssrRenderComponent(_component_CompareProjectSelector, {
            class: "main-column",
            projects: unref(visibleProjects),
            "scope-key": unref(projectScopeKey),
            "inline-table-mode": Boolean(unref(inlineTableProject)),
            "inline-tables": unref(inlineTables),
            "inline-tables-loading": unref(inlineTablesLoading),
            "inline-selected-table-name": unref(inlineSelectedTableName),
            "onUpdate:inlineSelectedTableName": ($event) => inlineSelectedTableName.value = $event,
            onPick: unref(selectProject),
            onPickWithTable: pickInlineTable
          }, null, _parent));
          _push(`<aside class="side-column">`);
          _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
          _push(`</aside></div>`);
        } else if (unref(step) === 2 && unref(selectedProject)) {
          _push(`<div class="workspace-grid">`);
          _push(ssrRenderComponent(_component_CompareTableSelector, {
            class: "main-column",
            project: unref(selectedProject),
            tables: unref(tableCatalog),
            "table-statuses": unref(tableStatuses),
            "selected-table": unref(selectedTable),
            "selected-primary-keys": unref(selectedPrimaryKeys),
            preview: unref(preview),
            "scope-preview": unref(scopePreview),
            "sample-ids": unref(sampleIds),
            "search-mode": unref(searchMode),
            "onUpdate:searchMode": ($event) => isRef(searchMode) ? searchMode.value = $event : null,
            "search-id1": unref(searchId1),
            "onUpdate:searchId1": ($event) => isRef(searchId1) ? searchId1.value = $event : null,
            "search-id2": unref(searchId2),
            "onUpdate:searchId2": ($event) => isRef(searchId2) ? searchId2.value = $event : null,
            "search-id": unref(searchId),
            "onUpdate:searchId": ($event) => isRef(searchId) ? searchId.value = $event : null,
            onBack: unref(backToProjectList),
            onSelectTable: unref(selectTable),
            onTogglePrimaryKey: unref(togglePrimaryKey),
            onRefreshPreview: unref(refreshPreview),
            onPrepare: openConfirm
          }, null, _parent));
          _push(`<aside class="side-column">`);
          _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
          _push(ssrRenderComponent(_component_CompareTableTree, {
            tables: unref(tableCatalog),
            statuses: unref(tableStatuses),
            "selected-name": (_a = unref(selectedTable)) == null ? void 0 : _a.name,
            onSelect: unref(selectTable)
          }, null, _parent));
          _push(ssrRenderComponent(_component_CommonLegacyPanel, {
            title: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22",
            compact: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="legend-list"${_scopeId}><li${_scopeId}><span class="legend warning"${_scopeId}>\u25B2</span>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23 compare</li><li${_scopeId}><span class="legend ok"${_scopeId}>\u2713</span>Compare \u0E41\u0E25\u0E49\u0E27</li><li${_scopeId}><span class="legend error"${_scopeId}>\u2716</span>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19</li><li${_scopeId}><span class="legend slash"${_scopeId}>/</span>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19</li><li${_scopeId}><span class="legend empty"${_scopeId}>\u25A1</span>\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A</li></ul>`);
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
                      createTextVNode("\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19")
                    ]),
                    createVNode("li", null, [
                      createVNode("span", { class: "legend slash" }, "/"),
                      createTextVNode("\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19")
                    ]),
                    createVNode("li", null, [
                      createVNode("span", { class: "legend empty" }, "\u25A1"),
                      createTextVNode("\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E23\u0E2D\u0E1A")
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</aside></div>`);
        } else if (unref(step) === 4 && unref(selectedProject) && unref(selectedTable)) {
          _push(`<div class="workspace-grid">`);
          _push(ssrRenderComponent(_component_CompareStep4Compare, {
            class: "main-column",
            project: unref(selectedProject),
            table: unref(selectedTable),
            records: unref(records),
            "active-record": unref(activeRecord),
            "active-index": unref(activeRecordIndex),
            "compared-count": unref(comparedCount),
            complete: unref(compareComplete),
            onChoose: unref(chooseField),
            onCustom: unref(setCustomField),
            onSave: unref(saveActiveRecord),
            onReset: unref(resetActiveRecord),
            onOpenRecord: unref(openRecord),
            onBack: ($event) => step.value = 2
          }, null, _parent));
          _push(`<aside class="side-column">`);
          _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
          _push(ssrRenderComponent(_component_CommonDetailPanel, {
            title: "\u0E1C\u0E25",
            rows: unref(resultRows)
          }, null, _parent));
          _push(ssrRenderComponent(_component_CommonLegacyPanel, {
            title: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A",
            compact: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="small-button-stack"${_scopeId}><button type="button"${_scopeId}>-\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A-R1</button><button type="button"${_scopeId}>-\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A-R2</button></div>`);
              } else {
                return [
                  createVNode("div", { class: "small-button-stack" }, [
                    createVNode("button", { type: "button" }, "-\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A-R1"),
                    createVNode("button", { type: "button" }, "-\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E2B\u0E31\u0E2A-R2")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</aside></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_CommonConfirmDialog, {
          open: unref(confirmOpen),
          title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Compare",
          "confirm-text": "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E40\u0E23\u0E34\u0E48\u0E21 Compare",
          onClose: ($event) => confirmOpen.value = false,
          onConfirm: confirmPrepare
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(`<p${_scopeId}>\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E15\u0E23\u0E27\u0E08\u0E15\u0E32\u0E23\u0E32\u0E07 <strong${_scopeId}>${ssrInterpolate((_a2 = unref(preview)) == null ? void 0 : _a2.targetFullName)}</strong> \u0E41\u0E25\u0E30\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 <strong${_scopeId}>round = 1</strong> \u0E08\u0E32\u0E01\u0E10\u0E32\u0E19\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E10\u0E32\u0E19 <strong${_scopeId}>_cmp</strong></p><ul class="confirm-list"${_scopeId}><li${_scopeId}>\u0E44\u0E21\u0E48\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E19\u0E10\u0E32\u0E19\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07 \`_raw\`</li><li${_scopeId}>\u0E43\u0E0A\u0E49 Transaction \u0E41\u0E25\u0E30 Rollback \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19 PHP API \u0E08\u0E23\u0E34\u0E07</li><li${_scopeId}>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25\u0E41\u0E25\u0E30 Audit Log \u0E40\u0E09\u0E1E\u0E32\u0E30\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E01\u0E14 Submit</li></ul>`);
            } else {
              return [
                createVNode("p", null, [
                  createTextVNode("\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E15\u0E23\u0E27\u0E08\u0E15\u0E32\u0E23\u0E32\u0E07 "),
                  createVNode("strong", null, toDisplayString((_b = unref(preview)) == null ? void 0 : _b.targetFullName), 1),
                  createTextVNode(" \u0E41\u0E25\u0E30\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 "),
                  createVNode("strong", null, "round = 1"),
                  createTextVNode(" \u0E08\u0E32\u0E01\u0E10\u0E32\u0E19\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E10\u0E32\u0E19 "),
                  createVNode("strong", null, "_cmp")
                ]),
                createVNode("ul", { class: "confirm-list" }, [
                  createVNode("li", null, "\u0E44\u0E21\u0E48\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E19\u0E10\u0E32\u0E19\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07 `_raw`"),
                  createVNode("li", null, "\u0E43\u0E0A\u0E49 Transaction \u0E41\u0E25\u0E30 Rollback \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19 PHP API \u0E08\u0E23\u0E34\u0E07"),
                  createVNode("li", null, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25\u0E41\u0E25\u0E30 Audit Log \u0E40\u0E09\u0E1E\u0E32\u0E30\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E01\u0E14 Submit")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(toast)) {
          _push(`<div class="toast">${ssrInterpolate(unref(toast))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-DUI1LL9G');
//# sourceMappingURL=index-DUI1LL9G.mjs.map
