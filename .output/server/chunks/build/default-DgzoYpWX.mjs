import { _ as __nuxt_component_0 } from './nuxt-link-DIiCkb4O.mjs';
import { mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { a as useRoute, u as useRuntimeConfig } from './server.mjs';
import { u as useCompareWorkflow } from './useCompareWorkflow-DCC0rYzR.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const { user } = useCompareWorkflow();
    const version = config.public.appVersion || "1.0.0";
    const navItems = [
      { to: "/list", label: "Survey List" },
      { to: "/", label: "Compare" },
      { to: "/report", label: "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E1C\u0E25" },
      { to: "/admin", label: "Administrator" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "legacy-shell" }, _attrs))}><header class="legacy-topbar"><div class="legacy-container topbar-inner">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "legacy-brand",
        to: "/list"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`COMPARE DATA`);
          } else {
            return [
              createTextVNode("COMPARE DATA")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="legacy-nav" aria-label="Main navigation"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          class: { active: unref(route).path === item.to },
          to: item.to
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      if (unref(user)) {
        _push(`<button type="button">\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A</button>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/login" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A`);
            } else {
              return [
                createTextVNode("\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</nav></div></header>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<footer class="legacy-footer"><span> \xA9 2019\u2013${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} RIPED. \u0E2A\u0E07\u0E27\u0E19\u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C | \u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19 ${ssrInterpolate(unref(version))}</span></footer></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DgzoYpWX.mjs.map
