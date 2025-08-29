class Economy:
    def __init__(self):
        self.resources = {
            'food': 0,
            'wood': 0,
            'gold': 0,
        }
        self.buildings = []

    def add_building(self, building):
        self.buildings.append(building)

    def update(self):
        for building in self.buildings:
            building.update(self)
