class Api::V1::ExperiencesController < ApplicationController
  before_action :set_experience, only: [:show, :update, :destroy]
  skip_before_action :authenticate_request, only: [:index, :show]

  # GET /experiences
  def index
    @experiences = Experience.all.order(created_at: :desc)
    render json: @experiences.map { |experience| experience_json(experience) }
  end

  # GET /experiences/:id
  def show
    render json: experience_json(@experience)
  end

  # POST /experiences
  def create
    @experience = Experience.new(experience_params)
    @experience.user_id = current_user.id

    if @experience.save
      render json: @experience, status: :created
    else
      render json: @experience.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /experiences/:id
  def update
    if @experience.update(experience_params)
      render json: @experience
    else
      render json: @experience.errors, status: :unprocessable_entity
    end
  end

  # DELETE /experiences/:id
  def destroy
    if @experience.destroy
      head :no_content
    else
      render json: @experience.errors, status: :unprocessable_entity
    end
  end

  private

  def set_experience
    @experience = Experience.find(params[:id])
  end

  def experience_params
    params.require(:experience).permit(:title, :company, :position_name, :description, 
                                     :company_logo_url, :start_date, :end_date, :current, 
                                     :location, :website_url, :position,
                                     :title_es, :description_es, :position_name_es, :location_es,
                                     technologies: [], responsabilities: [], 
                                     technologies_es: [], responsabilities_es: [])
  end

  def experience_json(experience)
    lang = params[:lang] || 'en'
    
    {
      id: experience.id,
      title: get_content(experience, :title, lang),
      description: get_content(experience, :description, lang),
      position_name: get_content(experience, :position_name, lang),
      location: get_content(experience, :location, lang),
      responsabilities: get_content(experience, :responsabilities, lang),
      technologies: get_content(experience, :technologies, lang),
      company: experience.company,
      company_logo_url: experience.company_logo_url,
      website_url: experience.website_url,
      start_date: experience.start_date,
      end_date: experience.end_date,
      current: experience.current,
      position: experience.position,
      created_at: experience.created_at,
      updated_at: experience.updated_at
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