import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`p-6 rounded-2xl glass transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center gap-4 border-l-4 ${colorClass}`}>
    <div className={`p-4 rounded-xl ${colorClass.replace('border-', 'bg-').replace('500', '100')} text-${colorClass.split('-')[1]}-600`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default function Dashboard({ students }) {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const classesCount = new Set(students.map(s => s.grade)).size;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">ภาพรวมระบบ</h2>
        <p className="text-gray-500 mt-1">สรุปข้อมูลนักเรียนและชั้นเรียนทั้งหมด</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="นักเรียนทั้งหมด" 
          value={totalStudents} 
          icon={Users} 
          colorClass="border-blue-500" 
        />
        <StatCard 
          title="นักเรียนที่กำลังศึกษา" 
          value={activeStudents} 
          icon={TrendingUp} 
          colorClass="border-green-500" 
        />
        <StatCard 
          title="จำนวนชั้นเรียน" 
          value={classesCount} 
          icon={BookOpen} 
          colorClass="border-purple-500" 
        />
        <StatCard 
          title="อัตราส่วนที่ศึกษาอยู่" 
          value={totalStudents > 0 ? `${Math.round((activeStudents / totalStudents) * 100)}%` : '0%'} 
          icon={GraduationCap} 
          colorClass="border-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ข่าวสารและประกาศ</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">อัปเดตระบบประจำเดือน</h4>
                  <p className="text-sm text-gray-500 mt-1">เพิ่มฟีเจอร์การบันทึกที่อยู่ของนักเรียนในระบบจัดการสมาชิกแล้ว...</p>
                  <span className="text-xs text-primary-500 mt-2 inline-block">2 วันที่ผ่านมา</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ชั้นเรียน (ล่าสุด)</h3>
          <div className="space-y-3">
            {Array.from(new Set(students.map(s => s.grade))).map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-700">{grade}</span>
                <span className="text-sm bg-primary-100 text-primary-700 py-1 px-3 rounded-full">
                  {students.filter(s => s.grade === grade).length} คน
                </span>
              </div>
            ))}
            {classesCount === 0 && (
              <p className="text-center text-gray-400 py-4">ยังไม่มีข้อมูลชั้นเรียน</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
