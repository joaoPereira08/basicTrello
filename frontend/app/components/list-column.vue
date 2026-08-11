<script setup>
const props = defineProps({
  listId: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
})

const emit = defineEmits(['task-added', 'list-renamed'])

const showInput = ref(false)
const newTaskTitle = ref('')
const creating = ref(false)
const editingTitle = ref(false)
const draftTitle = ref(props.title)

watch(() => props.title, (newTitle) => {
  draftTitle.value = newTitle
  editingTitle.value = false
})

function startEditTitle() {
  draftTitle.value = props.title
  editingTitle.value = true
}

function cancelEditTitle() {
  draftTitle.value = props.title
  editingTitle.value = false
}

async function saveTitle() {
  const title = draftTitle.value.trim()

  if (!title || title === props.title) {
    cancelEditTitle()
    return
  }

  try {
    await $fetch(`http://localhost:8000/lists/${props.listId}`, {
      method: 'PATCH',
      body: { title },
    })
    editingTitle.value = false
    emit('list-renamed')
  } catch (err) {
    console.error('Erro ao renomear lista:', err)
  }
}

async function createTask() {
  if (!newTaskTitle.value.trim()) return
  creating.value = true
  try {
    await $fetch('http://localhost:8000/cards/', {
      method: 'POST',
      body: {
        title: newTaskTitle.value,
        list_id: props.listId,
        position: props.tasks.length,
      },
    })
    newTaskTitle.value = ''
    showInput.value = false
    emit('task-added')
  } catch (err) {
    console.error('Erro ao criar cartão:', err)
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="bg-gray-900/70 rounded-xl p-3 w-64 shrink-0">
    <div v-if="editingTitle" class="flex flex-col gap-2 mb-3">
      <UInput
        v-model="draftTitle"
        autofocus
        @keyup.enter="saveTitle"
        @keyup.esc="cancelEditTitle"
      />
      <div class="flex gap-2">
        <UButton type="button" label="Guardar" size="sm" @click="saveTitle" />
        <UButton type="button" label="Cancelar" size="sm" variant="ghost" color="neutral" @click="cancelEditTitle" />
      </div>
    </div>

    <div v-else class="flex items-center justify-between mb-3">
      <button class="font-medium text-sm text-gray-100 text-left flex-1 hover:text-white" @click="startEditTitle">
        {{ title }}
      </button>
      <span class="text-xs text-gray-500">{{ tasks.length }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @task-renamed="emit('list-renamed')" />
    </div>

    <div v-if="showInput" class="mt-2 flex flex-col gap-2">
      <UInput
        v-model="newTaskTitle"
        placeholder="Título do cartão"
        autofocus
        @keyup.enter="createTask"
        @keyup.esc="showInput = false"
      />
      <div class="flex gap-2">
        <UButton type="button" label="Adicionar" size="sm" :loading="creating" @click="createTask" />
        <UButton type="button" label="Cancelar" size="sm" variant="ghost" color="neutral" @click="showInput = false" />
      </div>
    </div>

    <UButton
      v-else
      type="button"
      label="Adicionar cartão"
      icon="i-lucide-plus"
      variant="ghost"
      color="neutral"
      size="sm"
      class="w-full justify-start mt-2 text-gray-500"
      @click="showInput = true"
    />
  </div>
</template>