---

# RBAC API with React Frontend - Complete Setup & Usage Guide

---

## System Dependencies

Make sure your system has the following installed:

* **Git**
* **Build essentials & libraries** (for Ruby compilation)

```bash
sudo apt update
sudo apt install -y build-essential libssl-dev libreadline-dev zlib1g-dev git
```

* **rbenv & ruby-build** (for Ruby version management)

```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc

mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build

rbenv install 3.0.0
rbenv global 3.0.0
ruby -v
```

* **Bundler and Rails gems**

```bash
gem install bundler
gem install rails
```

* **Node.js & npm (via nvm)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v
npm -v
```

---

## Configuration

### Backend (Rails)

* Clone the repo or copy project files.
* Install gems:

```bash
bundle install
```

* Setup Doorkeeper (OAuth2 provider):

```bash
rails generate doorkeeper:install
rails generate doorkeeper:migration
rails db:migrate
```

* Create Doorkeeper OAuth Application:

Either in `db/seeds.rb` or Rails console:

```ruby
Doorkeeper::Application.create!(
  name: "React Client",
  uid: "TestClient",
  secret: "",           # Optional
  redirect_uri: "",     # Optional for password grant
  scopes: ""
)
```

* Create admin user and roles (Rails console):

```ruby
admin_role = Role.find_or_create_by!(name: 'Admin')
User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password', role_id: admin_role.id)
```

* Configure your Rails server to listen on all interfaces (optional):

In `config/puma.rb` or start server with:

```bash
rails s -b 0.0.0.0
```

### Frontend (React + Vite)

* Navigate to React folder (e.g. `rbac-react`):

```bash
cd rbac-react
npm install
```

* Edit `vite.config.js` to expose server on all interfaces:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001
  }
})
```

* In `src/api.js`, set backend API base URL:

```js
const API = axios.create({ baseURL: 'http://localhost:3000' }) // or backend IP
```

* Start React dev server:

```bash
npm run dev
```

---

## Database Creation and Initialization

* Create and setup your database (e.g. PostgreSQL):

```bash
rails db:create
rails db:migrate
rails db:seed  # if you have seed data like OAuth app, roles, admin user
```

---

## How to Run the Test Suite

* Backend (RSpec + RSwag):

```bash
bundle exec rspec
```

* This runs your backend tests AND generates Swagger API documentation.

---

## Services

* No external job queues, cache servers, or search engines required by default.
* If you add background jobs, configure Sidekiq, Redis etc. accordingly.

---

## Deployment Instructions

1. Prepare server with dependencies (Ruby, Node, DB).
2. Pull the repo.
3. Run `bundle install` and `npm install`.
4. Setup DB and seed data.
5. Precompile assets if you want a production React build:

```bash
npm run build
```

6. Run Rails server (with appropriate environment):

```bash
rails s -e production -b 0.0.0.0
```

7. Serve React build with a web server or serve via Rails static files.

---

## RSwag - API Testing and Swagger Documentation

### Installation

Add to Gemfile:

```ruby
group :development, :test do
  gem 'rswag'
end
```

Then:

```bash
bundle install
rails generate rswag:install
```

### Configuration

Edit `spec/swagger_helper.rb` to set API metadata and servers:

```ruby
RSpec.configure do |config|
  config.swagger_root = Rails.root.join('swagger').to_s

  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'RBAC API V1',
        version: 'v1'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: :JWT
          }
        }
      },
      security: [{ bearerAuth: [] }],
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      paths: {}
    }
  }

  config.swagger_format = :yaml
end
```

### Writing API Specs

Example in `spec/integration/users_spec.rb`:

```ruby
require 'swagger_helper'

RSpec.describe 'Users API', type: :request do
  path '/api/managed_users' do
    get 'Retrieve all managed users' do
      tags 'Managed Users'
      produces 'application/json'
      security [bearerAuth: []]

      response '200', 'Users found' do
        let(:Authorization) { "Bearer #{valid_token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
        end
      end

      response '401', 'Unauthorized' do
        run_test!
      end
    end
  end
end
```

### Running Tests and Generating Swagger Docs

```bash
bundle exec rspec
```

This runs your specs and updates `swagger/v1/swagger.yaml`.

### Access Swagger UI

Start your Rails server:

```bash
rails s -b 0.0.0.0
```

Open in browser:

```
http://localhost:3000/api-docs
```

You get:

* Full interactive Swagger UI
* Ability to authorize with Bearer JWT token
* Try out API calls live from the browser

---

## Additional Notes

* Store your OAuth Client ID & Secret securely and use them in your React app `api.js` for token requests.
* Use localStorage in React to persist access and refresh tokens.
* Refresh tokens automatically via Axios interceptors to keep sessions alive.

---

## Quick Commands Summary

```bash
# Setup backend dependencies
bundle install
rails generate doorkeeper:install
rails generate doorkeeper:migration
rails db:migrate
rails db:seed

# Run backend tests + generate Swagger docs
bundle exec rspec

# Start Rails server
rails s -b 0.0.0.0

# Setup frontend
cd rbac-react
npm install
npm run dev  # or npm run build for production

# Access Swagger UI
http://localhost:3000/api-docs
```

