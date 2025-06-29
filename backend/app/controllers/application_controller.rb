class ApplicationController < ActionController::API
  include JsonWebToken
  
  before_action :authenticate_request
  
  private
  
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      @decoded = decode(header)
      @current_user = User.find(@decoded[:user_id]) if @decoded
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: 'User not found' }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: 'Invalid token' }, status: :unauthorized
    rescue JWT::ExpiredSignature => e
      render json: { errors: 'Token has expired' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
end
