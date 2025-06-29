import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    published: false,
    category_id: ''
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
      content: '',
      tags: [],
      published: false,
      category_id: ''
    });
    setEditingBlog(null);
  };

  const openModal = (blog = null) => {
    if (blog) {
      setFormData(blog);
      setEditingBlog(blog);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Y modificar el handleSubmit para usar api
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const { data } = await api.put(`/blogs/${editingBlog.id}`, formData);
        setBlogs(blogs.map(blog =>
          blog.id === editingBlog.id ? data : blog
        ));
      } else {
        const { data } = await api.post('/blogs', formData);
        setBlogs([data, ...blogs]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Blogs</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Blog
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 bg-slate-800 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{blog.title}</h3>
                <p className="text-sm text-gray-400">
                  {blog.published ? `Published: ${new Date(blog.published_at).toLocaleDateString()}` : 'Draft'}
                </p>
                <p className="text-sm text-gray-400">Reading time: {blog.reading_time}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openModal(blog)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-300">{blog.excerpt}</p>
            </div>
            <div className="mt-2 flex gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBlog ? 'Edit Blog' : 'Add Blog'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
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

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              required
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              rows="8"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content (Spanish)</label>
            <textarea
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              rows="8"
              value={formData.content_es || ''}
              onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              placeholder="Press Enter to add tags"
              onKeyPress={handleTagInput}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published">Published</label>
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
              {editingBlog ? 'Update' : 'Create'} Blog
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBlogManager;