import os
import random
import pyautogui
import time

pyautogui.FAILSAFE = False  # Disable the fail-safe

def automate_google_earth(output_folder, num, startNum):
    # Move the mouse to the center of the screen
    start_x, start_y = 800, 500  # Starting position
    pyautogui.click(start_x, start_y)
    time.sleep(1)

    # Switch to Google Earth Pro (assumes it's already running)
    pyautogui.hotkey('command', 'tab')  
    time.sleep(1) 

    for x in range(num):
        # Generate small offsets to slightly move the mouse
        x_offset = random.uniform(-600, 100)  # Randomly move slightly left
        y_offset = random.uniform(-600, 100)  # Randomly move slightly up
        
        # Compute new position
        new_x = start_x + x_offset
        new_y = start_y + y_offset
        
        # Drag the mouse to the new position
        pyautogui.moveTo(start_x, start_y)  # Reset to starting position
        pyautogui.dragTo(new_x, new_y, duration=0.5, button='left')  
        time.sleep(3)  # Wait for the map to refresh after the move
        
        # ----------- Script to get screenshots of map -----------
        # Take the screenshot
        screenshot = pyautogui.screenshot()
        
        # Generate a unique filename for the screenshot
        filename = f"{startNum + x:05d}.png"
        screenshot.save(os.path.join(output_folder, filename))
        # --------------------------------------------------------#
        
        time.sleep(0.1)  # Delay between each screenshot
    
# Usage
output_folder = "screenshots"  # Folder to save screenshots

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

automate_google_earth(output_folder, 15, 15)
