<script setup>
const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['task-renamed'])

const editingTitle = ref(false)
const draftTitle = ref(props.task.title)

watch(() => props.task.title, (newTitle) => {
  draftTitle.value = newTitle
  editingTitle.value = false
})

function startEdit() {
  draftTitle.value = props.task.title
  editingTitle.value = true
}

function cancelEdit() {
  draftTitle.value = props.task.title
  editingTitle.value = false
}

async function saveTitle() {
  const title = draftTitle.value.trim()

  if (!title || title === props.task.title) {
    cancelEdit()
    return
  }

  try {
    await $fetch(`http://localhost:8000/cards/${props.task.id}`, {
      method: 'PATCH',
      body: { title },
    })
    editingTitle.value = false
    emit('task-renamed')
  } catch (err) {
    console.error('Erro ao renomear cartão:', err)
  }
}
</script>

<template>
  <div
    class="bg-gray-800 border rounded-xl px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors"
    :class="task.done ? 'border-gray-800 opacity-60' : 'border-gray-800'"
  >
    <div v-if="editingTitle" class="flex flex-col gap-2">
      <UInput
        v-model="draftTitle"
        autofocus
        @keyup.enter="saveTitle"
        @keyup.esc="cancelEdit"
      />
      <div class="flex gap-2">
        <UButton type="button" label="Guardar" size="sm" @click="saveTitle" />
        <UButton type="button" label="Cancelar" size="sm" variant="ghost" color="neutral" @click="cancelEdit" />
      </div>
    </div>

    <div v-else class="flex items-start justify-between gap-2">
      <div class="flex-1">
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

      <UButton
        type="button"
        icon="i-lucide-pencil"
        size="xs"
        variant="ghost"
        color="neutral"
        class="shrink-0"
        @click="startEdit"
      />
    </div>
  </div>
</template>