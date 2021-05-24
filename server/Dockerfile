FROM python:3.8

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt
RUN pip install -e .
EXPOSE 5000
ENTRYPOINT [ "python" ]
CMD [ "inquire/__init__.py" ]
