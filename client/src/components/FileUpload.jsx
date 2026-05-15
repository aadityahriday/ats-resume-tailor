import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileUpload({ onFileContent, label, icon }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // For TXT files, read directly on client
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text()
        onFileContent(text)
        setIsUploading(false)
        return
      }

      // For PDF and DOCX, send to backend for parsing
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.status === 'error') {
        setError(data.message)
      } else {
        onFileContent(data.text)
      }
    } catch (err) {
      setError('Failed to parse file. Please try again or copy-paste the text directly.')
    } finally {
      setIsUploading(false)
    }
  }, [onFileContent])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-amber bg-amber/5' 
          : 'border-border hover:border-amber/50 bg-bg/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-muted">
          {isUploading ? 'Parsing file...' : isDragActive ? 'Drop file here...' : `Drag & drop ${label}, or click to browse`}
        </p>
        <p className="text-xs text-muted/60">
          Supports: TXT, PDF, DOCX
        </p>
        {error && (
          <p className="text-xs text-error mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
