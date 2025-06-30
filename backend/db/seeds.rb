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

# Find the user to assign experiences and projects
user = User.find_by(email: 'ortegaoscar14@gmail.com')

# Create experiences
experiences = [
  {
    title: 'Ruby on Rails Developer (Monolithic)',
    title_es: 'Desarrollador Ruby on Rails (Monolítico)',
    company: 'Fuzati',
    position_name: 'Ruby on Rails Developer',
    position_name_es: 'Desarrollador Ruby on Rails',
    description: "Development of the ARK project, an application that helps Diocese and schools test students and generate performance reports across multiple US states.",
    description_es: "Desarrollo del proyecto ARK, una aplicación que ayuda a Diocesis y escuelas a probar estudiantes y generar informes de rendimiento en varios estados de EE. UU.",
    responsabilities: [
      "Maintained and enhanced a Ruby on Rails application, implementing features using Devise, Impersonate, Ransack, and Prawn",
      "Developed unit tests with RSpec for controllers, models, and services",
      "Optimized client-side interactions using jQuery, vanilla JavaScript, and React.js components",
      "Managed deployments and infrastructure using Cloud66",
      "Worked with Agile SCRUM methodology"
    ],
    responsabilities_es: [
      "Mantuvo y mejoró una aplicación Ruby on Rails, implementando características utilizando Devise, Impersonate, Ransack y Prawn",
      "Desarrolló pruebas unitarias con RSpec para controladores, modelos y servicios",
      "Optimizó las interacciones del lado del cliente utilizando jQuery, JavaScript vanilla y componentes de React.js",
      "Administró despliegues y infraestructura utilizando Cloud66",
      "Trabajó con metodología Agile SCRUM"
    ],
    technologies: ['Ruby on Rails', 'jQuery', 'PostgreSQL', 'Bootstrap', 'Git', 'RSpec', 'Devise', 'Cloud66'],
    start_date: Date.new(2024, 8, 1),
    end_date: nil,
    current: true,
    location: 'Remote',
    website_url: 'https://www.fuzati.com',
    position: 1,
    user: user
  },
  {
    title: 'Ruby on Rails Developer (API)',
    title_es: 'Desarrollador Ruby on Rails (API)',
    company: 'GFT Technologies LATAM',
    position_name: 'Ruby on Rails API Developer',
    position_name_es: 'Desarrollador de API Ruby on Rails',
    description: "Development of electronic invoicing API in Colombia (CDP Project).",
    description_es: "Desarrollo de la API de facturación electrónica en Colombia (Proyecto CDP).",
    responsabilities: [
      "Developed a Ruby on Rails API for electronic invoice management",
      "Optimized PostgreSQL database improving query performance",
      "Optimized background job processing using Sidekiq and Redis",
      "Managed containers with Docker for development and deployment",
      "Collaborated using Git and Azure DevOps"
    ],
    responsabilities_es: [
      "Desarrolló una API Ruby on Rails para la gestión de facturas electrónicas",
      "Optimizó la base de datos PostgreSQL mejorando el rendimiento de las consultas",
      "Optimizó el procesamiento de trabajos en segundo plano utilizando Sidekiq y Redis",
      "Administró contenedores con Docker para desarrollo y despliegue",
      "Colaboró utilizando Git y Azure DevOps"
    ],
    technologies: ['Ruby on Rails', 'PostgreSQL', 'Sidekiq', 'Redis', 'Docker', 'Git', 'Azure DevOps'],
    start_date: Date.new(2023, 3, 1),
    end_date: Date.new(2024, 8, 31),
    current: false,
    location: 'Remote',
    website_url: 'https://www.gft.com',
    position: 2,
    user: user
  },
  {
    title: 'Ruby on Rails Developer (Monolithic)',
    title_es: 'Desarrollador Ruby on Rails (Monolítico)',
    company: 'ISWO Intelligence Software',
    position_name: 'Full Stack Developer',
    position_name_es: 'Desarrollador Full Stack',
    description: "Development of a web application for internal documentation management and ISO certification.",
    description_es: "Desarrollo de una aplicación web para la gestión de documentación interna y certificación ISO.",
    responsabilities: [
      "Developed and maintained robust web applications using Ruby on Rails",
      "Implemented unit tests with Minitest achieving 85% coverage",
      "Enhanced frontend interaction using Stimulus",
      "Integrated React.js components into existing Rails applications",
      "Improved and styled user interface using CSS and Sass"
    ],
    responsabilities_es: [
      "Desarrolló y mantuvo aplicaciones web robustas utilizando Ruby on Rails",
      "Implementó pruebas unitarias con Minitest alcanzando el 85% de cobertura",
      "Mejoró la interacción del frontend utilizando Stimulus",
      "Integró componentes de React.js en aplicaciones Rails existentes",
      "Mejoró y estilizó la interfaz de usuario utilizando CSS y Sass"
    ],
    technologies: ['Ruby on Rails', 'React', 'PostgreSQL', 'Bootstrap', 'Git', 'Sidekiq', 'Redis', 'Stimulus', 'Minitest'],
    start_date: Date.new(2021, 10, 1),
    end_date: Date.new(2023, 3, 31),
    current: false,
    location: 'Remote',
    website_url: 'https://www.iswo.co',
    position: 3,
    user: user
  },
  {
    title: 'Ruby on Rails Developer (Both)',
    title_es: 'Desarrollador Ruby on Rails (Ambos)',
    company: 'Freelance',
    position_name: 'Freelance Developer',
    position_name_es: 'Desarrollador Freelance',
    description: "Development of various freelance projects.",
    description_es: "Desarrollo de varios proyectos freelance.",
    responsabilities: [
      "Developed Ruby on Rails applications implementing microservices architecture",
      "Managed asynchronous jobs with Redis and Sidekiq",
      "Implemented real-time communication using Websockets",
      "Developed landing pages using React.js, Bootstrap and TailwindCSS",
      "Led technical design and implementation phases of projects"
    ],
    responsabilities_es: [
      "Desarrolló aplicaciones Ruby on Rails implementando arquitectura de microservicios",
      "Administró trabajos asincrónicos con Redis y Sidekiq",
      "Implementó comunicación en tiempo real utilizando Websockets",
      "Desarrolló páginas de aterrizaje utilizando React.js, Bootstrap y TailwindCSS",
      "Lideró fases de diseño técnico e implementación de proyectos"
    ],
    technologies: ['Ruby on Rails', 'React', 'PostgreSQL', 'TailwindCSS', 'Git', 'Sidekiq', 'Redis', 'Docker', 'Websockets'],
    start_date: Date.new(2020, 1, 1),
    end_date: Date.new(2021, 10, 31),
    current: false,
    location: 'Remote',
    position: 4,
    user: user
  }
]

