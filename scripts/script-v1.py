import pyautogui
import time
import os

def automate_google_earth(kml_file, output_folder, zoom_in=True):
    # Move the mouse to the center of the screen
    pyautogui.click(800, 500)
    time.sleep(1)

    # Open Google Earth Pro (ensure the program is already open)
    pyautogui.hotkey('command', 'tab')  # Switch to Google Earth Pro (assumes it's already running)
    time.sleep(1) 

    # # Open KML File
    # pyautogui.hotkey('command', 'o')  
    # time.sleep(1)
    
    # # Type the KML file path
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
kml_file = "resource/urban_location.kml" 
output_folder = "screenshots"     # Folder to save screenshots

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

automate_google_earth(kml_file, output_folder, zoom_in=True)

