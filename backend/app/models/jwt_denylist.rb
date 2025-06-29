class JwtDenylist < ApplicationRecord
  validates :jti, presence: true
end