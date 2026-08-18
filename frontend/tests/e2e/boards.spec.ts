import { test, expect, uniqueTitle } from './fixtures'

test.describe('Boards', () => {
  test('Criar um quadro', async ({ page }) => {

    await page.goto('/')


    const title = uniqueTitle('Board Criar')
    await page.getByPlaceholder('Nome do novo quadro').fill(title)
    await page.getByRole('button', { name: 'Criar' }).click()

    await expect(page.getByText(title)).toBeVisible()
  })

  test(' Abrir um quadro', async ({ page, createBoardViaApi }) => {

    const board = await createBoardViaApi(uniqueTitle('Board Abrir'))
    await page.goto('/')

    await page.getByText(board.title).click()

    await expect(page).toHaveURL(`/board/${board.id}`)
    await expect(page.getByRole('heading', { name: board.title })).toBeVisible()
  })

  test('Eliminar um quadro', async ({ page, createBoardViaApi }) => {

    const board = await createBoardViaApi(uniqueTitle('Board Eliminar'))
    await page.goto('/')

    const boardCard = page.locator('a', { hasText: board.title })
    await boardCard.hover()

    page.once('dialog', (dialog) => dialog.accept())
    await boardCard.getByRole('button').last().click()

    await expect(page.getByText(board.title)).not.toBeVisible()
  })
})