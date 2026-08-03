import { _ as _sfc_main$1 } from "./LegacyPanel-DJJ9u9fC.js";
import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, isRef, vModelText, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import "E:/Project2026/compare-data/node_modules/hookable/dist/index.mjs";
import { b as useRouter, a as useRoute } from "../server.mjs";
import { u as useCompareWorkflow } from "./useCompareWorkflow-DCC0rYzR.js";
import "E:/Project2026/compare-data/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/Project2026/compare-data/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/h3/dist/index.mjs";
import "pinia";
import "E:/Project2026/compare-data/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "E:/Project2026/compare-data/node_modules/ufo/dist/index.mjs";
import "E:/Project2026/compare-data/node_modules/klona/dist/index.mjs";
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
      const _component_CommonLegacyPanel = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container login-page" }, _attrs))}><section class="login-wrap">`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "เข้าสู่ระบบ COMPARE DATA" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="login-form"${_scopeId}><label for="username"${_scopeId}>UserName</label><input id="username"${ssrRenderAttr("value", unref(username))} autocomplete="username"${_scopeId}><label for="password"${_scopeId}>Password</label><input id="password"${ssrRenderAttr("value", unref(password))} type="password" autocomplete="current-password" placeholder="Password"${_scopeId}><button class="btn btn-login" type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(loading) ? "กำลังเข้าสู่ระบบ..." : "Login")}</button></form>`);
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
                }, toDisplayString(unref(loading) ? "กำลังเข้าสู่ระบบ..." : "Login"), 9, ["disabled"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
      if (unref(lastError)) {
        _push(`<p class="error-text">${unref(lastError) ?? ""}</p>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=login-tIpRDvKn.js.map
