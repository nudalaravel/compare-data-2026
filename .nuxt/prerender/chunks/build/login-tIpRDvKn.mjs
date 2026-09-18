import { _ as _sfc_main$1 } from './LegacyPanel-DJJ9u9fC.mjs';
import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, isRef, vModelText, toDisplayString, useSSRContext } from 'file://E:/Project2026/compare-data/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'file://E:/Project2026/compare-data/node_modules/vue/server-renderer/index.mjs';
import { b as useRouter, a as useRoute } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const route = useRoute();
    const { login, lastError, lastErrorIcon } = useCompareWorkflow();
    const loading = ref(false);
    const username = ref("");
    const password = ref("");
    async function submit() {
      loading.value = true;
      const ok = await login({
        username: username.value,
        password: password.value
      });
      loading.value = false;
      if (!ok) {
        showLoginAlert(lastError.value, lastErrorIcon.value);
        return;
      }
      router.push(typeof route.query.redirect === "string" ? route.query.redirect : "/list");
    }
    function showLoginAlert(html, icon = "error") {
      {
        return;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_CommonLegacyPanel = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container login-page" }, _attrs))}><section class="login-wrap">`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A COMPARE DATA" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="login-form"${_scopeId}><label for="username"${_scopeId}>UserName</label><input id="username"${ssrRenderAttr("value", unref(username))} autocomplete="username"${_scopeId}><label for="password"${_scopeId}>Password</label><input id="password"${ssrRenderAttr("value", unref(password))} type="password" autocomplete="current-password" placeholder="Password"${_scopeId}><button class="btn btn-login" type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(loading) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A..." : "Login")}</button></form>`);
          } else {
            return [
              createVNode("form", {
                class: "login-form",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("label", { for: "username" }, "UserName"),
                withDirectives(createVNode("input", {
                  id: "username",
                  "onUpdate:modelValue": ($event) => isRef(username) ? username.value = $event : null,
                  autocomplete: "username"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(username)]
                ]),
                createVNode("label", { for: "password" }, "Password"),
                withDirectives(createVNode("input", {
                  id: "password",
                  "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                  type: "password",
                  autocomplete: "current-password",
                  placeholder: "Password"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(password)]
                ]),
                createVNode("button", {
                  class: "btn btn-login",
                  type: "submit",
                  disabled: unref(loading)
                }, toDisplayString(unref(loading) ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A..." : "Login"), 9, ["disabled"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
      if (unref(lastError)) {
        _push(`<p class="error-text">${(_a = unref(lastError)) != null ? _a : ""}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-tIpRDvKn.mjs.map
