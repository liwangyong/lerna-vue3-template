<template>
  <div
    class="hook-button-box hook-flex-space"
    :class="[disabled && 'hook-button-disable']"
    @mousedown="changAssmblyType(2)"
    ref="buttonEl"
    @mouseup="changAssmblyType(1)"
    @click="handleClick"
    @mouseenter="changAssmblyType(1)"
    @mouseleave="changAssmblyType(0)"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: bgColor,
      color: textColor
    }"
  >
    <div class="hook-button-ctn">
      <div v-if="loading" class="hook-button-loading">
        <slot name="loading">
          <!-- <HookLoading color="#fff" width="16px"></HookLoading> -->
        </slot>
      </div>
      <div class="hook-button-text">
        <slot><span>按钮</span></slot>
      </div>
    </div>
    <transition-group name="moire-list" tag="ul" @after-enter="() => rippleArgs.shift()">
      <li
        v-for="(item, index) in rippleArgs"
        :key="index"
        :style="{
          top: `-${currtWidth - item.top}px`,
          left: `-${currtWidth - item.left}px`,
          width: `${currtWidth * 2}px`,
          height: `${currtWidth * 2}px`,
          borderRadius: `${currtWidth}px`,
          backgroundColor: moireColor,
          transition: `all ${duration}s`
        }"
      ></li>
    </transition-group>
  </div>
</template>
<script lang="ts">
enum CURRTTYPEENUM {
  USUAL,
  HOVER,
  PRESS
}
type DomPosition = {
  top: number;
  left: number;
};
import { computed, defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  name: "HookButton",
  props: {
    width: {
      default: 85,
      type: Number
    },
    height: {
      default: 36,
      type: Number
    },
    loading: {
      default: false,
      type: Boolean
    },
    // 平常背景色
    backgroundColor: {
      default: "rgba(0, 165, 237, 1)",
      type: String
    },
    // 文字颜色
    textColor: {
      default: "#fff",
      type: String
    },
    // hover
    hoverColor: {
      default: "rgba(103, 194, 255, 1)",
      type: String
    },
    // 按压时 背景色
    pressColor: {
      default: "rgba(0, 140, 201, 1)",
      type: String
    },
    // 波浪
    moireColor: {
      default: "rgba(0, 140, 201, 1)",
      type: String
    },
    duration: {
      default: 1.2,
      type: Number
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  components: {
    // HookLoading
  },
  emits: ["click"],
  setup(prop, { emit }) {
    const assemblyType = ref<CURRTTYPEENUM>(CURRTTYPEENUM.USUAL);
    const rippleArgs = ref<Array<DomPosition>>([]);
    const buttonEl = ref(null);
    const currtWidth = ref(0);
    const bgColor = computed((): string => {
      switch (assemblyType.value) {
        case CURRTTYPEENUM.USUAL:
          return prop.backgroundColor;
        case CURRTTYPEENUM.HOVER:
          return prop.hoverColor;
        case CURRTTYPEENUM.PRESS:
          return prop.pressColor;
      }
    });
    const handleClick = (e: MouseEvent) => {
      if (prop.disabled) return;
      const { offsetY: top, offsetX: left } = e;
      rippleArgs.value.push({
        top,
        left
      });
      emit("click", e);
    };
    const changAssmblyType = (type: CURRTTYPEENUM) => {
      assemblyType.value = type;
    };
    onMounted(() => {
      currtWidth.value = buttonEl.value.clientWidth;
    });
    return {
      assemblyType,
      bgColor,
      buttonEl,
      changAssmblyType,
      currtWidth,
      rippleArgs,
      handleClick
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hook-button-disable {
  cursor: not-allowed !important;
  border: 1px solid #c8c9cc;
  color: skyblue !important;
  background: transparent !important;
  transition: all 0.3s;
}
.hook-button-box {
  user-select: none;
  border-radius: 3px;
  padding: 0px 6px;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: inline-block;
  pointer-events: auto;
  transition: all 0.3s;
  .hook-button-ctn {
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: space-around;
    justify-content: center;
    pointer-events: none;
    transform: translate(-50%, -50%);
    position: absolute;
    .hook-button-text {
      display: flex;
      align-items: center;
    }
    .hook-button-loading {
      display: flex;
      margin-right: 6px;
      align-items: center;
    }
  }
}
ul {
  top: 0;
  left: 0;
  width: 0;
  padding: 0;
  margin: 0;
  height: 0;
  z-index: 1;
  position: absolute;
}
li {
  pointer-events: none;
  list-style: none;
  position: absolute;
  opacity: 0;
  transform: scale(1);
  transform-origin: center center;
  z-index: 1;
}
.moire-list-enter-from {
  transform: scale(0.01);
  opacity: 1;
  transform-origin: center center;
}
</style>
