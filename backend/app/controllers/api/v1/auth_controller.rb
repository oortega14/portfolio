# In your auth_controller.rb
class Api::V1::AuthController < ApplicationController
  include JsonWebToken
  skip_before_action :authenticate_request, only: [:login]
  
  # POST /auth/login
  def login
    @user = User.find_by(email: params[:email])
        
    if @user&.authenticate(params[:password])
      token = encode(user_id: @user.id)
      render json: { token: token, user: { id: @user.id, email: @user.email } }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
  
  # DELETE /auth/logout
  def logout
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    if token
      exp = @decoded[:exp] || 24.hours.from_now.to_i
      JwtDenylist.create!(jti: token, exp: Time.at(exp))
      render json: { message: 'Successfully logged out' }, status: :ok
    else
      render json: { error: 'No token provided' }, status: :bad_request
    end
  end
end