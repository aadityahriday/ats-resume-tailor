import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function ATSScoreVisualization({ beforeScore, afterScore, metrics }) {
  const getScoreTotal = (score) => typeof score === 'object' ? (score?.total || 0) : (Number(score) || 0);
  const beforeTotal = getScoreTotal(beforeScore);
  const afterTotal = getScoreTotal(afterScore);

  let data = metrics;
  
  if (!data) {
    if (typeof beforeScore === 'object' && beforeScore?.breakdown && typeof afterScore === 'object' && afterScore?.breakdown) {
      const getPercent = (obj) => obj && obj.max > 0 ? (obj.score / obj.max) * 100 : 0;
      data = [
        { subject: 'Keywords', before: getPercent(beforeScore.breakdown.keywordMatch), after: getPercent(afterScore.breakdown.keywordMatch), fullMark: 100 },
        { subject: 'Headers', before: getPercent(beforeScore.breakdown.sectionHeaders), after: getPercent(afterScore.breakdown.sectionHeaders), fullMark: 100 },
        { subject: 'Impact', before: getPercent(beforeScore.breakdown.quantifiedAchievements), after: getPercent(afterScore.breakdown.quantifiedAchievements), fullMark: 100 },
        { subject: 'Verbs', before: getPercent(beforeScore.breakdown.actionVerbs), after: getPercent(afterScore.breakdown.actionVerbs), fullMark: 100 },
        { subject: 'Contact', before: getPercent(beforeScore.breakdown.contactInfo), after: getPercent(afterScore.breakdown.contactInfo), fullMark: 100 },
        { subject: 'Format', before: getPercent(beforeScore.breakdown.formatting), after: getPercent(afterScore.breakdown.formatting), fullMark: 100 },
      ];
    } else {
      data = [
        { subject: 'Keywords', before: beforeTotal * 0.8, after: afterTotal * 0.9, fullMark: 100 },
        { subject: 'Skills', before: beforeTotal * 0.7, after: afterTotal * 0.85, fullMark: 100 },
        { subject: 'Experience', before: beforeTotal * 0.75, after: afterTotal * 0.88, fullMark: 100 },
        { subject: 'Education', before: beforeTotal * 0.6, after: afterTotal * 0.8, fullMark: 100 },
        { subject: 'Format', before: beforeTotal * 0.85, after: afterTotal * 0.95, fullMark: 100 },
        { subject: 'Relevance', before: beforeTotal * 0.7, after: afterTotal * 0.92, fullMark: 100 },
      ]
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="font-serif text-lg text-text mb-4">ATS Score Breakdown</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1F2433" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#636B7E', fontSize: 11 }}
              className="font-mono"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#636B7E', fontSize: 9 }}
              tickCount={5}
            />
            <Radar
              name="Before"
              dataKey="before"
              stroke="#F43F5E"
              fill="#F43F5E"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="After"
              dataKey="after"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error" />
          <span className="text-xs font-mono text-muted-light">Before: {beforeTotal}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs font-mono text-muted-light">After: {afterTotal}</span>
        </div>
      </div>
    </div>
  )
}
