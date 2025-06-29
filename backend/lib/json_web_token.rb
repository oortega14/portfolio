module JsonWebToken
  extend ActiveSupport::Concern
  
  SECRET_KEY = Rails.application.credentials.secret_key_base
  
  def encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end
  
  def decode(token)
    return nil if token.nil? || JwtDenylist.exists?(jti: token)
    
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  end
end