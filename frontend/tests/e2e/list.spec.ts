import { test, expect, uniqueTitle } from './fixtures'

test.describe('Lists', () => {
  test(' Criar uma lista', async ({ page, createBoardViaApi }) => {

    const board = await createBoardViaApi(uniqueTitle('Board p/ Lista'))
    await page.goto(`/board/${board.id}`)

    const listTitle = uniqueTitle('Lista')
    await page.getByPlaceholder('Nome da nova lista').fill(listTitle)
    await page.getByRole('button', { name: 'Adicionar lista' }).click()

    await expect(page.getByText(listTitle)).toBeVisible()
  })
})