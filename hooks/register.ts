import type { CoreEngineInterface, Register } from 'claude-code'

const SECTION_ID = 'milepost:protocol'

type State = { note: string; status: string | undefined }

async function readState($: CoreEngineInterface, path: string): Promise<State> {
  let text: string
  try {
    text = await $.fs.read(path)
  } catch {
    return { note: `No state file yet (${path}).`, status: undefined }
  }
  try {
    const state = JSON.parse(text)
    const status = [state.goal, state.status].filter(s => typeof s === 'string' && s).join(' › ')
    return { note: `Current state (${path}):\n\`\`\`json\n${text.trim()}\n\`\`\``, status: status || undefined }
  } catch (err) {
    return {
      note: `State file ${path} is not valid JSON (${(err as Error).message}). Fix it before going on.`,
      status: 'milepost: state.json invalid',
    }
  }
}

export const register: Register = (on, options) => {
  const reportsDir = String(options.reportsDir || 'docs/reports').replace(/[\\/]+$/, '')
  let protocol: string | undefined

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    protocol ??= (await $.fs.read(`${$.plugin.root}/guide/PROTOCOL.md`))
      .replaceAll('{{ROOT}}', $.plugin.root)
      .replaceAll('{{REPORTS}}', reportsDir)

    const { note, status } = await readState($, `${await $.session.root()}/${reportsDir}/state.json`)
    $.ui.status(status)

    return {
      sections: [...composed.sections, { id: SECTION_ID, text: `${protocol}\n\n${note}`, scope: 'session' }],
    }
  })
}
