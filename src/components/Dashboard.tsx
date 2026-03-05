import { Link } from 'react-router-dom';
import mockData from '../data/mockData.json';

const Dashboard = () => {
  const employees = mockData.employees;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Select an employee to give feedback or view their 360 review report.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {employees.map((employee) => (
            <li key={employee.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-slate-900 truncate">
                    {employee.name}
                  </h3>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                      <span className="font-medium text-slate-700 mr-2">Role:</span>
                      {employee.role}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                      <span className="font-medium text-slate-700 mr-2">Department:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.department}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <Link
                    to={`/survey/${employee.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Give Feedback
                  </Link>
                  <Link
                    to={`/report/${employee.id}`}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
