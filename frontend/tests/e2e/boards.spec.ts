import { test, expect } from '@playwright/test'

const boardTitle = `E2E Board ${Date.now()}`

test.describe('Quadros', () => {
  test('cria um quadro e aparece na lista', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('Nome do novo quadro').fill(boardTitle)
    await page.getByRole('button', { name: 'Criar' }).click()

    await expect(page.getByText(boardTitle)).toBeVisible()
  })

  test('abre um quadro ao clicar nele', async ({ page }) => {
    await page.goto('/')

    await page.getByText(boardTitle).click()

    await expect(page).toHaveURL(/\/board\/\d+/)
    await expect(page.getByRole('heading', { name: boardTitle })).toBeVisible()
  })

  test('elimina o quadro', async ({ page }) => {
    await page.goto('/')

    const boardCard = page.locator('a', { hasText: boardTitle })
    await boardCard.hover()

    page.once('dialog', (dialog) => dialog.accept())
    await boardCard.getByRole('button').last().click()

    await expect(page.getByText(boardTitle)).not.toBeVisible()
  })
})