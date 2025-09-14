import os
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from routes.index import eval_blueprint
from config import Config
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)

print("CLIENT_URI:", os.getenv("CLIENT_URI"))

# cors_options = {
#     "supports_credentials": True,
#     "origins": [f"{os.getenv('CLIENT_URI')}"],
#     "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
# }
# CORS(app, **cors_options)

app.config.from_object(Config)

Session(app)

app.register_blueprint(eval_blueprint, url_prefix="/api/evaluate")

if __name__ == "__main__":
    app.run(debug=True)