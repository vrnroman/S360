import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData.json';

type Scores = Record<string, number>;
type Comments = Record<string, string>;

const Survey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const employee = mockData.employees.find((emp) => emp.id === id);
  const questions = mockData.questions;

  const [scores, setScores] = useState<Scores>({});
  const [comments, setComments] = useState<Comments>({});
  const [relationship, setRelationship] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!employee) {
    return <div className="p-4 text-red-600">Employee not found.</div>;
  }

  // Group questions by category
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  const handleScoreChange = (questionId: string, value: number) => {
    setScores((prev) => ({ ...prev, [questionId]: value }));
    setError(null);
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setComments((prev) => ({ ...prev, [questionId]: value }));
    setError(null);
  };

  const validateForm = () => {
    // 0. Relationship must be selected
    if (!relationship) {
      setError('Please specify your relationship to the person before submitting.');
      return false;
    }

    // 1. All questions must be answered
    if (Object.keys(scores).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return false;
    }

    // 2. "Extreme Score" validation rule: 1 or 5 require comments
    for (const [questionId, score] of Object.entries(scores)) {
      if ((score === 1 || score === 5) && !comments[questionId]?.trim()) {
        setError(`You selected an extreme score (${score}) for a question but did not provide a comment. Please provide a comment explaining your score.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        employeeId: employee.id,
        relationship,
        scores,
        comments
      };
      console.log('Submitting feedback:', payload);
      alert(`Feedback for ${employee.name} submitted successfully as a ${relationship}! (This is a PoC)`);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">360 Feedback Survey</h1>
        <p className="mt-2 text-lg text-slate-600">
          Evaluating: <span className="font-semibold text-slate-900">{employee.name}</span> ({employee.role})
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
          <div className="px-4 py-5 border-b border-slate-200 bg-slate-50 sm:px-6">
            <h3 className="text-xl leading-6 font-medium text-slate-900">Your Information</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="relationship" className="block text-sm font-medium text-slate-700">
              Your relationship to {employee.name} <span className="text-red-500">*</span>
            </label>
            <select
              id="relationship"
              name="relationship"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border ${
                error && !relationship ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              value={relationship}
              onChange={(e) => {
                setRelationship(e.target.value);
                setError(null);
              }}
            >
              <option value="" disabled>Select a relationship...</option>
              <option value="Peer">Peer</option>
              <option value="Manager">Manager</option>
              <option value="Direct Report">Direct Report</option>
              <option value="Stakeholder">Stakeholder</option>
            </select>
          </div>
        </div>

        {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
          <div key={category} className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
            <div className="px-4 py-5 border-b border-slate-200 bg-slate-50 sm:px-6">
              <h3 className="text-xl leading-6 font-medium text-slate-900">{category}</h3>
            </div>
            <div className="px-4 py-5 sm:p-0">
              <ul role="list" className="divide-y divide-slate-200">
                {categoryQuestions.map((q) => (
                  <li key={q.id} className="p-4 sm:px-6 py-6">
                    <p className="text-base text-slate-900 mb-4">{q.text}</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Score (1 = Strongly Disagree, 5 = Strongly Agree)
                        </label>
                        <div className="flex space-x-4">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <label key={val} className="inline-flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`score-${q.id}`}
                                value={val}
                                checked={scores[q.id] === val}
                                onChange={() => handleScoreChange(q.id, val)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                              />
                              <span className="ml-2 text-sm text-slate-700">{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`comment-${q.id}`} className="block text-sm font-medium text-slate-700">
                          Comments
                          {(scores[q.id] === 1 || scores[q.id] === 5) && (
                            <span className="text-red-500 ml-1">* Required for extreme scores</span>
                          )}
                        </label>
                        <div className="mt-1">
                          <textarea
                            id={`comment-${q.id}`}
                            rows={3}
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border ${
                              (scores[q.id] === 1 || scores[q.id] === 5) && !comments[q.id]?.trim() && error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : ''
                            }`}
                            placeholder="Optional context (required for score 1 or 5)..."
                            value={comments[q.id] || ''}
                            onChange={(e) => handleCommentChange(q.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default Survey;
