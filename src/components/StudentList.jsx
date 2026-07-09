import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function StudentList({ students, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    grade: '',
    phone: '',
    email: '',
    address: '',
    status: 'active'
  });

  const filteredStudents = students.filter(student => 
    (student.firstName && student.firstName.includes(searchTerm)) || 
    (student.lastName && student.lastName.includes(searchTerm)) ||
    (student.id && student.id.includes(searchTerm)) ||
    (student.grade && student.grade.includes(searchTerm))
  );

  const openModal = (student = null) => {
    if (student) {
      setFormData(student);
      setEditingId(student.id);
    } else {
      setFormData({
        id: `STU-${String(students.length + 1).padStart(3, '0')}`,
        firstName: '',
        lastName: '',
        grade: '',
        phone: '',
        email: '',
        address: '',
        status: 'active'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dbPayload = {
        id: formData.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        grade: formData.grade,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        status: formData.status
      };

      if (editingId) {
        const { error } = await supabase
          .from('students')
          .update(dbPayload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([dbPayload]);
        if (error) throw error;
      }
      
      await onRefresh();
      closeModal();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนักเรียนคนนี้ใช่หรือไม่?')) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await onRefresh();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">รายชื่อนักเรียน</h2>
          <p className="text-gray-500 mt-1">จัดการข้อมูลสมาชิกนักเรียนทั้งหมด</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
        >
          <Plus size={20} />
          เพิ่มนักเรียนใหม่
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, รหัสประจำตัว, หรือชั้นเรียน..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 text-sm">
                <th className="p-4 font-medium">รหัส</th>
                <th className="p-4 font-medium">ชื่อ - นามสกุล</th>
                <th className="p-4 font-medium">ชั้นเรียน</th>
                <th className="p-4 font-medium hidden md:table-cell">ที่อยู่</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-primary-50/30 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{student.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-sm text-gray-600 max-w-xs truncate flex items-center gap-1" title={student.address}>
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        {student.address || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      {student.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          <Check size={12} /> กำลังศึกษา
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                          <X size={12} /> พ้นสภาพ
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => openModal(student)}
                        className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors inline-flex"
                        title="แก้ไข"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                        title="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    ไม่พบข้อมูลนักเรียนที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="student-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รหัสประจำตัว</label>
                    <input type="text" name="id" value={formData.id} onChange={handleChange} required
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50"
                      readOnly={!!editingId}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นเรียน</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleChange} required placeholder="เช่น ม.4/1"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">กำลังศึกษา</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">พ้นสภาพ/จบการศึกษา</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={closeModal}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                form="student-form"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
