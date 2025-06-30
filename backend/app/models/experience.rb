class Experience < ApplicationRecord
  # Associations
  belongs_to :user

  # Attributes
  attr_accessor :duration

  # Validations
  validates :title, presence: true
  validates :company, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true, unless: :current?
  validates :description, presence: true

  def duration
    if current? && end_date.nil?
      "#{start_date.strftime('%B %Y')} - Present"
    else
      "#{start_date.strftime('%B %Y')} - #{end_date.strftime('%B %Y')}"
    end
  end
end
