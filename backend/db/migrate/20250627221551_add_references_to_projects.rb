class AddReferencesToProjects < ActiveRecord::Migration[8.0]
  def change
    add_reference :projects, :user, null: false, foreign_key: true
    add_reference :projects, :category, null: false, foreign_key: true
  end
end
