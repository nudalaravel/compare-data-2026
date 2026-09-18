import { mergeProps, useSSRContext } from 'file://E:/Project2026/compare-data/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'file://E:/Project2026/compare-data/node_modules/vue/server-renderer/index.mjs';

const _sfc_main = {
  __name: "LegacyPanel",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    badge: { type: String, default: "" },
    compact: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["legacy-panel", { compact: __props.compact }]
      }, _attrs))}><header class="legacy-panel-head"><h2>${ssrInterpolate(__props.title)}</h2>`);
      if (__props.badge) {
        _push(`<span class="panel-badge">${ssrInterpolate(__props.badge)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="legacy-panel-body">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/LegacyPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=LegacyPanel-DJJ9u9fC.mjs.map
