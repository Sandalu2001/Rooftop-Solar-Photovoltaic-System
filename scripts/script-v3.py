
import os
import pyautogui
import time

def create_kml_file(latitude, longitude, filename="urban_location.kml"):
    kml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Urban Area</name>
    <Point>
      <coordinates>{longitude},{latitude},0</coordinates>
    </Point>
  </Placemark>
</kml>"""

    with open(filename, 'w') as f:
        f.write(kml_content)

latitude = 40.730610   
longitude = -73.935242 
# create_kml_file(latitude, longitude)

# ------------------------------------------------------------#

def automate_google_earth(kml_file, output_folder, zoom_in=True):
    # Move the mouse to the center of the screen
    pyautogui.click(800, 500)
    time.sleep(1)

    # # Open Google Earth Pro (ensure the program is already open)
    # pyautogui.hotkey('command', 'tab')  # Switch to Google Earth Pro (assumes it's already running)
    # time.sleep(1) 

    # # # Open KML File
    # pyautogui.hotkey('command', 'o')  
    # time.sleep(1)
    
    # # # Type the KML file path
    # with pyautogui.hold('command'):
    #     pyautogui.press('f')
    # pyautogui.write(os.path.abspath(kml_file), interval=0.05)
    # pyautogui.press('enter')
    # time.sleep(3)  # Wait for Google Earth to load the location

    # Adjust zoom level (scroll mouse up or down to zoom in/out)
    if zoom_in:
        for _ in range(10):  # Adjust the number of scrolls to zoom in
            pyautogui.scroll(500)  # Scroll up (zoom in)
            time.sleep(0.5)
    else:
        for _ in range(10):  # Adjust the number of scrolls to zoom out
            pyautogui.scroll(-500)  # Scroll down (zoom out)
            time.sleep(0.5)

    # Take a screenshot
    filename = os.path.join(output_folder, 'google_earth_screenshot.png')
    print(filename)
    pyautogui.screenshot(filename)
    print(f"Screenshot saved: {filename}")

# Usage
kml_file = "urban_location.kml" 
output_folder = "screenshots"     # Folder to save screenshots

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# automate_google_earth(kml_file, output_folder, zoom_in=True)
# ------------------------------------------------------------#

# Wait for 5 seconds to give you time to move the mouse
time.sleep(5)

# # Get the mouse position
print(pyautogui.position())

# ----------- Script to get screenshots of map ---------------#
x=1400, y=77