class Api::V1::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :update, :destroy]
  skip_before_action :authenticate_request, only: [:index, :index_by_categories, :show]

  # GET /projects
  def index
    @projects = Project.all.order(created_at: :desc)
    render json: @projects.map { |project| project_json(project) }
  end

  # GET /projects_by_categories
  def index_by_categories
    @projects = Project.includes(:category).order('categories.name, projects.position')
    render json: @projects.map { |project| project_json(project) }, include: :category
  end

  # GET /projects/:id
  def show
    render json: project_json(@project)
  end

  # POST /projects
  def create
    @project = Project.new(project_params)
    @project.user_id = current_user.id
    if @project.save
      render json: @project, status: :created
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /projects/:id
  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # DELETE /projects/:id
  def destroy
    if @project.destroy
      head :no_content
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:title, :description, :slug, :github_url, :website_url, 
                                  :published, :category_id, :image, :position,
                                  :title_es, :description_es,
                                  technologies: [], technologies_es: [])
  end

  def project_json(project)
    lang = params[:lang] || 'en'
    
    {
      id: project.id,
      title: get_content(project, :title, lang),
      description: get_content(project, :description, lang),
      technologies: get_content(project, :technologies, lang),
      slug: project.slug,
      github_url: project.github_url,
      website_url: project.website_url,
      published: project.published,
      published_at: project.published_at,
      position: project.position,
      category: project.category&.name,
      created_at: project.created_at,
      updated_at: project.updated_at
    }
  end

  def get_content(model, field, lang)
    if lang == 'es' && model.respond_to?("#{field}_es") && model.send("#{field}_es").present?
      model.send("#{field}_es")
    else
      model.send(field)
    end
  end
end