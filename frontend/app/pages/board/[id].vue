<script setup>
const apiBase = useRuntimeConfig().public.apiBase

const route = useRoute()
const boardId = route.params.id

const { data: board, refresh } = await useFetch(`${apiBase}/boards/${boardId}`)

const newListTitle = ref('')
const creatingList = ref(false)
const editingBoardTitle = ref(false)
const boardTitleDraft = ref('')

function startEditBoardTitle() {
  boardTitleDraft.value = board.value?.title ?? ''
  editingBoardTitle.value = true
}

function cancelEditBoardTitle() {
  boardTitleDraft.value = board.value?.title ?? ''
  editingBoardTitle.value = false
}

async function saveBoardTitle() {
  const title = boardTitleDraft.value.trim()

  if (!title || title === board.value?.title) {
    cancelEditBoardTitle()
    return
  }

  try {
    await $fetch(`${apiBase}/boards/${boardId}`, {
      method: 'PATCH',
      body: { title },
    })
    editingBoardTitle.value = false
    await refresh()
  } catch (err) {
    console.error('Erro ao renomear quadro:', err)
  }
}

async function createList() {
  if (!newListTitle.value.trim()) return
  creatingList.value = true
  try {
    await $fetch(`${apiBase}/lists/`, {
      method: 'POST',
      body: { title: newListTitle.value, board_id: Number(boardId), position: board.value?.lists?.length ?? 0 },
    })
    newListTitle.value = ''
    await refresh()
  } catch (err) {
    console.error('Erro ao criar lista:', err)
  } finally {
    creatingList.value = false
  }
}

async function deleteBoard() {
  if (!confirm(`Eliminar o quadro "${board.value?.title}"? Esta ação não pode ser desfeita.`)) return
  try {
    await $fetch(`${apiBase}/boards/${boardId}`, { method: 'DELETE' })
    await navigateTo('/')
  } catch (err) {
    console.error('Erro ao eliminar board:', err)
  }
}
</script>

<template>
  <div class="p-6">
    <NuxtLink
  to="/"
  class="inline-flex items-center rounded-2xl border border-gray-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white">
    ← Voltar
  </NuxtLink>

    <div v-if="editingBoardTitle" class="flex items-center gap-2 my-4">
      <UInput
        v-model="boardTitleDraft"
        class="max-w-md"
        autofocus
        @keyup.enter="saveBoardTitle"
        @keyup.esc="cancelEditBoardTitle"
      />
      <UButton type="button" label="Guardar" @click="saveBoardTitle" />
      <UButton type="button" label="Cancelar" variant="ghost" color="neutral" @click="cancelEditBoardTitle" />
    </div>

    <div v-else class="flex items-center gap-2 my-4">
      <h1 class="text-xl font-semibold text-gray-100">
        {{ board?.title }}
      </h1>
      <UButton
        type="button"
        icon="i-lucide-pencil"
        size="sm"
        variant="ghost"
        color="neutral"
        @click="startEditBoardTitle"
      />
      <UButton
        type="button"
        icon="i-lucide-trash-2"
        size="sm"
        variant="ghost"
        color="error"
        @click="deleteBoard"
      />
    </div>

    <div class="flex gap-3 items-start">
      <ListColumn
        v-for="list in board?.lists"
        :key="list.id"
        :list-id="list.id"
        :title="list.title"
        :tasks="list.cards"
        @task-added="refresh"
        @list-renamed="refresh"
      />

      <div class="bg-gray-900/60 rounded-xl p-3 w-64 shrink-0">
        <UInput
          v-model="newListTitle"
          placeholder="Nome da nova lista"
          class="w-full mb-2"
          @keyup.enter="createList"
        />
        <UButton
          type="button"
          label="Adicionar lista"
          icon="i-lucide-plus"
          variant="soft"
          size="sm"
          :loading="creatingList"
          @click="createList"
        />
      </div>
    </div>
  </div>
</template>