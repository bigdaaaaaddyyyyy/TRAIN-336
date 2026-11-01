from enum import Enum

class PlaygroundType(Enum):
    SWING = "Swing"
    SLIDE = "Slide"
    CLIMBING_FRAME = "Climbing Frame"
    SEESAW = "Seesaw"
    SANDPIT = "Sandpit"

# print(PlaygroundType.SWING.value)
# print(PlaygroundType.SLIDE.value)
# print(PlaygroundType.CLIMBING_FRAME.value)
# print(PlaygroundType.SEESAW.value)
# print(PlaygroundType.SANDPIT.value)

print("Available Playground Types:")
for number, playground_type in enumerate(PlaygroundType, start=1):
    print(f"{number}: {playground_type.value}")