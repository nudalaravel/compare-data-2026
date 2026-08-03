globalThis.__timing__.logStart('Load chunks/build/login-tIpRDvKn');import { _ as _sfc_main$1 } from './LegacyPanel-DJJ9u9fC.mjs';
import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, isRef, vModelText, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { b as useRouter, a as useRoute } from './server.mjs';
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

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/login-tIpRDvKn');
//# sourceMappingURL=login-tIpRDvKn.mjs.map
