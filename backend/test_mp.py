import mediapipe as mp
import sys

print("Python version:", sys.version)
print("Mediapipe file:", mp.__file__)
print("Dir of mp:", dir(mp))

try:
    print("Has solutions?", hasattr(mp, 'solutions'))
    if hasattr(mp, 'solutions'):
        print("Dir of solutions:", dir(mp.solutions))
        print("Has pose?", hasattr(mp.solutions, 'pose'))
except Exception as e:
    print("Error:", e)
