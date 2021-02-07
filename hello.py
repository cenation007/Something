import base64
import cv2
import numpy as np
import sys
import os

def filter1(img):
    img = np.array(img, dtype=np.float64) # converting to float to prevent loss
    img = cv2.transform(img, np.matrix([[0.272, 0.534, 0.131],
                                    [0.349, 0.686, 0.168],
                                    [0.393, 0.769, 0.189]])) # multipying image with special sepia matrix
    img[np.where(img > 255)] = 255 # normalizing values greater than 255 to 255
    img = np.array(img, dtype=np.uint8)
    return img

def verify_alpha_channel(img):
    try:
        img.shape[3]
    except IndexError:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    return img

def filter2(img, intensity = 0.5, b = 20,
    g=66,
    r=112):
    img = verify_alpha_channel(img)
    h, w, c = img.shape
    b=b
    g=g
    r=r
    color_bgra = (b, g, r, 1)
    color_filter = np.full((h,w,4), color_bgra, dtype='uint8')
    img = cv2.addWeighted(color_filter, intensity, img, 1.0, 0)
    img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    return img

def filter3(image):
    return cv2.bitwise_not(image)


img = cv2.imread(sys.argv[1])
img1 = filter1(img)
img2 = filter2(img)
img3 = filter3(img)
img4 = filter2(img, b= 102,g= 255,r= 255)
import time
st = str(int(time.time()))
cv2.imwrite('uploads/'+st+'1.png', img1)
cv2.imwrite('uploads/'+st+'2.png', img2)
cv2.imwrite('uploads/'+st+'3.png', img3)
cv2.imwrite('uploads/'+st+'4.png', img4)
arr = str(st+'1.png,'+st+'2.png,'+st+'3.png,'+st+'4.png')
print(arr)