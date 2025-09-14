from flask import Blueprint
from controllers.evaluate_controller import evaluate_json_data

eval_blueprint = Blueprint("evaluate", __name__)

eval_blueprint.route("/", methods=["POST"])(evaluate_json_data)