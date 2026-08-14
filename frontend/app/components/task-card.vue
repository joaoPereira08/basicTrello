<script setup>
const apiBase = useRuntimeConfig().public.apiBase

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['task-renamed'])

const editingTitle = ref(false)
const draftTitle = ref(props.task.title)

const descOpen = ref(false)
const draftDescription = ref(props.task.description || '')
const savingDescription = ref(false)

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
    await $fetch(`${apiBase}/cards/${props.task.id}`, {
      method: 'PATCH',
      body: { title },
    })
    editingTitle.value = false
    emit('task-renamed')
  } catch (err) {
    console.error('Erro ao renomear cartão:', err)
  }
}

function openDescription() {
  if (editingTitle.value) return
  draftDescription.value = props.task.description || ''
  descOpen.value = true
}

async function saveDescription() {
  savingDescription.value = true
  try {
    await $fetch(`${apiBase}/cards/${props.task.id}`, {
      method: 'PATCH',
      body: { description: draftDescription.value },
    })
    descOpen.value = false
    emit('task-renamed')
  } catch (err) {
    console.error('Erro ao guardar descrição:', err)
  } finally {
    savingDescription.value = false
  }
}

async function deleteTask() {
  if (!confirm(`Eliminar o cartão "${props.task.title}"?`)) return
  try {
    await $fetch(`${apiBase}/cards/${props.task.id}`, { method: 'DELETE' })
    descOpen.value = false
    emit('task-renamed')
  } catch (err) {
    console.error('Erro ao eliminar cartão:', err)
  }
}
</script>

<template>
  <div>
  <div
    class="bg-gray-800 border rounded-xl px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors"
    :class="task.done ? 'border-gray-800 opacity-60' : 'border-gray-800'"
    @click="openDescription"
  >
    <div v-if="editingTitle" class="flex flex-col gap-2" @click.stop>
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
      <div class="flex-1 min-w-0">
        <p
          class="text-sm text-gray-100"
          :class="{ 'line-through': task.done }"
        >
          {{ task.title }}
        </p>
        <p v-if="task.description" class="text-xs text-gray-500 mt-1 truncate">
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
        @click.stop="startEdit"
      />
    </div>
  </div>

  <UModal v-model:open="descOpen">
    <template #content>
      <div class="p-4 flex flex-col gap-3 w-full bg-gray-900 border border-gray-800 rounded-xl">
        <p class="text-sm font-medium text-gray-100">{{ task.title }}</p>
        <UTextarea
          v-model="draftDescription"
          placeholder="Adicionar descrição..."
          color="neutral"
          :rows="6"
          class="bg-gray-800"
        />

        <div class="flex justify-between mt-2">
          <UButton type="button" label="Eliminar" icon="i-lucide-trash-2" color="error" variant="ghost" @click="deleteTask" />
          <div class="flex gap-2">
            <UButton type="button" label="Cancelar" variant="ghost" color="neutral" @click="descOpen = false" />
            <UButton type="button" label="Guardar" :loading="savingDescription" @click="saveDescription" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
  </div>
</template>