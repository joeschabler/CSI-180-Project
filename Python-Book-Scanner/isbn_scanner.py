import cv2
import pytesseract
import re
import requests
import os

pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'

def scan_for_isbn(image_path):
    # Check if file exists first
    if not os.path.exists(image_path):
        print(f"Error: The file '{image_path}' does not exist in {os.getcwd()}")
        return None

    img = cv2.imread(image_path)
    if img is None:
        print("Error: OpenCV couldn't decode the image. Is it a valid .jpg or .png?")
        return None


    # 1. Load Image
    image = cv2.imread(image_path)
    if image is None:
        return "Error: Could not find image file."
    
    # 2. Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) # easier for computer to find shapes in grayscale

    # 3. Apply Thresholding
    # Makes everything either pure white or pure black
    # Removes shadows and makes text pop
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    # 4. OCR: Get raw text string
    raw_text = pytesseract.image_to_string(thresh)
    print(f"--- Raw Text Found ---\n{raw_text}\n----------------------")

    # 5. ISBN Regex: Look for 10 or 13 digits
    # Looks for a pattern similar to an isbn in raw_text
    isbn_pattern = r"[\d]{1,5}-[\d]{1,7}-[\d]{1,7}-[\dXx]"
    match = re.search(isbn_pattern, raw_text)

    if match:
        # Clean the string (remove dashes, spaces, and 'ISBN')
        clean_isbn = match.group(0).replace("-", "").replace(" ", "")
        return clean_isbn
    
    return None


def get_book_details(isbn):
    print(f"Searching Open Library for ISBN: {isbn}...")
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"

    try:
        response = requests.get(url)
        data = response.json()
        key = f"ISBN:{isbn}"
        
        if key in data:
            book = data[key]
            return {
                "title": book.get("title", "Unknown Title"),
                "authors": [a['name'] for a in book.get("authors", [])],
                "pages": book.get("number_of_pages", "N/A"),
                "cover": book.get("cover", {}).get("large", "No cover image")
            }
        return "Book not found in Open Library."
    except Exception as e:
        return f"API Error: {str(e)}"

found = scan_for_isbn('test_book.jpg')
if found:
    print(f"✅ Found ISBN: {found}")
    details = get_book_details(found)
    print(details)
else:
    print("No ISBN found. Try a clearer photo!")
