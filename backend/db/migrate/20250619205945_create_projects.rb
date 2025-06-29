class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :slug, null: false
      t.integer :position
      t.string :github_url
      t.string :website_url
      t.jsonb :technologies, default: []
      t.boolean :published, default: false
      t.datetime :published_at


      t.timestamps
    end
  end
end
