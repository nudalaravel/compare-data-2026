globalThis.__timing__.logStart('Load chunks/build/admin-DoLactuq');import { _ as _sfc_main$2 } from './LegacyPanel-DJJ9u9fC.mjs';
import { mergeProps, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, reactive, withModifiers, withDirectives, vModelText, vModelCheckbox, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
  __name: "AdminProjectForm",
  __ssrInlineRender: true,
  emits: ["add"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const form = reactive({
      code: "",
      displayName: "",
      rawDatabase: "",
      cmpDatabase: "",
      roundField: "round",
      active: false
    });
    function submit() {
      if (!form.code || !form.displayName || !form.rawDatabase) {
        return;
      }
      emit("add", { ...form });
      Object.assign(form, {
        code: "",
        displayName: "",
        rawDatabase: "",
        cmpDatabase: "",
        roundField: "round",
        active: false
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({ title: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E43\u0E2B\u0E21\u0E48" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="admin-form"${_scopeId}><label${_scopeId}>Project Code *</label><input${ssrRenderAttr("value", unref(form).code)} placeholder="\u0E40\u0E0A\u0E48\u0E19 TCLS2026_CH1"${_scopeId}><label${_scopeId}>\u0E0A\u0E37\u0E48\u0E2D\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07 *</label><input${ssrRenderAttr("value", unref(form).displayName)} placeholder="Children Baseline 2026 (CH1)"${_scopeId}><label${_scopeId}>\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07 (_raw) *</label><input${ssrRenderAttr("value", unref(form).rawDatabase)} placeholder="tcls2026_ch1_raw"${_scopeId}><label${_scopeId}>\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Compare (_cmp)</label><input${ssrRenderAttr("value", unref(form).cmpDatabase)} placeholder="\u0E40\u0E27\u0E49\u0E19\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34"${_scopeId}><div class="form-grid"${_scopeId}><span${_scopeId}><label${_scopeId}>Round Field</label><input${ssrRenderAttr("value", unref(form).roundField)}${_scopeId}></span><label class="switch-row"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).active) ? ssrLooseContain(unref(form).active, null) : unref(form).active) ? " checked" : ""} type="checkbox"${_scopeId}> \u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08 Schema </label></div><div class="admin-note"${_scopeId}><strong${_scopeId}>\u0E2B\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</strong><p${_scopeId}>\u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E14\u0E2A\u0E2D\u0E1A connection, scan \u0E15\u0E32\u0E23\u0E32\u0E07, \u0E15\u0E23\u0E27\u0E08 Primary Key, \u0E15\u0E31\u0E49\u0E07 allowlist \u0E41\u0E25\u0E30\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07</p></div><button class="btn btn-success wide" type="submit"${_scopeId}>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A Schema</button></form>`);
          } else {
            return [
              createVNode("form", {
                class: "admin-form",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("label", null, "Project Code *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).code = $event,
                  placeholder: "\u0E40\u0E0A\u0E48\u0E19 TCLS2026_CH1"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).code]
                ]),
                createVNode("label", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07 *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).displayName = $event,
                  placeholder: "Children Baseline 2026 (CH1)"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).displayName]
                ]),
                createVNode("label", null, "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07 (_raw) *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).rawDatabase = $event,
                  placeholder: "tcls2026_ch1_raw"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).rawDatabase]
                ]),
                createVNode("label", null, "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Compare (_cmp)"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).cmpDatabase = $event,
                  placeholder: "\u0E40\u0E27\u0E49\u0E19\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).cmpDatabase]
                ]),
                createVNode("div", { class: "form-grid" }, [
                  createVNode("span", null, [
                    createVNode("label", null, "Round Field"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).roundField = $event
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).roundField]
                    ])
                  ]),
                  createVNode("label", { class: "switch-row" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).active = $event,
                      type: "checkbox"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, unref(form).active]
                    ]),
                    createTextVNode(" \u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08 Schema ")
                  ])
                ]),
                createVNode("div", { class: "admin-note" }, [
                  createVNode("strong", null, "\u0E2B\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01"),
                  createVNode("p", null, "\u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E14\u0E2A\u0E2D\u0E1A connection, scan \u0E15\u0E32\u0E23\u0E32\u0E07, \u0E15\u0E23\u0E27\u0E08 Primary Key, \u0E15\u0E31\u0E49\u0E07 allowlist \u0E41\u0E25\u0E30\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07")
                ]),
                createVNode("button", {
                  class: "btn btn-success wide",
                  type: "submit"
                }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A Schema")
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminProjectForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { projects, addAdminProject } = useCompareWorkflow();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}><div class="report-head"><div><h1 class="page-title">Administrator</h1><p class="updated">\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C \u0E15\u0E32\u0E23\u0E32\u0E07 allowlist, Primary Key \u0E41\u0E25\u0E30\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</p></div><span class="status-pill ok">\u0E23\u0E30\u0E1A\u0E1A\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span></div><div class="admin-grid">`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="admin-project-list"${_scopeId}><!--[-->`);
            ssrRenderList(unref(projects), (project) => {
              _push2(`<article class="admin-project-row"${_scopeId}><span class="${ssrRenderClass(["project-color", project.color])}"${_scopeId}></span><div${_scopeId}><strong${_scopeId}>${ssrInterpolate(project.displayName)}</strong><small${_scopeId}>${ssrInterpolate(project.code)} \xB7 ${ssrInterpolate(project.rawDatabase)} \u2192 ${ssrInterpolate(project.cmpDatabase)}</small></div><em${_scopeId}>${ssrInterpolate(project.active ? "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" : "\u0E1B\u0E34\u0E14")}</em><button type="button" class="btn btn-light"${_scopeId}>\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32</button></article>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "admin-project-list" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(projects), (project) => {
                  return openBlock(), createBlock("article", {
                    key: project.id,
                    class: "admin-project-row"
                  }, [
                    createVNode("span", {
                      class: ["project-color", project.color]
                    }, null, 2),
                    createVNode("div", null, [
                      createVNode("strong", null, toDisplayString(project.displayName), 1),
                      createVNode("small", null, toDisplayString(project.code) + " \xB7 " + toDisplayString(project.rawDatabase) + " \u2192 " + toDisplayString(project.cmpDatabase), 1)
                    ]),
                    createVNode("em", null, toDisplayString(project.active ? "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" : "\u0E1B\u0E34\u0E14"), 1),
                    createVNode("button", {
                      type: "button",
                      class: "btn btn-light"
                    }, "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32")
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { onAdd: unref(addAdminProject) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "Security Checklist" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="security-list"${_scopeId}><li${_scopeId}>\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E25\u0E30\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19 Metadata/Allowlist \u0E01\u0E48\u0E2D\u0E19\u0E19\u0E33\u0E44\u0E1B\u0E2A\u0E23\u0E49\u0E32\u0E07 SQL</li><li${_scopeId}>API \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25 Update \u0E40\u0E09\u0E1E\u0E32\u0E30\u0E10\u0E32\u0E19 \`_cmp\` \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48 Update \u0E10\u0E32\u0E19 \`_raw\`</li><li${_scopeId}>Correction log \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E1A\u0E1A append-only \u0E25\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07 \`chk_user\` \u0E43\u0E19\u0E10\u0E32\u0E19 \`_cmp\` \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49 \u0E40\u0E27\u0E25\u0E32 \u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21 \u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</li><li${_scopeId}>\u0E43\u0E0A\u0E49 \`.env\` \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A credential \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E25\u0E07 repository</li></ul>`);
          } else {
            return [
              createVNode("ul", { class: "security-list" }, [
                createVNode("li", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E25\u0E30\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19 Metadata/Allowlist \u0E01\u0E48\u0E2D\u0E19\u0E19\u0E33\u0E44\u0E1B\u0E2A\u0E23\u0E49\u0E32\u0E07 SQL"),
                createVNode("li", null, "API \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25 Update \u0E40\u0E09\u0E1E\u0E32\u0E30\u0E10\u0E32\u0E19 `_cmp` \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48 Update \u0E10\u0E32\u0E19 `_raw`"),
                createVNode("li", null, "Correction log \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E1A\u0E1A append-only \u0E25\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07 `chk_user` \u0E43\u0E19\u0E10\u0E32\u0E19 `_cmp` \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49 \u0E40\u0E27\u0E25\u0E32 \u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21 \u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01"),
                createVNode("li", null, "\u0E43\u0E0A\u0E49 `.env` \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A credential \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E25\u0E07 repository")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
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

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/admin-DoLactuq');
//# sourceMappingURL=admin-DoLactuq.mjs.map
