import { useEffect, useState } from 'react'
import { runLatencyScan } from '../lib/latency'
import { measureDownload, measureUpload } from '../lib/throughput'
import type { DeepScanResult, ProbeSample, QuickScanResult } from '../types/network'
import { ScanStage } from '../components/ScanStage'

export function DeepScanScreen({ onComplete, onCancel }: { onComplete: (result: DeepScanResult) => void; onCancel: () => void }) {
  const [stage, setStage] = useState('latency'); const [samples, setSamples] = useState<ProbeSample[]>([]); const [error, setError] = useState('')
  useEffect(() => { let cancelled = false; void (async () => { try { const quick = await runLatencyScan(12, (sample) => setSamples((current) => [...current, sample])); if (cancelled) return; setStage('download'); const download = await measureDownload(); setStage('upload'); const upload = await measureUpload(); onComplete({ ...quick, downloadMbps: download.mbps, uploadMbps: upload.mbps, bytesDownloaded: download.bytes, bytesUploaded: upload.bytes }) } catch { setError('The deep scan could not complete. You can still use your quick scan result.') } })(); return () => { cancelled = true } }, [onComplete])
  return <main className="scan-screen page-shell"><div className="scan-intro"><span className="eyebrow">DEEP SCAN / EXPLICIT BANDWIDTH TEST</span><h1>Let's look<br /><em>closer.</em></h1><p>This uses more data: a download and upload transfer after the latency check. You can stop at any time.</p></div><div className="scan-list"><ScanStage label="Responsiveness" detail={`${samples.length} HTTP probes`} done={stage !== 'latency'} active={stage === 'latency'} /><ScanStage label="Download transfer" detail={stage === 'download' ? 'Measuring now' : stage === 'latency' ? 'Waiting' : 'Complete'} done={stage === 'upload'} active={stage === 'download'} /><ScanStage label="Upload transfer" detail={stage === 'upload' ? 'Measuring now' : 'Waiting'} active={stage === 'upload'} /></div>{error && <p className="error-copy">{error}</p>}<button className="text-cta" onClick={onCancel}>Cancel deep scan</button></main>
}
