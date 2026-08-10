<script setup>
defineProps({
  task: { type: Object, required: true },
})
</script>

<template>
  <div
    class="bg-gray-800 border rounded-xl px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors"
    :class="task.done ? 'border-gray-800 opacity-60' : 'border-gray-800'"
  >
    <p
      class="text-sm text-gray-100"
      :class="{ 'line-through': task.done }"
    >
      {{ task.title }}
    </p>
    <p v-if="task.description" class="text-xs text-gray-500 mt-1">
      {{ task.description }}
    </p>
  </div>
</template>