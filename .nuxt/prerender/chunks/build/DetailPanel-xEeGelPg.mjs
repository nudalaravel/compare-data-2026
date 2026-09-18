import { _ as _sfc_main$1 } from './LegacyPanel-DJJ9u9fC.mjs';
import { mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'file://E:/Project2026/compare-data/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'file://E:/Project2026/compare-data/node_modules/vue/server-renderer/index.mjs';

const _sfc_main = {
  __name: "DetailPanel",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" },
    rows: { type: Array, default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLegacyPanel = _sfc_main$1;
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({
        title: __props.title,
        compact: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="detail-list"${_scopeId}><!--[-->`);
            ssrRenderList(__props.rows, (row) => {
              _push2(`<div class="detail-row"${_scopeId}><span class="detail-label"${_scopeId}>${ssrInterpolate(row.label)}</span><span class="detail-value"${_scopeId}>${ssrInterpolate(row.value || "-")}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "detail-list" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.rows, (row) => {
                  return openBlock(), createBlock("div", {
                    key: row.label,
                    class: "detail-row"
                  }, [
                    createVNode("span", { class: "detail-label" }, toDisplayString(row.label), 1),
                    createVNode("span", { class: "detail-value" }, toDisplayString(row.value || "-"), 1)
                  ]);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/DetailPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=DetailPanel-xEeGelPg.mjs.map
