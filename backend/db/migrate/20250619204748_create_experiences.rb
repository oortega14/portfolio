class CreateExperiences < ActiveRecord::Migration[8.0]
  def change
    create_table :experiences do |t|
      t.string :title, null: false
      t.string :company
      t.string :position_name
      t.text :description
      t.string :company_logo_url
      t.jsonb :technologies, default: []
      t.jsonb :responsabilities, default: []
      t.date :start_date
      t.date :end_date
      t.boolean :current, default: false
      t.string :location
      t.string :website_url
      t.integer :position
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :experiences, :start_date
  end
end
