import math
from datetime import datetime

class PricingEngine:
    def __init__(self, base_price: float, total_seats: int):
        self.base_price = base_price
        self.total_seats = total_seats

    def calculate_price(self, available_seats: int, departure_date: datetime):
        """
        Dynamic pricing logic:
        - Higher demand as seats fill up (Supply/Demand)
        - Higher price as departure date approaches (Urgency)
        """
        now = datetime.now()
        days_until_departure = (departure_date - now).days
        
        # Demand Factor: (1 - occupancy_rate)
        occupancy_rate = (self.total_seats - available_seats) / self.total_seats
        demand_multiplier = 1 + (occupancy_rate ** 2) # Exponential increase as it fills
        
        # Time Factor: 
        # More expensive if booked last minute. 
        # We'll use a decaying function or simple multiplier
        if days_until_departure <= 0:
            time_multiplier = 2.5 # Last second
        elif days_until_departure < 7:
            time_multiplier = 1.5 + (0.1 * (7 - days_until_departure))
        elif days_until_departure < 30:
            time_multiplier = 1.1 + (0.01 * (30 - days_until_departure))
        else:
            time_multiplier = 1.0 # Early bird
            
        final_price = self.base_price * demand_multiplier * time_multiplier
        
        return round(final_price, 2)

# Simple delay predictor model
def predict_delay_probability(flight_number: str, departure_time: datetime):
    """
    Mock ML Delay Predictor.
    In a real scenario, this would use historical data, weather APIs, etc.
    """
    # Simple deterministic mock based on flight number hash for demo
    hash_val = sum(ord(c) for c in flight_number)
    base_prob = (hash_val % 30) / 100.0 # 0% to 30% base
    
    # Add time of day factor (night flights more prone to delay in this mock)
    hour = departure_time.hour
    if 18 <= hour <= 23:
        base_prob += 0.1
    elif 0 <= hour <= 5:
        base_prob += 0.15
        
    return min(round(base_prob, 2), 1.0)
