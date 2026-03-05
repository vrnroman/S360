import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import mockData from '../data/mockData.json';

const RELATIONSHIP_COLORS: Record<string, string> = {
  Overall: '#2563eb', // blue-600
  Peer: '#10b981', // emerald-500
  Manager: '#f59e0b', // amber-500
  Stakeholder: '#8b5cf6', // violet-500
  'Direct Report': '#ec4899', // pink-500
};

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const employee = mockData.employees.find((emp) => emp.id === id);
  const questions = mockData.questions;
  const employeeFeedback = mockData.historicalFeedback.filter((f) => f.subjectId === id);

  if (!employee) {
    return <div className="p-4 text-red-600">Employee not found.</div>;
  }

  // Identify all unique relationships present in this employee's feedback
  const relationshipsPresent = Array.from(new Set(employeeFeedback.map(f => f.relationship)));

  // Calculate average scores per category, overall and by relationship
  const categoryScores: Record<string, {
    overall: { total: number; count: number };
    byRelationship: Record<string, { total: number; count: number }>;
  }> = {};

  questions.forEach(q => {
    categoryScores[q.category] = {
      overall: { total: 0, count: 0 },
      byRelationship: {}
    };
    relationshipsPresent.forEach(rel => {
      categoryScores[q.category].byRelationship[rel] = { total: 0, count: 0 };
    });
  });

  employeeFeedback.forEach(feedback => {
    const rel = feedback.relationship;
    Object.entries(feedback.scores).forEach(([questionId, score]) => {
      const q = questions.find(q => q.id === questionId);
      if (q) {
        // Overall stats
        categoryScores[q.category].overall.total += score;
        categoryScores[q.category].overall.count += 1;
        // Relationship specific stats
        if (!categoryScores[q.category].byRelationship[rel]) {
            categoryScores[q.category].byRelationship[rel] = { total: 0, count: 0 };
        }
        categoryScores[q.category].byRelationship[rel].total += score;
        categoryScores[q.category].byRelationship[rel].count += 1;
      }
    });
  });

  const chartData = Object.entries(categoryScores).map(([category, stats]) => {
    const dataPoint: any = {
      subject: category,
      Overall: stats.overall.count > 0 ? Number((stats.overall.total / stats.overall.count).toFixed(2)) : 0,
      fullMark: 5,
    };

    relationshipsPresent.forEach(rel => {
      const relStats = stats.byRelationship[rel];
      if (relStats && relStats.count > 0) {
        dataPoint[rel] = Number((relStats.total / relStats.count).toFixed(2));
      }
    });

    return dataPoint;
  });

  // Gather all comments
  const allComments: { category: string; question: string; text: string; relationship: string; id: string }[] = [];
  employeeFeedback.forEach(feedback => {
    Object.entries(feedback.comments).forEach(([questionId, text]) => {
      const q = questions.find(q => q.id === questionId);
      if (q && text) {
        allComments.push({
          id: `${feedback.id}-${questionId}`,
          category: q.category,
          question: q.text,
          text: text as string,
          relationship: feedback.relationship
        });
      }
    });
  });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">360 Feedback Report</h1>
          <p className="mt-2 text-lg text-slate-600">
            Subject: <span className="font-semibold text-slate-900">{employee.name}</span> ({employee.role})
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </button>
      </div>

      {employeeFeedback.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-slate-500 border border-slate-200">
          No feedback data available for this employee yet.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Radar Chart Section */}
          <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-200">
            <h3 className="text-xl leading-6 font-medium text-slate-900 mb-6 border-b pb-4">
              Competency Overview
            </h3>
            <div className="h-96 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Radar
                    name="Overall Average"
                    dataKey="Overall"
                    stroke={RELATIONSHIP_COLORS['Overall']}
                    fill={RELATIONSHIP_COLORS['Overall']}
                    fillOpacity={0.3}
                  />
                  {relationshipsPresent.map((rel) => (
                    <Radar
                      key={rel}
                      name={rel}
                      dataKey={rel}
                      stroke={RELATIONSHIP_COLORS[rel] || '#94a3b8'}
                      fill="none"
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {chartData.map((data) => (
                 <div key={data.subject} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <p className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3">{data.subject}</p>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-slate-500">Overall</span>
                       <span className="text-lg font-bold text-blue-600">{data.Overall}</span>
                     </div>
                     {relationshipsPresent.map(rel => data[rel] !== undefined && (
                       <div key={rel} className="flex justify-between items-center">
                         <span className="text-sm text-slate-500">{rel}</span>
                         <span className="text-sm font-semibold" style={{ color: RELATIONSHIP_COLORS[rel] || '#94a3b8' }}>
                           {data[rel]}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Qualitative Feedback Section */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
            <div className="px-4 py-5 border-b border-slate-200 bg-slate-50 sm:px-6">
              <h3 className="text-xl leading-6 font-medium text-slate-900">Qualitative Feedback</h3>
            </div>
            {allComments.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No comments provided.</div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {allComments.map((comment) => (
                  <li key={comment.id} className="p-4 sm:px-6">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-900">{comment.category}</h4>
                          <p className="text-sm text-slate-500">
                            From: <span className="font-medium text-slate-700">{comment.relationship}</span>
                          </p>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{comment.question}</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md mt-2 border border-slate-100">
                          "{comment.text}"
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
