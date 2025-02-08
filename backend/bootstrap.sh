#!/bin/sh

export FLASK_APP=./service/index.py
pipenv run flask --debug run -h 0.0.0.0