class Experience < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :projects, dependent: :destroy
  has_many :blogs, dependent: :destroy
  has_many :certifications, dependent: :destroy

  # Attributes
  attr_accessor :duration

  # Validations
  validates :title, presence: true
  validates :company, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :description, presence: true

  def duration
    "#{start_date.strftime('%B %Y')} - #{end_date.strftime('%B %Y')}"
  end
end