experiences.each do |experience_attrs|
  Experience.find_or_create_by!(
    title: experience_attrs[:title],
    company: experience_attrs[:company],
    user: experience_attrs[:user]
  ) do |experience|
    experience.assign_attributes(experience_attrs.except(:user))
  end
end

puts "Experiences created/updated successfully"

# Create projects
frontend_category = Category.find_by(name: 'Frontend')
backend_category = Category.find_by(name: 'Backend')

projects = [
  {
    title: 'ISWO Academy',
    title_es: 'ISWO Academy',
    description: 'Application to create and manage courses for the ISWO Academy',
    description_es: 'Aplicación para crear y gestionar cursos para la ISWO Academy',
    slug: 'iswo-academy',
    technologies: ['Ruby on Rails', 'Next.js', 'Zod', 'PostgreSQL', 'TailwindCSS'],
    website_url: 'https://www.iswoacademy.com',
    published: true,
    published_at: Time.current,
    position: 1,
    user: user,
    category: frontend_category
  },
  {
    title: 'Luminous Rails UI',
    title_es: 'Luminous Rails UI',
    description: 'User interface library for Ruby on Rails created with TailwindCSS and view-components gem',
    description_es: 'Librería de interfaz de usuario para Ruby on Rails creada con TailwindCSS y view-components gem',
    slug: 'luminous-rails-ui',
    technologies: ['Ruby on Rails', 'TailwindCSS', 'View Components'],
    github_url: 'https://github.com/oortega14/luminous_rails_ui',
    website_url: 'https://github.com/oortega14/luminous_rails_ui',
    published: true,
    published_at: Time.current,
    position: 2,
    user: user,
    category: frontend_category
  },
  {
    title: 'JSON API Responses',
    title_es: 'JSON API Responses',
    description: 'Gem to generate JSON API responses for Ruby on Rails',
    description_es: 'Gema para generar respuestas JSON API para Ruby on Rails',
    slug: 'jsonapi-responses',
    technologies: ['Ruby on Rails', 'Ruby', 'JSON API'],
    github_url: 'https://github.com/oortega14/jsonapi_responses',
    website_url: 'https://github.com/oortega14/jsonapi_responses',
    published: true,
    published_at: Time.current,
    position: 3,
    user: user,
    category: backend_category
  }
]

projects.each do |project_attrs|
  Project.find_or_create_by!(
    title: project_attrs[:title],
    slug: project_attrs[:slug],
    user: project_attrs[:user]
  ) do |project|
    project.assign_attributes(project_attrs.except(:user))
  end
end

puts "Projects created/updated successfully"

