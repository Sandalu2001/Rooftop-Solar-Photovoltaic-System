from PIL import Image
import os

# Directory containing the images
image_directory = "screenshots"

# Range of files to crop
start_num = 247
end_num = 271

# Loop through all files in the directory
for filename in os.listdir(image_directory):
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
        # Extract the numeric part of the filename
        try:
            file_num = int(filename.split('.')[0]) 
        except ValueError:
            continue 

        if start_num <= file_num <= end_num:
            file_path = os.path.join(image_directory, filename)
            
            # Open the image
            with Image.open(file_path) as img:
                image_width, image_height = img.size

                # Define the crop box
                left = 600
                upper = 100 
                right = image_width 
                lower = image_height - 100 

                # Crop the image
                crop_box = (left, upper, right, lower)
                cropped_image = img.crop(crop_box) 

                # Save the cropped image with the same name in the same directory
                cropped_image.save(file_path)
                print(f"Cropped and saved: {filename}")

print("All images within the specified range have been cropped and saved.")
