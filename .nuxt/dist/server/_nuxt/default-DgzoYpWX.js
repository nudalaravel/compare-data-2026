import { _ as __nuxt_component_0 } from "./nuxt-link-DIiCkb4O.js";
import { mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { a as useRoute, u as useRuntimeConfig } from "../server.mjs";
import { u as useCompareWorkflow } from "./useCompareWorkflow-DCC0rYzR.js";
import "E:/Project2026/compare-data/node_modules/ufo/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/defu/dist/defu.mjs";
import "E:/Project2026/compare-data/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/Project2026/compare-data/node_modules/hookable/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "E:/Project2026/compare-data/node_modules/klona/dist/index.mjs";
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
      { to: "/report", label: "รายงานผล" },
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
        _push(`<button type="button">ออกจากระบบ</button>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/login" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`เข้าสู่ระบบ`);
            } else {
              return [
                createTextVNode("เข้าสู่ระบบ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</nav></div></header>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<footer class="legacy-footer"><span> © 2019–${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} RIPED. สงวนลิขสิทธิ์ | เวอร์ชัน ${ssrInterpolate(unref(version))}</span></footer></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-DgzoYpWX.js.map
