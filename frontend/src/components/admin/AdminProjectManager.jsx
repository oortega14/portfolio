import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';

const AdminProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_es: '',
    description: '',
    description_es: '',
    slug: '',
    github_url: '',
    website_url: '',
    technologies: [],
    technologies_es: [],
    published: false,
    category_id: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_es: '',
      description: '',
      description_es: '',
      slug: '',
      github_url: '',
      website_url: '',
      technologies: [],
      technologies_es: [],
      published: false,
      category_id: ''
    });
    setEditingProject(null);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const openModal = (project = null) => {
    if (project) {
      setFormData(project);
      setEditingProject(project);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleTechnologyInput = (e, field = 'technologies') => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTech = e.target.value.trim();
      const currentArray = formData[field] || [];
      if (!currentArray.includes(newTech)) {
        setFormData({
          ...formData,
          [field]: [...currentArray, newTech]
        });
      }
      e.target.value = '';
    }
  };

  const removeTechnology = (techToRemove, field = 'technologies') => {
    const currentArray = formData[field] || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter(tech => tech !== techToRemove)
    });
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const { data } = await api.put(`/projects/${editingProject.id}`, formData);
        setProjects(projects.map(proj =>
          proj.id === editingProject.id ? data : proj
        ));
      } else {
        const { data } = await api.post('/projects', formData);
        setProjects([data, ...projects]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(proj => proj.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const togglePublished = async (project) => {
    try {
      const updatedData = {
        ...project,
        published: !project.published,
        published_at: !project.published ? new Date().toISOString() : null
      };
      const { data } = await api.put(`/projects/${project.id}`, updatedData);
      setProjects(projects.map(proj =>
        proj.id === project.id ? data : proj
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Projects</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-slate-800 rounded">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${project.published
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-gray-500/20 text-gray-300'
                    }`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Slug: {project.slug}</p>
                <p className="text-sm text-gray-400">
                  Category: {categories.find(cat => cat.id === project.category_id)?.name || 'N/A'}
                </p>
                {project.published_at && (
                  <p className="text-sm text-gray-400">
                    Published: {new Date(project.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="space-x-2 flex">
                <button
                  onClick={() => togglePublished(project)}
                  className={`text-sm px-3 py-1 rounded ${project.published
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    }`}
                >
                  {project.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openModal(project)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-300">{project.description}</p>
            </div>

            <div className="mt-2 flex gap-4 text-sm">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  GitHub
                </a>
              )}
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300"
                >
                  Live Demo
                </a>
              )}
            </div>

            {project.technologies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Technologies:</p>
                <div className="flex gap-1 flex-wrap">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
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
        title={editingProject ? 'Edit Project' : 'Add Project'}
        size="lg"
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
                onChange={handleTitleChange}
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
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              required
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Descripciones */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description (English) *</label>
              <textarea
                required
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
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input
                type="url"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
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

          {/* Tecnologías en ambos idiomas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technologies (English)</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
                placeholder="Press Enter to add technologies"
                onKeyPress={(e) => handleTechnologyInput(e, 'technologies')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech, 'technologies')}
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
                onKeyPress={(e) => handleTechnologyInput(e, 'technologies_es')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.technologies_es || []).map((tech, index) => (
                  <span
                    key={index}
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech, 'technologies_es')}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm">Published</label>
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
              {editingProject ? 'Update' : 'Create'} Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProjectManager;
