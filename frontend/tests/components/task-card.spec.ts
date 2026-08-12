/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import TaskCard from '../../app/components/task-card.vue'

describe('TaskCard', () => {
  const task = {
    id: 10,
    title: 'Tarefa antiga',
    description: 'Descrição antiga',
    done: false,
  }

  const stubs = {
    UInput: {
      template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: ['modelValue'],
      emits: ['update:modelValue'],
    },
    UButton: {
      template: '<button :data-label="label"><slot /></button>',
      props: ['label', 'loading'],
    },
    UTextarea: {
      template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: ['modelValue'],
      emits: ['update:modelValue'],
    },
    UModal: {
      template: '<div><slot name="content" /></div>',
    },
  }

  it('renders task title and description', () => {
    const wrapper = mount(TaskCard, {
      props: { task },
      global: { stubs },
    })

    expect(wrapper.text()).toContain('Tarefa antiga')
    expect(wrapper.text()).toContain('Descrição antiga')
  })

  it('calls API when saving a renamed task', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('$fetch', fetchMock)

    const wrapper = mount(TaskCard, {
      props: { task },
      global: { stubs },
    })

    const editButton = wrapper.findAll('button')[0]
    expect(editButton).toBeTruthy()
    await editButton!.trigger('click')

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    await input.setValue('Tarefa nova')

    const saveButton = wrapper.findAll('button').find((button) => button.attributes('data-label') === 'Guardar')
    expect(saveButton).toBeTruthy()
    await saveButton!.trigger('click')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/cards/10',
      expect.objectContaining({
        method: 'PATCH',
      }),
    )
    expect(wrapper.emitted('task-renamed')).toBeTruthy()
  })
})
