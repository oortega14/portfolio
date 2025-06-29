class AddTranslationsToBlogs < ActiveRecord::Migration[8.0]
  def change
    add_column :blogs, :title_es, :string
    add_column :blogs, :content_es, :text
    add_column :blogs, :excerpt_es, :text
    add_column :blogs, :tags_es, :text, array: true, default: []
  end
end