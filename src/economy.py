from __future__ import annotations
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class BuildingType:
    name: str
    cost: Dict[str, float]
    production: Dict[str, float]
    consumption: Dict[str, float]

@dataclass
class Building:
    kind: BuildingType
    x: int
    y: int

    def work(self, city: 'City', market: 'Market') -> None:
        # attempt to consume resources
        for res, amount in self.kind.consumption.items():
            if city.resources.get(res, 0) < amount:
                market.record_demand(res, amount)
                return  # not enough resources, building idle
        for res, amount in self.kind.consumption.items():
            city.resources[res] -= amount
            market.record_demand(res, amount)
        for res, amount in self.kind.production.items():
            city.resources[res] = city.resources.get(res, 0) + amount
            market.record_supply(res, amount)

@dataclass
class Market:
    prices: Dict[str, float] = field(default_factory=lambda: defaultdict(lambda:1.0))
    supply: Dict[str, float] = field(default_factory=lambda: defaultdict(float))
    demand: Dict[str, float] = field(default_factory=lambda: defaultdict(float))

    def record_supply(self, resource: str, amount: float) -> None:
        self.supply[resource] += amount

    def record_demand(self, resource: str, amount: float) -> None:
        self.demand[resource] += amount

    def update_prices(self) -> None:
        for res in set(list(self.supply.keys()) + list(self.demand.keys())):
            s = self.supply.get(res, 0)
            d = self.demand.get(res, 0)
            if s == d:
                continue
            ratio = (d - s) / max(1.0, s + d)
            self.prices[res] = max(0.1, self.prices[res] * (1 + 0.1 * ratio))
        self.supply.clear()
        self.demand.clear()

@dataclass
class City:
    width: int
    height: int
    resources: Dict[str, float] = field(default_factory=dict)
    buildings: List[Building] = field(default_factory=list)
    market: Market = field(default_factory=Market)

    def tick(self) -> None:
        for b in self.buildings:
            b.work(self, self.market)
        self.market.update_prices()

    def can_afford(self, cost: Dict[str, float]) -> bool:
        return all(self.resources.get(res, 0) >= price for res, price in cost.items())

    def build(self, kind: BuildingType, x: int, y: int) -> bool:
        if not (0 <= x < self.width and 0 <= y < self.height):
            return False
        if any(b.x == x and b.y == y for b in self.buildings):
            return False
        if not self.can_afford(kind.cost):
            return False
        for res, amount in kind.cost.items():
            self.resources[res] -= amount
        self.buildings.append(Building(kind, x, y))
        return True
