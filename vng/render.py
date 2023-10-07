from pathlib import Path
from tempfile import _TemporaryFileWrapper, NamedTemporaryFile

import cadquery as cq
from flask import Flask

from vng.types import NamePlateParameters, PrinterModel


ASSETS_PATH = Path.cwd() / "assets"
FONT_PATH = ASSETS_PATH / "fonts" / "Play-Regular.ttf"
FONT_SIZE = 10
CUT_DISTANCE = 0.6
PLATE_THICKNESS = 10.0


def render_nameplate(app: Flask, params: NamePlateParameters) -> _TemporaryFileWrapper:
    """
    Render VORON nameplate as STL

    WSGI standard requires send_file to call `close()` so the temp file
    used for rendering will get cleaned up after the file has been downloaded
    by the client.

    Args:
        params: Sanitized input params

    Returns:
        BinaryIO like file handle to generated STL
    """
    app.logger.info("Generating nameplate for: %s", params)
    format = cq.exporters.ExportTypes.STL
    match params.model:
        case PrinterModel.VORON_ZERO:
            file = "logo_zero.step" if params.logo else "blank_zero.step"
        case PrinterModel.VORON_ZERO_R2:
            file = "logo_zero_two.step" if params.logo else "blank_zero_two.step"
        case _:
            file = "logo_2020.step" if params.logo else "blank_2020.step"

    blank_plate = ASSETS_PATH / "plates" / file
    app.logger.info("Plate file: %s", blank_plate.absolute())
    plate = cq.importers.importStep(str(blank_plate.absolute()))
    plate_bb = plate.val().BoundingBox()

    # Adjust thickness
    if params.model not in [PrinterModel.VORON_ZERO, PrinterModel.VORON_ZERO_R2]:
        if (distance := params.thickness - PLATE_THICKNESS) < 0.0:
            plate = plate.faces(">Y").workplane(distance).split(keepBottom=True)

    # Create the serial number text
    serial_text = (
        cq.Workplane("XZ")
        .transformed(rotate=cq.Vector(0, 0, 180))
        .text(
            params.name,
            fontsize=FONT_SIZE,
            distance=CUT_DISTANCE,
            fontPath=str(FONT_PATH.absolute()),
            halign="center",
            valign="center",
        )
    )
    serial_text_bb = serial_text.val().BoundingBox()

    # Center serial number on nameplate
    offset = plate_bb.center.sub(serial_text_bb.center)
    offset.y = plate_bb.ymin - serial_text_bb.ymin
    serial_text = serial_text.translate((offset.x, offset.y, offset.z))

    # Cut the serial number
    plate = plate.cut(serial_text.val())

    # Add the serial number object for multi material
    if params.multi_material:
        plate = plate.add(serial_text)

    # Print orientation
    plate = plate.rotate((0, 0, 0), (1000, 0, 0), 90)

    # Export the filament card
    stl = NamedTemporaryFile(prefix=params.name)
    cq.exporters.export(
        plate,
        str(stl.name),
        cq.exporters.ExportTypes.STL,
        tolerance=0.01,
        angularTolerance=0.2,
    )

    # Rewind file pointer so we can send file
    stl.seek(0)

    return stl
