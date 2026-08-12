import { ref, watch } from 'vue'

vi.stubGlobal('$fetch', vi.fn())
vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)
