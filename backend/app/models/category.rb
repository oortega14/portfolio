class Category < ApplicationRecord
  # Validations
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true

  # Associations
  has_many :projects, dependent: :destroy
  has_many :blogs, dependent: :destroy
end