# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_28_000002) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "blogs", force: :cascade do |t|
    t.string "title", null: false
    t.text "content", null: false
    t.jsonb "tags", default: []
    t.boolean "published", default: false
    t.datetime "published_at"
    t.text "excerpt"
    t.string "slug", null: false
    t.string "reading_time"
    t.bigint "user_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title_es"
    t.text "content_es"
    t.text "excerpt_es"
    t.text "tags_es", default: [], array: true
    t.index ["category_id"], name: "index_blogs_on_category_id"
    t.index ["published"], name: "index_blogs_on_published"
    t.index ["published_at"], name: "index_blogs_on_published_at"
    t.index ["slug"], name: "index_blogs_on_slug", unique: true
    t.index ["user_id"], name: "index_blogs_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.text "body", null: false
    t.bigint "blog_id", null: false
    t.bigint "user_id", null: false
    t.bigint "parent_id"
    t.boolean "approved", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blog_id"], name: "index_comments_on_blog_id"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "experiences", force: :cascade do |t|
    t.string "title", null: false
    t.string "company"
    t.string "position_name"
    t.text "description"
    t.string "company_logo_url"
    t.jsonb "technologies", default: []
    t.jsonb "responsabilities", default: []
    t.date "start_date"
    t.date "end_date"
    t.boolean "current", default: false
    t.string "location"
    t.string "website_url"
    t.integer "position"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title_es"
    t.text "description_es"
    t.string "position_name_es"
    t.text "responsabilities_es", default: [], array: true
    t.index ["start_date"], name: "index_experiences_on_start_date"
    t.index ["user_id"], name: "index_experiences_on_user_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exp"], name: "index_jwt_denylists_on_exp"
    t.index ["jti"], name: "index_jwt_denylists_on_jti", unique: true
  end

  create_table "projects", force: :cascade do |t|
    t.string "title", null: false
    t.text "description", null: false
    t.string "slug", null: false
    t.integer "position"
    t.string "github_url"
    t.string "website_url"
    t.jsonb "technologies", default: []
    t.boolean "published", default: false
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "category_id", null: false
    t.string "title_es"
    t.text "description_es"
    t.index ["category_id"], name: "index_projects_on_category_id"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "blogs", "categories"
  add_foreign_key "blogs", "users"
  add_foreign_key "comments", "blogs"
  add_foreign_key "comments", "comments", column: "parent_id"
  add_foreign_key "comments", "users"
  add_foreign_key "experiences", "users"
  add_foreign_key "projects", "categories"
  add_foreign_key "projects", "users"
end
