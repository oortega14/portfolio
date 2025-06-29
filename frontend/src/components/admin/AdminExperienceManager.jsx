import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';

const AdminExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_es: '',
    company: '',
    position_name: '',
    position_name_es: '',
    description: '',
    description_es: '',
    company_logo_url: '',
    technologies: [],
    technologies_es: [],
    responsabilities: [],
    responsabilities_es: [],
    start_date: '',
    end_date: '',
    current: false,
    location: '',
    location_es: '',
    website_url: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await api.get('/experiences');
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_es: '',
      company: '',
      position_name: '',
      position_name_es: '',
      description: '',
      description_es: '',
      company_logo_url: '',
      technologies: [],
      technologies_es: [],
      responsabilities: [],
      responsabilities_es: [],
      start_date: '',
      end_date: '',
      current: false,
      location: '',
      location_es: '',
      website_url: ''
    });
    setEditingExperience(null);
  };

  const openModal = (experience = null) => {
    if (experience) {
      setFormData({
        ...experience,
        start_date: experience.start_date?.split('T')[0] || '',
        end_date: experience.end_date?.split('T')[0] || '',
      });
      setEditingExperience(experience);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleArrayInput = (e, field) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newItem = e.target.value.trim();
      const currentArray = formData[field] || [];
      if (!currentArray.includes(newItem)) {
        setFormData({
          ...formData,
          [field]: [...currentArray, newItem]
        });
      }
      e.target.value = '';
    }
  };

  const removeArrayItem = (itemToRemove, field) => {
    const currentArray = formData[field] || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter(item => item !== itemToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExperience) {
        const { data } = await api.put(`/experiences/${editingExperience.id}`, formData);
        setExperiences(experiences.map(exp =>
          exp.id === editingExperience.id ? data : exp
        ));
      } else {
        const { data } = await api.post('/experiences', formData);
        setExperiences([data, ...experiences]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.delete(`/experiences/${id}`);
        setExperiences(experiences.filter(exp => exp.id !== id));
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Experiences</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="p-4 bg-slate-800 rounded">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{experience.title}</h3>
                <p className="text-blue-400">{experience.company}</p>
                <p className="text-sm text-gray-400">{experience.position_name}</p>
                <p className="text-sm text-gray-400">{experience.location}</p>
                <p className="text-sm text-gray-400">
                  {new Date(experience.start_date).toLocaleDateString()} -
                  {experience.current ? ' Present' : ` ${new Date(experience.end_date).toLocaleDateString()}`}
                </p>
              </div>
              <div className="space-x-2 flex">
                <button
                  onClick={() => openModal(experience)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-300">{experience.description}</p>
            </div>

            {experience.technologies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Technologies:</p>
                <div className="flex gap-1 flex-wrap">
                  {experience.technologies.map((tech, index) => (
                    <span key={index} className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExperience ? 'Edit Experience' : 'Add Experience'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Títulos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title (English) *</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (Spanish)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.title_es || ''}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company *</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          {/* Posiciones */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Position (English)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.position_name}
                onChange={(e) => setFormData({ ...formData, position_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position (Spanish)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.position_name_es || ''}
                onChange={(e) => setFormData({ ...formData, position_name_es: e.target.value })}
              />
            </div>
          </div>

          {/* Ubicaciones */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location (English)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location (Spanish)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.location_es || ''}
                onChange={(e) => setFormData({ ...formData, location_es: e.target.value })}
              />
            </div>
          </div>

          {/* Descripciones */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description (English)</label>
              <textarea
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Spanish)</label>
              <textarea
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                rows="4"
                value={formData.description_es || ''}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Logo URL</label>
              <input
                type="url"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.company_logo_url}
                onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="url"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                disabled={formData.current}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 disabled:opacity-50"
                value={formData.current ? '' : formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
                className="mr-2"
              />
              <label htmlFor="current" className="text-sm">Current Position</label>
            </div>
          </div>

          {/* Tecnologías en ambos idiomas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technologies (English)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                placeholder="Press Enter to add technologies"
                onKeyPress={(e) => handleArrayInput(e, 'technologies')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(tech, 'technologies')}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Technologies (Spanish)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                placeholder="Press Enter to add technologies"
                onKeyPress={(e) => handleArrayInput(e, 'technologies_es')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.technologies_es || []).map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(tech, 'technologies_es')}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Responsabilidades en ambos idiomas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Responsibilities (English)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                placeholder="Press Enter to add responsibilities"
                onKeyPress={(e) => handleArrayInput(e, 'responsabilities')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.responsabilities.map((resp, index) => (
                  <span
                    key={index}
                    className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(resp, 'responsabilities')}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Responsibilities (Spanish)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                placeholder="Press Enter to add responsibilities"
                onKeyPress={(e) => handleArrayInput(e, 'responsabilities_es')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.responsabilities_es || []).map((resp, index) => (
                  <span
                    key={index}
                    className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(resp, 'responsabilities_es')}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingExperience ? 'Update' : 'Create'} Experience
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminExperienceManager;
