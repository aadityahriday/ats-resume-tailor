import { Joyride, STATUS } from 'react-joyride'

export default function OnboardingTour({ run, onClose }) {
  const steps = [
    {
      target: '#setup-panel',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Welcome to ResumeCopy! 👋</h3>
          <p className="text-muted text-sm">
            First, let's set up your AI provider and Overleaf session. This is a one-time setup that takes about 30 seconds.
          </p>
        </div>
      ),
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '#generator-form',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Paste Your Resume & Job Description</h3>
          <p className="text-muted text-sm">
            Paste your current resume and the full job description here. The AI will analyze the JD and rewrite your resume with matched keywords.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '#ai-provider-selector',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Choose Your AI Provider</h3>
          <p className="text-muted text-sm">
            Select between Claude (best for deep analysis), ChatGPT (latest flagship), or Gemini (advanced reasoning). You can switch anytime!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '#generate-button',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Generate Your ATS-Optimized Resume</h3>
          <p className="text-muted text-sm">
            Click to start the AI rewriting process. Watch the workflow panel track progress in real-time. Your optimized PDF will be ready in under 90 seconds!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '#workflow-panel',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Track Your Progress</h3>
          <p className="text-muted text-sm">
            This panel shows each step of the AI workflow: ATS scoring, resume rewriting, LaTeX conversion, and PDF compilation.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '#score-comparison',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">See Your ATS Score Improvement</h3>
          <p className="text-muted text-sm">
            Compare your before and after ATS scores. We target a 90+ score to help you pass Applicant Tracking Systems.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '#history-panel',
      content: (
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-text">Access Your History</h3>
          <p className="text-muted text-sm">
            All your generated resumes are saved locally. You can view, download, or compare previous versions anytime.
          </p>
        </div>
      ),
      placement: 'left',
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onClose()
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#FF9F43',
        },
        tooltip: {
          fontSize: '14px',
          padding: '20px',
        },
        tooltipContent: {
          padding: '0',
        },
        tooltipTitle: {
          fontSize: '18px',
          marginBottom: '12px',
        },
        buttonNext: {
          backgroundColor: '#FF9F43',
          color: '#0F0F12',
          fontSize: '14px',
          padding: '8px 20px',
          borderRadius: '8px',
        },
        buttonBack: {
          color: '#A0A0A0',
          marginRight: '8px',
        },
        buttonSkip: {
          color: '#A0A0A0',
        },
      }}
    />
  )
}
