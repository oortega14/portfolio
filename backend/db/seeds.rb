User.find_or_create_by(email: 'ortegaoscar14@gmail.com') do |user|
  user.name = 'Oscar Ortega'
  user.password = Rails.application.credentials.dig(:default_user, :password) || 'default_password'
  user.active = true
end

puts "Usuario creado/actualizado correctamente"

# Create categories
categories = [
  { name: 'Frontend', description: 'Web development from the client side - HTML, CSS, JavaScript, React, Vue, etc.' },
  { name: 'Backend', description: 'Server-side development - Ruby, Python, Node.js, APIs, databases, etc.' },
  { name: 'DevOps', description: 'Development operations - Docker, AWS, CI/CD, deployment, monitoring.' },
  { name: 'Architecture', description: 'System design, patterns, scalability, and best practices.' },
  { name: 'Security', description: 'Web security, authentication, authorization, and best practices.' },
  { name: 'Performance', description: 'Web optimization, caching, loading strategies, and monitoring.' }
]

categories.each do |category_attrs|
  Category.find_or_create_by!(name: category_attrs[:name]) do |category|
    category.description = category_attrs[:description]
  end
end

puts "Categories created/updated successfully"