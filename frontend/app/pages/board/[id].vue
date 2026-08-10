<script setup>
const route = useRoute()
const boardId = route.params.id

const { data: board } = await useFetch(`http://localhost:8000/boards/${boardId}`)
</script>

<template>
  <div class="p-6">
    <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-300">
      ← Voltar aos quadros
    </NuxtLink>

    <h1 class="text-xl font-semibold text-gray-100 my-4">
      {{ board?.title }}
    </h1>

    <div v-if="board?.lists?.length" class="grid grid-cols-3 gap-3">
      <ListColumn
        v-for="list in board.lists"
        :key="list.id"
        :title="list.title"
        :tasks="list.cards"
      />
    </div>

    <div v-else class="text-gray-500 text-sm">
      Este quadro ainda não tem listas.
    </div>
  </div>
</template>