class Building:
    name = 'Building'
    production = {}
    consumption = {}

    def update(self, economy):
        # Check if resources are available for consumption
        for res, amount in self.consumption.items():
            if economy.resources.get(res, 0) < amount:
                return  # Not enough resources, skip production
        for res, amount in self.consumption.items():
            economy.resources[res] -= amount
        for res, amount in self.production.items():
            economy.resources[res] = economy.resources.get(res, 0) + amount


class Farm(Building):
    name = 'Farm'
    production = {'food': 2}


class House(Building):
    name = 'House'
    consumption = {'food': 1}
    production = {'gold': 1}


class LumberMill(Building):
    name = 'LumberMill'
    production = {'wood': 2}


class Market(Building):
    name = 'Market'
    consumption = {'food': 1, 'wood': 1}
    production = {'gold': 3}
