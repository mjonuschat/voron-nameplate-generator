from pathlib import Path

from flask import Flask, render_template, request, send_file

from vng.render import render_nameplate
from vng.types import NamePlateParameters

TEMPLATE_PATH = Path.cwd() / "public"
STATIC_PATH = Path.cwd() / "public" / "assets"


def create_app() -> Flask:
    app = Flask(
        __name__,
        template_folder=TEMPLATE_PATH.absolute(),
        static_folder=STATIC_PATH.absolute(),
        static_url_path="/assets",
    )

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/nameplate/create", methods=["POST"])
    def plate_create():
        params = NamePlateParameters(**request.form)
        return send_file(
            render_nameplate(app=app, params=params),
            mimetype="model/stl",
            as_attachment=True,
            download_name=params.download_name,
        )

    return app
