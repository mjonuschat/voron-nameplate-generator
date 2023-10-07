# Voron Nameplate Generator

Voron Nameplate Genertor to create nameplates personalized with your printers
serial number (and optionally a logo).

## Inputs

- Printer Model
  Defines the prefix for the debossed serial number (e.g. VT)
- Serial Number
  The serial for your printer model (e.g. 888)
- Panel Thickness
  Defines how thick the panel (including foam) is where you want to mount
  the generated plate. Not used for V0 models.
- Logo
  Will add the Voron hex logo to the nameplate if selected

## Credits

- https://github.com/rdmullett/voron_serial_plate
  The original Reddit bot that created serial number plates

  Step files for the 2020 extrusions have been recreated based on
  the OpenSCAD models in this repository.
- https://www.printables.com/model/83468-voron-v0-serial-plate-adaptation
  Blank step files for the V0.0 / V0.1 nameplates have been created based
  on the files shared here.
- https://github.com/rdmullett/voron_serial_plate/pull/5
  V0.2 compatible clip positions have been taken from this pull request for
  the original bot

## Build & Deployment

Docker images to run VNG can be build using [Paketo](https://paketo.io/) buildpacks,
for example with a command like this:

```
pack build vng \
    --builder paketobuildpacks/builder-jammy-full \
    --pre-buildpack fagiani/apt \
    --pre-buildpack paketo-buildpacks/nodejs \
    --pre-buildpack paketo-buildpacks/nginx \
    -D app
```

## License

GNU General Public License v3.0
