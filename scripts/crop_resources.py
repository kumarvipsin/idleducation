from PIL import Image
import os

source_path = '/Users/idleducation/.gemini/antigravity-ide/brain/e42bd2aa-a505-4f08-a0d4-0716f2b9a2bb/.user_uploaded/media_1790415804094.png'
dest_dir = '/Users/idleducation/projects/idleducation/public/resources-ui'
os.makedirs(dest_dir, exist_ok=True)

im = Image.open(source_path)
width, height = im.size
print(f"Loaded image {width}x{height}")

# In the desktop view (left part of image):
# Fine-tuned box coordinates for each illustration
# Card 1 (Notes): x: 38 to 260, y: 115 to 263
# Card 2 (NCERT): x: 274 to 496, y: 115 to 263
# Card 3 (PYQ): x: 510 to 732, y: 115 to 263

card1_box = (38, 115, 260, 263)
card2_box = (274, 115, 496, 263)
card3_box = (510, 115, 732, 263)

c1 = im.crop(card1_box)
c1.save(os.path.join(dest_dir, 'notes-visual.png'))

c2 = im.crop(card2_box)
c2.save(os.path.join(dest_dir, 'ncert-visual.png'))

c3 = im.crop(card3_box)
c3.save(os.path.join(dest_dir, 'pyq-visual.png'))

print("Saved notes-visual.png, ncert-visual.png, pyq-visual.png successfully")
