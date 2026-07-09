import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings, Bell, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import { initialStudents } from './data/mockData';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [students, setStudents] = useState(initialStudents);

  const navigation = [
    { id: 'dashboard', name: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'students', name: 'จัดการนักเรียน', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-sm flex flex-col z-10 hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/40">
            S
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">School CMS</h1>
            <p className="text-xs text-gray-500">ระบบจัดการนักเรียน</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">เมนูหลัก</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'} />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium">
            <LogOut size={20} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="font-bold text-gray-900">School CMS</h1>
        </div>
        <div className="flex gap-2">
          {navigation.map(item => (
            <button 
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`p-2 rounded-lg ${currentTab === item.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 bg-gray-50'}`}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-100 px-8 hidden md:flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">
              {navigation.find(n => n.id === currentTab)?.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                alt="Admin" 
                className="w-9 h-9 rounded-full bg-gray-200"
              />
              <div className="hidden lg:block text-sm">
                <p className="font-medium text-gray-700">ผู้ดูแลระบบ</p>
                <p className="text-xs text-gray-500">admin@school.ac.th</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-20 md:pb-0">
            {currentTab === 'dashboard' && <Dashboard students={students} />}
            {currentTab === 'students' && <StudentList students={students} setStudents={setStudents} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
