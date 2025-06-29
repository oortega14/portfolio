class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :projects, dependent: :destroy  
  has_many :blogs, dependent: :destroy
  has_many :experiences, dependent: :destroy
  
  # Validations
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validate :only_one_active_user, if: :active?
  
  private
  
  def only_one_active_user
    if User.where(active: true).where.not(id: id).exists?
      errors.add(:active, "Solo puede haber un usuario activo")
    end
  end
end
