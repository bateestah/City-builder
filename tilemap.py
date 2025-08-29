TILE_WIDTH = 64
TILE_HEIGHT = 32

class Tile:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.building = None


class TileMap:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.tiles = [[Tile(x, y) for y in range(height)] for x in range(width)]

    def get_tile(self, x, y):
        if 0 <= x < self.width and 0 <= y < self.height:
            return self.tiles[x][y]
        return None


def iso_to_screen(x, y):
    screen_x = (x - y) * TILE_WIDTH // 2
    screen_y = (x + y) * TILE_HEIGHT // 2
    return screen_x, screen_y


def screen_to_iso(screen_x, screen_y):
    x = (screen_x / (TILE_WIDTH / 2) + screen_y / (TILE_HEIGHT / 2)) / 2
    y = (screen_y / (TILE_HEIGHT / 2) - (screen_x / (TILE_WIDTH / 2))) / 2
    return int(x), int(y)
