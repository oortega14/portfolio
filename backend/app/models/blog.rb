class Blog < ApplicationRecord
  # Associations
  has_many :comments, dependent: :destroy
  
  belongs_to :category
  belongs_to :user
  
  # Attributes
  attr_accessor :excerpt
  
  # Validations
  validates :title, presence: true
  validates :content, presence: true
  validates :slug, presence: true, uniqueness: true
  
  # Before actions
  before_validation :generate_slug, if: -> { title.present? && slug.blank? }
  before_save :set_published_at, if: -> { published_changed? && published? }
  before_save :generate_excerpt, if: -> { content_changed? && excerpt.blank? }
  
  # Scopes
  scope :published, -> { where(published: true) }
  scope :by_date, -> { order(published_at: :desc, created_at: :desc) }
  
  def to_param
    slug
  end
  
  private
  
  def generate_slug
    self.slug = title.parameterize
  end
  
  def set_published_at
    self.published_at = published? ? Time.current : nil
  end
  
  def generate_excerpt
    plain_content = ActionView::Base.full_sanitizer.sanitize(content)
    self.excerpt = plain_content.truncate(200)
  end
end
