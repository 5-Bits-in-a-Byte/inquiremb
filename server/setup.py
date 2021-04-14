"""
Installs the backend server as a python package.
Run "pip install -e ." from the server folder" to install
"""
from setuptools import setup, find_packages

setup(
    name='inquire-backend',
    version='0.1.0',
    packages=find_packages()
)
