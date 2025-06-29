namespace :jwt do
  desc "Clean up expired tokens from JwtDenylist"
  task cleanup: :environment do
    JwtDenylist.where("exp < ?", Time.now).delete_all
    puts "Expired JWT tokens removed from denylist"
  end
end