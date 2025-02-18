#!/bin/sh

# Exit on any error
set -e

echo "Setting up Flask App using Conda environment (gee)..."

# Activate the existing Conda environment
source /opt/anaconda3/etc/profile.d/conda.sh  # Ensure Conda is available in shell
conda activate gee

# Confirm the environment
echo "Current ENV: $(conda info --envs | grep '*')"

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run setup.py and install dependencies correctly
python -c "import distutils.core; dist = distutils.core.run_setup('detectron2/setup.py'); \
               import os; os.system('python -m pip install ' + ' '.join(dist.install_requires))"

# Change directory into Detectron2
cd detectron2 || exit

# Check Detectron2 Version
echo "Detectron2 Version:"
python -c "import detectron2; print(detectron2.__version__)"
    
# Go back to the main directory
cd ..

# Set environment variables
export FLASK_APP=./service/index.py

# Run Flask application
echo "🎯 Starting Flask server..."
flask --debug run --host=0.0.0.0 --port=5000