#!/usr/bin/env python3
"""
Create folders for all 50 US states.
Inside each folder, create temples.json containing an array of temples in that state.

Run this script from the parent directory where you want the state folders created.
"""

import json
import os
from pathlib import Path

STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
    "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
    "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
]

# Temples by state (from your provided list)
TEMPLES_BY_STATE = {
    "Alabama": [
        "Birmingham Alabama Temple",
        "Huntsville Alabama Temple",
    ],
    "Alaska": [
        "Anchorage Alaska Temple",
        "Fairbanks Alaska Temple",
    ],
    "Arizona": [
        "Flagstaff Arizona Temple",
        "Gila Valley Arizona Temple",
        "Gilbert Arizona Temple",
        "Mesa Arizona Temple",
        "Phoenix Arizona Temple",
        "Queen Creek Arizona Temple",
        "Snowflake Arizona Temple",
        "Tucson Arizona Temple",
        "Yuma Arizona Temple",
    ],
    "Arkansas": [
        "Bentonville Arkansas Temple",
    ],
    "California": [
        "Bakersfield California Temple",
        "Feather River California Temple",
        "Fresno California Temple",
        "Los Angeles California Temple",
        "Modesto California Temple",
        "Newport Beach California Temple",
        "Oakland California Temple",
        "Redlands California Temple",
        "Sacramento California Temple",
        "San Diego California Temple",
        "Sunnyvale California Temple",
        "Yorba Linda California Temple",
    ],
    "Colorado": [
        "Colorado Springs Colorado Temple",
        "Denver Colorado Temple",
        "Fort Collins Colorado Temple",
        "Grand Junction Colorado Temple",
    ],
    "Connecticut": [
        "Hartford Connecticut Temple",
    ],
    "Delaware": [],
    "Florida": [
        "Fort Lauderdale Florida Temple",
        "Jacksonville Florida Temple",
        "Orlando Florida Temple",
        "Tallahassee Florida Temple",
        "Tampa Florida Temple",
    ],
    "Georgia": [
        "Atlanta Georgia Temple",
    ],
    "Hawaii": [
        "Honolulu Hawaii Temple",
        "Kahului Hawaii Temple",
        "Kona Hawaii Temple",
        "Laie Hawaii Temple",
    ],
    "Idaho": [
        "Boise Idaho Temple",
        "Burley Idaho Temple",
        "Caldwell Idaho Temple",
        "Coeur d'Alene Idaho Temple",
        "Idaho Falls Idaho Temple",
        "Meridian Idaho Temple",
        "Montpelier Idaho Temple",
        "Pocatello Idaho Temple",
        "Rexburg Idaho Temple",
        "Teton River Idaho Temple",
        "Twin Falls Idaho Temple",
    ],
    "Illinois": [
        "Chicago Illinois Temple",
        "Nauvoo Illinois Temple",
    ],
    "Indiana": [
        "Indianapolis Indiana Temple",
    ],
    "Iowa": [
        "Des Moines Iowa Temple",
    ],
    "Kansas": [
        "Wichita Kansas Temple",
    ],
    "Kentucky": [
        "Louisville Kentucky Temple",
    ],
    "Louisiana": [
        "Baton Rouge Louisiana Temple",
    ],
    "Maine": [
        "Portland Maine Temple",
    ],
    "Maryland": [
        "Washington D.C. Temple",
    ],
    "Massachusetts": [
        "Boston Massachusetts Temple",
    ],
    "Michigan": [
        "Detroit Michigan Temple",
        "Grand Rapids Michigan Temple",
    ],
    "Minnesota": [
        "St. Paul Minnesota Temple",
    ],
    "Mississippi": [],
    "Missouri": [
        "Kansas City Missouri Temple",
        "Springfield Missouri Temple",
        "St. Louis Missouri Temple",
    ],
    "Montana": [
        "Billings Montana Temple",
        "Helena Montana Temple",
        "Missoula Montana Temple",
    ],
    "Nebraska": [
        "Winter Quarters Nebraska Temple",
    ],
    "Nevada": [
        "Elko Nevada Temple",
        "Las Vegas Nevada Temple",
        "Lone Mountain Nevada Temple",
        "Reno Nevada Temple",
    ],
    "New Hampshire": [],
    "New Jersey": [
        "Summit New Jersey Temple",
    ],
    "New Mexico": [
        "Albuquerque New Mexico Temple",
        "Farmington New Mexico Temple",
    ],
    "New York": [
        "Manhattan New York Temple",
        "Palmyra New York Temple",
    ],
    "North Carolina": [
        "Charlotte North Carolina Temple",
        "Raleigh North Carolina Temple",
    ],
    "North Dakota": [
        "Bismarck North Dakota Temple",
    ],
    "Ohio": [
        "Cincinnati Ohio Temple",
        "Cleveland Ohio Temple",
        "Columbus Ohio Temple",
    ],
    "Oklahoma": [
        "Oklahoma City Oklahoma Temple",
        "Tulsa Oklahoma Temple",
    ],
    "Oregon": [
        "Medford Oregon Temple",
        "Portland Oregon Temple",
        "Willamette Valley Oregon Temple",
    ],
    "Pennsylvania": [
        "Harrisburg Pennsylvania Temple",
        "Philadelphia Pennsylvania Temple",
        "Pittsburgh Pennsylvania Temple",
    ],
    "Rhode Island": [],
    "South Carolina": [
        "Columbia South Carolina Temple",
        "Greenville South Carolina Temple",
    ],
    "South Dakota": [
        "Rapid City South Dakota Temple",
    ],
    "Tennessee": [
        "Knoxville Tennessee Temple",
        "Memphis Tennessee Temple",
        "Nashville Tennessee Temple",
    ],
    "Texas": [
        "Austin Texas Temple",
        "Dallas Texas Temple",
        "El Paso Texas Temple",
        "Fairview Texas Temple",
        "Fort Bend Texas Temple",
        "Fort Worth Texas Temple",
        "Houston Texas Temple",
        "Lubbock Texas Temple",
        "McAllen Texas Temple",
        "San Antonio Texas Temple",
    ],
    "Utah": [
        "Bountiful Utah Temple",
        "Brigham City Utah Temple",
        "Cedar City Utah Temple",
        "Deseret Peak Utah Temple",
        "Draper Utah Temple",
        "Ephraim Utah Temple",
        "Heber Valley Utah Temple",
        "Jordan River Utah Temple",
        "Layton Utah Temple",
        "Lehi Utah Temple",
        "Lindon Utah Temple",
        "Logan Utah Temple",
        "Manti Utah Temple",
        "Monticello Utah Temple",
        "Mount Timpanogos Utah Temple",
        "Ogden Utah Temple",
        "Oquirrh Mountain Utah Temple",
        "Orem Utah Temple",
        "Payson Utah Temple",
        "Price Utah Temple",
        "Provo City Center Temple",
        "Provo Utah Rock Canyon Temple",
        "Red Cliffs Utah Temple",
        "Salt Lake Temple",
        "Saratoga Springs Utah Temple",
        "Smithfield Utah Temple",
        "Spanish Fork Utah Temple",
        "St. George Utah Temple",
        "Syracuse Utah Temple",
        "Taylorsville Utah Temple",
        "Vernal Utah Temple",
        "West Jordan Utah Temple",
    ],
    "Vermont": [],
    "Virginia": [
        "Norfolk Virginia Temple",
        "Richmond Virginia Temple",
        "Roanoke Virginia Temple",
        "Winchester Virginia Temple",
    ],
    "Washington": [
        "Columbia River Washington Temple",
        "Moses Lake Washington Temple",
        "Seattle Washington Temple",
        "Spokane Washington Temple",
        "Tacoma Washington Temple",
        "Vancouver Washington Temple",
    ],
    "West Virginia": [],
    "Wisconsin": [
        "Milwaukee Wisconsin Temple",
    ],
    "Wyoming": [
        "Casper Wyoming Temple",
        "Cody Wyoming Temple",
        "Star Valley Wyoming Temple",
    ],
}

def make_temple_obj(name: str, state: str) -> dict:
    return {
        "name": name,
        "state": state,
        "latitude": None,         # placeholder
        "longitude": None,        # placeholder
        "visitStatus": "Not Visited",
        "imageUrl": "",           # placeholder
        "sourceUrl": "",          # placeholder
    }

def main():
    base = Path.cwd()

    for state in STATES:
        state_dir = base / state
        state_dir.mkdir(parents=True, exist_ok=True)

        temples = [make_temple_obj(t, state) for t in TEMPLES_BY_STATE.get(state, [])]

        out_path = state_dir / "temples.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(temples, f, ensure_ascii=False, indent=2)

    print(f"Done. Created/updated {len(STATES)} state folders with temples.json files.")

if __name__ == "__main__":
    main()