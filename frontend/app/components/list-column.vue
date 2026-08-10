<script setup>
defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="bg-gray-900 rounded-xl p-3">
    <div class="flex items-center justify-between mb-3">
      <p class="font-medium text-sm text-gray-100">{{ title }}</p>
      <span class="text-xs text-gray-500">{{ tasks.length }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </div>

    <UButton
      label="Adicionar cartão"
      icon="i-lucide-plus"
      variant="ghost"
      color="neutral"
      size="sm"
      class="w-full justify-start mt-2 text-gray-500"
    />
  </div>
</template>
