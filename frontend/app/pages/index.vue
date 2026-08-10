<script setup>
const { data: boards, refresh } = await useFetch('http://localhost:8000/boards/')

const newTitle = ref('')
const creating = ref(false)

async function createBoard() {
  if (!newTitle.value.trim()) return
  creating.value = true
  await $fetch('http://localhost:8000/boards/', {
    method: 'POST',
    body: { title: newTitle.value },
  })
  newTitle.value = ''
  creating.value = false
  await refresh()
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-100 mb-6">Os meus Quadros</h1>

    <div class="flex gap-2 mb-6">
      <UInput
        v-model="newTitle"
        placeholder="Nome do novo quadro"
        class="flex-1"
        @keyup.enter="createBoard"
      />
      <UButton
        label="Criar"
        icon="i-lucide-plus"
        :loading="creating"
        @click="createBoard"
      />
    </div>

    <div v-if="!boards?.length" class="text-gray-500 text-sm">
      Ainda não tens quadros. Cria o primeiro acima.
    </div>

    <div v-else class="grid grid-cols-3 gap-4">
      <BoardCard v-for="board in boards" :key="board.id" :board="board" />
    </div>
  </div>
</template>