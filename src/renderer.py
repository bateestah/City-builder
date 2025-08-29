import pygame
from economy import City, BuildingType

TILE_WIDTH = 64
TILE_HEIGHT = 32
ORIGIN_X = 400
ORIGIN_Y = 50
COLORS = {
    'grid': (200, 200, 200),
    'house': (150, 75, 0),
    'farm': (0, 200, 0),
}

def cart_to_iso(x: int, y: int) -> tuple[int, int]:
    screen_x = (x - y) * TILE_WIDTH // 2 + ORIGIN_X
    screen_y = (x + y) * TILE_HEIGHT // 2 + ORIGIN_Y
    return screen_x, screen_y

def iso_to_cart(px: int, py: int) -> tuple[int, int]:
    px -= ORIGIN_X
    py -= ORIGIN_Y
    x = (px / (TILE_WIDTH / 2) + py / (TILE_HEIGHT / 2)) / 2
    y = (py / (TILE_HEIGHT / 2) - px / (TILE_WIDTH / 2)) / 2
    return int(x), int(y)

def draw_tile(screen: pygame.Surface, x: int, y: int, color: tuple[int, int, int]) -> None:
    cx, cy = cart_to_iso(x, y)
    points = [
        (cx, cy),
        (cx + TILE_WIDTH // 2, cy + TILE_HEIGHT // 2),
        (cx, cy + TILE_HEIGHT),
        (cx - TILE_WIDTH // 2, cy + TILE_HEIGHT // 2),
    ]
    pygame.draw.polygon(screen, color, points, 1)

def render_city(screen: pygame.Surface, city: City) -> None:
    for x in range(city.width):
        for y in range(city.height):
            draw_tile(screen, x, y, COLORS['grid'])
    for b in city.buildings:
        cx, cy = cart_to_iso(b.x, b.y)
        rect = pygame.Rect(
            cx - TILE_WIDTH // 4,
            cy - TILE_HEIGHT // 2,
            TILE_WIDTH // 2,
            TILE_HEIGHT // 2,
        )
        color = COLORS.get(b.kind.name, (255, 0, 0))
        pygame.draw.rect(screen, color, rect)
