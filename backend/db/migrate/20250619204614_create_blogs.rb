class CreateBlogs < ActiveRecord::Migration[8.0]
  def change
    create_table :blogs do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.jsonb :tags, default: []
      t.boolean :published, default: false
      t.datetime :published_at
      t.text :excerpt
      t.string :slug, null: false
      t.string :reading_time
      t.references :user, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end

    add_index :blogs, :slug, unique: true
    add_index :blogs, :published
    add_index :blogs, :published_at
  end
end
