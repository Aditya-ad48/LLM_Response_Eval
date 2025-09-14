from flask import Blueprint
from controllers.evaluate_controller import evaluate_json_data

eval_blueprint = Blueprint("evaluate", __name__)

@eval_blueprint.route("/", methods=["POST"], strict_slashes=False)
def evaluate():
    return evaluate_json_data()