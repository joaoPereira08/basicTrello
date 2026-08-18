import { test, expect, uniqueTitle } from './fixtures'

test.describe('Cards', () => {
  test('5. Criar um cartão', async ({ page, createBoardViaApi, createListViaApi }) => {
    // Preparação: quadro + lista, ambos pela API
    const board = await createBoardViaApi(uniqueTitle('Board p/ Cartão'))
    const list = await createListViaApi(board.id, uniqueTitle('Lista p/ Cartão'))
    await page.goto(`/board/${board.id}`)
    await expect(page.getByText(list.title)).toBeVisible()

    // Ação: criar o cartão pela UI (é isto que testamos)
    const cardTitle = uniqueTitle('Cartão')
    await page.getByRole('button', { name: 'Adicionar cartão' }).click()
    await page.getByPlaceholder('Título do cartão').fill(cardTitle)
    await page.getByRole('button', { name: 'Adicionar', exact: true }).click()

    // Resultado esperado: o cartão aparece
    await expect(page.getByText(cardTitle)).toBeVisible()
  })

  test('6. Editar descrição de um cartão', async ({
    page,
    createBoardViaApi,
    createListViaApi,
    createCardViaApi,
  }) => {

    const board = await createBoardViaApi(uniqueTitle('Board p/ Editar Cartão'))
    const list = await createListViaApi(board.id, uniqueTitle('Lista p/ Editar Cartão'))
    const card = await createCardViaApi(list.id, uniqueTitle('Cartão p/ Editar'))
    await page.goto(`/board/${board.id}`)
    await expect(page.getByText(card.title)).toBeVisible()

    const description = uniqueTitle('Descrição')
    await page.getByText(card.title).click()
    await page.getByPlaceholder('Adicionar descrição...').fill(description)
    await page.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByText(description)).toBeVisible()
  })
})