import { _ as _sfc_main$2 } from "./LegacyPanel-DJJ9u9fC.js";
import { mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext, ref, computed, unref, withDirectives, isRef, vModelText } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { u as useCompareWorkflow } from "./useCompareWorkflow-DCC0rYzR.js";
import "../server.mjs";
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
const _sfc_main$1 = {
  __name: "AuditLogTable",
  __ssrInlineRender: true,
  props: {
    logs: { type: Array, default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({ title: "Audit Log ล่าสุด" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="audit-table-wrap"${_scopeId}><table class="audit-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>วันเวลา</th><th${_scopeId}>ผู้ใช้</th><th${_scopeId}>Project/Table</th><th${_scopeId}>Primary Key</th><th${_scopeId}>Column</th><th${_scopeId}>Round 1</th><th${_scopeId}>Round 2</th><th${_scopeId}>ค่าที่เลือก</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.logs, (log) => {
              _push2(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(log.changedAt)}</td><td${_scopeId}>${ssrInterpolate(log.user)}</td><td${_scopeId}>${ssrInterpolate(log.projectId)} / ${ssrInterpolate(log.tableName)}</td><td${_scopeId}>${ssrInterpolate(log.primaryKey)}</td><td${_scopeId}>${ssrInterpolate(log.columnName)}</td><td${_scopeId}>${ssrInterpolate(log.round1Value || "-")}</td><td${_scopeId}>${ssrInterpolate(log.round2Value || "-")}</td><td${_scopeId}><strong${_scopeId}>${ssrInterpolate(log.selectedValue || "-")}</strong><small${_scopeId}>${ssrInterpolate(log.source)}</small></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "audit-table-wrap" }, [
                createVNode("table", { class: "audit-table" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", null, "วันเวลา"),
                      createVNode("th", null, "ผู้ใช้"),
                      createVNode("th", null, "Project/Table"),
                      createVNode("th", null, "Primary Key"),
                      createVNode("th", null, "Column"),
                      createVNode("th", null, "Round 1"),
                      createVNode("th", null, "Round 2"),
                      createVNode("th", null, "ค่าที่เลือก")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.logs, (log) => {
                      return openBlock(), createBlock("tr", {
                        key: `${log.id}-${log.columnName}`
                      }, [
                        createVNode("td", null, toDisplayString(log.changedAt), 1),
                        createVNode("td", null, toDisplayString(log.user), 1),
                        createVNode("td", null, toDisplayString(log.projectId) + " / " + toDisplayString(log.tableName), 1),
                        createVNode("td", null, toDisplayString(log.primaryKey), 1),
                        createVNode("td", null, toDisplayString(log.columnName), 1),
                        createVNode("td", null, toDisplayString(log.round1Value || "-"), 1),
                        createVNode("td", null, toDisplayString(log.round2Value || "-"), 1),
                        createVNode("td", null, [
                          createVNode("strong", null, toDisplayString(log.selectedValue || "-"), 1),
                          createVNode("small", null, toDisplayString(log.source), 1)
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/report/AuditLogTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "report",
  __ssrInlineRender: true,
  setup(__props) {
    const { auditLogs, records, comparedCount } = useCompareWorkflow();
    const query = ref("");
    const filteredLogs = computed(() => {
      const term = query.value.trim().toLowerCase();
      if (!term) {
        return auditLogs.value;
      }
      return auditLogs.value.filter((log) => [
        log.projectId,
        log.tableName,
        log.primaryKey,
        log.columnName,
        log.user,
        log.changedAt
      ].some((value) => String(value || "").toLowerCase().includes(term)));
    });
    const stats = computed(() => {
      const total = records.value.length || 128;
      const done = records.value.length ? comparedCount.value : 106;
      return [
        { label: "จำนวนรหัสทั้งหมด", value: total, note: "รหัส" },
        { label: "Compare เสร็จแล้ว", value: done, note: `${Math.round(done / total * 100)}%`, tone: "ok" },
        { label: "ยังรอตรวจ", value: total - done, note: "รหัส", tone: "warn" },
        { label: "Audit Log", value: auditLogs.value.length, note: "รายการ" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      const _component_ReportAuditLogTable = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}><div class="report-head"><div><h1 class="page-title">รายงานผล</h1><p class="updated">ตรวจสอบความคืบหน้าและประวัติการแก้ไขข้อมูล</p></div><button class="btn btn-gray" type="button">Export CSV</button></div><div class="stat-grid"><!--[-->`);
      ssrRenderList(unref(stats), (item) => {
        _push(`<div class="${ssrRenderClass(["stat-box", item.tone])}"><span>${ssrInterpolate(item.label)}</span><strong>${ssrInterpolate(item.value)}</strong><small>${ssrInterpolate(item.note)}</small></div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "ค้นหา" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="search-line"${_scopeId}><span class="input-prefix"${_scopeId}>SEARCH :</span><input${ssrRenderAttr("value", unref(query))} placeholder="รหัส / ผู้ใช้งาน / ตัวแปร / วันที่"${_scopeId}><button class="btn btn-gray" type="button"${_scopeId}>Search</button></div>`);
          } else {
            return [
              createVNode("div", { class: "search-line" }, [
                createVNode("span", { class: "input-prefix" }, "SEARCH :"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => isRef(query) ? query.value = $event : null,
                  placeholder: "รหัส / ผู้ใช้งาน / ตัวแปร / วันที่"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(query)]
                ]),
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
      _push(ssrRenderComponent(_component_ReportAuditLogTable, { logs: unref(filteredLogs) }, null, _parent));
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=report-fr-Kl507.js.map
