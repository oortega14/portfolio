Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      resources :categories
      resources :blogs do
        collection do
          get ':slug', to: 'blogs#show_by_slug', as: 'by_slug'
        end
      end
      resources :experiences
      resources :projects
      resources :comments
      post '/login', to: 'auth#login'
      delete '/logout', to: 'auth#logout'
    end
  end
end
