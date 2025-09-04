# VolunTrack — README

Simple instructions to get the backend running locally.

## Requirements
- PHP 8.0+ 
- Composer
- MySQL 

## Setup
1. Copy environment file:
    cp .env.example .env
2. Edit .env and set at least: 
    - DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
3. Install PHP dependencies:
    composer install
4. Generate app key:
    php artisan key:generate
5. Run migrations :
    php artisan migrate
    

## Running
- Start the local server:
  php artisan serve
  By default available at http://127.0.0.1:8000


