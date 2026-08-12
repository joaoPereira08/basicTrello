/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import BoardCard from '../../app/components/board-card.vue'

describe('BoardCard', () => {
  const board = {
    id: 1,
    title: 'Quadro principal',
    lists: [{ id: 1 }, { id: 2 }],
  }

  const stubs = {
    NuxtLink: {
      template: '<a><slot /></a>',
      props: ['to'],
    },
    UInput: {
      template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: ['modelValue'],
      emits: ['update:modelValue'],
    },
    UButton: {
      template: '<button :data-label="label"><slot /></button>',
      props: ['label', 'loading'],
    },
  }

  it('renders board title and list count', () => {
    const wrapper = mount(BoardCard, {
      props: { board },
      global: { stubs },
    })

    expect(wrapper.text()).toContain('Quadro principal')
    expect(wrapper.text()).toContain('2 listas')
  })

  it('calls API when saving a renamed board', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('$fetch', fetchMock)

    const wrapper = mount(BoardCard, {
      props: { board: { ...board, title: 'Quadro antigo' } },
      global: { stubs },
    })

    const editButton = wrapper.findAll('button')[0]
    expect(editButton).toBeTruthy()
    await editButton!.trigger('click')

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    await input.setValue('Quadro novo')

    const saveButton = wrapper.findAll('button').find((button) => button.attributes('data-label') === 'Guardar')
    expect(saveButton).toBeTruthy()
    await saveButton!.trigger('click')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/boards/1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    )
    expect(wrapper.emitted('board-renamed')).toBeTruthy()
  })
})
