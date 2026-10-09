import { expect, test } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { On } from 'claude-code'

const BASE = { id: 'intro', text: 'base', scope: 'shared' } as const

// Stands in for the engine beneath the plugin: a project at /proj whose
// state.json holds `state` (undefined = missing), and a status line recorder.
function engine(on: On, state: string | undefined) {
  const statuses: (string | undefined)[] = []
  on('prompt.compose', () => ({ sections: [BASE] }))
  on('session.root', () => ({ value: '/proj' }))
  on('ui.status', ($, e) => {
    statuses.push(e.text)
    return { value: undefined }
  })
  // Unanswered reads fall to the kit's bottom hook, which rejects like a missing file.
  on('fs.read', ($, e, next) => {
    const path = e.path.replaceAll('\\', '/')
    if (path.endsWith('/guide/PROTOCOL.md')) return { value: 'loop rules; state at {{REPORTS}}/state.json' }
    if (path.endsWith('/proj/docs/reports/state.json') && state !== undefined) return { value: state }
    return next(e)
  })
  return statuses
}

const section = async ($: Parameters<TestBody>[0]) => {
  const model = 'claude-opus-5-5'
  const { sections } = await $.prompt.compose({ model, promptModel: model, surfaces: [], tools: [], outputStyle: null, traits: [] })
  expect(sections[0]).toEqual(BASE)
  return sections.find(s => s.id === 'milepost:protocol')
}

test('no state file: rules injected, status cleared', async ($, on) => {
  const statuses = engine(on, undefined)
  const s = await section($)
  expect(s?.scope).toBe('session')
  expect(s?.text).toContain('loop rules; state at docs/reports/state.json')
  expect(s?.text).toContain('No state file yet')
  expect(statuses).toEqual([undefined])
})

test('state file: injected verbatim, goal and status on the status line', async ($, on) => {
  const state = JSON.stringify({ goal: '복셀 맵', status: 'M2 설계 · 승인 대기', current: 'M2' })
  const statuses = engine(on, state)
  const s = await section($)
  expect(s?.text).toContain(state)
  expect(statuses).toEqual(['복셀 맵 › M2 설계 · 승인 대기'])
})

test('broken state file: says so instead of failing', async ($, on) => {
  const statuses = engine(on, '{ not json')
  const s = await section($)
  expect(s?.text).toContain('is not valid JSON')
  expect(statuses).toEqual(['milepost: state.json invalid'])
})

test('reportsDir option moves the state file', { options: { reportsDir: 'reports/' } }, async ($, on) => {
  engine(on, undefined)
  const s = await section($)
  expect(s?.text).toContain('state at reports/state.json')
  expect(s?.text).toContain('/proj/reports/state.json')
})
