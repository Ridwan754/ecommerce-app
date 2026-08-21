from flask import Blueprint, send_from_directory, current_app


upload_routes = Blueprint(
    "upload_routes",
    __name__
)


# ==========================================
# GET FILE UPLOAD
# ==========================================

@upload_routes.route(
    "/uploads/<filename>",
    methods=["GET"]
)
def uploaded_file(filename):

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        filename
    )