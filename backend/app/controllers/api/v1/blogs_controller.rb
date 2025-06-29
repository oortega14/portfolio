class Api::V1::BlogsController < ApplicationController
  before_action :set_blog, only: [:update, :destroy]
  before_action :set_blog_by_slug, only: [:show_by_slug]
  skip_before_action :authenticate_request, only: [:index, :show_by_slug]

  # GET /blogs
  def index
    @blogs = Blog.includes(:category, :user).all.order(created_at: :desc)
    render json: @blogs.map { |blog| blog_json(blog) }
  end

  # GET /blogs/:slug
  def show_by_slug
    render json: blog_json(@blog)
  end

  # POST /blogs
  def create
    @blog = Blog.new(blog_params)
    @blog.user_id = current_user.id
    @blog.slug = generate_slug(@blog.title) if @blog.title.present?

    if @blog.save
      render json: blog_json(@blog), status: :created
    else
      render json: @blog.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /blogs/:id
  def update
    # Regenerar slug si el título cambia
    if blog_params[:title] && blog_params[:title] != @blog.title
      @blog.slug = generate_slug(blog_params[:title])
    end

    if @blog.update(blog_params)
      render json: blog_json(@blog)
    else
      render json: @blog.errors, status: :unprocessable_entity
    end
  end

  # DELETE /blogs/:id
  def destroy
    if @blog.destroy
      head :no_content
    else
      render json: @blog.errors, status: :unprocessable_entity
    end
  end

  private

  def set_blog
    @blog = Blog.find(params[:id])
  end

  def set_blog_by_slug
    @blog = Blog.find_by!(slug: params[:slug])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Blog post not found' }, status: :not_found
  end

  def blog_json(blog)
    lang = params[:lang] || 'en'
    
    {
      id: blog.id,
      title: get_content(blog, :title, lang),
      content: get_content(blog, :content, lang),
      excerpt: get_content(blog, :excerpt, lang),
      tags: get_content(blog, :tags, lang),
      slug: blog.slug,
      published: blog.published,
      published_at: blog.published_at,
      reading_time: blog.reading_time,
      category: blog.category&.name,
      author: blog.user&.name,
      created_at: blog.created_at,
      updated_at: blog.updated_at
    }
  end

  def get_content(model, field, lang)
    if lang == 'es' && model.respond_to?("#{field}_es") && model.send("#{field}_es").present?
      model.send("#{field}_es")
    else
      model.send(field)
    end
  end

  def blog_params
    params.require(:blog).permit(:title, :content, :published, :category_id, 
                                 :title_es, :content_es, :excerpt_es,
                                 tags: [], tags_es: [])
  end

  def generate_slug(title)
    base_slug = title.downcase.gsub(/[^a-z0-9\s-]/, '').gsub(/\s+/, '-')
    slug = base_slug
    counter = 1

    while Blog.exists?(slug: slug)
      slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    slug
  end
end
