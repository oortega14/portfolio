import { useState } from 'react';
import Logout from './Logout';
import AdminBlogManager from './admin/AdminBlogManager'
import AdminCategoryManager from './admin/AdminCategoryManager'
import AdminExperienceManager from './admin/AdminExperienceManager'
import AdminProjectManager from './admin/AdminProjectManager'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('blog');

  const tabs = [
    { id: 'blog', label: 'Blogs' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'categories', label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Logout />
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'blog' && <AdminBlogManager />}
        {activeTab === 'experience' && <AdminExperienceManager />}
        {activeTab === 'projects' && <AdminProjectManager />}
        {activeTab === 'categories' && <AdminCategoryManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;