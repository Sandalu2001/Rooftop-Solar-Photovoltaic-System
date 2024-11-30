import os
import random
import pyautogui
import time

pyautogui.FAILSAFE = False  # Disable the fail-safe


def automate_google_earth(output_folder, num, startNum):
    # Move the mouse to the center of the screen
    pyautogui.click(800, 500)
    time.sleep(1)

    # Switch to Google Earth Pro (assumes it's already running)
    pyautogui.hotkey('command', 'tab')  
    time.sleep(1) 
    # ------------------------------------------------------------#

    for x in range(num):
        x_cordinates  = random.random()
        y_cordinates  = random.random()
        # Move the map slightly using arrow keys
        pyautogui.dragTo(x_cordinates, y_cordinates, 0.5,button='left',mouseDownUp= 'false')  # Drag left for even iterations
        time.sleep(3)  # Wait for the map to refresh after the move
        
        # ----------- Script to get screenshots of map -----------
        # Take the screenshot
        screenshot = pyautogui.screenshot()
        pyautogui.click(800, 500)
        # Generate a unique filename for the screenshot
        filename = f"{startNum + x:05d}.png"
        screenshot.save(os.path.join(output_folder, filename))
        # --------------------------------------------------------#
        
        time.sleep(.1)  # Delay between each screenshot
    
# Usage
output_folder = "screenshots"  # Folder to save screenshots

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

automate_google_earth(output_folder, 20, 189)
