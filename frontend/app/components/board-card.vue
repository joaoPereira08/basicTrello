<script setup>
defineProps({
  board: { type: Object, required: true },
})
</script>

<template>
  <NuxtLink :to="`/board/${board.id}`">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
      <p class="font-medium text-gray-100">{{ board.title }}</p>
      <p class="text-xs text-gray-500 mt-1">
        {{ board.lists?.length ?? 0 }} listas
      </p>
    </div>
  </NuxtLink>
</template>