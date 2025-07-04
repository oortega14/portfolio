class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :name
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
