<script setup lang="ts">
import { computed } from 'vue';
import { EDIT_BREAKPOINTS, type Breakpoint } from '../types/block';

const props = defineProps<{ active: Breakpoint }>();

const label = computed(
  () => EDIT_BREAKPOINTS.find((b) => b.key === props.active)?.label ?? 'Unknown',
);
</script>

<template>
  <span
    class="breakpoint-badge"
    :data-breakpoint="active"
  >
    {{ label }}
  </span>
</template>
