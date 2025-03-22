# Hackathon Application - AI for Mental Health: Personalized AI-driven Therapy and Mental Health Monitoring



## Creating a new application
1. Clone the repo `git clone https://github.com/Sawthai/Hackathon.git`.
2. This project was set up using Python 3.11. You might have an older version installed. If you run into an error later that says that your activated Python version isn't compatible, the in the pyproject.toml file, just change the version there to match the version that you have installed. If you do this, you need to make sure that the lock file gets regenerated. You can do this by running `poetry lock --no-update` or by simply deleting the poetry.lock file (it will get regenerated when you run poetry install)/

## Initial Setup
1. In the root directory "Hackathon", install the python dependencies `poetry install`
2. In the `client` directory, install the javascript dependencies `npm install`
3. In the `_server` directory, create a new file called `.env`. Make sure that the `.env` file is on the same level as `.env.example`.
4. Copy the contents of `_server/.env.example` into the newly created `.env` file.
5. Activate the poetry env `poetry shell`
6. Install google-generativeai `poetry add google-generativeai`
7. In the `_server` directory, run the migrations `python manage.py migrate`

## Running the appliction
1. You will need two terminal windows open
2. In one terminal, in the `client` directory run `npm run dev`
3. In the other terminal, in the `_server` directory (with your poetry env activated) run `python manage.py runserver`
4. Visit your application at `http://localhost:8000`
