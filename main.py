import os
import pygame
from tilemap import TileMap, TILE_WIDTH, TILE_HEIGHT, iso_to_screen, screen_to_iso
from economy import Economy
from building import Farm, House, LumberMill, Market

# Allow running in headless mode for tests
if os.environ.get('SDL_VIDEODRIVER') == 'dummy':
    os.environ['SDL_AUDIODRIVER'] = 'dummy'

WIDTH, HEIGHT = 800, 600
MAP_WIDTH, MAP_HEIGHT = 10, 10

BUILDING_TYPES = {
    pygame.K_1: Farm,
    pygame.K_2: House,
    pygame.K_3: LumberMill,
    pygame.K_4: Market,
}

COLORS = {
    'Farm': (50, 205, 50),
    'House': (176, 196, 222),
    'LumberMill': (139, 69, 19),
    'Market': (218, 165, 32),
}

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    font = pygame.font.SysFont(None, 24)

    tilemap = TileMap(MAP_WIDTH, MAP_HEIGHT)
    economy = Economy()

    selected_building = Farm
    update_event = pygame.USEREVENT + 1
    pygame.time.set_timer(update_event, 1000)  # economy update every second

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key in BUILDING_TYPES:
                    selected_building = BUILDING_TYPES[event.key]
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                mx, my = event.pos
                tx, ty = screen_to_iso(mx - WIDTH // 2, my)
                tile = tilemap.get_tile(tx, ty)
                if tile and tile.building is None:
                    b = selected_building()
                    tile.building = b
                    economy.add_building(b)
            elif event.type == update_event:
                economy.update()

        screen.fill((135, 206, 235))
        for x in range(MAP_WIDTH):
            for y in range(MAP_HEIGHT):
                screen_x, screen_y = iso_to_screen(x, y)
                screen_x += WIDTH // 2
                points = [
                    (screen_x, screen_y),
                    (screen_x + TILE_WIDTH // 2, screen_y + TILE_HEIGHT // 2),
                    (screen_x, screen_y + TILE_HEIGHT),
                    (screen_x - TILE_WIDTH // 2, screen_y + TILE_HEIGHT // 2),
                ]
                pygame.draw.polygon(screen, (34, 139, 34), points, 1)
                tile = tilemap.tiles[x][y]
                if tile.building:
                    color = COLORS.get(tile.building.name, (255, 255, 255))
                    pygame.draw.polygon(screen, color, points)

        res_text = ", ".join(f"{k}: {v}" for k, v in economy.resources.items())
        text_surf = font.render(res_text, True, (0, 0, 0))
        screen.blit(text_surf, (5, 5))

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

if __name__ == '__main__':
    main()
