class Project < ApplicationRecord
  # Acts as list gem
  acts_as_list scope: :category

  # Associations
  belongs_to :user, dependent: :destroy
  belongs_to :category, dependent: :destroy

  # Validations
  validates :title, presence: true, uniqueness: true

  # Model methods
  def self.search(query)
    where("title ILIKE ?", "%#{query}%")
  end

  def self.filter_by_category(category_id)
    joins(:categories).where(categories: { id: category_id })
  end
end
