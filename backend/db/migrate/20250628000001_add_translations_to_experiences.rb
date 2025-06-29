class AddTranslationsToExperiences < ActiveRecord::Migration[8.0]
  def change
    add_column :experiences, :title_es, :string
    add_column :experiences, :description_es, :text
    add_column :experiences, :position_name_es, :string
    add_column :experiences, :responsabilities_es, :text, array: true, default: []
  end
end