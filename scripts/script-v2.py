import xml.etree.ElementTree as ET

def extract_coordinates_from_kml(kml_file_path):
    # Parse the KML file
    tree = ET.parse(kml_file_path)
    root = tree.getroot()

    # Define all necessary namespaces
    namespaces = {
        "kml": "http://www.opengis.net/kml/2.2",  # Main KML namespace
        "gx": "http://www.google.com/kml/ext/2.2",  # Google Earth extensions
        "atom": "http://www.w3.org/2005/Atom",  # Atom feed
        "xsd": "http://www.w3.org/2001/XMLSchema"  # XML schema
    }

    # Find all Placemark elements and extract their coordinates
    coordinates = []
    for placemark in root.findall(".//kml:Placemark", namespaces=namespaces):
        point = placemark.find(".//kml:Point/kml:coordinates", namespaces=namespaces)
        if point is not None:
            coord_text = point.text.strip()
            lon, lat, _ = map(float, coord_text.split(","))
            coordinates.append((lat, lon))

    return coordinates

# Extract coordinates from the provided KML file
kml_file_path = 'resource/urban_location.kml'  # Update to your KML file path
urban_coordinates = extract_coordinates_from_kml(kml_file_path)
print(urban_coordinates)