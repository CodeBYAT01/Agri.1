import json
import os

def get_solution_for_disease(disease_label: str):
    file_path = os.path.join(os.path.dirname(__file__), "solutions.json")
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
            return data.get(disease_label, data.get("Healthy_Leaf"))
    except FileNotFoundError:
        return {
            "organic_treatment": "Data unavailable",
            "chemical_treatment": "Data unavailable",
            "preventive_measures": "Data unavailable",
            "seasonal_tips": "Data unavailable"
        }
