import { test, expect } from '@playwright/test'

const boardTitle = `E2E Lists ${Date.now()}`
const listTitle = 'A Fazer'
const cardTitle = 'Escrever testes e2e'

test.describe('Listas e Cartões', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Nome do novo quadro').fill(boardTitle)
    await page.getByRole('button', { name: 'Criar' }).click()
    await page.getByText(boardTitle).click()
    await expect(page).toHaveURL(/\/board\/\d+/)
  })

  test('cria uma lista dentro do quadro', async ({ page }) => {
    await page.getByPlaceholder('Nome da nova lista').fill(listTitle)
    await page.getByRole('button', { name: 'Adicionar lista' }).click()

    await expect(page.getByText(listTitle)).toBeVisible()
  })

  test('cria um cartão dentro de uma lista', async ({ page }) => {
    await page.getByPlaceholder('Nome da nova lista').fill(listTitle)
    await page.getByRole('button', { name: 'Adicionar lista' }).click()
    await expect(page.getByText(listTitle)).toBeVisible()

    await page.getByRole('button', { name: 'Adicionar cartão' }).click()
    await page.getByPlaceholder('Título do cartão').fill(cardTitle)
    await page.getByRole('button', { name: 'Adicionar' }).click()

    await expect(page.getByText(cardTitle)).toBeVisible()
  })

  test('edita a descrição de um cartão', async ({ page }) => {
    await page.getByPlaceholder('Nome da nova lista').fill(listTitle)
    await page.getByRole('button', { name: 'Adicionar lista' }).click()
    await page.getByRole('button', { name: 'Adicionar cartão' }).click()
    await page.getByPlaceholder('Título do cartão').fill(cardTitle)
    await page.getByRole('button', { name: 'Adicionar' }).click()

    await page.getByText(cardTitle).click()
    await page.getByPlaceholder('Adicionar descrição...').fill('Descrição criada pelo teste e2e')
    await page.getByRole('button', { name: 'Guardar' }).click()


    await expect(page.getByText('Descrição criada pelo teste e2e')).toBeVisible()
  })
})