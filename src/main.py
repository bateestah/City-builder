import os
os.environ.setdefault('SDL_VIDEODRIVER', 'dummy')  # allows headless execution

import pygame
from economy import City, BuildingType
from renderer import render_city, iso_to_cart

pygame.init()
SCREEN = pygame.display.set_mode((800, 600))
CLOCK = pygame.time.Clock()
FONT = pygame.font.SysFont(None, 24)

HOUSE = BuildingType(
    name='house',
    cost={'money': 100},
    production={},
    consumption={'food': 1},
)
FARM = BuildingType(
    name='farm',
    cost={'money': 200},
    production={'food': 2},
    consumption={},
)
BUILDING_KEYS = {
    '1': HOUSE,
    '2': FARM,
}

def draw_ui(screen, city, selected):
    y = 5
    for res, amount in city.resources.items():
        price = city.market.prices.get(res, 1.0)
        text = f"{res}: {amount:.1f} (price {price:.2f})"
        img = FONT.render(text, True, (255, 255, 255))
        screen.blit(img, (5, y))
        y += 20
    sel = FONT.render(f"Selected: {selected.name}", True, (255,255,0))
    screen.blit(sel, (5, y))

def main():
    city = City(10, 10, resources={'money': 1000, 'food': 20})
    selected = HOUSE
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.unicode in BUILDING_KEYS:
                    selected = BUILDING_KEYS[event.unicode]
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                gx, gy = iso_to_cart(*event.pos)
                city.build(selected, gx, gy)
        city.tick()
        SCREEN.fill((0, 0, 0))
        render_city(SCREEN, city)
        draw_ui(SCREEN, city, selected)
        pygame.display.flip()
        CLOCK.tick(30)
    pygame.quit()

if __name__ == '__main__':
    main()
