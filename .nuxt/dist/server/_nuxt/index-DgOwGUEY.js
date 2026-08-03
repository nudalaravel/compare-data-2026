import { _ as _sfc_main$6 } from "./LegacyPanel-DJJ9u9fC.js";
import { computed, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext, useModel, ref, watch, withKeys, withModifiers, createTextVNode, mergeModels, mergeProps, isRef } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$7 } from "./DetailPanel-xEeGelPg.js";
import { u as useCompareWorkflow } from "./useCompareWorkflow-DCC0rYzR.js";
import { a as useRoute } from "../server.mjs";
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
const _sfc_main$5 = {
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
      const _component_CommonLegacyPanel = _sfc_main$6;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">1.เลือกฐานข้อมูล</h1><div class="rule"></div><p class="updated">${ssrInterpolate(__props.scopeKey ? `แสดงฐานข้อมูลใน Project: ${__props.scopeKey}` : "เลือกฐานข้อมูลหรือแบบสอบถามที่ต้องการ compare")}</p><div class="rule"></div>`);
      if (__props.inlineTableMode && unref(inlineProject)) {
        _push(`<div class="inline-table-picker"><button type="button" class="${ssrRenderClass(["legacy-db-button", unref(inlineProject).color])}" aria-disabled="true"><span>${ssrInterpolate(unref(inlineProject).displayName || unref(inlineProject).questionnaireName)}</span><small>${ssrInterpolate(unref(inlineProject).rawDatabase)}</small></button>`);
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ตารางข้อมูล" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="inline-table-hint"${_scopeId}>โปรเจคนี้มีฐานข้อมูลเดียว เลือกตารางที่ต้องการ compare แล้วกด Next</p>`);
              if (__props.inlineTablesLoading) {
                _push2(`<div class="empty-state"${_scopeId}>กำลังโหลดตาราง...</div>`);
              } else {
                _push2(`<div class="inline-table-list"${_scopeId}><!--[-->`);
                ssrRenderList(__props.inlineTables, (table) => {
                  _push2(`<button type="button" class="${ssrRenderClass(["inline-table-button", { selected: __props.inlineSelectedTableName === table.name }])}"${ssrIncludeBooleanAttr(!table.allowed) ? " disabled" : ""}${_scopeId}><strong${_scopeId}>${ssrInterpolate(table.displayName || table.name)}</strong><small${_scopeId}>${ssrInterpolate(table.name)}</small><em${_scopeId}>${ssrInterpolate(table.allowed ? "เปิด compare" : "ยังไม่เปิด compare")}</em></button>`);
                });
                _push2(`<!--]-->`);
                if (!__props.inlineTables.length) {
                  _push2(`<p class="empty-state"${_scopeId}>ยังไม่มีตารางที่เปิด compare</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
            } else {
              return [
                createVNode("p", { class: "inline-table-hint" }, "โปรเจคนี้มีฐานข้อมูลเดียว เลือกตารางที่ต้องการ compare แล้วกด Next"),
                __props.inlineTablesLoading ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "empty-state"
                }, "กำลังโหลดตาราง...")) : (openBlock(), createBlock("div", {
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
                      createVNode("em", null, toDisplayString(table.allowed ? "เปิด compare" : "ยังไม่เปิด compare"), 1)
                    ], 10, ["disabled", "onClick"]);
                  }), 128)),
                  !__props.inlineTables.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "empty-state"
                  }, "ยังไม่มีตารางที่เปิด compare")) : createCommentVNode("", true)
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
            _push(`<small>ยังไม่มีตารางที่เปิด compare</small>`);
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/ProjectSelector.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
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
      const index = props.tables.findIndex((table) => table.name === props.selectedTable?.name);
      return index >= 0 ? props.tableStatuses[index] : null;
    });
    const selectedTableReady = computed(() => Boolean(selectedTableStatus.value?.ready));
    const freshPreview = computed(() => {
      const previewSearchId = props.preview?.searchId || props.preview?.search_id || "";
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
      setSearchId1(option?.value || searchId1Query.value);
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
      if (!String(searchId2.value || "").trim()) {
        return "prefix";
      }
      const mode = String(props.project?.searchId2Mode || props.project?.search_id2_mode || "exact").toLowerCase();
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
      const id = String(sample?.id || sample?.sample_id || "");
      return {
        id,
        databaseCode: sample?.databaseCode || sample?.database_code || props.project.databaseCode || props.project.database_code || props.project.id,
        searchId1: String(sample?.searchId1 || sample?.search_id1 || id),
        searchId2: String(sample?.searchId2 || sample?.search_id2 || "")
      };
    }
    function splitSearchIdByProject(project, id) {
      const text = String(id || "");
      const id1Start = Math.max(1, Number(project?.searchId1Start || project?.search_id1_start || 1));
      const id1Length = Math.max(1, Number(project?.searchId1Length || project?.search_id1_length || text.length || 1));
      const id2Start = Math.max(1, Number(project?.searchId2Start || project?.search_id2_start || id1Start + id1Length));
      const rawId2Length = project?.searchId2Length || project?.search_id2_length || null;
      const id2Length = rawId2Length ? Number(rawId2Length) : null;
      return {
        searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
        searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$6;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">2.เลือกตารางข้อมูล</h1><div class="rule"></div><button class="back-link" type="button">« ย้อนกลับ</button><div class="rule"></div><div class="instructions"><p>1. เลือกหมู่ ที่ต้องการ compare <span class="danger-text">(compare หมู่ A เป็นครั้งแรก)</span></p><p>2. กรอก StructureID หรือ StructureID+MemberID <span class="danger-text">(เคย compare หมู่ A แล้ว)</span></p><p>3. คลิกเลือกตารางที่ต้องการ compare กล่องทางขวามือ</p><p>4. กด Select PrimaryKey</p><p>5. กด Next</p></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, {
        title: `Compare Data : ${__props.project.rawDatabase}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="scope-row"${_scopeId}><span class="step-bubble"${_scopeId}>1</span><label${_scopeId}>CID:</label><div class="${ssrRenderClass([{ open: unref(searchId1Open) }, "searchable-select"])}"${_scopeId}><input${ssrRenderAttr("value", unref(searchId1Query))} autocomplete="off" role="combobox" aria-autocomplete="list"${ssrRenderAttr("aria-expanded", unref(searchId1Open) ? "true" : "false")} placeholder="เลือกหรือพิมพ์ CID"${_scopeId}><button class="searchable-select-toggle" type="button" aria-label="Open CID list"${_scopeId}> ▾ </button>`);
            if (unref(searchId1Open)) {
              _push2(`<div class="searchable-select-menu" role="listbox"${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredSearchId1Options), (option, index) => {
                _push2(`<button type="button" class="${ssrRenderClass(["searchable-select-option", { active: index === unref(highlightedSearchId1Index) }])}" role="option"${_scopeId}>${ssrInterpolate(option.value)}</button>`);
              });
              _push2(`<!--]-->`);
              if (!unref(filteredSearchId1Options).length) {
                _push2(`<div class="searchable-select-empty"${_scopeId}> ไม่พบรหัส </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><span class="step-bubble"${_scopeId}>2</span><input${ssrRenderAttr("value", unref(searchId2Query))} placeholder=""${_scopeId}></div><div class="scope-row"${_scopeId}><label${_scopeId}>New table:</label><input${ssrRenderAttr("value", __props.project.cmpDatabase)} disabled${_scopeId}><input${ssrRenderAttr("value", __props.selectedTable?.name || "")} disabled placeholder="เลือกตารางจากด้านขวา"${_scopeId}></div><div class="center-actions"${_scopeId}><span class="step-bubble"${_scopeId}>4</span><button class="btn btn-lime" type="button"${ssrIncludeBooleanAttr(!__props.selectedTable || !unref(selectedTableReady)) ? " disabled" : ""}${_scopeId}> Select PrimaryKey </button></div>`);
            if (__props.selectedTable) {
              _push2(`<div class="primary-key-zone"${_scopeId}><div class="pk-box"${_scopeId}><h3${_scopeId}>X Drop</h3><div class="pk-list empty-state"${_scopeId}>ตัวแปรที่ซ่อนจะถูกอ่านจาก Metadata</div></div><div class="pk-box"${_scopeId}><h3${_scopeId}>Select</h3><!--[-->`);
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
                    placeholder: "เลือกหรือพิมพ์ CID",
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
                  }, " ▾ "),
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
                    }, " ไม่พบรหัส ")) : createCommentVNode("", true)
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
                  value: __props.selectedTable?.name || "",
                  disabled: "",
                  placeholder: "เลือกตารางจากด้านขวา"
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
                  createVNode("div", { class: "pk-list empty-state" }, "ตัวแปรที่ซ่อนจะถูกอ่านจาก Metadata")
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/TableSelector.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
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
      return status?.tone || (status?.ready ? "warning" : "empty");
    }
    function statusIcon(status) {
      if (status?.icon) {
        return status.icon;
      }
      const tone = statusTone(status);
      if (tone === "ok") {
        return "✓";
      }
      if (tone === "warning") {
        return "▲";
      }
      if (tone === "slash") {
        return "/";
      }
      if (tone === "empty") {
        return "✖";
      }
      return "☒";
    }
    function statusTitle(status) {
      return status?.label || "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$6;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({
        title: "③ ตารางข้อมูล",
        compact: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="table-tree"${_scopeId}><!--[-->`);
            ssrRenderList(__props.tables, (table, index) => {
              _push2(`<button type="button" class="${ssrRenderClass(["table-node", { selected: __props.selectedName === table.name }])}"${ssrIncludeBooleanAttr(!table.allowed || !__props.statuses[index]?.ready) ? " disabled" : ""}${ssrRenderAttr("title", statusTitle(__props.statuses[index]))}${_scopeId}><span class="${ssrRenderClass(["tree-icon", statusTone(__props.statuses[index])])}"${_scopeId}>${ssrInterpolate(statusIcon(__props.statuses[index]))}</span><span${_scopeId}>${ssrInterpolate(table.name)}</span></button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "table-tree" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.tables, (table, index) => {
                  return openBlock(), createBlock("button", {
                    key: table.name,
                    type: "button",
                    class: ["table-node", { selected: __props.selectedName === table.name }],
                    disabled: !table.allowed || !__props.statuses[index]?.ready,
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/TableTree.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "FieldRow",
  __ssrInlineRender: true,
  props: {
    recordId: { type: String, required: true },
    field: { type: Object, required: true }
  },
  emits: ["choose", "custom"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(_attrs)}><td><strong>${ssrInterpolate(__props.field.key)}</strong><small>${ssrInterpolate(__props.field.label)}</small></td><td><button type="button" class="${ssrRenderClass(["choice-button", { selected: __props.field.selectedSource === "round1" }])}">${ssrInterpolate(__props.field.round1Value || "ว่าง")}</button></td><td><button type="button" class="${ssrRenderClass(["choice-button", { selected: __props.field.selectedSource === "round2" }])}">${ssrInterpolate(__props.field.round2Value || "ว่าง")}</button></td><td><input class="save-value-input"${ssrRenderAttr("value", __props.field.selectedValue ?? "")} placeholder="เลือกหรือกรอกค่าที่จะบันทึก"></td></tr>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/FieldRow.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
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
      return (props.activeRecord?.fields || []).filter((field) => !field.same);
    });
    const canSubmit = computed(() => {
      return differentFields.value.every((field) => hasSaveValue(field.selectedValue));
    });
    function hasSaveValue(value) {
      return value !== null && typeof value !== "undefined" && String(value).trim() !== "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$6;
      const _component_CompareFieldRow = _sfc_main$2;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="page-title">4.เปรียบเทียบข้อมูล</h1><button class="back-link" type="button">« ย้อนกลับ</button><div class="rule"></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ค้นหา:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="search-line"${_scopeId}><span class="input-prefix"${_scopeId}>SEARCH ID :</span><input${ssrRenderAttr("value", __props.activeRecord?.primaryKey || "")} readonly placeholder="INPUT ID!!"${_scopeId}><button class="btn btn-gray" type="button"${_scopeId}>Search</button></div>`);
          } else {
            return [
              createVNode("div", { class: "search-line" }, [
                createVNode("span", { class: "input-prefix" }, "SEARCH ID :"),
                createVNode("input", {
                  value: __props.activeRecord?.primaryKey || "",
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
        _push(`<div class="compare-card"><header class="compare-card-head"><div><span>Primary Key(s)</span><strong>${ssrInterpolate(__props.activeRecord.primaryKey)}</strong></div><div class="mini-progress"><span>${ssrInterpolate(__props.comparedCount)} / ${ssrInterpolate(__props.records.length)} รหัส</span><i><b style="${ssrRenderStyle({ width: `${__props.records.length ? __props.comparedCount / __props.records.length * 100 : 0}%` })}"></b></i></div></header><div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>field_name</th><th>ROUND 1</th><th>ROUND 2</th><th>ค่าที่จะบันทึก</th></tr></thead><tbody><!--[-->`);
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
          _push(`<tr><td colspan="4" class="empty-diff">ข้อมูล ROUND 1 และ ROUND 2 ตรงกันทั้งหมด</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><footer class="submit-row"><span>บันทึกเฉพาะฐาน ${ssrInterpolate(__props.project.cmpDatabase)} และสร้าง Audit Log แบบ append-only</span><button class="btn btn-gray" type="button"${ssrIncludeBooleanAttr(!unref(canSubmit)) ? " disabled" : ""}>Submit</button><button class="btn btn-gray" type="button">Reset</button></footer></div>`);
      } else {
        _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ไม่พบข้อมูล" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="empty-state"${_scopeId}>ไม่พบรหัสที่อยู่ครบทั้ง ROUND 1 และ ROUND 2</p>`);
            } else {
              return [
                createVNode("p", { class: "empty-state" }, "ไม่พบรหัสที่อยู่ครบทั้ง ROUND 1 และ ROUND 2")
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/compare/Step4Compare.vue");
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
    const detailRows = computed(() => [
      { label: "USER:", value: user.value?.username || "nuda" },
      { label: "ฐานข้อมูล", value: selectedProject.value?.rawDatabase || "-" },
      { label: "ตาราง", value: selectedTable.value?.name || "-" }
    ]);
    const resultRows = computed(() => [
      { label: "search", value: activeRecord.value?.primaryKey || searchId.value },
      { label: "compare", value: `${records.value.length - comparedCount.value} record` },
      { label: "#rows in ROUND1", value: preview.value?.round1Count ?? "-" },
      { label: "#rows in ROUND2", value: preview.value?.round2Count ?? "-" },
      { label: "#rows intersection", value: preview.value?.intersectionCount ?? "-" }
    ]);
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
      inlineTablesLoading.value = true;
      inlineTables.value = [];
      inlineSelectedTableName.value = "";
      try {
        const tables = await loadTablesForProject(project);
        inlineTables.value = tables;
        inlineSelectedTableName.value = tables.find((table) => table.allowed)?.name || "";
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
      const _component_CompareProjectSelector = _sfc_main$5;
      const _component_CommonDetailPanel = _sfc_main$7;
      const _component_CompareTableSelector = _sfc_main$4;
      const _component_CompareTableTree = _sfc_main$3;
      const _component_CommonLegacyPanel = _sfc_main$6;
      const _component_CompareStep4Compare = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}>`);
      if (!unref(isAuthenticated)) {
        _push(`<div class="auth-loading"> กำลังตรวจสอบสิทธิ์ผู้ใช้งาน... </div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(usingMock)) {
          _push(`<div class="mock-banner"> ใช้งาน Mock Service ระหว่างรอเชื่อม PHP API จริง </div>`);
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
            onPrepare: unref(prepareCompare)
          }, null, _parent));
          _push(`<aside class="side-column">`);
          _push(ssrRenderComponent(_component_CommonDetailPanel, { rows: unref(detailRows) }, null, _parent));
          _push(ssrRenderComponent(_component_CompareTableTree, {
            tables: unref(tableCatalog),
            statuses: unref(tableStatuses),
            "selected-name": unref(selectedTable)?.name,
            onSelect: unref(selectTable)
          }, null, _parent));
          _push(ssrRenderComponent(_component_CommonLegacyPanel, {
            title: "คำอธิบาย",
            compact: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="legend-list"${_scopeId}><li${_scopeId}><span class="legend warning"${_scopeId}>▲</span>ยังไม่ดำเนินการ compare</li><li${_scopeId}><span class="legend ok"${_scopeId}>✓</span>Compare แล้ว</li><li${_scopeId}><span class="legend error"${_scopeId}>✖</span>ข้อมูลทั้งสองรอบ ไม่ตรงกัน</li><li${_scopeId}><span class="legend slash"${_scopeId}>/</span>ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน</li><li${_scopeId}><span class="legend empty"${_scopeId}>□</span>ไม่มีข้อมูลทั้งสองรอบ</li></ul>`);
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
                      createTextVNode("ข้อมูลทั้งสองรอบ ไม่ตรงกัน")
                    ]),
                    createVNode("li", null, [
                      createVNode("span", { class: "legend slash" }, "/"),
                      createTextVNode("ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน")
                    ]),
                    createVNode("li", null, [
                      createVNode("span", { class: "legend empty" }, "□"),
                      createTextVNode("ไม่มีข้อมูลทั้งสองรอบ")
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
            title: "ผล",
            rows: unref(resultRows)
          }, null, _parent));
          _push(ssrRenderComponent(_component_CommonLegacyPanel, {
            title: "รายการแก้ไขรหัส",
            compact: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="small-button-stack"${_scopeId}><button type="button"${_scopeId}>-ไม่มีรายการแก้ไขรหัส-R1</button><button type="button"${_scopeId}>-ไม่มีรายการแก้ไขรหัส-R2</button></div>`);
              } else {
                return [
                  createVNode("div", { class: "small-button-stack" }, [
                    createVNode("button", { type: "button" }, "-ไม่มีรายการแก้ไขรหัส-R1"),
                    createVNode("button", { type: "button" }, "-ไม่มีรายการแก้ไขรหัส-R2")
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DgOwGUEY.js.map
