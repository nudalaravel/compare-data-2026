import { _ as _sfc_main$2 } from "./LegacyPanel-DJJ9u9fC.js";
import { reactive, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, vModelText, vModelCheckbox, createTextVNode, useSSRContext, openBlock, createBlock, Fragment, renderList, toDisplayString } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
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
      _push(ssrRenderComponent(_component_CommonLegacyPanel, mergeProps({ title: "เพิ่มโปรเจกต์ใหม่" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="admin-form"${_scopeId}><label${_scopeId}>Project Code *</label><input${ssrRenderAttr("value", unref(form).code)} placeholder="เช่น TCLS2026_CH1"${_scopeId}><label${_scopeId}>ชื่อที่แสดง *</label><input${ssrRenderAttr("value", unref(form).displayName)} placeholder="Children Baseline 2026 (CH1)"${_scopeId}><label${_scopeId}>ฐานข้อมูลต้นทาง (_raw) *</label><input${ssrRenderAttr("value", unref(form).rawDatabase)} placeholder="tcls2026_ch1_raw"${_scopeId}><label${_scopeId}>ฐานข้อมูล Compare (_cmp)</label><input${ssrRenderAttr("value", unref(form).cmpDatabase)} placeholder="เว้นว่างเพื่อใช้ชื่ออัตโนมัติ"${_scopeId}><div class="form-grid"${_scopeId}><span${_scopeId}><label${_scopeId}>Round Field</label><input${ssrRenderAttr("value", unref(form).roundField)}${_scopeId}></span><label class="switch-row"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).active) ? ssrLooseContain(unref(form).active, null) : unref(form).active) ? " checked" : ""} type="checkbox"${_scopeId}> เปิดใช้งานหลังตรวจ Schema </label></div><div class="admin-note"${_scopeId}><strong${_scopeId}>หลังบันทึก</strong><p${_scopeId}>ระบบต้องทดสอบ connection, scan ตาราง, ตรวจ Primary Key, ตั้ง allowlist และกำหนดสิทธิ์ผู้ใช้ก่อนเปิดใช้งานจริง</p></div><button class="btn btn-success wide" type="submit"${_scopeId}>บันทึกและตรวจสอบ Schema</button></form>`);
          } else {
            return [
              createVNode("form", {
                class: "admin-form",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("label", null, "Project Code *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).code = $event,
                  placeholder: "เช่น TCLS2026_CH1"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).code]
                ]),
                createVNode("label", null, "ชื่อที่แสดง *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).displayName = $event,
                  placeholder: "Children Baseline 2026 (CH1)"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).displayName]
                ]),
                createVNode("label", null, "ฐานข้อมูลต้นทาง (_raw) *"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).rawDatabase = $event,
                  placeholder: "tcls2026_ch1_raw"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(form).rawDatabase]
                ]),
                createVNode("label", null, "ฐานข้อมูล Compare (_cmp)"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).cmpDatabase = $event,
                  placeholder: "เว้นว่างเพื่อใช้ชื่ออัตโนมัติ"
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
                    createTextVNode(" เปิดใช้งานหลังตรวจ Schema ")
                  ])
                ]),
                createVNode("div", { class: "admin-note" }, [
                  createVNode("strong", null, "หลังบันทึก"),
                  createVNode("p", null, "ระบบต้องทดสอบ connection, scan ตาราง, ตรวจ Primary Key, ตั้ง allowlist และกำหนดสิทธิ์ผู้ใช้ก่อนเปิดใช้งานจริง")
                ]),
                createVNode("button", {
                  class: "btn btn-success wide",
                  type: "submit"
                }, "บันทึกและตรวจสอบ Schema")
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
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "legacy-container content-page" }, _attrs))}><div class="report-head"><div><h1 class="page-title">Administrator</h1><p class="updated">จัดการโปรเจกต์ ตาราง allowlist, Primary Key และสิทธิ์ผู้ใช้งาน</p></div><span class="status-pill ok">ระบบพร้อมใช้งาน</span></div><div class="admin-grid">`);
      _push(ssrRenderComponent(_component_CommonLegacyPanel, { title: "โปรเจกต์ทั้งหมด" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="admin-project-list"${_scopeId}><!--[-->`);
            ssrRenderList(unref(projects), (project) => {
              _push2(`<article class="admin-project-row"${_scopeId}><span class="${ssrRenderClass(["project-color", project.color])}"${_scopeId}></span><div${_scopeId}><strong${_scopeId}>${ssrInterpolate(project.displayName)}</strong><small${_scopeId}>${ssrInterpolate(project.code)} · ${ssrInterpolate(project.rawDatabase)} → ${ssrInterpolate(project.cmpDatabase)}</small></div><em${_scopeId}>${ssrInterpolate(project.active ? "เปิดใช้งาน" : "ปิด")}</em><button type="button" class="btn btn-light"${_scopeId}>ตั้งค่า</button></article>`);
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
                      createVNode("small", null, toDisplayString(project.code) + " · " + toDisplayString(project.rawDatabase) + " → " + toDisplayString(project.cmpDatabase), 1)
                    ]),
                    createVNode("em", null, toDisplayString(project.active ? "เปิดใช้งาน" : "ปิด"), 1),
                    createVNode("button", {
                      type: "button",
                      class: "btn btn-light"
                    }, "ตั้งค่า")
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
            _push2(`<ul class="security-list"${_scopeId}><li${_scopeId}>ชื่อตารางและคอลัมน์ต้องผ่าน Metadata/Allowlist ก่อนนำไปสร้าง SQL</li><li${_scopeId}>API บันทึกผล Update เฉพาะฐาน \`_cmp\` และไม่ Update ฐาน \`_raw\`</li><li${_scopeId}>Correction log บันทึกแบบ append-only ลงตาราง \`chk_user\` ในฐาน \`_cmp\` พร้อมผู้ใช้ เวลา ค่าเดิม และค่าที่เลือก</li><li${_scopeId}>ใช้ \`.env\` สำหรับ credential และไม่เก็บรหัสผ่านลง repository</li></ul>`);
          } else {
            return [
              createVNode("ul", { class: "security-list" }, [
                createVNode("li", null, "ชื่อตารางและคอลัมน์ต้องผ่าน Metadata/Allowlist ก่อนนำไปสร้าง SQL"),
                createVNode("li", null, "API บันทึกผล Update เฉพาะฐาน `_cmp` และไม่ Update ฐาน `_raw`"),
                createVNode("li", null, "Correction log บันทึกแบบ append-only ลงตาราง `chk_user` ในฐาน `_cmp` พร้อมผู้ใช้ เวลา ค่าเดิม และค่าที่เลือก"),
                createVNode("li", null, "ใช้ `.env` สำหรับ credential และไม่เก็บรหัสผ่านลง repository")
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
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-DoLactuq.js.map
