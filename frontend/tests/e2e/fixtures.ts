import { test as base, expect } from '@playwright/test'

type Board = { id: number; title: string }
type List = { id: number; title: string }
type Card = { id: number; title: string }

type Fixtures = {
  apiBase: string
  createBoardViaApi: (title: string) => Promise<Board>
  createListViaApi: (boardId: number, title: string) => Promise<List>
  createCardViaApi: (listId: number, title: string) => Promise<Card>
}


export const test = base.extend<Fixtures>({
  apiBase: async ({}, use) => {
    await use(process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000')
  },

  createBoardViaApi: async ({ request, apiBase }, use) => {
    const createdIds: number[] = []

    await use(async (title: string) => {
      const res = await request.post(`${apiBase}/boards/`, { data: { title } })
      const board = await res.json()
      createdIds.push(board.id)
      return board
    })

    
    for (const id of createdIds) {
      await request.delete(`${apiBase}/boards/${id}`).catch(() => {})
    }
  },

  createListViaApi: async ({ request, apiBase }, use) => {
    await use(async (boardId: number, title: string) => {
      const res = await request.post(`${apiBase}/lists/`, {
        data: { title, board_id: boardId, position: 0 },
      })
      return res.json()
    })
  },

  createCardViaApi: async ({ request, apiBase }, use) => {
    await use(async (listId: number, title: string) => {
      const res = await request.post(`${apiBase}/cards/`, {
        data: { title, list_id: listId, position: 0 },
      })
      return res.json()
    })
  },
})

export { expect }

export function uniqueTitle(prefix: string) {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 10000)}`
}