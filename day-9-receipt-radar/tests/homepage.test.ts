import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const landing = readFileSync(new URL('../src/screens/LandingScreen.tsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('homepage leads with upload and shows the product audit preview', () => {
  assert.ok(landing.indexOf('UPLOAD RECEIPT') < landing.indexOf('OPEN DEMO'))
  assert.match(landing, /className="landing-preview"/)
  assert.match(landing, /className="preview-receipt"/)
  assert.match(landing, /className="preview-audit"/)
})

test('homepage has responsive preview styling and clean copy', () => {
  assert.match(styles, /\.landing-grid\s*{/)
  assert.match(styles, /\.landing-preview\s*{/)
  assert.match(styles, /@media \(max-width: 980px\)/)
  assert.doesNotMatch(landing, /—|â€”/)
})
