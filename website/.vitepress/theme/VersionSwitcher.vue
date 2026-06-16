<template>
  <div class="version-switcher">
    <select class="version-select" @change="navigate">
      <option value="" disabled selected>v1.2 (current)</option>
      <option value="v1.1">v1.1</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
const { site } = useData();
function navigate(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  if (val === 'v1.1') {
    window.location.href = window.location.origin + site.value.base + 'v1.1/';
  }
}
</script>

<style scoped>
.version-switcher {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.version-select {
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand);
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--vp-c-brand-dark);
  appearance: none;
  -webkit-appearance: none;
}
.version-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}
</style>
