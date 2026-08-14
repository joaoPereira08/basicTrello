<script setup>
import draggable from 'vuedraggable'

const apiBase = useRuntimeConfig().public.apiBase

const props = defineProps({
  listId: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
})

const emit = defineEmits(['task-added', 'list-renamed'])

const localTasks = ref([...props.tasks])
watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks]
})

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
    await $fetch(`${apiBase}/lists/${props.listId}`, {
      method: 'PATCH',
      body: { title },
    })
    editingTitle.value = false
    emit('list-renamed')
  } catch (err) {
    console.error('Erro ao renomear lista:', err)
  }
}

async function deleteList() {
  if (!confirm(`Eliminar a lista "${props.title}" e todos os seus cartões?`)) return
  try {
    await $fetch(`${apiBase}/lists/${props.listId}`, { method: 'DELETE' })
    emit('list-renamed')
  } catch (err) {
    console.error('Erro ao eliminar lista:', err)
  }
}

async function createTask() {
  if (!newTaskTitle.value.trim()) return
  creating.value = true
  try {
    await $fetch(`${apiBase}/cards/`, {
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

async function handleDragChange(evt) {
  if (evt.added) {
    const { element, newIndex } = evt.added
    try {
      await $fetch(`${apiBase}/cards/${element.id}`, {
        method: 'PATCH',
        body: { list_id: props.listId, position: newIndex },
      })
      emit('list-renamed')
    } catch (err) {
      console.error('Erro ao mover cartão:', err)
      emit('list-renamed')
    }
  } else if (evt.moved) {
    const { element, newIndex } = evt.moved
    try {
      await $fetch(`${apiBase}/cards/${element.id}`, {
        method: 'PATCH',
        body: { position: newIndex },
      })
    } catch (err) {
      console.error('Erro ao reordenar cartão:', err)
    }
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

    <div v-else class="group flex items-center justify-between mb-3">
      <button class="font-medium text-sm text-gray-100 text-left flex-1 hover:text-white" @click="startEditTitle">
        {{ title }}
      </button>
      <span class="text-xs text-gray-500 mr-1">{{ tasks.length }}</span>
      <UButton
        type="button"
        icon="i-lucide-trash-2"
        size="xs"
        variant="ghost"
        color="error"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click="deleteList"
      />
    </div>

    <draggable
      v-model="localTasks"
      :item-key="(task) => task.id"
      group="cards"
      class="flex flex-col gap-2 min-h-[8px]"
      ghost-class="opacity-40"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <TaskCard :task="element" @task-renamed="emit('list-renamed')" />
      </template>
    </draggable>

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