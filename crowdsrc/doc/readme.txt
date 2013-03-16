Setup project on your machine:
1. Copy the file settings.example.py into /crowdsrc and rename it to settings.py.
2. Set the database parameters for your machine in settings.py


Create or update the database:
python manage.py syncdb

Run the project:
python manage.py runserver