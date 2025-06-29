class AddTranslationsToProjects < ActiveRecord::Migration[8.0]  
  def change
    add_column :projects, :title_es, :string
    add_column :projects, :description_es, :text
  end
end
