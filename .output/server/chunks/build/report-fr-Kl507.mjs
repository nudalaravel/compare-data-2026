globalThis.__timing__.logStart('Load chunks/build/report-fr-Kl507');import { _ as _sfc_main$2 } from './LegacyPanel-DJJ9u9fC.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, withDirectives, isRef, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { u as useCompareWorkflow } from './useCompareWorkflow-DCC0rYzR.mjs';
import './server.mjs';
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

const _sfc_main$1 = {
  __name: "AuditLogTable",
  __ssrInlineRender: true,
  props: {
    logs: { type: Array, default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({ title: "Audit Log \u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="audit-table-wrap"${_scopeId}><table class="audit-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32</th><th${_scopeId}>\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49</th><th${_scopeId}>Project/Table</th><th${_scopeId}>Primary Key</th><th${_scopeId}>Column</th><th${_scopeId}>Round 1</th><th${_scopeId}>Round 2</th><th${_scopeId}>\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</th></tr></thead><tbody${_scopeId}><!--[-->`);
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
                      createVNode("th", null, "\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32"),
                      createVNode("th", null, "\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49"),
                      createVNode("th", null, "Project/Table"),
                      createVNode("th", null, "Primary Key"),
                      createVNode("th", null, "Column"),
                      createVNode("th", null, "Round 1"),
                      createVNode("th", null, "Round 2"),
                      createVNode("th", null, "\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01")
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
        { label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", value: total, note: "\u0E23\u0E2B\u0E31\u0E2A" },
        { label: "Compare \u0E40\u0E2A\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27", value: done, note: `${Math.round(done / total * 100)}%`, tone: "ok" },
        { label: "\u0E22\u0E31\u0E07\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08", value: total - done, note: "\u0E23\u0E2B\u0E31\u0E2A", tone: "warn" },
        { label: "Audit Log", value: auditLogs.value.length, note: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      const _component_ReportAuditLogTable = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}><div class="report-head"><div><h1 class="page-title">\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E1C\u0E25</h1><p class="updated">\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E04\u0E37\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</p></div><button class="btn btn-gray" type="button">Export CSV</button></div><div class="stat-grid"><!--[-->`);
      ssrRenderList(unref(stats), (item) => {
        _push(`<div class="${ssrRenderClass(["stat-box", item.tone])}"><span>${ssrInterpolate(item.label)}</span><strong>${ssrInterpolate(item.value)}</strong><small>${ssrInterpolate(item.note)}</small></div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E04\u0E49\u0E19\u0E2B\u0E32" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="search-line"${_scopeId}><span class="input-prefix"${_scopeId}>SEARCH :</span><input${ssrRenderAttr("value", unref(query))} placeholder="\u0E23\u0E2B\u0E31\u0E2A / \u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 / \u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 / \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48"${_scopeId}><button class="btn btn-gray" type="button"${_scopeId}>Search</button></div>`);
          } else {
            return [
              createVNode("div", { class: "search-line" }, [
                createVNode("span", { class: "input-prefix" }, "SEARCH :"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => isRef(query) ? query.value = $event : null,
                  placeholder: "\u0E23\u0E2B\u0E31\u0E2A / \u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 / \u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 / \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48"
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

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/report-fr-Kl507');
//# sourceMappingURL=report-fr-Kl507.mjs.map
