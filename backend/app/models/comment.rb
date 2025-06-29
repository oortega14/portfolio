class Comment < ApplicationRecord
  # Associations
  belongs_to :blog
  belongs_to :user
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy
  
  # Validations
  validates :body, presence: true
  
  # Scopes
  scope :approved, -> { where(approved: true) }
  scope :root_comments, -> { where(parent_id: nil) }
  
  # Methods
  def author_name
    user.name
  end
end
