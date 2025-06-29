ARG RUBY_VERSION=3.4
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install packages needed
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    postgresql-client \
    libyaml-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Configure bundler for development
ENV RAILS_ENV="development" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="" \
    BUNDLE_APP_CONFIG="/usr/local/bundle"

# Verify Ruby and gem installation
RUN ruby -v && \
    gem -v

# Copy Gemfile and install dependencies step by step to debug
COPY Gemfile Gemfile.lock ./

# Set bundler to non-frozen for development
RUN gem install bundler && \
    bundle -v && \
    bundle config set --local frozen false

# Install gems and provide detailed output
RUN bundle install --jobs=4 --retry=3

# Verify Rails installation
RUN bundle exec rails -v || echo "Rails not found in executable path"

# Copy the rest of the application
COPY . .

# Copy entrypoint and make it executable
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Expose the port the app will run on
EXPOSE 3000

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
