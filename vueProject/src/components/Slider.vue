<template>
  <div>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="value.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span
        class="toggle-background"
        :class="backgroundStyles"
      />
      <span
        class="toggle-indicator"
        :style="indicatorStyles"
      />
    </span>
  </div>
</template>

<script>
module.exports = {
  props: {
    modelValue:{
      type: Boolean,
      required: true
    }
  },
  computed: {
    backgroundStyles() {
      return {
        'gold-mid': this.modelValue,
        'gray-lighter': !this.modelValue
      };
    },
    indicatorStyles() {
      return {transform: this.modelValue ? 'translateX(24px)' : 'translateX(0)'}
    },
    value: {
      get(){return this.modelValue}
    }
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.value);
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.gold-mid{background-color: #666666}
.gray-lighter{background-color: #c2c2c2}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 18px;
  border-radius: 9999px;
  top: 8px;
  right: 23px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 160%;
  width: 160%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color .4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 26px;
  width: 26px;
  left: 0px;
  top: 2px;
  background-color: #ffffff;
  border-radius: 9999px;
  box-shadow:  0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform .4s ease;
}
</style>