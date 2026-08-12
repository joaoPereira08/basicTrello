<script setup>
const props = defineProps({
  board: { type: Object, required: true },
})

const emit = defineEmits(['board-renamed'])

const editing = ref(false)
const draftTitle = ref(props.board.title)

watch(() => props.board.title, (newTitle) => {
  draftTitle.value = newTitle
  editing.value = false
})

function startEdit(event) {
  event.preventDefault()
  event.stopPropagation()
  draftTitle.value = props.board.title
  editing.value = true
}

function cancelEdit() {
  draftTitle.value = props.board.title
  editing.value = false
}

async function saveTitle() {
  const title = draftTitle.value.trim()

  if (!title || title === props.board.title) {
    cancelEdit()
    return
  }

  try {
    await $fetch(`http://localhost:8000/boards/${props.board.id}`, {
      method: 'PATCH',
      body: { title },
    })
    editing.value = false
    emit('board-renamed')
  } catch (err) {
    console.error('Erro ao renomear quadro:', err)
  }
}

async function deleteBoard(event) {
  event.preventDefault()
  event.stopPropagation()
  if (!confirm(`Eliminar o quadro "${props.board.title}"? Esta ação não pode ser desfeita.`)) return
  try {
    await $fetch(`http://localhost:8000/boards/${props.board.id}`, { method: 'DELETE' })
    emit('board-renamed')
  } catch (err) {
    console.error('Erro ao eliminar quadro:', err)
  }
}
</script>

<template>
  <NuxtLink :to="`/board/${board.id}`">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
      <div v-if="editing" class="flex flex-col gap-2" @click.stop>
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

      <div v-else class="group flex items-start justify-between gap-2">
        <div class="flex-1">
          <p class="font-medium text-gray-100">{{ board.title }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ board.lists?.length ?? 0 }} listas
          </p>
        </div>

        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <UButton
            type="button"
            icon="i-lucide-pencil"
            size="xs"
            variant="ghost"
            color="neutral"
            @click="startEdit"
          />
          <UButton
            type="button"
            icon="i-lucide-trash-2"
            size="xs"
            variant="ghost"
            color="error"
            @click="deleteBoard"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>